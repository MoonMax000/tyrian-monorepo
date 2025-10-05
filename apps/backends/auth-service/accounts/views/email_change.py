from datetime import datetime
import logging
import base64
import json

from cryptography.fernet import Fernet
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from drf_spectacular.utils import extend_schema, OpenApiResponse # type: ignore

from django.core.mail import send_mail # type: ignore
from django.conf import settings # type: ignore
from django.core.cache import cache # type: ignore
from django.contrib.auth import get_user_model # type: ignore

from ..serializers.email_change import (
    ChangeEmailVerificationRequestSerializer,
    EmailChangeConfirmSerializer,
    EmailChangeSerializer,
)
from ..services import (
    check_user_is_valid_for_request,
    EmailService,
    deactivate_user_sessions,
)

User = get_user_model()
logger = logging.getLogger(__name__)


def create_change_email_verification_token(current_email: str, new_email: str, action: str = 'change_email') -> str:
    """Создает криптографически зашифрованный токен для верификации изменения email"""
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
            'current_email': current_email,
            'new_email': new_email,
            'action': action,
            'timestamp': datetime.now().isoformat()
        }
        
        # Шифруем данные
        encrypted_data = fernet.encrypt(json.dumps(data).encode())
        
        return base64.urlsafe_b64encode(encrypted_data).decode()
    except Exception as e:
        raise ValueError(f"Error creating change email verification token: {e}")


def decrypt_change_email_verification_token(token: str) -> dict:
    """Расшифровывает токен верификации изменения email и возвращает current_email и new_email"""
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
        raise ValueError(f"Error decrypting change email verification token: {e}")


@extend_schema(
    tags=['Profile'],
    summary='Запрос верификации для изменения email',
    description='Отправляет код верификации для изменения email профиля пользователя.',
    request=ChangeEmailVerificationRequestSerializer,
    responses={
        200: OpenApiResponse(description='Код верификации отправлен'),
        400: OpenApiResponse(description='Неверные данные запроса'),
        404: OpenApiResponse(description='Пользователь не найден')
    }
)
class ChangeEmailVerificationRequestView(APIView):
    """Запрос верификации для изменения email профиля пользователя"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangeEmailVerificationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        current_email = serializer.validated_data['current_email']
        new_email = serializer.validated_data['new_email']
        
        is_valid, error = check_user_is_valid_for_request(request.user)
        if not is_valid:
            logger.error(f"User is not valid for request: {error}")
            return Response({'detail': error}, status=status.HTTP_403_FORBIDDEN)
        
        user = request.user
        email = user.email
        if email != current_email:
            return Response({'detail': 'Given email and user email are not the same'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Проверяем, что пользователь с таким new_email не существует
        User = get_user_model()
        if User.objects.filter(email=new_email).exists():
            return Response({'detail': 'Invalid new email'}, status=status.HTTP_400_BAD_REQUEST)
        
        cache.set(f'change_{email}', new_email, timeout=settings.EMAIL_CHANGE_TOKEN_TTL)

        # Создаем зашифрованный токен
        token = create_change_email_verification_token(current_email, new_email)
        
        # Отправляем token
        email_service = EmailService(email)
        email_service.send_email_change_verification(new_email=new_email)

        return Response({
            'detail': 'Email change verification sent',
            'token': token,
        }, status=status.HTTP_200_OK)

@extend_schema(
    tags=['Profile'],
    summary='Подтверждение изменения email',
    description='Изменяет email профиля после верификации токена.',
    request=EmailChangeConfirmSerializer,
    responses={
        200: OpenApiResponse(description='Запрос успешно подтвержден, отправлен код верификации на новую почту'),
        400: OpenApiResponse(description='Неверный или истекший код'),
        404: OpenApiResponse(description='Пользователь не найден')
    }
)
class EmailChangeConfirmView(APIView):
    def post(self, request):
        serializer = EmailChangeConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        code = serializer.validated_data['code']

        try:
            # Расшифровываем токен
            token_data = decrypt_change_email_verification_token(token)
        except ValueError:
            return Response({'detail': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        
        current_email = token_data['current_email']
        new_email = token_data['new_email']
        action = token_data['action']

        if action != 'change_email':
            cache.delete(f'change_{current_email}')
            logger.error(f"Stopping change email: {action}")
            return Response({'detail': 'Stopped change email'}, status=status.HTTP_200_OK)

        user = request.user
        email = user.email
        if email != current_email:
            return Response({'detail': 'Given email and user email are not the same'}, status=status.HTTP_400_BAD_REQUEST)

        cached_code = cache.get(f'change_email_verify_code_{current_email}')
        if not cached_code or cached_code != code:
            return Response({'detail': 'Invalid or expired code'}, status=status.HTTP_400_BAD_REQUEST)

        cache.delete(f'change_email_verify_code_{current_email}')

        cached_new_email = cache.get(f'change_{current_email}')
        if not cached_new_email or cached_new_email != new_email:
            return Response({'detail': 'Invalid or expired new email'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=current_email)
            email_service = EmailService(new_email)
            email_service.send_email_verification()

            logger.info(f"Successfully sent verification code for new email {new_email} of user {user.id}")
            
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error when sending verification code for new email {new_email} of user {user.id}: {e}")
            return Response({'detail': 'Unexpected error when sending verification code for new email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Отправляем stop email об изменении email
        token = create_change_email_verification_token(current_email, new_email, 'stop_change_email')
        reset_url = f"{settings.FRONTEND_EMAIL_CHANGE_CONFIRMATION_URL}{token}"

        email_service = EmailService(current_email)
        email_service.send(
            'Your email is under changing!',
            f'Right now your email is being changed to {new_email}\n\nClick here if you want to stop it: {reset_url}',
        )

        return Response({
            'detail': 'New email change verification sent',
        }, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Profile'],
    summary='Финальное изменение email',
    description='Выполняет финальное изменение email после верификации кода.',
    request=EmailChangeSerializer,
    responses={
        200: OpenApiResponse(description='Email успешно изменен'),
        400: OpenApiResponse(description='Неверный или истекший код'),
        403: OpenApiResponse(description='Пользователь не авторизован для запроса')
    }
)
class EmailChangeView(APIView):
    """Финальное изменение email текущего пользователя"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        is_valid, error = check_user_is_valid_for_request(user)
        if not is_valid:
            logger.debug(f"User is not valid for request: {error}")
            return Response({'detail': error}, status=status.HTTP_403_FORBIDDEN)

        serializer = EmailChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data['code']

        cached_new_email = cache.get(f'change_{user.email}')
        if not cached_new_email:
            return Response({'detail': 'Invalid request, no new email found'}, status=status.HTTP_400_BAD_REQUEST)

        cached_code = cache.get(f'verify_code_{cached_new_email}')
        if cached_code and cached_code == code:
            cache.delete(f'verify_code_{cached_new_email}')

            deactivate_user_sessions(user.id)

            user.email = cached_new_email
            user.save()
            logger.info(f"User {user.id} changed email to {cached_new_email}")
            cache.delete(f'change_{user.email}')
    
            return Response({'detail': 'Email changed successfully'}, status=status.HTTP_200_OK)
        
        logger.error(f"Email verification: Invalid or expired code for {cached_new_email}")
        return Response({'detail': 'Invalid or expired code'}, status=status.HTTP_400_BAD_REQUEST) 
