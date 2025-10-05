import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from django.conf import settings
from unittest.mock import patch

User = get_user_model()


class TestPasswordResetRequestView:
    """Тесты для эндпойнта запроса сброса пароля"""

    @patch('accounts.views.password_reset.send_mail')
    def test_password_reset_request_success(self, mock_send_mail, api_client, user, password_reset_data, db):
        """Тест успешного запроса сброса пароля"""
        url = reverse('password-reset')
        response = api_client.post(url, password_reset_data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Password reset link sent'
        
        # Проверяем, что email был отправлен
        mock_send_mail.assert_called_once()
        call_args = mock_send_mail.call_args
        assert call_args[0][0] == 'Password Reset'  # subject
        assert call_args[0][2] == settings.DEFAULT_FROM_EMAIL  # from_email
        assert call_args[0][3] == [user.email]  # recipient_list
        
        # Проверяем, что в письме есть ссылка с токеном
        email_body = call_args[0][1]
        assert 'Your password reset link:' in email_body
        assert settings.FRONTEND_PASS_CHANGE_CONFIRMATION_URL in email_body
        # Токен должен быть в конце ссылки
        reset_url = email_body.split('Your password reset link: ')[1]
        assert len(reset_url.split('/')[-1]) > 20  # Токен должен быть достаточно длинным

    def test_password_reset_request_without_email(self, api_client, db):
        """Тест запроса сброса пароля без email"""
        url = reverse('password-reset')
        response = api_client.post(url, {})
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data

    def test_password_reset_request_with_invalid_email(self, api_client, db):
        """Тест запроса сброса пароля с неверным email"""
        url = reverse('password-reset')
        data = {'email': 'invalid-email'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data

    def test_password_reset_request_with_nonexistent_email(self, api_client, db):
        """Тест запроса сброса пароля с несуществующим email"""
        url = reverse('password-reset')
        data = {'email': 'nonexistent@example.com'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['detail'] == 'Invalid credentials'

    def test_password_reset_request_with_get_method(self, api_client, db):
        """Тест запроса сброса пароля с GET методом"""
        url = reverse('password-reset')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    @patch('accounts.views.password_reset.send_mail')
    def test_password_reset_request_token_generation(self, mock_send_mail, api_client, user, db):
        """Тест генерации уникального токена для каждого запроса"""
        url = reverse('password-reset')
        
        # Первый запрос
        response1 = api_client.post(url, {'email': user.email})
        assert response1.status_code == status.HTTP_200_OK
        
        # Второй запрос
        response2 = api_client.post(url, {'email': user.email})
        assert response2.status_code == status.HTTP_200_OK
        
        # Проверяем, что токены разные
        call_args1 = mock_send_mail.call_args_list[0]
        call_args2 = mock_send_mail.call_args_list[1]
        
        email_body1 = call_args1[0][1]
        email_body2 = call_args2[0][1]
        
        token1 = email_body1.split('Your password reset link: ')[1].split('/')[-1]
        token2 = email_body2.split('Your password reset link: ')[1].split('/')[-1]
        
        assert token1 != token2  # Токены должны быть разными


class TestPasswordResetConfirmView:
    """Тесты для эндпойнта подтверждения сброса пароля"""

    def test_password_reset_confirm_success(self, api_client, user, db):
        """Тест успешного подтверждения сброса пароля"""
        from accounts.views.password_reset import create_encrypted_token
        
        # Создаем токен для тестирования
        test_code = '123456'
        token = create_encrypted_token(user.email, test_code)
        
        # Сохраняем код в кэше
        from django.core.cache import cache
        cache.set(f'reset_code_{user.email}', test_code, timeout=600)
        
        # Подтверждаем сброс пароля
        confirm_url = reverse('password-reset-confirm')
        data = {
            'token': token,
            'new_password': 'newpass123!'
        }
        response = api_client.post(confirm_url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Password reset successful'
        
        # Проверяем, что пароль действительно изменился
        user.refresh_from_db()
        assert user.check_password('newpass123!')

    def test_password_reset_confirm_with_invalid_token(self, api_client, db):
        """Тест подтверждения сброса пароля с неверным токеном"""
        confirm_url = reverse('password-reset-confirm')
        data = {
            'token': 'invalid_token_here',
            'new_password': 'newpass123!'
        }
        response = api_client.post(confirm_url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['detail'] == 'Invalid token'

    def test_password_reset_confirm_with_expired_code(self, api_client, user, db):
        """Тест подтверждения сброса пароля с истекшим кодом"""
        from accounts.views.password_reset import create_encrypted_token
        
        # Создаем токен с кодом, которого нет в кэше
        test_code = '123456'
        token = create_encrypted_token(user.email, test_code)
        
        # НЕ сохраняем код в кэше (имитируем истечение)
        
        confirm_url = reverse('password-reset-confirm')
        data = {
            'token': token,
            'new_password': 'newpass123!'
        }
        response = api_client.post(confirm_url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['detail'] == 'Invalid or expired token'

    def test_password_reset_confirm_with_wrong_code_in_token(self, api_client, user, db):
        """Тест подтверждения сброса пароля с неверным кодом в токене"""
        from accounts.views.password_reset import create_encrypted_token
        
        # Создаем токен с одним кодом
        token_code = '123456'
        token = create_encrypted_token(user.email, token_code)
        
        # Сохраняем в кэше другой код
        from django.core.cache import cache
        cache.set(f'reset_code_{user.email}', '654321', timeout=600)
        
        confirm_url = reverse('password-reset-confirm')
        data = {
            'token': token,
            'new_password': 'newpass123!'
        }
        response = api_client.post(confirm_url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['detail'] == 'Invalid or expired token'

    def test_password_reset_confirm_with_nonexistent_user(self, api_client, db):
        """Тест подтверждения сброса пароля с несуществующим пользователем"""
        from accounts.views.password_reset import create_encrypted_token
        
        # Создаем токен для несуществующего пользователя
        test_code = '123456'
        token = create_encrypted_token('nonexistent@example.com', test_code)
        
        # Сохраняем код в кэше
        from django.core.cache import cache
        cache.set(f'reset_code_nonexistent@example.com', test_code, timeout=600)
        
        confirm_url = reverse('password-reset-confirm')
        data = {
            'token': token,
            'new_password': 'newpass123!'
        }
        response = api_client.post(confirm_url, data)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert response.data['detail'] == 'Invalid credentials'

    def test_password_reset_confirm_without_token(self, api_client, db):
        """Тест подтверждения сброса пароля без токена"""
        confirm_url = reverse('password-reset-confirm')
        data = {
            'new_password': 'newpass123!'
        }
        response = api_client.post(confirm_url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'token' in response.data

    def test_password_reset_confirm_without_new_password(self, api_client, db):
        """Тест подтверждения сброса пароля без нового пароля"""
        confirm_url = reverse('password-reset-confirm')
        data = {
            'token': 'some_token_here'
        }
        response = api_client.post(confirm_url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'new_password' in response.data

    def test_password_reset_confirm_with_empty_data(self, api_client, db):
        """Тест подтверждения сброса пароля с пустыми данными"""
        confirm_url = reverse('password-reset-confirm')
        response = api_client.post(confirm_url, {})
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'token' in response.data
        assert 'new_password' in response.data

    def test_password_reset_confirm_with_get_method(self, api_client, db):
        """Тест подтверждения сброса пароля с GET методом"""
        confirm_url = reverse('password-reset-confirm')
        response = api_client.get(confirm_url)
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED 