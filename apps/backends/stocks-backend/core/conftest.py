import pytest

from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from django.conf import settings
from django.contrib.auth.hashers import make_password

from accounts.models import User
from stocks.models import Stock


@pytest.fixture
def stock():
    stock, _ = Stock.objects.get_or_create(
        name="Сбербанк",
        ticker="SBER",
    )
    return stock


@pytest.fixture
def user():
    email = "test@test.com"
    user, created = User.objects.get_or_create(email=email)

    if created:
        secret_key = settings.SECRET_KEY
        hashed_password = make_password(f"{email}{secret_key}")
        user.password = hashed_password
        user.is_active = True
        user.save()

    return user


# Авторизация


@pytest.fixture
def user_access_token(user):
    """Access token for user."""
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    return access_token


@pytest.fixture
def preauth_user_client(user_access_token):
    client = APIClient()
    client.credentials(
        HTTP_AUTHORIZATION=f"JWT {user_access_token}",
    )
    return client
