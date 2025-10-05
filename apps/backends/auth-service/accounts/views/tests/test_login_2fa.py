import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.cache import cache

User = get_user_model()


class TestLogin2FAView:
    """Тесты для эндпойнта логина с 2FA"""

    def test_login_2fa_success(self, api_client, user_2fa, login_2fa_data, setup_2fa_code, db):
        """Тест успешного входа с 2FA"""
        url = reverse('login-2fa')
        response = api_client.post(url, login_2fa_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['detail'] == 'Login successful'
        assert 'timestamp' in response.data

    def test_login_2fa_with_inactive_user(self, api_client, inactive_user_2fa, setup_2fa_code_inactive, db):
        """Тест входа с 2FA для неактивного пользователя"""
        url = reverse('login-2fa')
        data = {
            'email': 'inactive2fa@example.com', 
            'password': 'testpass123',
            'code': '123456'
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['detail'] == 'User is not active'

    def test_login_2fa_with_nonexistent_user(self, api_client, db):
        """Тест входа с 2FA для несуществующего пользователя"""
        url = reverse('login-2fa')
        data = {
            'email': 'nonexistent@example.com', 
            'password': 'testpass123',
            'code': '123456'
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['detail'] == 'Invalid credentials'

    def test_login_2fa_with_invalid_code(self, api_client, user_2fa, setup_2fa_code, db):
        """Тест входа с 2FA с неверным кодом"""
        url = reverse('login-2fa')
        data = {
            'email': 'test2fa@example.com', 
            'password': 'testpass123',
            'code': '999999'  # Неверный код
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['detail'] == 'Invalid 2FA code'

    def test_login_2fa_with_expired_code(self, api_client, user_2fa, db):
        """Тест входа с 2FA с истекшим кодом"""
        url = reverse('login-2fa')
        data = {
            'email': 'test2fa@example.com', 
            'password': 'testpass123',
            'code': '123456'
        }
        # Удаляем код из кэша (имитируем истечение)
        cache.delete(f'2fa_code_test2fa@example.com')
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['detail'] == 'Invalid 2FA code'

    def test_login_2fa_with_wrong_password(self, api_client, user_2fa, setup_2fa_code, db):
        """Тест входа с 2FA с неверным паролем"""
        url = reverse('login-2fa')
        data = {
            'email': 'test2fa@example.com', 
            'password': 'wrongpassword',
            'code': '123456'
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['detail'] == 'Invalid credentials'

    def test_login_2fa_without_email(self, api_client, db):
        """Тест входа с 2FA без email"""
        url = reverse('login-2fa')
        data = {
            'password': 'testpass123',
            'code': '123456'
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data

    def test_login_2fa_without_password(self, api_client, db):
        """Тест входа с 2FA без пароля"""
        url = reverse('login-2fa')
        data = {
            'email': 'test2fa@example.com',
            'code': '123456'
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data

    def test_login_2fa_without_code(self, api_client, db):
        """Тест входа с 2FA без кода"""
        url = reverse('login-2fa')
        data = {
            'email': 'test2fa@example.com',
            'password': 'testpass123'
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'code' in response.data

    def test_login_2fa_with_empty_data(self, api_client, db):
        """Тест входа с 2FA с пустыми данными"""
        url = reverse('login-2fa')
        response = api_client.post(url, {})
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data
        assert 'password' in response.data
        assert 'code' in response.data

    def test_login_2fa_with_invalid_email_format(self, api_client, db):
        """Тест входа с 2FA с неверным форматом email"""
        url = reverse('login-2fa')
        data = {
            'email': 'invalid-email', 
            'password': 'testpass123',
            'code': '123456'
        }
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data

    def test_login_2fa_code_deleted_after_success(self, api_client, user_2fa, login_2fa_data, setup_2fa_code, db):
        """Тест что код 2FA удаляется из кэша после успешного входа"""
        url = reverse('login-2fa')
        
        # Проверяем что код существует в кэше
        assert cache.get(f'2fa_code_test2fa@example.com') == '123456'
        
        response = api_client.post(url, login_2fa_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        
        # Проверяем что код удален из кэша
        assert cache.get(f'2fa_code_test2fa@example.com') is None 