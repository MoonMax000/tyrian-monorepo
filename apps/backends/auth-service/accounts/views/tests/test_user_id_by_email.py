import pytest
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.core.cache import cache

User = get_user_model()


@pytest.mark.django_db
class TestUserIdByEmailView:
    """Тесты для UserIdByEmailView"""

    def setup_method(self):
        """Настройка перед каждым тестом"""
        self.client = APIClient()
        cache.clear()

    def test_get_user_id_by_email_success(self):
        """Тест успешного получения ID пользователя по email"""
        # Создаем пользователя
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            is_active=True
        )
        
        # Выполняем запрос
        response = self.client.get('/api/accounts/user/id-by-email/', {'email': 'test@example.com'})
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'id': user.id}

    def test_get_user_id_by_email_not_found(self):
        """Тест получения ID несуществующего пользователя"""
        response = self.client.get('/api/accounts/user/id-by-email/', {'email': 'nonexistent@example.com'})
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data == {'detail': 'User not found'}

    def test_get_user_id_by_email_missing_email(self):
        """Тест запроса без параметра email"""
        response = self.client.get('/api/accounts/user/id-by-email/')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data == {'detail': 'Email parameter is required'}

    def test_get_user_id_by_email_empty_email(self):
        """Тест запроса с пустым параметром email"""
        response = self.client.get('/api/accounts/user/id-by-email/', {'email': ''})
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data == {'detail': 'Email parameter is required'}

    def test_get_user_id_by_email_case_sensitive(self):
        """Тест чувствительности к регистру email"""
        user = User.objects.create_user(
            email='Test@Example.com',
            username='testuser',
            is_active=True
        )
        
        # Поиск с другим регистром должен не найти пользователя
        response = self.client.get('/api/accounts/user/id-by-email/', {'email': 'test@example.com'})
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data == {'detail': 'User not found'}

    def test_get_user_id_by_email_exact_case(self):
        """Тест поиска с точным регистром email"""
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser3',
            is_active=True
        )
        
        # Поиск с точным регистром должен найти пользователя
        response = self.client.get('/api/accounts/user/id-by-email/', {'email': 'test@example.com'})
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'id': user.id}

    def test_get_user_id_by_email_caching(self):
        """Тест кэширования результата"""
        user = User.objects.create_user(
            email='cache@example.com',
            username='cacheuser',
            is_active=True
        )
        
        # Первый запрос - должен загрузить из БД и закэшировать
        response1 = self.client.get('/api/accounts/user/id-by-email/', {'email': 'cache@example.com'})
        assert response1.status_code == status.HTTP_200_OK
        assert response1.data == {'id': user.id}
        
        # Второй запрос - должен вернуть из кэша
        response2 = self.client.get('/api/accounts/user/id-by-email/', {'email': 'cache@example.com'})
        assert response2.status_code == status.HTTP_200_OK
        assert response2.data == {'id': user.id}

    def test_get_user_id_by_email_cache_key_uniqueness(self):
        """Тест уникальности ключей кэша для разных email"""
        user1 = User.objects.create_user(
            email='user1@example.com',
            username='user1',
            is_active=True
        )
        user2 = User.objects.create_user(
            email='user2@example.com',
            username='user2',
            is_active=True
        )
        
        # Запрос для первого пользователя
        response1 = self.client.get('/api/accounts/user/id-by-email/', {'email': 'user1@example.com'})
        assert response1.status_code == status.HTTP_200_OK
        assert response1.data == {'id': user1.id}
        
        # Запрос для второго пользователя
        response2 = self.client.get('/api/accounts/user/id-by-email/', {'email': 'user2@example.com'})
        assert response2.status_code == status.HTTP_200_OK
        assert response2.data == {'id': user2.id}

    def test_get_user_id_by_email_unsupported_methods(self):
        """Тест неподдерживаемых HTTP методов"""
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            is_active=True
        )
        
        # POST запрос
        response = self.client.post('/api/accounts/user/id-by-email/', {'email': 'test@example.com'})
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
        
        # PUT запрос
        response = self.client.put('/api/accounts/user/id-by-email/', {'email': 'test@example.com'})
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
        
        # DELETE запрос
        response = self.client.delete('/api/accounts/user/id-by-email/', {'email': 'test@example.com'})
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_get_user_id_by_email_inactive_user(self):
        """Тест получения ID неактивного пользователя"""
        user = User.objects.create_user(
            email='inactive@example.com',
            username='inactiveuser',
            is_active=False
        )
        
        # Неактивный пользователь все равно должен быть найден
        response = self.client.get('/api/accounts/user/id-by-email/', {'email': 'inactive@example.com'})
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'id': user.id}

    def test_get_user_id_by_email_deleted_user(self):
        """Тест получения ID удаленного пользователя"""
        user = User.objects.create_user(
            email='deleted@example.com',
            username='deleteduser',
            is_active=True
        )
        user.is_deleted = True
        user.save()
        
        # Удаленный пользователь все равно должен быть найден
        response = self.client.get('/api/accounts/user/id-by-email/', {'email': 'deleted@example.com'})
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data == {'id': user.id}

    def test_get_user_id_by_email_response_structure(self):
        """Тест структуры ответа"""
        user = User.objects.create_user(
            email='structure@example.com',
            username='structureuser',
            is_active=True
        )
        
        response = self.client.get('/api/accounts/user/id-by-email/', {'email': 'structure@example.com'})
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, dict)
        assert 'id' in response.data
        assert isinstance(response.data['id'], int)
        assert response.data['id'] == user.id
