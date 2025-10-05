import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class TestProfileView:
    """Тесты для эндпойнта профиля"""

    def test_get_profile_success(self, authenticated_client, user, db):
        """Тест успешного получения профиля"""
        url = reverse('me')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == user.email

    def test_get_profile_unauthenticated(self, api_client, db):
        """Тест получения профиля без аутентификации"""
        url = reverse('me')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_profile_with_put_method(self, authenticated_client, db):
        """Тест профиля с PUT методом (не поддерживается)"""
        url = reverse('me')
        data = {'email': 'updated@example.com'}
        response = authenticated_client.put(url, data)
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_profile_with_patch_method(self, authenticated_client, db):
        """Тест профиля с PATCH методом (не поддерживается)"""
        url = reverse('me')
        data = {'email': 'patched@example.com'}
        response = authenticated_client.patch(url, data)
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_profile_with_delete_method(self, authenticated_client, db):
        """Тест профиля с DELETE методом (не поддерживается)"""
        url = reverse('me')
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED 