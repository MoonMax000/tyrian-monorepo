import logging
from rest_framework_simplejwt.authentication import JWTAuthentication # type: ignore
from rest_framework.exceptions import AuthenticationFailed # type: ignore
from django.contrib.auth import get_user_model # type: ignore
from rest_framework_simplejwt.authentication import AuthUser
from typing import Optional, Tuple
from rest_framework.request import Request # type: ignore
from rest_framework_simplejwt.exceptions import AuthenticationFailed # type: ignore
from django.contrib.auth.backends import ModelBackend # type: ignore
from rest_framework_simplejwt.tokens import Token # type: ignore

from accounts.auth_service_client import AuthServiceApiClient

User = get_user_model()
logger = logging.getLogger(__name__)


class EmailJWTAuthentication(JWTAuthentication):
    """
    Аутентификация по email.
    """

    def get_user(self, validated_token):
        logger.info(f"Validated token: {validated_token}")
        email = validated_token.get('email')
        try:
            user = User.objects.get(email=email)
            if not user.is_active:
                raise AuthenticationFailed("User is not active")
            return user
        except User.DoesNotExist:
            raise AuthenticationFailed("User is not found")

    def get_validated_token(self, raw_token):
        token = super().get_validated_token(raw_token)
        logger.info(f"Token: {token}")
        if 'jti' not in token:
            # Если JTI отсутствует, просто возвращаем токен
            return token
        return token

    def authenticate(self, request: Request) -> Optional[Tuple[AuthUser, Token]]:
        try:
            user = super().authenticate(request)
        except AuthenticationFailed:
            raise AuthenticationFailed(detail='password required')
        return user


class AuthenticationBackend(ModelBackend):
    user_model = get_user_model()

    def authenticate(self, request, username=None, password=None, **kwargs):
        user = super().authenticate(request, username=username, password=password, **kwargs)
        if not user:
            user_status = AuthServiceApiClient.check_user(email=kwargs.get('email'), password=password)

            if user_status.get('status') == 'registered':
                return self.user_model.objects.create_user(email=kwargs.get('email'), password=password)
            elif user_status.get('status') == 'email_exists':
                raise AuthenticationFailed(detail='password required')
        return user
