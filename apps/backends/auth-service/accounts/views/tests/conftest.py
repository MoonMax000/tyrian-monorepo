import pytest
import os
from unittest.mock import patch
from django.test import Client
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()


@pytest.fixture(autouse=True)
def mock_celery_tasks():
    """Автоматически мокает все Celery задачи во всех тестах"""
    with patch('django_login_control.services.may_user_log_in.log_login_event.delay') as mock_log_login:
        with patch('accounts.views.login.log_login_event.delay') as mock_login_event:
            yield {
                'log_login': mock_log_login,
                'login_event': mock_login_event
            }


@pytest.fixture
def api_client():
    """Фикстура для API клиента"""
    return APIClient()


@pytest.fixture
def django_client():
    """Фикстура для Django клиента"""
    return Client()


@pytest.fixture
def env_save_user_after_verification_only():
    """Фикстура для установки SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY=1"""
    with patch.dict(os.environ, {'SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY': '1'}):
        # Также патчим модули, которые уже импортировали переменные
        with patch('accounts.views.register.SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY', True):
            with patch('accounts.views.email_verification.SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY', True):
                yield


@pytest.fixture
def env_save_user_immediately():
    """Фикстура для установки SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY=0"""
    with patch.dict(os.environ, {'SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY': '0'}):
        # Также патчим модули, которые уже импортировали переменные
        with patch('accounts.views.register.SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY', False):
            with patch('accounts.views.email_verification.SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY', False):
                yield


@pytest.fixture
def env_send_email_verification():
    """Фикстура для установки SHOULD_SEND_EMAIL_VERIFICATION=1"""
    with patch.dict(os.environ, {'SHOULD_SEND_EMAIL_VERIFICATION': '1'}):
        with patch('accounts.views.register.SHOULD_SEND_EMAIL_VERIFICATION', True):
            yield


@pytest.fixture
def env_no_email_verification():
    """Фикстура для установки SHOULD_SEND_EMAIL_VERIFICATION=0"""
    with patch.dict(os.environ, {'SHOULD_SEND_EMAIL_VERIFICATION': '0'}):
        with patch('accounts.views.register.SHOULD_SEND_EMAIL_VERIFICATION', False):
            yield


@pytest.fixture
def env_login_after_registration():
    """Фикстура для установки SHOULD_LOGIN_AFTER_REGISTRATION=1"""
    with patch.dict(os.environ, {'SHOULD_LOGIN_AFTER_REGISTRATION': '1'}):
        with patch('accounts.views.register.SHOULD_LOGIN_AFTER_REGISTRATION', True):
            yield


@pytest.fixture
def env_no_login_after_registration():
    """Фикстура для установки SHOULD_LOGIN_AFTER_REGISTRATION=0"""
    with patch.dict(os.environ, {'SHOULD_LOGIN_AFTER_REGISTRATION': '0'}):
        with patch('accounts.views.register.SHOULD_LOGIN_AFTER_REGISTRATION', False):
            yield


@pytest.fixture
def user_data():
    """Данные для создания пользователя"""
    return {
        'email': 'test@example.com',
        'password': 'TestPass123!'
    }


@pytest.fixture
def user(user_data, db):
    """Фикстура для создания пользователя"""
    user = User.objects.create_user(
        email=user_data['email'],
        password=user_data['password'],
        is_active=True
    )
    return user


@pytest.fixture
def inactive_user(user_data, db):
    """Фикстура для создания неактивного пользователя"""
    user = User.objects.create_user(
        email='inactive@example.com',
        password=user_data['password'],
        is_active=False
    )
    return user


@pytest.fixture
def authenticated_client(api_client, user, db):
    """Фикстура для аутентифицированного API клиента"""
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def authenticated_session_client(django_client, user, db):
    """Фикстура для аутентифицированного Django клиента с сессией"""
    django_client.force_login(user)
    return django_client


@pytest.fixture
def superuser(db):
    """Фикстура для создания суперпользователя"""
    user = User.objects.create_superuser(
        email='admin@example.com',
        password='adminpass123'
    )
    return user


@pytest.fixture
def register_data():
    """Данные для регистрации"""
    return {
        'email': 'newuser@example.com',
        'password': 'TestPass123!'
    }


@pytest.fixture
def login_data():
    """Данные для входа"""
    return {
        'email': 'test@example.com',
        'password': 'TestPass123!'
    }


@pytest.fixture
def password_change_data():
    """Данные для смены пароля"""
    return {
        'old_password': 'TestPass123!',
        'new_password': 'NewPass123!'
    }


@pytest.fixture
def password_reset_data():
    """Данные для сброса пароля"""
    return {
        'email': 'test@example.com'
    }


@pytest.fixture
def password_reset_confirm_data():
    """Данные для подтверждения сброса пароля"""
    return {
        'email': 'test@example.com',
        'code': '123456',
        'new_password': 'NewPass123!'
    }


@pytest.fixture
def user_2fa(db):
    """Фикстура для создания пользователя с 2FA"""
    user = User.objects.create_user(
        email='test2fa@example.com',
        password='TestPass123!',
        is_active=True,
        is_2fa_enabled=True
    )
    return user


@pytest.fixture
def inactive_user_2fa(db):
    """Фикстура для создания неактивного пользователя с 2FA"""
    user = User.objects.create_user(
        email='inactive2fa@example.com',
        password='TestPass123!',
        is_active=False,
        is_2fa_enabled=True
    )
    return user


@pytest.fixture
def login_2fa_data():
    """Данные для входа с 2FA"""
    return {
        'email': 'test2fa@example.com',
        'password': 'TestPass123!',
        'code': '123456'
    }


@pytest.fixture
def setup_2fa_code(db):
    """Фикстура для настройки кода 2FA в кэше"""
    from django.core.cache import cache
    cache.set('2fa_code_test2fa@example.com', '123456', timeout=300)
    yield
    cache.delete('2fa_code_test2fa@example.com')


@pytest.fixture
def setup_2fa_code_inactive(db):
    """Фикстура для настройки кода 2FA в кэше для неактивного пользователя"""
    from django.core.cache import cache
    cache.set('2fa_code_inactive2fa@example.com', '123456', timeout=300)
    yield
    cache.delete('2fa_code_inactive2fa@example.com')


@pytest.fixture
def user_no_2fa(db):
    """Фикстура для создания пользователя без 2FA"""
    user = User.objects.create_user(
        email='test_no_2fa@example.com',
        password='TestPass123!',
        is_active=True,
        is_2fa_enabled=False
    )
    return user


@pytest.fixture
def login_data_no_2fa():
    """Данные для входа без 2FA"""
    return {
        'email': 'test_no_2fa@example.com',
        'password': 'TestPass123!'
    } 