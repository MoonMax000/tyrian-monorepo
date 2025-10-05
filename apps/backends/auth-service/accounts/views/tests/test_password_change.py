import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class TestPasswordChangeView:
    """Тесты для эндпойнта смены пароля"""

    def test_password_change_success(self, authenticated_client, user, password_change_data, db):
        """Тест успешной смены пароля"""
        url = reverse('password-change')
        response = authenticated_client.post(url, password_change_data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Password changed successfully'
        
        # Проверяем, что пароль действительно изменился
        user.refresh_from_db()
        assert user.check_password(password_change_data['new_password'])

    def test_password_change_with_wrong_old_password(self, authenticated_client, password_change_data, db):
        """Тест смены пароля с неверным старым паролем"""
        url = reverse('password-change')
        data = {
            'old_password': 'wrongpassword',
            'new_password': password_change_data['new_password']
        }
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['detail'] == 'Wrong old password'

    def test_password_change_without_old_password(self, authenticated_client, db):
        """Тест смены пароля без старого пароля"""
        url = reverse('password-change')
        data = {'new_password': 'newpass123'}
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'old_password' in response.data

    def test_password_change_without_new_password(self, authenticated_client, db):
        """Тест смены пароля без нового пароля"""
        url = reverse('password-change')
        data = {'old_password': 'testpass123'}
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'new_password' in response.data

    def test_password_change_with_empty_data(self, authenticated_client, db):
        """Тест смены пароля с пустыми данными"""
        url = reverse('password-change')
        response = authenticated_client.post(url, {})
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'old_password' in response.data
        assert 'new_password' in response.data

    def test_password_change_unauthenticated(self, api_client, password_change_data, db):
        """Тест смены пароля без аутентификации"""
        url = reverse('password-change')
        response = api_client.post(url, password_change_data)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_password_change_with_get_method(self, authenticated_client, db):
        """Тест смены пароля с GET методом"""
        url = reverse('password-change')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_password_change_with_put_method(self, authenticated_client, password_change_data, db):
        """Тест смены пароля с PUT методом"""
        url = reverse('password-change')
        response = authenticated_client.put(url, password_change_data)
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED 