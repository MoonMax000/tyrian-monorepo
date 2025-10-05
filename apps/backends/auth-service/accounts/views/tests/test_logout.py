import pytest
from django.urls import reverse # type: ignore
from rest_framework import status # type: ignore
from django.contrib.auth import get_user_model # type: ignore

User = get_user_model()


class TestLogoutView:
    """Тесты для эндпойнта логаута"""

    def test_logout_success(self, authenticated_client, db):
        """Тест успешного выхода"""
        url = reverse('logout')
        response = authenticated_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Logged out successfully'

    def test_logout_unauthenticated(self, api_client, db):
        """Тест выхода без аутентификации"""
        url = reverse('logout')
        response = api_client.post(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_logout_with_get_method(self, authenticated_client, db):
        """Тест выхода с GET методом"""
        url = reverse('logout')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_logout_with_put_method(self, authenticated_client, db):
        """Тест выхода с PUT методом"""
        url = reverse('logout')
        response = authenticated_client.put(url)
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_logout_with_delete_method(self, authenticated_client, db):
        """Тест выхода с DELETE методом"""
        url = reverse('logout')
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED 