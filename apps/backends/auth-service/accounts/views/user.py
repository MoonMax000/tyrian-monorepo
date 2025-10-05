import logging
import secrets
import base64
import json
import os

from cryptography.fernet import Fernet
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.permissions import IsAuthenticated, AllowAny  # type: ignore
from rest_framework import status # type: ignore
from django.contrib.auth import get_user_model # type: ignore
from django.core.cache import cache # type: ignore
from django.core.mail import send_mail # type: ignore
from accounts.serializers import (
    UserSerializer, 
    UserByEmailSerializer,
    ProfileDeletionVerificationConfirmSerializer
)
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from django.conf import settings # type: ignore

from ..serializers.user import UserIdByEmailSerializer
from ..services import deactivate_user_sessions, EmailService


logger = logging.getLogger(__name__)


def create_deletion_verification_token(email: str, code: str) -> str:
    """Создает криптографически зашифрованный токен для верификации удаления профиля"""
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
            'action': 'profile_deletion'
        }
        
        # Шифруем данные
        encrypted_data = fernet.encrypt(json.dumps(data).encode())
        
        return base64.urlsafe_b64encode(encrypted_data).decode()
    except Exception as e:
        raise ValueError(f"Error creating deletion verification token: {e}")


def decrypt_deletion_verification_token(token: str) -> dict:
    """Расшифровывает токен верификации удаления и возвращает email и code"""
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
        raise ValueError(f"Error decrypting deletion verification token: {e}")


@extend_schema(
    tags=['User'],
    summary='Получить информацию о текущем пользователе',
    description='Возвращает данные аутентифицированного пользователя.',
    responses={
        200: UserSerializer,
        401: OpenApiResponse(description='Пользователь не аутентифицирован')
    }
)
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


User = get_user_model()


