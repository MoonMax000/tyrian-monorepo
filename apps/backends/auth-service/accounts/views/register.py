import os
import logging
import smtplib

from datetime import datetime
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
from rest_framework import status # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.views import APIView # type: ignore

from django.contrib.auth import login # type: ignore

from ..serializers import RegisterSerializer, RegisterSuccessResponseSerializer, RegisterErrorResponseSerializer
from ..models import User
from ..services import send_request_to_create_user_in_services

from .email_verification import send_email_verification, send_email_verification_to_user


SHOULD_LOGIN_AFTER_REGISTRATION = bool(int(os.getenv('SHOULD_LOGIN_AFTER_REGISTRATION', 0)))
SHOULD_SEND_EMAIL_VERIFICATION = bool(int(os.getenv('SHOULD_SEND_EMAIL_VERIFICATION', 1)))
SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY = bool(int(os.getenv('SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY', 1)))
email_timeout = os.getenv('EMAIL_VERIFICATION_TOKEN_TTL', 15*60)


logger = logging.getLogger(__name__)

class RegisterView(APIView):
    @extend_schema(
        tags=['Authentication'],
        summary='Регистрация пользователя',
        description='Создает нового пользователя в системе. Может отправлять код верификации на email и автоматически логинить пользователя.',
        request=RegisterSerializer,
        responses={
            201: RegisterSuccessResponseSerializer,
            400: RegisterErrorResponseSerializer
        },
        examples=[
            OpenApiExample(
                'Request Example',
                value={
                    "email": "user@example.com",
                    "password": "securepassword123"
                },
                request_only=True
            )
        ]
    )
    def post(self, request):
        logger.info(f"Registering user {request.data}")
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data.get('email')
        # Проверяем существование пользователя
        if User.objects.filter(email=email).exists():
            return Response(
                {"email": ["User with this email already exists."]}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        if SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY:
            logger.info(f"Sending email verification to {email}")
            try:
                send_email_verification(email)
            except Exception as e:
                logger.error(f"Error sending email verification to {email}: {e}")
                return Response(
                    {"detail": "Error sending email verification"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            except smtplib.SMTPRecipientsRefused:
                logger.error(f"Error sending email verification to {email}: SMTPRecipientsRefused")
                return Response(
                    {"detail": "Ошибка отправки кода верификации, проверьте правильность email"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            return Response(
                {
                    "detail": "Registration in progress, check your email for verification code",
                    "timestamp": int(datetime.now().timestamp()),
                },
                status=status.HTTP_200_OK)
        user = serializer.save()
        if SHOULD_SEND_EMAIL_VERIFICATION:
            logger.info(f"Sending email verification to {user.email}")
            send_email_verification_to_user(user)
        else:
            user.is_active = True
            user.save()
            logger.info(f"User {user.email} created and activated")
            send_request_to_create_user_in_services.delay(user.id)
        if SHOULD_LOGIN_AFTER_REGISTRATION and user.is_active:
            logger.info(f"Logging in user {user.email} after registration")
            request.session['user_email'] = user.email
            request.session.save()
            login(request, user)  # автоматически логиним после регистрации
            return Response(
                {
                    "detail": "Registration successful, you are logged in",
                    "timestamp": int(datetime.now().timestamp()),
                },
                status=status.HTTP_201_CREATED)
        return Response(
            {
                "detail": "Registration successful",
                "timestamp": int(datetime.now().timestamp()),
            },
            status=status.HTTP_201_CREATED)
