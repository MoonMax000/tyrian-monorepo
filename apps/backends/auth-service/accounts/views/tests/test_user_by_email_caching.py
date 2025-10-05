import pytest
from django.core.cache import cache
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


@pytest.mark.django_db
class TestUserByEmailCaching:
    """Тесты кэширования для UserByEmailView"""

    def test_user_by_email_caching(self, api_client, authenticated_client):
        """Тест кэширования данных пользователя по email"""
        # Создаем тестового пользователя
        user, _ = User.objects.get_or_create(
            email='test_caching@example.com',
            defaults={
                'username': 'test_caching',
                'is_active': True
            }
        )
        
        # Очищаем кэш перед тестом
        cache.clear()
        
        # Первый запрос - должен загрузить данные из БД и закэшировать
        response1 = authenticated_client.get('/api/accounts/user/by-email/', {'email': user.email})
        assert response1.status_code == status.HTTP_200_OK
        
        # Проверяем, что данные закэшированы
        cache_key = f'user_by_email:{user.email}'
        cached_data = cache.get(cache_key)
        assert cached_data is not None
        assert cached_data['email'] == user.email
        assert cached_data['username'] == user.username
        
        # Второй запрос - должен вернуть данные из кэша
        response2 = authenticated_client.get('/api/accounts/user/by-email/', {'email': user.email})
        assert response2.status_code == status.HTTP_200_OK
        assert response1.data == response2.data

    def test_cache_invalidation_on_profile_update(self, api_client, authenticated_client):
        """Тест инвалидации кэша при обновлении профиля"""
        # Создаем тестового пользователя
        user, _ = User.objects.get_or_create(
            email='test_invalidation@example.com',
            defaults={
                'username': 'test_invalidation',
                'is_active': True
            }
        )
        
        # Очищаем кэш перед тестом
        cache.clear()
        
        # Загружаем данные пользователя (кэшируем)
        response = authenticated_client.get('/api/accounts/user/by-email/', {'email': user.email})
        assert response.status_code == status.HTTP_200_OK
        
        # Проверяем, что данные закэшированы
        cache_key = f'user_by_email:{user.email}'
        assert cache.get(cache_key) is not None
        
        # Обновляем профиль пользователя
        update_data = {
            'username': 'updated_username',
            'bio': 'Updated bio'
        }
        
        # Аутентифицируемся как этот пользователь для обновления профиля
        user_client = APIClient()
        user_client.force_authenticate(user=user)
        
        response = user_client.patch('/api/accounts/profile/update/', update_data)
        assert response.status_code == status.HTTP_200_OK
        
        # Проверяем, что кэш инвалидирован
        assert cache.get(cache_key) is None
        
        # Загружаем данные снова - должны получить обновленные данные
        response = authenticated_client.get('/api/accounts/user/by-email/', {'email': user.email})
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == 'updated_username'
        assert response.data['bio'] == 'Updated bio'

    def test_cache_timeout(self, api_client, authenticated_client):
        """Тест истечения времени жизни кэша"""
        # Создаем тестового пользователя
        user, _ = User.objects.get_or_create(
            email='test_timeout@example.com',
            defaults={
                'username': 'test_timeout',
                'is_active': True
            }
        )
        
        # Очищаем кэш перед тестом
        cache.clear()
        
        # Загружаем данные пользователя (кэшируем)
        response = authenticated_client.get('/api/accounts/user/by-email/', {'email': user.email})
        assert response.status_code == status.HTTP_200_OK
        
        # Проверяем, что данные закэшированы
        cache_key = f'user_by_email:{user.email}'
        assert cache.get(cache_key) is not None
        
        # Удаляем данные из кэша вручную (имитируем истечение времени)
        cache.delete(cache_key)
        
        # Проверяем, что кэш пуст
        assert cache.get(cache_key) is None
        
        # Загружаем данные снова - должны загрузиться из БД
        response = authenticated_client.get('/api/accounts/user/by-email/', {'email': user.email})
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == user.email

    def test_cache_key_uniqueness(self, api_client, authenticated_client):
        """Тест уникальности ключей кэша для разных пользователей"""
        # Создаем двух тестовых пользователей
        user1, _ = User.objects.get_or_create(
            email='user1@example.com',
            defaults={
                'username': 'user1',
                'is_active': True
            }
        )
        
        user2, _ = User.objects.get_or_create(
            email='user2@example.com',
            defaults={
                'username': 'user2',
                'is_active': True
            }
        )
        
        # Очищаем кэш перед тестом
        cache.clear()
        
        # Загружаем данные первого пользователя
        response1 = authenticated_client.get('/api/accounts/user/by-email/', {'email': user1.email})
        assert response1.status_code == status.HTTP_200_OK
        
        # Загружаем данные второго пользователя
        response2 = authenticated_client.get('/api/accounts/user/by-email/', {'email': user2.email})
        assert response2.status_code == status.HTTP_200_OK
        
        # Проверяем, что кэши содержат разные данные
        cache_key1 = f'user_by_email:{user1.email}'
        cache_key2 = f'user_by_email:{user2.email}'
        
        cached_data1 = cache.get(cache_key1)
        cached_data2 = cache.get(cache_key2)
        
        assert cached_data1 is not None
        assert cached_data2 is not None
        assert cached_data1['email'] != cached_data2['email']
        assert cached_data1['username'] != cached_data2['username']
