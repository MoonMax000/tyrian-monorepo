import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class TestLoginView:
    """Тесты для эндпойнта логина"""

    def test_login_success(self, api_client, user_no_2fa, login_data_no_2fa, db):
        """Тест успешного входа"""
        url = reverse('login')
        response = api_client.post(url, login_data_no_2fa)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['detail'] == 'Login successful'

    def test_login_with_inactive_user(self, api_client, inactive_user, db):
        """Тест входа с неактивным пользователем"""
        url = reverse('login')
        data = {'email': 'inactive@example.com', 'password': 'testpass123'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['detail'] == 'User is not active'

    def test_login_with_wrong_password(self, api_client, user_no_2fa, db):
        """Тест входа с неверным паролем"""
        url = reverse('login')
        data = {'email': 'test_no_2fa@example.com', 'password': 'wrongpassword'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['detail'] == 'Invalid credentials'

    def test_login_with_nonexistent_user(self, api_client, db):
        """Тест входа с несуществующим пользователем"""
        url = reverse('login')
        data = {'email': 'nonexistent@example.com', 'password': 'testpass123'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['detail'] == 'Invalid credentials'

    def test_login_without_email(self, api_client, db):
        """Тест входа без email"""
        url = reverse('login')
        data = {'password': 'testpass123'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data

    def test_login_without_password(self, api_client, db):
        """Тест входа без пароля"""
        url = reverse('login')
        data = {'email': 'test@example.com'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data

    def test_login_with_empty_data(self, api_client, db):
        """Тест входа с пустыми данными"""
        url = reverse('login')
        response = api_client.post(url, {})
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data
        assert 'password' in response.data

    def test_login_with_invalid_email_format(self, api_client, db):
        """Тест входа с неверным форматом email"""
        url = reverse('login')
        data = {'email': 'invalid-email', 'password': 'testpass123'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data 