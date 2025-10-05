import secrets
import os
import logging

from drf_spectacular.utils import extend_schema, OpenApiExample
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from django.core.mail import send_mail # type: ignore
from django.conf import settings # type: ignore
from django.core.cache import cache # type: ignore

from ..serializers import (
    EmailVerificationRequestSerializer,
    EmailVerificationConfirmSerializer,
    EmailVerificationRequestSuccessResponseSerializer,
    EmailVerificationConfirmSuccessResponseSerializer,
    EmailVerificationErrorResponseSerializer,
    EmailVerificationValidationErrorResponseSerializer,
)
from ..models import User
from ..services import send_request_to_create_user_in_services


logger = logging.getLogger(__name__)

SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY = bool(int(os.getenv('SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY', 1)))
email_timeout = int(os.getenv('EMAIL_VERIFICATION_TOKEN_TTL', 15*60))


def send_email_verification(email: str) -> str:
    """Отправляет код верификации на указанный email"""
    
    # Генерируем криптографически сильный код верификации
    # https://docs.python.org/3/library/secrets.html#module-secrets
    code = str(secrets.randbelow(1000000)).zfill(6)
    
    # Сохраняем код в кэш
    cache.set(f'verify_code_{email}', code, timeout=email_timeout)
    
    # Отправляем email
    send_mail(
        'Верификация email',
        f'Ваш код верификации: {code}',
        settings.DEFAULT_FROM_EMAIL,
        [email],
    )
    
    return code


def send_email_verification_to_user(user: User) -> str:
    """Отправляет код верификации на email пользователя"""
    email = user.email
    return send_email_verification(email)


@extend_schema(
    tags=['Email Verification'],
    summary='Запрос верификации email',
    description='Отправляет код верификации на указанный email адрес',
    request=EmailVerificationRequestSerializer,
    responses={
        200: EmailVerificationRequestSuccessResponseSerializer,
        400: EmailVerificationValidationErrorResponseSerializer
    },
    examples=[
        OpenApiExample(
            'Request Example',
            value={'email': 'user@example.com'},
            request_only=True
        )
    ]
)
class EmailVerificationRequestView(APIView):
    def post(self, request):
        serializer = EmailVerificationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        
        # Используем общую функцию
        send_email_verification(email)
        
        return Response({'detail': 'Verification code sent'}, status=status.HTTP_200_OK)

@extend_schema(
    tags=['Email Verification'],
    summary='Подтверждение верификации email',
    description='Подтверждает email с помощью полученного кода верификации',
    request=EmailVerificationConfirmSerializer,
    responses={
        200: EmailVerificationConfirmSuccessResponseSerializer,
        400: EmailVerificationErrorResponseSerializer
    },
    examples=[
        OpenApiExample(
            'Request Example',
            value={'email': 'user@example.com', 'code': '123456', 'password': 'password123!'},
            request_only=True
        )
    ]
)
class EmailVerificationConfirmView(APIView):
    def post(self, request):
        serializer = EmailVerificationConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        code = serializer.validated_data['code']
        cached_code = cache.get(f'verify_code_{email}')
        if cached_code and cached_code == code:
            if SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY:
                # Проверяем существование пользователя
                if User.objects.filter(email=email).exists():
                    return Response(
                        {"email": ["User with this email already exists."]}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                password = serializer.validated_data.get('password')
                if not password:
                    return Response(
                        {"password": ["This field is required."]}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                user = User.objects.create_user(
                    email=email,
                    password=password,
                    )
                user.is_active = True
                user.save()
                logger.info(f"User {user.email} created and activated")
                send_request_to_create_user_in_services.delay(user.id)
                cache.delete(f'verify_code_{email}')
                return Response({'detail': 'Email verified'}, status=status.HTTP_200_OK)
            else:
                try:
                    user = User.objects.get(email=email)
                    was_user_active = user.is_active
                    user.is_active = True
                    user.save()
                    logger.info(f"User {user.email} verified")
                    if not was_user_active:
                        send_request_to_create_user_in_services.delay(user.id)
                except User.DoesNotExist:
                    logger.error(f"Email verification: User {email} not found")
                cache.delete(f'verify_code_{email}')
                return Response({'detail': 'Email verified'}, status=status.HTTP_200_OK)
            
        logger.error(f"Email verification: Invalid or expired code for {email}")
        return Response({'detail': 'Invalid or expired code'}, status=status.HTTP_400_BAD_REQUEST) 
