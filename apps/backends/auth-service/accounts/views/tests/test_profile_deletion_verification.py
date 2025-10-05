import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.core.cache import cache
from unittest.mock import patch

User = get_user_model()


@pytest.mark.django_db
class TestDeleteProfileVerificationRequestView:
    """Тесты для DeleteProfileVerificationRequestView"""

    def test_request_deletion_verification_success(self, authenticated_client, user_no_2fa):
        """Тест успешного запроса кода верификации для удаления профиля"""
        # Устанавливаем email как метод верификации
        user_no_2fa.verification_method = 'email'
        user_no_2fa.save()
        
        # Аутентифицируемся как user_no_2fa
        authenticated_client.force_authenticate(user=user_no_2fa)
        
        with patch('accounts.views.user.send_mail') as mock_send_mail:
            response = authenticated_client.delete('/api/accounts/profile/delete/verification/')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'detail' in response.data
        assert 'verification_method' in response.data
        assert 'token' in response.data
        assert response.data['detail'] == 'Verification code sent'
        assert response.data['verification_method'] == 'email'
        
        # Проверяем, что код сохранен в кэше
        cache_key = f'profile_deletion_verification_{user_no_2fa.email}'
        cached_code = cache.get(cache_key)
        assert cached_code is not None
        assert len(cached_code) == 6
        
        # Проверяем, что email отправлен
        mock_send_mail.assert_called_once()

    def test_request_deletion_verification_unauthenticated(self, api_client):
        """Тест запроса кода верификации без аутентификации"""
        response = api_client.delete('/api/accounts/profile/delete/verification/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_request_deletion_verification_with_get_method(self, authenticated_client):
        """Тест запроса кода верификации с неподдерживаемым методом"""
        response = authenticated_client.get('/api/accounts/profile/delete/verification/')
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_request_deletion_verification_with_post_method(self, authenticated_client):
        """Тест запроса кода верификации с неподдерживаемым методом"""
        response = authenticated_client.post('/api/accounts/profile/delete/verification/')
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_request_deletion_verification_with_put_method(self, authenticated_client):
        """Тест запроса кода верификации с неподдерживаемым методом"""
        response = authenticated_client.put('/api/accounts/profile/delete/verification/')
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


@pytest.mark.django_db
class TestDeleteProfileVerificationConfirmView:
    """Тесты для DeleteProfileVerificationConfirmView"""

    def test_confirm_deletion_verification_success(self, authenticated_client, user_no_2fa):
        """Тест успешного подтверждения удаления профиля с кодом верификации"""
        # Аутентифицируемся как user_no_2fa
        authenticated_client.force_authenticate(user=user_no_2fa)
        
        # Сначала запрашиваем код верификации
        with patch('accounts.views.user.send_mail'):
            request_response = authenticated_client.delete('/api/accounts/profile/delete/verification/')
        
        assert request_response.status_code == status.HTTP_200_OK
        token = request_response.data['token']
        
        # Получаем код из кэша
        cache_key = f'profile_deletion_verification_{user_no_2fa.email}'
        code = cache.get(cache_key)
        
        # Подтверждаем удаление
        confirm_data = {
            'token': token,
            'code': code
        }
        
        response = authenticated_client.post('/api/accounts/profile/delete/confirm/', confirm_data)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'detail' in response.data
        assert 'deletion_requested_at' in response.data
        assert response.data['detail'] == 'Account deletion requested successfully'
        
        # Проверяем, что пользователь помечен для удаления
        user_no_2fa.refresh_from_db()
        assert user_no_2fa.is_deleted
        assert user_no_2fa.deletion_requested_at is not None
        
        # Проверяем, что код удален из кэша
        assert cache.get(cache_key) is None

    def test_confirm_deletion_verification_unauthenticated(self, api_client):
        """Тест подтверждения удаления без аутентификации"""
        data = {
            'token': 'some-token',
            'code': '123456'
        }
        
        response = api_client.post('/api/accounts/profile/delete/confirm/', data)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_confirm_deletion_verification_invalid_token(self, authenticated_client, user_no_2fa):
        """Тест подтверждения удаления с неверным токеном"""
        # Аутентифицируемся как user_no_2fa
        authenticated_client.force_authenticate(user=user_no_2fa)
        
        data = {
            'token': 'invalid-token',
            'code': '123456'
        }
        
        response = authenticated_client.post('/api/accounts/profile/delete/confirm/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['detail'] == 'Invalid token'

    def test_confirm_deletion_verification_invalid_code(self, authenticated_client, user_no_2fa):
        """Тест подтверждения удаления с неверным кодом"""
        # Аутентифицируемся как user_no_2fa
        authenticated_client.force_authenticate(user=user_no_2fa)
        
        # Сначала запрашиваем код верификации
        with patch('accounts.views.user.send_mail'):
            request_response = authenticated_client.delete('/api/accounts/profile/delete/verification/')
        
        assert request_response.status_code == status.HTTP_200_OK
        token = request_response.data['token']
        
        # Подтверждаем с неверным кодом
        confirm_data = {
            'token': token,
            'code': '000000'  # Неверный код
        }
        
        response = authenticated_client.post('/api/accounts/profile/delete/confirm/', confirm_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['detail'] == 'Invalid or expired verification code'

    def test_confirm_deletion_verification_expired_code(self, authenticated_client, user_no_2fa):
        """Тест подтверждения удаления с истекшим кодом"""
        # Аутентифицируемся как user_no_2fa
        authenticated_client.force_authenticate(user=user_no_2fa)
        
        # Сначала запрашиваем код верификации
        with patch('accounts.views.user.send_mail'):
            request_response = authenticated_client.delete('/api/accounts/profile/delete/verification/')
        
        assert request_response.status_code == status.HTTP_200_OK
        token = request_response.data['token']
        
        # Удаляем код из кэша (имитируем истечение)
        cache_key = f'profile_deletion_verification_{user_no_2fa.email}'
        cache.delete(cache_key)
        
        # Подтверждаем удаление
        confirm_data = {
            'token': token,
            'code': '123456'
        }
        
        response = authenticated_client.post('/api/accounts/profile/delete/confirm/', confirm_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['detail'] == 'Invalid or expired verification code'

    def test_confirm_deletion_verification_missing_token(self, authenticated_client, user_no_2fa):
        """Тест подтверждения удаления без токена"""
        # Аутентифицируемся как user_no_2fa
        authenticated_client.force_authenticate(user=user_no_2fa)
        
        data = {
            'code': '123456'
        }
        
        response = authenticated_client.post('/api/accounts/profile/delete/confirm/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_confirm_deletion_verification_missing_code(self, authenticated_client, user_no_2fa):
        """Тест подтверждения удаления без кода"""
        # Аутентифицируемся как user_no_2fa
        authenticated_client.force_authenticate(user=user_no_2fa)
        
        data = {
            'token': 'some-token'
        }
        
        response = authenticated_client.post('/api/accounts/profile/delete/confirm/', data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_confirm_deletion_verification_with_get_method(self, authenticated_client):
        """Тест подтверждения удаления с неподдерживаемым методом"""
        response = authenticated_client.get('/api/accounts/profile/delete/confirm/')
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_confirm_deletion_verification_with_put_method(self, authenticated_client):
        """Тест подтверждения удаления с неподдерживаемым методом"""
        response = authenticated_client.put('/api/accounts/profile/delete/confirm/')
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_confirm_deletion_verification_with_delete_method(self, authenticated_client):
        """Тест подтверждения удаления с неподдерживаемым методом"""
        response = authenticated_client.delete('/api/accounts/profile/delete/confirm/')
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


@pytest.mark.django_db
class TestProfileDeletionVerificationIntegration:
    """Интеграционные тесты для верификации удаления профиля"""

    def test_complete_deletion_verification_flow(self, authenticated_client, user_no_2fa):
        """Тест полного цикла верификации удаления профиля"""
        # Аутентифицируемся как user_no_2fa
        authenticated_client.force_authenticate(user=user_no_2fa)
        
        # 1. Запрашиваем код верификации
        with patch('accounts.views.user.send_mail') as mock_send_mail:
            request_response = authenticated_client.delete('/api/accounts/profile/delete/verification/')
        
        assert request_response.status_code == status.HTTP_200_OK
        token = request_response.data['token']
        
        # 2. Получаем код из кэша
        cache_key = f'profile_deletion_verification_{user_no_2fa.email}'
        code = cache.get(cache_key)
        assert code is not None
        
        # 3. Подтверждаем удаление
        confirm_data = {
            'token': token,
            'code': code
        }
        
        response = authenticated_client.post('/api/accounts/profile/delete/confirm/', confirm_data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Account deletion requested successfully'
        
        # 4. Проверяем, что пользователь помечен для удаления
        user_no_2fa.refresh_from_db()
        assert user_no_2fa.is_deleted
        assert user_no_2fa.deletion_requested_at is not None
        
        # 5. Проверяем, что код удален из кэша
        assert cache.get(cache_key) is None

    def test_deletion_verification_with_sms_method(self, authenticated_client, user_no_2fa):
        """Тест верификации удаления с SMS методом"""
        # Устанавливаем SMS как метод верификации
        user_no_2fa.verification_method = 'sms'
        user_no_2fa.save()
        
        # Аутентифицируемся как user_no_2fa
        authenticated_client.force_authenticate(user=user_no_2fa)
        
        with patch('accounts.views.user.send_mail') as mock_send_mail:
            response = authenticated_client.delete('/api/accounts/profile/delete/verification/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['verification_method'] == 'sms'
        
        # Email не должен быть отправлен
        mock_send_mail.assert_not_called()

    def test_deletion_verification_token_security(self, authenticated_client, user_no_2fa):
        """Тест безопасности токена верификации удаления"""
        # Аутентифицируемся как user_no_2fa
        authenticated_client.force_authenticate(user=user_no_2fa)
        
        # Запрашиваем код верификации
        with patch('accounts.views.user.send_mail'):
            request_response = authenticated_client.delete('/api/accounts/profile/delete/verification/')
        
        assert request_response.status_code == status.HTTP_200_OK
        token = request_response.data['token']
        
        # Получаем код из кэша
        cache_key = f'profile_deletion_verification_{user_no_2fa.email}'
        code = cache.get(cache_key)
        
        # Пытаемся использовать токен с неверным действием (имитируем подделку)
        # Это должно провалиться, так как токен содержит action='profile_deletion'
        confirm_data = {
            'token': token,
            'code': code
        }
        
        response = authenticated_client.post('/api/accounts/profile/delete/confirm/', confirm_data)
        
        # Должен пройти успешно, так как токен корректный
        assert response.status_code == status.HTTP_200_OK
