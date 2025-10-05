import pytest
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock
from django.core.cache import cache
from django.conf import settings

from accounts.models import User
from accounts.views.email_change import (
    create_change_email_verification_token,
    decrypt_change_email_verification_token,
)


class ChangeEmailVerificationRequestViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('email-change-verification-request')
        
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

    @patch('accounts.views.email_change.EmailService')
    def test_successful_verification_request(self, mock_email_service):
        """Тест успешного запроса верификации изменения email"""
        data = {
            'current_email': 'test@example.com',
            'new_email': 'newemail@example.com'
        }
        
        # Мокаем EmailService
        mock_service_instance = MagicMock()
        mock_email_service.return_value = mock_service_instance
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Email change verification sent')
        self.assertIn('token', response.data)
        
        # Проверяем, что EmailService был вызван
        mock_email_service.assert_called_once_with('test@example.com')
        mock_service_instance.send_email_change_verification.assert_called_once_with(new_email='newemail@example.com')
        
        # Проверяем, что данные сохранены в кэше
        cached_email = cache.get(f'change_test@example.com')
        self.assertEqual(cached_email, 'newemail@example.com')

    def test_invalid_current_email(self):
        """Тест с неверным текущим email"""
        data = {
            'current_email': 'wrong@example.com',
            'new_email': 'newemail@example.com'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        # Теперь проверяется соответствие current_email и user.email
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Given email and user email are not the same')

    def test_invalid_new_email_format(self):
        """Тест с неверным форматом нового email"""
        data = {
            'current_email': 'test@example.com',
            'new_email': 'invalid-email'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_existing_new_email(self):
        """Тест с уже существующим новым email"""
        # Создаем другого пользователя с email, который мы хотим использовать как new_email
        existing_user = User.objects.create_user(
            email='existing@example.com',
            password='testpass123',
            is_active=True
        )
        
        data = {
            'current_email': 'test@example.com',
            'new_email': 'existing@example.com'  # Этот email уже существует
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Invalid new email')

    def test_unauthenticated_request(self):
        """Тест неаутентифицированного запроса"""
        # Создаем новый клиент без аутентификации
        unauthenticated_client = APIClient()
        
        data = {
            'current_email': 'test@example.com',
            'new_email': 'newemail@example.com'
        }
        
        response = unauthenticated_client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class EmailChangeConfirmViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('email-change-confirm')
        
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

    def test_successful_email_change_confirm(self):
        """Тест успешного подтверждения изменения email"""
        # Создаем валидный токен
        token = create_change_email_verification_token(
            'test@example.com', 
            'newemail@example.com'
        )
        
        # Сохраняем код верификации в кэше
        verification_code = '123456'
        cache.set(f'change_email_verify_code_test@example.com', verification_code, timeout=300)
        cache.set(f'change_test@example.com', 'newemail@example.com', timeout=300)
        
        data = {
            'token': token,
            'code': verification_code
        }
        
        with patch('accounts.views.email_change.EmailService') as mock_email_service:
            mock_service_instance = MagicMock()
            mock_email_service.return_value = mock_service_instance
            
            response = self.client.post(self.url, data, format='json')
            
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data['detail'], 'New email change verification sent')
            
            # Проверяем, что EmailService был вызван для нового email
            mock_email_service.assert_any_call('newemail@example.com')
            mock_service_instance.send_email_verification.assert_called_once()

    def test_invalid_token(self):
        """Тест с неверным токеном"""
        data = {
            'token': 'invalid-token',
            'code': '123456'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Invalid token')

    def test_invalid_verification_code(self):
        """Тест с неверным кодом верификации"""
        token = create_change_email_verification_token(
            'test@example.com', 
            'newemail@example.com'
        )
        
        # Сохраняем правильный код в кэше
        cache.set(f'change_email_verify_code_test@example.com', '123456', timeout=300)
        cache.set(f'change_test@example.com', 'newemail@example.com', timeout=300)
        
        data = {
            'token': token,
            'code': 'wrong-code'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Invalid or expired code')

    def test_expired_verification_code(self):
        """Тест с истекшим кодом верификации"""
        token = create_change_email_verification_token(
            'test@example.com', 
            'newemail@example.com'
        )
        
        # Не сохраняем код в кэше
        cache.set(f'change_test@example.com', 'newemail@example.com', timeout=300)
        
        data = {
            'token': token,
            'code': '123456'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Invalid or expired code')

    def test_mismatched_cached_email(self):
        """Тест с несоответствующим кэшированным email"""
        token = create_change_email_verification_token(
            'test@example.com', 
            'newemail@example.com'
        )
        
        # Сохраняем другой email в кэше
        cache.set(f'change_email_verify_code_test@example.com', '123456', timeout=300)
        cache.set(f'change_test@example.com', 'different@example.com', timeout=300)
        
        data = {
            'token': token,
            'code': '123456'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Invalid or expired new email')

    def test_user_not_found(self):
        """Тест с несуществующим пользователем"""
        # Создаем токен для текущего пользователя, но удаляем его из базы
        token = create_change_email_verification_token(
            'test@example.com',
            'newemail@example.com'
        )
        
        # Добавляем данные в кэш
        verification_code = '123456'
        cache.set(f'change_email_verify_code_test@example.com', verification_code, timeout=300)
        cache.set(f'change_test@example.com', 'newemail@example.com', timeout=300)
        
        # Удаляем пользователя из базы данных
        self.user.delete()
        
        data = {
            'token': token,
            'code': verification_code
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail'], 'User not found')

    def test_stop_change_email_action(self):
        """Тест остановки изменения email"""
        # Создаем токен с действием остановки
        token = create_change_email_verification_token(
            'test@example.com', 
            'newemail@example.com',
            'stop_change_email'
        )
        
        data = {
            'token': token,
            'code': '123456'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Stopped change email')

    def test_mismatched_user_email(self):
        """Тест с несоответствующим email пользователя"""
        # Создаем токен с другим email
        token = create_change_email_verification_token(
            'different@example.com', 
            'newemail@example.com'
        )
        
        # Сохраняем код верификации в кэше
        verification_code = '123456'
        cache.set(f'change_email_verify_code_different@example.com', verification_code, timeout=300)
        cache.set(f'change_different@example.com', 'newemail@example.com', timeout=300)
        
        data = {
            'token': token,
            'code': verification_code
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Given email and user email are not the same')

    def test_missing_verification_code(self):
        """Тест без кода верификации"""
        token = create_change_email_verification_token(
            'test@example.com', 
            'newemail@example.com'
        )
        
        data = {
            'token': token
            # Отсутствует поле 'code'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class EmailChangeViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('email-change')
        
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

    def test_successful_email_change(self):
        """Тест успешного изменения email"""
        new_email = 'newemail@example.com'
        verification_code = '123456'
        
        # Сохраняем данные в кэше
        cache.set(f'verify_code_{new_email}', verification_code, timeout=300)
        cache.set(f'change_{self.user.email}', new_email, timeout=300)
        
        data = {
            'code': verification_code
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Email changed successfully')
        
        # Проверяем, что email пользователя изменился
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, new_email)
        
        # Проверяем, что данные удалены из кэша
        self.assertIsNone(cache.get(f'verify_code_{new_email}'))
        self.assertIsNone(cache.get(f'change_{self.user.email}'))

    def test_invalid_verification_code(self):
        """Тест с неверным кодом верификации"""
        new_email = 'newemail@example.com'
        verification_code = '123456'
        
        # Сохраняем данные в кэше
        cache.set(f'verify_code_{new_email}', verification_code, timeout=300)
        cache.set(f'change_{self.user.email}', new_email, timeout=300)
        
        data = {
            'code': 'wrong-code'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Invalid or expired code')

    def test_no_cached_new_email(self):
        """Тест без сохраненного нового email в кэше"""
        verification_code = '123456'
        
        # Не сохраняем данные в кэше
        
        data = {
            'code': verification_code
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Invalid request, no new email found')

    def test_expired_verification_code(self):
        """Тест с истекшим кодом верификации"""
        new_email = 'newemail@example.com'
        
        # Сохраняем данные в кэше, но не сохраняем код верификации
        cache.set(f'change_{self.user.email}', new_email, timeout=300)
        
        data = {
            'code': '123456'
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Invalid or expired code')

    def test_mismatched_cached_email(self):
        """Тест с несоответствующим кэшированным email"""
        new_email = 'newemail@example.com'
        cached_email = 'different@example.com'
        verification_code = '123456'
        
        # Сохраняем данные в кэше
        cache.set(f'verify_code_{cached_email}', verification_code, timeout=300)
        cache.set(f'change_{self.user.email}', cached_email, timeout=300)
        
        data = {
            'code': verification_code
        }
        
        response = self.client.post(self.url, data, format='json')
        
        # В новой логике код проверяется для cached_email, а не new_email
        # Поэтому тест должен пройти успешно, так как код правильный для cached_email
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Email changed successfully')
        
        # Проверяем, что email пользователя изменился на cached_email
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, cached_email)

    def test_wrong_code_for_cached_email(self):
        """Тест с неверным кодом для кэшированного email"""
        cached_email = 'different@example.com'
        correct_code = '123456'
        wrong_code = '654321'
        
        # Сохраняем данные в кэше
        cache.set(f'verify_code_{cached_email}', correct_code, timeout=300)
        cache.set(f'change_{self.user.email}', cached_email, timeout=300)
        
        data = {
            'code': wrong_code  # Неверный код
        }
        
        response = self.client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Invalid or expired code')

    def test_unauthenticated_request(self):
        """Тест неаутентифицированного запроса"""
        # Создаем новый клиент без аутентификации
        unauthenticated_client = APIClient()
        
        data = {
            'code': '123456'
        }
        
        response = unauthenticated_client.post(self.url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class EmailChangeTokenTest(TestCase):
    """Тесты для функций создания и расшифровки токенов"""
    
    def test_create_and_decrypt_token(self):
        """Тест создания и расшифровки токена"""
        current_email = 'test@example.com'
        new_email = 'newemail@example.com'
        action = 'change_email'
        
        # Создаем токен
        token = create_change_email_verification_token(current_email, new_email, action)
        
        # Проверяем, что токен создан
        self.assertIsInstance(token, str)
        self.assertGreater(len(token), 0)
        
        # Расшифровываем токен
        decrypted_data = decrypt_change_email_verification_token(token)
        
        # Проверяем данные
        self.assertEqual(decrypted_data['current_email'], current_email)
        self.assertEqual(decrypted_data['new_email'], new_email)
        self.assertEqual(decrypted_data['action'], action)
        self.assertIn('timestamp', decrypted_data)

    def test_invalid_token_decryption(self):
        """Тест расшифровки неверного токена"""
        with self.assertRaises(ValueError):
            decrypt_change_email_verification_token('invalid-token')

    def test_empty_token_decryption(self):
        """Тест расшифровки пустого токена"""
        with self.assertRaises(ValueError):
            decrypt_change_email_verification_token('')

    def test_different_actions(self):
        """Тест создания токенов с разными действиями"""
        current_email = 'test@example.com'
        new_email = 'newemail@example.com'
        
        # Тест с действием change_email
        token1 = create_change_email_verification_token(current_email, new_email, 'change_email')
        data1 = decrypt_change_email_verification_token(token1)
        self.assertEqual(data1['action'], 'change_email')
        
        # Тест с действием stop_change_email
        token2 = create_change_email_verification_token(current_email, new_email, 'stop_change_email')
        data2 = decrypt_change_email_verification_token(token2)
        self.assertEqual(data2['action'], 'stop_change_email')
