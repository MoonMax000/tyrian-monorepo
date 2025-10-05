import logging
import secrets
import base64
import json
import os

from cryptography.fernet import Fernet
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from drf_spectacular.utils import extend_schema, OpenApiResponse # type: ignore

from django.core.mail import send_mail # type: ignore
from django.conf import settings # type: ignore
from django.core.cache import cache # type: ignore
from django.contrib.auth import logout # type: ignore

from ..serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from ..models import User
from ..services import deactivate_user_sessions
from ..utils import send_lazy_email
from ..exceptions import DeactivationUserSessionsException

from responses import InvalidCredentialsResponse

logger = logging.getLogger(__name__)


def create_encrypted_token(email: str, code: str) -> str:
    """Создает криптографически зашифрованный токен из email и code"""
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
            'code': code
        }
        
        # Шифруем данные
        encrypted_data = fernet.encrypt(json.dumps(data).encode())
        
        return base64.urlsafe_b64encode(encrypted_data).decode()
    except Exception as e:
        raise ValueError(f"Error creating encrypted token: {e}")


def decrypt_token(token: str) -> dict:
    """Расшифровывает токен и возвращает email и code"""
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
        raise ValueError(f"Error decrypting token: {e}")


@extend_schema(
    tags=['Password Reset'],
    summary='Запрос сброса пароля',
    description='Отправляет зашифрованную ссылку для сброса пароля на email пользователя.',
    request=PasswordResetRequestSerializer,
    responses={
        200: OpenApiResponse(description='Ссылка для сброса пароля отправлена'),
        404: OpenApiResponse(description='Пользователь не найден')
    }
)
class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        
        if not User.objects.filter(email=email).exists():
            return InvalidCredentialsResponse(-2)
        
        # Генерируем криптографически сильный код
        code = str(secrets.randbelow(1000000)).zfill(6)
        
        # Создаем зашифрованный токен
        token = create_encrypted_token(email, code)
        
        # Сохраняем код в кэше
        cache.set(f'reset_code_{email}', code, timeout=int(os.getenv('PASSWORD_RESET_TOKEN_TTL', 600)))
        
        # Отправляем email с токеном
        reset_url = f"{settings.FRONTEND_PASS_CHANGE_CONFIRMATION_URL}{token}"
        send_mail(
            'Password Reset',
            f'Your password reset link: {reset_url}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
        )
        
        return Response({'detail': 'Password reset link sent'}, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Password Reset'],
    summary='Подтверждение сброса пароля',
    description='Устанавливает новый пароль, используя зашифрованный токен.',
    request=PasswordResetConfirmSerializer,
    responses={
        200: OpenApiResponse(description='Пароль успешно сброшен'),
        400: OpenApiResponse(description='Неверный или истекший токен'),
        404: OpenApiResponse(description='Пользователь не найден')
    }
)
class PasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        try:
            # Расшифровываем токен
            token_data = decrypt_token(token)
            email = token_data['email']
            code = token_data['code']
        except ValueError:
            return Response({'detail': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Проверяем код в кэше
        cached_code = cache.get(f'reset_code_{email}')
        if not cached_code or cached_code != code:
            return Response({'detail': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            logger.info(f"User {user.id} successfully changed password")
            
            # После сбора пароля удаляем все текущие сессии
            logout(request)
        except User.DoesNotExist:
            return InvalidCredentialsResponse(-3)
        except Exception as e:
            logger.error(f"Unexpected error when changing password for user {user.id}: {e}")
            return Response({'detail': 'Unexpected error when changing password'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        try:
            deactivate_user_sessions(user.id)
        except DeactivationUserSessionsException as e:
            logger.error(f"Error during deactivation of sessions for user {user.id}: {e} \nThe password has been changed, but the sessions have not been deactivated")
        except Exception as e:
            logger.error(f"Unexpected error when deactivating sessions for user {user.id}: {e}\nThe password has been changed, but the sessions have not been deactivated")

        # Удаляем код из кэша
        cache.delete(f'reset_code_{email}')

        # Отправляем email о смене пароля
        send_lazy_email.delay(
            'Password changed',
            f'Your password has been changed',
            email,
        )
        
        return Response({'detail': 'Password reset successful'}, status=status.HTTP_200_OK)
