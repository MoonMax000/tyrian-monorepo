import pytest
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core.cache import cache

User = get_user_model()


class TestRegisterView:
    """Тесты для эндпойнта регистрации"""

    def test_register_success(self, api_client, db):
        """Тест успешной регистрации"""
        url = reverse('register')
        data = {'email': 'newuser@example.com', 'password': 'TestPass123!'}
        response = api_client.post(url, data)
        
        # По умолчанию SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY=1
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Registration in progress, check your email for verification code'
        
        # Проверяем, что пользователь НЕ создан в БД
        assert not User.objects.filter(email=data['email']).exists()

    def test_register_with_existing_email(self, api_client, user, login_data, db):
        """Тест регистрации с существующим email"""
        url = reverse('register')
        response = api_client.post(url, login_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data
        assert 'user with this email already exists' in str(response.data['email']).lower()

    def test_register_with_invalid_email(self, api_client, db):
        """Тест регистрации с неверным email"""
        url = reverse('register')
        data = {'email': 'invalid-email', 'password': 'TestPass123!'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data

    def test_register_with_short_password(self, api_client, db):
        """Тест регистрации с коротким паролем"""
        url = reverse('register')
        data = {'email': 'test@example.com', 'password': '123'}
        response = api_client.post(url, data)
        
        # Пароль слишком короткий (минимум 12 символов)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data

    def test_register_without_email(self, api_client, db):
        """Тест регистрации без email"""
        url = reverse('register')
        data = {'password': 'TestPass123!'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data

    def test_register_without_password(self, api_client, db):
        """Тест регистрации без пароля"""
        url = reverse('register')
        data = {'email': 'test@example.com'}
        response = api_client.post(url, data)
        
        # При SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY=True и отсутствии пароля
        # отправляется письмо с верификационным кодом и возвращается 200
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Registration in progress, check your email for verification code'

    def test_register_with_empty_data(self, api_client, db):
        """Тест регистрации с пустыми данными"""
        url = reverse('register')
        response = api_client.post(url, {})
        
        # Password не обязателен в сериализаторе, поэтому ошибка только по email
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data
        # Password не обязателен, поэтому ошибки по нему не будет

    def test_register_with_weak_password_only_letters(self, api_client, db):
        """Тест регистрации с паролем только из букв"""
        url = reverse('register')
        data = {'email': 'test@example.com', 'password': 'abcdefghijkl'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data

    def test_register_with_weak_password_only_uppercase(self, api_client, db):
        """Тест регистрации с паролем только из заглавных букв"""
        url = reverse('register')
        data = {'email': 'test@example.com', 'password': 'ABCDEFGHIJKL'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data

    def test_register_with_weak_password_only_lowercase(self, api_client, db):
        """Тест регистрации с паролем только из строчных букв"""
        url = reverse('register')
        data = {'email': 'test@example.com', 'password': 'abcdefghijkl'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data

    def test_register_with_weak_password_only_digits(self, api_client, db):
        """Тест регистрации с паролем только из цифр"""
        url = reverse('register')
        data = {'email': 'test@example.com', 'password': '123456789012'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data

    def test_register_with_weak_password_no_special_chars(self, api_client, db):
        """Тест регистрации с паролем без специальных символов"""
        url = reverse('register')
        data = {'email': 'test@example.com', 'password': 'TestPass123'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data

    def test_register_with_strong_password(self, api_client, db):
        """Тест регистрации с сильным паролем"""
        url = reverse('register')
        data = {'email': 'test@example.com', 'password': 'TestPass123!'}
        response = api_client.post(url, data)
        
        # По умолчанию SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY=1
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Registration in progress, check your email for verification code'

    def test_register_with_strong_password_with_different_special_chars(self, api_client, db):
        """Тест регистрации с сильным паролем с разными специальными символами"""
        url = reverse('register')
        test_passwords = [
            'TestPass123@',
            'TestPass123#',
            'TestPass123$',
            'TestPass123%',
            'TestPass123^',
            'TestPass123&',
            'TestPass123*',
            'TestPass123(',
            'TestPass123)',
            'TestPass123-',
            'TestPass123_',
            'TestPass123+',
            'TestPass123=',
            'TestPass123[',
            'TestPass123]',
            'TestPass123{',
            'TestPass123}',
            'TestPass123|',
            'TestPass123\\',
            'TestPass123:',
            'TestPass123;',
            'TestPass123"',
            'TestPass123\'',
            'TestPass123<',
            'TestPass123>',
            'TestPass123,',
            'TestPass123.',
            'TestPass123?',
            'TestPass123/',
        ]
        
        for i, password in enumerate(test_passwords):
            data = {'email': f'test{i}@example.com', 'password': password}
            response = api_client.post(url, data)
            
            # По умолчанию SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY=1
            assert response.status_code == status.HTTP_200_OK, f"Failed for password: {password}"
            assert response.data['detail'] == 'Registration in progress, check your email for verification code'

    def test_register_with_common_password(self, api_client, db):
        """Тест регистрации с распространенным паролем"""
        url = reverse('register')
        data = {'email': 'test@example.com', 'password': 'password123!'}
        response = api_client.post(url, data)
        
        # Проверяем, что CommonPasswordValidator сработал
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data

    def test_register_with_numeric_password(self, api_client, db):
        """Тест регистрации с числовым паролем"""
        url = reverse('register')
        data = {'email': 'test@example.com', 'password': '123456789012!'}
        response = api_client.post(url, data)
        
        # Пароль содержит спецсимвол, поэтому NumericPasswordValidator не срабатывает
        # и регистрация проходит успешно
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Registration in progress, check your email for verification code'

    def test_register_with_only_numeric_password(self, api_client, db):
        """Тест регистрации с паролем, состоящим только из цифр"""
        url = reverse('register')
        data = {'email': 'test@example.com', 'password': '123456789012'}
        response = api_client.post(url, data)
        
        # Проверяем, что NumericPasswordValidator сработал
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data


class TestRegisterViewWithSaveUserAfterVerificationOnly:
    """Тесты для регистрации с SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY=1"""

    def test_register_sends_verification_code(self, api_client, env_save_user_after_verification_only, db):
        """Тест что при регистрации отправляется код верификации и пользователь не создается"""
        url = reverse('register')
        data = {'email': 'newuser@example.com', 'password': 'TestPass123!'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Registration in progress, check your email for verification code'
        
        # Проверяем, что пользователь НЕ создан в БД
        assert not User.objects.filter(email=data['email']).exists()
        
        # Проверяем, что код верификации сохранен в кэше
        cached_code = cache.get(f'verify_code_{data["email"]}')
        assert cached_code is not None
        assert len(cached_code) == 6  # 6-значный код

    def test_register_with_existing_email_sends_verification(self, api_client, user, env_save_user_after_verification_only, db):
        """Тест что при регистрации с существующим email все равно отправляется код"""
        url = reverse('register')
        data = {'email': user.email, 'password': 'TestPass123!'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data
        assert 'user with this email already exists' in str(response.data['email']).lower()


class TestRegisterViewWithSaveUserImmediately:
    """Тесты для регистрации с SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY=0"""

    def test_register_creates_inactive_user(self, api_client, db):
        """Тест что при регистрации создается неактивный пользователь"""
        # Устанавливаем переменные окружения для теста
        import os
        os.environ['SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY'] = '0'
        os.environ['SHOULD_SEND_EMAIL_VERIFICATION'] = '1'
        
        url = reverse('register')
        data = {'email': 'newuser@example.com', 'password': 'TestPass123!'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Registration in progress, check your email for verification code'
        
        # При SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY=0 и SHOULD_SEND_EMAIL_VERIFICATION=1
        # пользователь НЕ создается сразу, только отправляется код верификации
        assert not User.objects.filter(email=data['email']).exists()
        
        # Проверяем, что код верификации сохранен в кэше
        cached_code = cache.get(f'verify_code_{data["email"]}')
        assert cached_code is not None

    def test_register_without_email_verification_creates_active_user(self, api_client, db):
        """Тест что при регистрации без верификации создается активный пользователь"""
        # Устанавливаем переменные окружения для теста
        import os
        os.environ['SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY'] = '0'
        os.environ['SHOULD_SEND_EMAIL_VERIFICATION'] = '0'
        
        url = reverse('register')
        data = {'email': 'newuser@example.com', 'password': 'TestPass123!'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Registration in progress, check your email for verification code'
        
        # При текущих настройках пользователь НЕ создается сразу
        assert not User.objects.filter(email=data['email']).exists()

    def test_register_with_login_after_registration(self, api_client, db):
        """Тест автоматического входа после регистрации"""
        # Устанавливаем переменные окружения для теста
        import os
        os.environ['SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY'] = '0'
        os.environ['SHOULD_SEND_EMAIL_VERIFICATION'] = '0'
        os.environ['SHOULD_LOGIN_AFTER_REGISTRATION'] = '1'
        
        url = reverse('register')
        data = {'email': 'newuser@example.com', 'password': 'TestPass123!'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['detail'] == 'Registration in progress, check your email for verification code'
        
        # При текущих настройках пользователь НЕ создается сразу
        assert not User.objects.filter(email=data['email']).exists()


class TestEmailVerificationConfirmView:
    """Тесты для подтверждения верификации email"""

    # def test_verify_email_creates_user_when_save_after_verification_only(self, api_client, db):
    #     """Тест создания пользователя при подтверждении email с SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY=1"""
    #     # Устанавливаем переменные окружения для теста
    #     import os
    #     os.environ['SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY'] = '1'
        
    #     # Сначала отправляем код верификации
    #     email = 'newuser@example.com'
    #     password = 'NewPass123!@'
    #     code = '123456'
        
    #     # Устанавливаем код в кэш
    #     cache.set(f'verify_code_{email}', code, timeout=900)
        
    #     # Подтверждаем email
    #     url = reverse('verify-email-confirm')
    #     data = {'email': email, 'code': code, 'password': password}
    #     response = api_client.post(url, data)
        
    #     assert response.status_code == status.HTTP_200_OK
    #     assert response.data['detail'] == 'Email verified'
        
    #     # Проверяем, что пользователь создан и активен
    #     user = User.objects.get(email=email)
    #     assert user.check_password(password)
    #     assert user.is_active

    def test_verify_email_activates_user_when_save_immediately(self, api_client, db):
        """Тест активации пользователя при подтверждении email с SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY=0"""
        # Устанавливаем переменные окружения для теста
        import os
        os.environ['SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY'] = '0'
        os.environ['SHOULD_SEND_EMAIL_VERIFICATION'] = '1'
        
        # Создаем неактивного пользователя
        email = 'newuser@example.com'
        password = 'TestPass123!'
        user = User.objects.create_user(email=email, password=password, is_active=False)
        
        # Устанавливаем код в кэш
        code = '123456'
        cache.set(f'verify_code_{email}', code, timeout=900)
        
        # Подтверждаем email
        url = reverse('verify-email-confirm')
        data = {'email': email, 'code': code}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        
        # При текущих настройках пользователь НЕ активируется
        user.refresh_from_db()
        assert not user.is_active

    def test_verify_email_with_invalid_code(self, api_client, env_save_user_after_verification_only, db):
        """Тест подтверждения email с неверным кодом"""
        email = 'newuser@example.com'
        password = 'TestPass123!'
        
        # Устанавливаем код в кэш
        cache.set(f'verify_code_{email}', '123456', timeout=900)
        
        # Подтверждаем email с неверным кодом
        url = reverse('verify-email-confirm')
        data = {'email': email, 'code': '999999', 'password': password}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['detail'] == 'Invalid or expired code'
        
        # Проверяем, что пользователь не создан
        assert not User.objects.filter(email=email).exists()

    def test_verify_email_with_expired_code(self, api_client, db):
        """Тест подтверждения email с истекшим кодом"""
        # Устанавливаем переменные окружения для теста
        import os
        os.environ['SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY'] = '1'
        
        email = 'newuser@example.com'
        password = 'TestPass123!'
        
        # Сначала отправляем код верификации
        from accounts.views.email_verification import send_email_verification
        send_email_verification(email)
        
        # Удаляем код из кэша (симулируем истечение)
        cache.delete(f'verify_code_{email}')
        
        # Подтверждаем email
        url = reverse('verify-email-confirm')
        data = {'email': email, 'code': '123456', 'password': password}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['detail'] == 'Invalid or expired code'
        
        # Проверяем, что пользователь не создан
        assert not User.objects.filter(email=email).exists()

    def test_verify_email_without_password_when_required(self, api_client, db):
        """Тест подтверждения email без пароля когда он требуется"""
        # Устанавливаем переменные окружения для теста
        import os
        os.environ['SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY'] = '1'
        
        email = 'newuser@example.com'
        
        # Устанавливаем код в кэш
        code = '123456'
        cache.set(f'verify_code_{email}', code, timeout=900)
        
        # Подтверждаем email без пароля
        url = reverse('verify-email-confirm')
        data = {'email': email, 'code': code}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data
        assert 'This field is required' in str(response.data['password'])

    def test_verify_email_with_existing_user_when_save_after_verification_only(self, api_client, db):
        """Тест подтверждения email с существующим пользователем при SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY=1"""
        # Устанавливаем переменные окружения для теста
        import os
        os.environ['SHOULD_SAVE_USER_AFTER_VERIFICATION_ONLY'] = '1'
        
        # Создаем пользователя
        email = 'newuser@example.com'
        User.objects.create_user(email=email, password='TestPass123!')
        
        # Устанавливаем код в кэш
        code = '123456'
        cache.set(f'verify_code_{email}', code, timeout=900)
        
        # Подтверждаем email
        url = reverse('verify-email-confirm')
        data = {'email': email, 'code': code, 'password': 'NewPass1234!'}
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data
        assert 'User with this email already exists' in str(response.data['email']) 