@extend_schema(
    tags=['User'],
    summary='Получить информацию о пользователе по email',
    description='Возвращает данные пользователя по указанному email адресу.',
    parameters=[
        OpenApiParameter(
            name='email',
            type=OpenApiTypes.EMAIL,
            location=OpenApiParameter.QUERY,
            required=True,
            description='Email адрес пользователя для поиска'
        )
    ],
    responses={
        200: UserByEmailSerializer,
        400: OpenApiResponse(description='Неверные данные запроса - отсутствует параметр email'),
        401: OpenApiResponse(description='Пользователь не аутентифицирован'),
        404: OpenApiResponse(description='Пользователь не найден'),
        500: OpenApiResponse(description='Внутренняя ошибка сервера')
    }
)
class UserByEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Получить данные пользователя по email"""
        email = request.query_params.get('email')
        
        if not email:
            return Response(
                {'detail': 'Email parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Ключ кэша для пользователя по email
        cache_key = f'user_by_email:{email}'
        
        # Пытаемся получить данные из кэша
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response(cached_data)
        
        try:
            user = User.objects.get(email=email)
            serializer = UserByEmailSerializer(user)
            data = serializer.data
            
            # Кэшируем данные на 5 минут (300 секунд)
            cache.set(cache_key, data, timeout=settings.USER_PROFILE_CACHE_TIMEOUT)
            
            return Response(data)
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            ) 
        except Exception as e:
            return Response(
                {'detail': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@extend_schema(
    tags=['User'],
    summary='Получить id пользователя по email',
    description='Возвращает id пользователя по указанному email адресу.',
    parameters=[
        OpenApiParameter(
            name='email',
            type=OpenApiTypes.EMAIL,
            location=OpenApiParameter.QUERY,
            required=True,
            description='Email адрес пользователя для поиска'
        )
    ],
    responses={
        200: UserIdByEmailSerializer,
        400: OpenApiResponse(description='Неверные данные запроса - отсутствует параметр email'),
        404: OpenApiResponse(description='Пользователь не найден'),
        500: OpenApiResponse(description='Внутренняя ошибка сервера')
    }
)
class UserIdByEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """Получить данные пользователя по email"""
        email = request.query_params.get('email')

        if not email:
            return Response(
                {'detail': 'Email parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Ключ кэша для пользователя по email
        cache_key = f'user_id_by_email:{email}'

        # Пытаемся получить данные из кэша
        cached_data = cache.get(cache_key)
        if cached_data is not None:
            return Response(cached_data)

        try:
            user = User.objects.get(email=email)
            serializer = UserIdByEmailSerializer(user)
            data = serializer.data

            # Кэшируем данные на 5 минут (300 секунд)
            cache.set(cache_key, data, timeout=settings.USER_PROFILE_CACHE_TIMEOUT)

            return Response(data)
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@extend_schema(
    tags=['User'],
    summary='Запросить верификацию для удаления профиля',
    description='Отправляет код верификации для удаления профиля пользователя.',
    responses={
        200: OpenApiResponse(description='Код верификации отправлен'),
        401: OpenApiResponse(description='Пользователь не аутентифицирован'),
        500: OpenApiResponse(description='Внутренняя ошибка сервера')
    }
)
class DeleteProfileVerificationRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        """Запросить код верификации для удаления профиля"""
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_403_FORBIDDEN)
        
        user = request.user
        email = user.email
        
        # Генерируем криптографически сильный код
        code = str(secrets.randbelow(1000000)).zfill(6)
        
        # Создаем зашифрованный токен
        token = create_deletion_verification_token(email, code)
        
        # Сохраняем код в кэше
        cache.set(f'profile_deletion_verification_{email}', code, timeout=int(os.getenv('PROFILE_VERIFICATION_TOKEN_TTL', 600)))
        
        # Отправляем код верификации
        verification_method = user.verification_method or 'email'
        
        if verification_method == 'email':
            # Отправляем email с кодом
            send_mail(
                'Account Deletion Verification',
                f'Your verification code for account deletion: {code}\n\nThis code will expire in 10 minutes.',
                settings.DEFAULT_FROM_EMAIL,
                [email],
            )
        elif verification_method == 'sms':
            # Здесь должна быть логика отправки SMS
            logger.info(f"SMS verification code for account deletion: {code} (to be implemented)")
        
        logger.info(f"Deletion verification code sent to user {user.id} ({email})")
        
        return Response({
            'detail': 'Verification code sent',
            'verification_method': verification_method,
            'token': token
        }, status=status.HTTP_200_OK)


@extend_schema(
    tags=['User'],
    summary='Подтвердить удаление профиля с кодом верификации',
    description='Удаляет профиль пользователя после верификации кода.',
    request=ProfileDeletionVerificationConfirmSerializer,
    responses={
        200: OpenApiResponse(description='Профиль успешно помечен для удаления'),
        400: OpenApiResponse(description='Неверный или истекший код'),
        401: OpenApiResponse(description='Пользователь не аутентифицирован'),
        404: OpenApiResponse(description='Пользователь не найден')
    }
)
class DeleteProfileVerificationConfirmView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Подтвердить удаление профиля с кодом верификации"""
        serializer = ProfileDeletionVerificationConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        code = serializer.validated_data['code']
        
        try:
            # Расшифровываем токен
            token_data = decrypt_deletion_verification_token(token)
            email = token_data['email']
            token_code = token_data['code']
            action = token_data['action']
            
            if action != 'profile_deletion':
                return Response({'detail': 'Invalid token for profile deletion'}, status=status.HTTP_400_BAD_REQUEST)
                
        except ValueError:
            return Response({'detail': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            
            # Проверяем код верификации
            cached_code = cache.get(f'profile_deletion_verification_{email}')
            if not cached_code or cached_code != code or code != token_code:
                return Response({'detail': 'Invalid or expired verification code'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Помечаем пользователя для удаления
            user.request_deletion()
            
            # Инвалидируем кэш пользователя
            cache_key = f'user_by_email:{user.email}'
            cache.delete(cache_key)
            
            # Деактивируем сессии пользователя
            deactivate_user_sessions(user.id)
            
            # Удаляем код из кэша
            cache.delete(f'profile_deletion_verification_{email}')
            
            # Отправляем пользователю письмо с уведомление об удалении
            email_service = EmailService(user.email)
            email_service.send_account_deletion_notification()

            logger.info(f"User {user.id} ({user.email}) successfully requested account deletion with verification")
            
            return Response({
                'detail': 'Account deletion requested successfully',
                'deletion_requested_at': user.deletion_requested_at.isoformat() if user.deletion_requested_at else None
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error when requesting account deletion for user {user.id}: {e}")
            return Response({'detail': 'Unexpected error when requesting account deletion'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@extend_schema(
    tags=['User'],
    summary='Отменить удаление профиля пользователя',
    description='Отменяет запрос на удаление профиля пользователя, если он еще существует.',
    responses={
        200: OpenApiResponse(description='Удаление профиля успешно отменено'),
        400: OpenApiResponse(description='Профиль не был помечен для удаления'),
        401: OpenApiResponse(description='Пользователь не аутентифицирован'),
        404: OpenApiResponse(description='Пользователь не найден'),
        500: OpenApiResponse(description='Внутренняя ошибка сервера')
    }
)
class RestoreProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Отменить удаление профиля пользователя"""
        try:
            user = request.user
            
            # Проверяем, что пользователь существует и помечен для удаления
            if not user.is_deleted:
                return Response(
                    {'detail': 'Account is not marked for deletion'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.cancel_deletion()
            
            # Инвалидируем кэш пользователя
            cache_key = f'user_by_email:{user.email}'
            cache.delete(cache_key)
            
            logger.info(f"User {user.id} ({user.email}) cancelled account deletion")
            
            return Response({
                'detail': 'Account deletion cancelled successfully',
                'is_deleted': user.is_deleted,
                'deletion_requested_at': user.deletion_requested_at
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error cancelling account deletion for user {request.user.id}: {str(e)}")
            return Response(
                {'detail': 'Failed to cancel account deletion'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
