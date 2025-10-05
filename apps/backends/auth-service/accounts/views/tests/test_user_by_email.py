import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class TestUserByEmailView:
    """Тесты для эндпойнта получения пользователя по email"""

    def test_get_user_by_email_success(self, authenticated_client, db):
        """Тест успешного получения пользователя по email"""
        # Создаем тестового пользователя
        test_user, created = User.objects.get_or_create(
            email='test@example.com',
            defaults={
                'password': 'testpass123',
                'is_active': True,
                'username': 'testuser'
            }
        )
        
        url = reverse('user-by-email')
        response = authenticated_client.get(url, {'email': 'test@example.com'})
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == 'test@example.com'
        assert response.data['username'] == test_user.username

    def test_get_user_by_email_not_found(self, authenticated_client, db):
        """Тест получения несуществующего пользователя"""
        url = reverse('user-by-email')
        response = authenticated_client.get(url, {'email': 'nonexistent@example.com'})
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data['detail'] == 'User not found'

    def test_get_user_by_email_missing_parameter(self, authenticated_client, db):
        """Тест запроса без параметра email"""
        url = reverse('user-by-email')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['detail'] == 'Email parameter is required'

    def test_get_user_by_email_empty_parameter(self, authenticated_client, db):
        """Тест запроса с пустым параметром email"""
        url = reverse('user-by-email')
        response = authenticated_client.get(url, {'email': ''})
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['detail'] == 'Email parameter is required'

    def test_get_user_by_email_unauthenticated(self, api_client, db):
        """Тест получения пользователя без аутентификации"""
        url = reverse('user-by-email')
        response = api_client.get(url, {'email': 'test@example.com'})
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_user_by_email_with_post_method(self, authenticated_client, db):
        """Тест с POST методом (не поддерживается)"""
        url = reverse('user-by-email')
        response = authenticated_client.post(url, {'email': 'test@example.com'})
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_user_by_email_with_put_method(self, authenticated_client, db):
        """Тест с PUT методом (не поддерживается)"""
        url = reverse('user-by-email')
        response = authenticated_client.put(url, {'email': 'test@example.com'})
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_user_by_email_with_patch_method(self, authenticated_client, db):
        """Тест с PATCH методом (не поддерживается)"""
        url = reverse('user-by-email')
        response = authenticated_client.patch(url, {'email': 'test@example.com'})
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_user_by_email_with_delete_method(self, authenticated_client, db):
        """Тест с DELETE методом (не поддерживается)"""
        url = reverse('user-by-email')
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_get_user_by_email_case_sensitive(self, authenticated_client, db):
        """Тест чувствительности к регистру email"""
        # Создаем пользователя с email в нижнем регистре
        test_user, created = User.objects.get_or_create(
            email='test@example.com',
            defaults={
                'password': 'testpass123',
                'is_active': True,
                'username': 'testuser'
            }
        )
        
        url = reverse('user-by-email')
        # Ищем с заглавными буквами
        response = authenticated_client.get(url, {'email': 'TEST@EXAMPLE.COM'})
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data['detail'] == 'User not found'

    def test_get_user_by_email_response_structure(self, authenticated_client, db):
        """Тест структуры ответа"""
        test_user, created = User.objects.get_or_create(
            email='test@example.com',
            defaults={
                'password': 'testpass123',
                'is_active': True,
                'name': 'Test User',
                'username': 'testuser'
            }
        )
        
        url = reverse('user-by-email')
        response = authenticated_client.get(url, {'email': 'test@example.com'})
        
        assert response.status_code == status.HTTP_200_OK
        
        # Проверяем, что все ожидаемые поля присутствуют
        expected_fields = ['username', 'avatar', 'email', 'bio']
        for field in expected_fields:
            assert field in response.data
        
        # Проверяем, что лишние поля отсутствуют
        unexpected_fields = ['id', 'is_active', 'is_2fa_enabled', 'name', 'location', 'website', 'role']
        for field in unexpected_fields:
            assert field not in response.data
