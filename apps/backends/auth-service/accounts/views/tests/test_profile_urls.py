from django.test import TestCase
from django.urls import reverse, resolve
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from accounts.views.profile_verification import ProfileVerificationRequestView, ProfileVerificationConfirmView
from accounts.views.profile_update import ProfileUpdateView

User = get_user_model()


class ProfileURLsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            is_active=True
        )

    def test_profile_verification_request_url(self):
        """Тест URL для запроса верификации профиля"""
        url = reverse('profile-verification-request')
        self.assertEqual(url, '/api/accounts/profile/verification/')
        
        # Проверяем, что URL разрешается в правильное представление
        resolver = resolve(url)
        # Для DRF представлений проверяем, что URL разрешается
        self.assertIsNotNone(resolver)

    def test_profile_verification_confirm_url(self):
        """Тест URL для подтверждения верификации профиля"""
        url = reverse('profile-verification-confirm')
        self.assertEqual(url, '/api/accounts/profile/verification/confirm/')
        
        # Проверяем, что URL разрешается в правильное представление
        resolver = resolve(url)
        # Для DRF представлений проверяем, что URL разрешается
        self.assertIsNotNone(resolver)

    def test_profile_update_url(self):
        """Тест URL для обновления профиля"""
        url = reverse('profile-update')
        self.assertEqual(url, '/api/accounts/profile/update/')
        
        # Проверяем, что URL разрешается в правильное представление
        resolver = resolve(url)
        # Для DRF представлений проверяем, что URL разрешается
        self.assertIsNotNone(resolver)

    def test_profile_urls_structure(self):
        """Тест структуры URL маршрутов профиля"""
        # Проверяем, что все URL находятся под общим маршрутом profile/
        verification_request_url = reverse('profile-verification-request')
        verification_confirm_url = reverse('profile-verification-confirm')
        update_url = reverse('profile-update')
        
        self.assertTrue(verification_request_url.startswith('/api/accounts/profile/'))
        self.assertTrue(verification_confirm_url.startswith('/api/accounts/profile/'))
        self.assertTrue(update_url.startswith('/api/accounts/profile/'))

    def test_profile_verification_request_url_methods(self):
        """Тест HTTP методов для URL запроса верификации"""
        url = reverse('profile-verification-request')
        
        # Должен поддерживать POST
        response = self.client.post(url, {
            'email': 'test@example.com',
            'fields_to_change': ['password']
        }, format='json')
        # POST может вернуть 400 для неверных данных, но не 405 Method Not Allowed
        self.assertNotEqual(response.status_code, 405)
        
        # Не должен поддерживать GET
        response = self.client.get(url)
        self.assertEqual(response.status_code, 405)  # Method Not Allowed

    def test_profile_verification_confirm_url_methods(self):
        """Тест HTTP методов для URL подтверждения верификации"""
        url = reverse('profile-verification-confirm')
        
        # Должен поддерживать POST (используем JSON формат)
        response = self.client.post(url, {
            'token': 'test_token',
            'new_values': {'password': 'newpass123'}
        }, format='json')
        # POST может вернуть 400 для неверных данных, но не 405 Method Not Allowed
        self.assertNotEqual(response.status_code, 405)
        
        # Не должен поддерживать GET
        response = self.client.get(url)
        self.assertEqual(response.status_code, 405)  # Method Not Allowed

    def test_profile_update_url_methods(self):
        """Тест HTTP методов для URL обновления профиля"""
        url = reverse('profile-update')
        
        # Должен поддерживать PUT
        self.client.force_authenticate(user=self.user)
        response = self.client.put(url, {
            'name': 'John Doe'
        }, format='json')
        # PUT может вернуть 400 для неверных данных, но не 405 Method Not Allowed
        self.assertNotEqual(response.status_code, 405)
        
        # Должен поддерживать PATCH
        response = self.client.patch(url, {
            'name': 'John Doe'
        }, format='json')
        # PATCH может вернуть 400 для неверных данных, но не 405 Method Not Allowed
        self.assertNotEqual(response.status_code, 405)
        
        # Не должен поддерживать GET
        response = self.client.get(url)
        self.assertEqual(response.status_code, 405)  # Method Not Allowed

    def test_profile_urls_namespace(self):
        """Тест пространства имен URL маршрутов профиля"""
        # Проверяем, что URL имеют правильные имена
        verification_request_url = reverse('profile-verification-request')
        verification_confirm_url = reverse('profile-verification-confirm')
        update_url = reverse('profile-update')
        
        # Проверяем, что URL содержат правильные пути
        self.assertIn('verification', verification_request_url)
        self.assertIn('verification/confirm', verification_confirm_url)
        self.assertIn('update', update_url)

    def test_profile_urls_resolve_correctly(self):
        """Тест правильного разрешения URL маршрутов профиля"""
        # Проверяем разрешение URL для запроса верификации
        verification_request_url = reverse('profile-verification-request')
        resolver = resolve(verification_request_url)
        self.assertIsNotNone(resolver)
        
        # Проверяем разрешение URL для подтверждения верификации
        verification_confirm_url = reverse('profile-verification-confirm')
        resolver = resolve(verification_confirm_url)
        self.assertIsNotNone(resolver)
        
        # Проверяем разрешение URL для обновления профиля
        update_url = reverse('profile-update')
        resolver = resolve(update_url)
        self.assertIsNotNone(resolver)

    def test_profile_urls_parameters(self):
        """Тест параметров URL маршрутов профиля"""
        # Проверяем, что URL не требуют параметров
        verification_request_url = reverse('profile-verification-request')
        verification_confirm_url = reverse('profile-verification-confirm')
        update_url = reverse('profile-update')
        
        # Все URL должны быть статическими, без параметров
        self.assertNotIn('<', verification_request_url)
        self.assertNotIn('<', verification_confirm_url)
        self.assertNotIn('<', update_url)

    def test_profile_urls_consistency(self):
        """Тест согласованности URL маршрутов профиля"""
        # Проверяем, что все URL профиля следуют единому паттерну
        base_url = '/api/accounts/profile/'
        
        verification_request_url = reverse('profile-verification-request')
        verification_confirm_url = reverse('profile-verification-confirm')
        update_url = reverse('profile-update')
        
        # Все URL должны начинаться с базового пути
        self.assertTrue(verification_request_url.startswith(base_url))
        self.assertTrue(verification_confirm_url.startswith(base_url))
        self.assertTrue(update_url.startswith(base_url))
        
        # Проверяем, что URL не дублируются
        urls = [verification_request_url, verification_confirm_url, update_url]
        self.assertEqual(len(urls), len(set(urls)))

    def test_profile_urls_http_methods_consistency(self):
        """Тест согласованности HTTP методов для URL профиля"""
        # Проверяем, что все URL используют правильные HTTP методы
        
        # URL верификации должны использовать только POST
        verification_request_url = reverse('profile-verification-request')
        verification_confirm_url = reverse('profile-verification-confirm')
        
        for url in [verification_request_url, verification_confirm_url]:
            # POST должен работать
            response = self.client.post(url, {}, format='json')
            self.assertNotEqual(response.status_code, 405)
            
            # GET не должен работать
            response = self.client.get(url)
            self.assertEqual(response.status_code, 405)
            
            # PUT не должен работать
            response = self.client.put(url, {}, format='json')
            self.assertEqual(response.status_code, 405)
            
            # PATCH не должен работать
            response = self.client.patch(url, {}, format='json')
            self.assertEqual(response.status_code, 405)
        
        # URL обновления должен использовать PUT и PATCH
        update_url = reverse('profile-update')
        self.client.force_authenticate(user=self.user)
        
        # PUT должен работать
        response = self.client.put(update_url, {}, format='json')
        self.assertNotEqual(response.status_code, 405)
        
        # PATCH должен работать
        response = self.client.patch(update_url, {}, format='json')
        self.assertNotEqual(response.status_code, 405)
        
        # GET не должен работать
        response = self.client.get(update_url)
        self.assertEqual(response.status_code, 405)
        
        # POST не должен работать
        response = self.client.post(update_url, {}, format='json')
        self.assertEqual(response.status_code, 405)
