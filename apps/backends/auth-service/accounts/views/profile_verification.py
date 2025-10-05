import logging
import secrets
import base64
import json

from cryptography.fernet import Fernet
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from drf_spectacular.utils import extend_schema, OpenApiResponse # type: ignore

from django.core.mail import send_mail # type: ignore
from django.conf import settings # type: ignore
from django.core.cache import cache # type: ignore
from django.contrib.auth import get_user_model # type: ignore

from ..serializers.profile_verification import (
    ProfileVerificationRequestSerializer,
    ProfileVerificationConfirmSerializer,
    ProfileVerificationRequestSuccessResponseSerializer,
)
from ..services import EmailService
from ..utils import send_lazy_email

User = get_user_model()
logger = logging.getLogger(__name__)


def create_verification_token(email: str, code: str, fields_to_change: list) -> str:
    """Создает криптографически зашифрованный токен для верификации изменения полей"""
    try:
        # Создаем ключ из DJANGO_SECRET_KEY (дополняем до 32 байт)
        key_bytes = settings.SECRET_KEY.encode()
        if len(key_bytes) < 32:
            key_bytes = key_bytes + b'\0' * (32 - len(key_bytes))
        elif len(key_bytes) > 32:
            key_bytes = key_bytes[:32]
        
        key = base64.urlsafe_b64encode(key_bytes)
        
        # Создаем Fernet для шифрования
        fernet = Fernet(key)
        
        # Создаем данные для шифрования
        data = {
            'email': email,
            'code': code,
            'fields_to_change': fields_to_change
        }
        
        # Шифруем данные
        encrypted_data = fernet.encrypt(json.dumps(data).encode())
        
        return base64.urlsafe_b64encode(encrypted_data).decode()
    except Exception as e:
        raise ValueError(f"Error creating verification token: {e}")


def decrypt_verification_token(token: str) -> dict:
    """Расшифровывает токен верификации и возвращает email, code и fields_to_change"""
    try:
        # Создаем ключ из DJANGO_SECRET_KEY (дополняем до 32 байт)
        key_bytes = settings.SECRET_KEY.encode()
        if len(key_bytes) < 32:
            key_bytes = key_bytes + b'\0' * (32 - len(key_bytes))
        elif len(key_bytes) > 32:
            key_bytes = key_bytes[:32]
        
        key = base64.urlsafe_b64encode(key_bytes)
        
        # Создаем Fernet для дешифрования
        fernet = Fernet(key)
        
        # Декодируем и расшифровываем
        encrypted_data = base64.urlsafe_b64decode(token.encode())
        decrypted_data = fernet.decrypt(encrypted_data)
        
        return json.loads(decrypted_data.decode())
    except Exception as e:
        raise ValueError(f"Error decrypting verification token: {e}")


@extend_schema(
    tags=['Profile'],
    summary='Запрос верификации для изменения критических полей',
    description='Отправляет код верификации для изменения критических полей профиля пользователя.',
    request=ProfileVerificationRequestSerializer,
    responses={
        200: ProfileVerificationRequestSuccessResponseSerializer,
        400: OpenApiResponse(description='Неверные данные запроса'),
        404: OpenApiResponse(description='Пользователь не найден')
    }
)
class ProfileVerificationRequestView(APIView):
    def post(self, request):
        serializer = ProfileVerificationRequestSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Serializer validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        fields_to_change = serializer.validated_data['fields_to_change']
        
        if not request.user.is_authenticated:
            logger.debug("Logout attempt by unauthenticated user")
            return Response({'detail': 'Authentication required'}, status=status.HTTP_403_FORBIDDEN)
        
        user = request.user
        email = user.email
        
        # Генерируем криптографически сильный код
        code = str(secrets.randbelow(1000000)).zfill(6)
        
        # Создаем зашифрованный токен
        token = create_verification_token(email, code, fields_to_change)

        # Сохраняем код в кэше для каждого поля
        for field_name in fields_to_change:
            cache.set(f'profile_verification_{email}_{field_name}', code, timeout=settings.PROFILE_VERIFICATION_TOKEN_TTL)
        
        # Отправляем код верификации
        verification_method = user.verification_method or 'email'
        
        if verification_method == 'email':
            # Отправляем email с кодом
            fields_str = ', '.join(fields_to_change)
            email_service = EmailService(email)
            email_service.send(
                'Profile Change Verification',
                f'Your verification code for changing {fields_str}: {code}',
            )
        elif verification_method == 'sms':
            # Здесь должна быть логика отправки SMS
            # Пока что просто логируем
            fields_str = ', '.join(fields_to_change)
            logger.info(f"SMS verification code for {fields_str}: {code} (to be implemented)")
        
        return Response({
            'detail': 'Verification code sent',
            'verification_method': verification_method,
            'fields_to_change': fields_to_change,
            'token': token,
        }, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Profile'],
    summary='Подтверждение изменения критических полей',
    description='Изменяет критические поля профиля после верификации кода.',
    request=ProfileVerificationConfirmSerializer,
    responses={
        200: OpenApiResponse(description='Поля успешно изменены'),
        400: OpenApiResponse(description='Неверный или истекший код'),
        404: OpenApiResponse(description='Пользователь не найден')
    }
)
class ProfileVerificationConfirmView(APIView):
    def post(self, request):
        serializer = ProfileVerificationConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        new_values = serializer.validated_data['new_values']
        code = serializer.validated_data['code']
        
        try:
            # Расшифровываем токен
            token_data = decrypt_verification_token(token)
            email = token_data['email']
            token_code = token_data['code']
            fields_to_change = token_data['fields_to_change']
        except ValueError:
            return Response({'detail': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        
        if token_code != code:
            return Response({'detail': 'Invalid or expired code (probably changed)'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            
            # Проверяем код верификации для каждого поля
            for field_name in fields_to_change:
                cached_code = cache.get(f'profile_verification_{email}_{field_name}')
                if not cached_code or cached_code != code:
                    return Response({'detail': f'Invalid or expired verification code for {field_name}'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Изменяем поля
            changed_fields = []
            for field_name in fields_to_change:
                if field_name in new_values:
                    if field_name == 'password':
                        user.set_password(new_values['password'])
                    elif field_name == 'phone':
                        user.phone = new_values['phone']
                    elif field_name == 'backup_email':
                        user.backup_email = new_values['backup_email']
                    elif field_name == 'backup_phone':
                        user.backup_phone = new_values['backup_phone']
                    elif field_name == 'verification_method':
                        user.verification_method = new_values['verification_method']
                    elif field_name == 'is_active':
                        user.is_active = new_values['is_active']
                    elif field_name == 'is_deleted':
                        user.is_deleted = new_values['is_deleted']
                    
                    changed_fields.append(field_name)
            
            user.save()
            logger.info(f"User {user.id} successfully changed fields: {changed_fields}")
            
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error when changing fields for user {user.id}: {e}")
            return Response({'detail': 'Unexpected error when changing fields'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Удаляем коды из кэша
        for field_name in fields_to_change:
            cache.delete(f'profile_verification_{email}_{field_name}')

        # Отправляем email о изменении полей
        fields_str = ', '.join(changed_fields)
        send_lazy_email.delay(
            'Profile fields changed',
            f'Your fields have been changed successfully: {fields_str}',
            email,
        )
        
        return Response({
            'detail': f'Fields changed successfully: {fields_str}',
            'changed_fields': changed_fields
        }, status=status.HTTP_200_OK)
