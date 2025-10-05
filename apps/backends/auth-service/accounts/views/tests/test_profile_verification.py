import pytest
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock

from accounts.models import User, UserRole
from django.core.cache import cache


class ProfileVerificationRequestViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('profile-verification-request')
        
        # Создаем пользователя
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            is_active=True
        )
        
        # Аутентифицируем пользователя
        self.client.force_authenticate(user=self.user)
        
        # Очищаем кэш перед каждым тестом
        cache.clear()

    def tearDown(self):
        cache.clear()

    @patch('accounts.views.profile_verification.EmailService')
    def test_successful_verification_request_single_field(self, mock_email_service):
        """Тест успешного запроса верификации для одного поля"""
        data = {
            'fields_to_change': ['password']
        }
        
        mock_service_instance = MagicMock()
        mock_email_service.return_value = mock_service_instance
        
        response = self.client.post(self.url, data, format='json')
        
        print(f"Response status: {response.status_code}")
        print(f"Response data: {response.data}")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Verification code sent')
        self.assertEqual(response.data['verification_method'], 'email')
        self.assertEqual(response.data['fields_to_change'], ['password'])
        self.assertIn('token', response.data)
        mock_email_service.assert_called_once_with('test@example.com')
        mock_service_instance.send.assert_called_once()

    @patch('accounts.views.profile_verification.EmailService')
    def test_successful_verification_request_multiple_fields(self, mock_email_service):
        """Тест успешного запроса верификации для нескольких полей"""
        data = {
            'fields_to_change': ['password', 'phone', 'backup_phone']
        }
        
        mock_service_instance = MagicMock()
        mock_email_service.return_value = mock_service_instance
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Verification code sent')
        self.assertEqual(response.data['verification_method'], 'email')
        self.assertEqual(len(response.data['fields_to_change']), 3)
        self.assertIn('token', response.data)
        mock_email_service.assert_called_once_with('test@example.com')
        mock_service_instance.send.assert_called_once()

    def test_verification_request_user_not_found(self):
        """Тест запроса верификации для несуществующего пользователя"""
        # Создаем новый клиент без аутентификации
        from rest_framework.test import APIClient
        unauthenticated_client = APIClient()
        
        data = {
            'email': 'nonexistent@example.com',
            'fields_to_change': ['password']
        }
        
        response = unauthenticated_client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['detail'], 'Authentication required')

    def test_verification_request_invalid_data(self):
        """Тест запроса верификации с неверными данными"""
        data = {
            'email': 'invalid-email',
            'fields_to_change': ['invalid_field']
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verification_request_empty_fields_list(self):
        """Тест запроса верификации с пустым списком полей"""
        data = {
            'email': 'test@example.com',
            'fields_to_change': []
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('accounts.views.profile_verification.EmailService')
    def test_verification_request_with_sms_method(self, mock_email_service):
        """Тест запроса верификации с SMS методом"""
        self.user.verification_method = 'sms'
        self.user.save()
        
        data = {
            'fields_to_change': ['password']
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Verification code sent')
        self.assertEqual(response.data['verification_method'], 'sms')
        self.assertIn('token', response.data)
        # SMS не должен вызывать EmailService
        mock_email_service.assert_not_called()


class ProfileVerificationConfirmViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('profile-verification-confirm')
        
        # Создаем пользователя
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            is_active=True
        )
        
        # Создаем роль
        self.role = UserRole.objects.create(name='Test Role')
        
        # Очищаем кэш перед каждым тестом
        cache.clear()

    def tearDown(self):
        cache.clear()

    def create_verification_token(self, email, code, fields_to_change):
        """Создает токен верификации для тестирования"""
        from accounts.views.profile_verification import create_verification_token
        return create_verification_token(email, code, fields_to_change)

    @patch('accounts.views.profile_verification.send_lazy_email')
    def test_successful_field_change_single(self, mock_send_lazy_email):
        """Тест успешного изменения одного поля"""
        fields_to_change = ['phone']
        code = '123456'
        token = self.create_verification_token('test@example.com', code, fields_to_change)
        
        # Сохраняем код в кэш
        cache.set(f'profile_verification_test@example.com_phone', code, timeout=600)
        
        data = {
            'token': token,
            'new_values': {'phone': '+1234567890'},
            'code': code
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['changed_fields'], ['phone'])
        self.assertIn('Fields changed successfully', response.data['detail'])
        
        # Проверяем, что поле изменилось
        self.user.refresh_from_db()
        self.assertEqual(self.user.phone, '+1234567890')
        
        # Проверяем, что отправлен email
        mock_send_lazy_email.delay.assert_called_once()

    @patch('accounts.views.profile_verification.send_lazy_email')
    def test_successful_field_change_multiple(self, mock_send_lazy_email):
        """Тест успешного изменения нескольких полей"""
        fields_to_change = ['phone', 'backup_phone']
        code = '123456'
        token = self.create_verification_token('test@example.com', code, fields_to_change)
        
        # Сохраняем коды в кэш
        for field in fields_to_change:
            cache.set(f'profile_verification_test@example.com_{field}', code, timeout=600)
        
        data = {
            'token': token,
            'new_values': {
                'phone': '+1234567890',
                'backup_phone': '+9876543210'
            },
            'code': code
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['changed_fields']), 2)
        self.assertIn('Fields changed successfully', response.data['detail'])
        
        # Проверяем, что поля изменились
        self.user.refresh_from_db()
        self.assertEqual(self.user.phone, '+1234567890')
        self.assertEqual(self.user.backup_phone, '+9876543210')
        
        # Проверяем, что отправлен email
        mock_send_lazy_email.delay.assert_called_once()

    @patch('accounts.views.profile_verification.send_lazy_email')
    def test_successful_password_change(self, mock_send_lazy_email):
        """Тест успешного изменения пароля"""
        fields_to_change = ['password']
        code = '123456'
        token = self.create_verification_token('test@example.com', code, fields_to_change)
        
        # Сохраняем код в кэш
        cache.set(f'profile_verification_test@example.com_password', code, timeout=600)
        
        data = {
            'token': token,
            'new_values': {'password': 'newpassword123'},
            'code': code
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['changed_fields'], ['password'])
        self.assertIn('Fields changed successfully', response.data['detail'])
        
        # Проверяем, что пароль изменился
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword123'))
        
        # Проверяем, что отправлен email
        mock_send_lazy_email.delay.assert_called_once()

    def test_invalid_token(self):
        """Тест с неверным токеном"""
        data = {
            'token': 'invalid_token',
            'new_values': {'phone': '+1234567890'},
            'code': '123456'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Invalid token')

    def test_expired_verification_code(self):
        """Тест с истекшим кодом верификации"""
        fields_to_change = ['phone']
        code = '123456'
        token = self.create_verification_token('test@example.com', code, fields_to_change)
        
        # НЕ сохраняем код в кэш (имитируем истечение)
        
        data = {
            'token': token,
            'new_values': {'phone': '+1234567890'},
            'code': code
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Invalid or expired verification code', response.data['detail'])

    def test_user_not_found(self):
        """Тест с несуществующим пользователем"""
        fields_to_change = ['phone']
        code = '123456'
        token = self.create_verification_token('nonexistent@example.com', code, fields_to_change)
        
        data = {
            'token': token,
            'new_values': {'phone': '+1234567890'},
            'code': code
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail'], 'User not found')

    @patch('accounts.views.profile_verification.send_lazy_email')
    def test_partial_field_update(self, mock_send_lazy_email):
        """Тест частичного обновления полей (не все поля из списка)"""
        fields_to_change = ['phone', 'backup_phone']
        code = '123456'
        token = self.create_verification_token('test@example.com', code, fields_to_change)
        
        # Сохраняем коды в кэш
        for field in fields_to_change:
            cache.set(f'profile_verification_test@example.com_{field}', code, timeout=600)
        
        data = {
            'token': token,
            'new_values': {
                'phone': '+1234567890',
                # backup_phone не передается
            },
            'code': code
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['changed_fields']), 1)
        self.assertIn('phone', response.data['changed_fields'])
        self.assertIn('Fields changed successfully', response.data['detail'])
        
        # Проверяем, что только переданные поля изменились
        self.user.refresh_from_db()
        self.assertEqual(self.user.phone, '+1234567890')
        # backup_phone должен остаться неизменным
        self.assertIsNone(self.user.backup_phone)
        
        # Проверяем, что отправлен email
        mock_send_lazy_email.delay.assert_called_once()

    def test_code_mismatch(self):
        """Тест с несоответствием кода из токена и переданного кода"""
        fields_to_change = ['phone']
        code = '123456'
        wrong_code = '654321'
        token = self.create_verification_token('test@example.com', code, fields_to_change)
        
        # Сохраняем правильный код в кэш
        cache.set(f'profile_verification_test@example.com_phone', code, timeout=600)
        
        data = {
            'token': token,
            'new_values': {'phone': '+1234567890'},
            'code': wrong_code  # Передаем неправильный код
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Invalid or expired code (probably changed)')
