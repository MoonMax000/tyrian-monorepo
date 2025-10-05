import pytest
from django.contrib.auth import get_user_model
from django.test import Client
from rest_framework.test import APIClient
from django_login_control.models import UserLockout, LoginEvent, LoginStatus

User = get_user_model()


@pytest.fixture
def api_client():
    """Создает API клиент для тестов"""
    return APIClient()


@pytest.fixture
def client():
    """Создает обычный Django клиент для тестов"""
    return Client()


@pytest.fixture
def user():
    """Создает активного пользователя для тестов"""
    return User.objects.create_user(
        email='test@example.com',
        password='testpass123!',
        is_active=True
    )


@pytest.fixture
def user_no_2fa():
    """Создает активного пользователя без 2FA для тестов"""
    return User.objects.create_user(
        email='test_no_2fa@example.com',
        password='testpass123!',
        is_active=True,
        is_2fa_enabled=False
    ) 