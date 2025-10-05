import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model

from accounts.models.user_role import UserRole

User = get_user_model()


class TestUserRoleListView:
    """Тесты для эндпойнта списка ролей пользователей"""

    def test_get_user_roles_success(self, authenticated_client, db):
        """Тест успешного получения списка ролей"""
        # Создаем тестовые роли
        role1 = UserRole.objects.create(name="Admin")
        role2 = UserRole.objects.create(name="User")
        role3 = UserRole.objects.create(name="Moderator")
        
        url = reverse('user-roles-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 3
        
        # Проверяем, что роли отсортированы по имени
        role_names = [role['name'] for role in response.data]
        assert role_names == ["Admin", "Moderator", "User"]
        
        # Проверяем структуру данных
        for role_data in response.data:
            assert 'id' in role_data
            assert 'name' in role_data
            assert isinstance(role_data['id'], int)
            assert isinstance(role_data['name'], str)

    def test_get_user_roles_empty_list(self, authenticated_client, db):
        """Тест получения пустого списка ролей"""
        url = reverse('user-roles-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data == []

    def test_get_user_roles_unauthenticated(self, api_client, db):
        """Тест получения списка ролей без аутентификации"""
        url = reverse('user-roles-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_user_roles_with_post_method(self, authenticated_client, db):
        """Тест списка ролей с POST методом (не поддерживается)"""
        url = reverse('user-roles-list')
        data = {'name': 'New Role'}
        response = authenticated_client.post(url, data)
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_user_roles_with_put_method(self, authenticated_client, db):
        """Тест списка ролей с PUT методом (не поддерживается)"""
        url = reverse('user-roles-list')
        data = {'name': 'Updated Role'}
        response = authenticated_client.put(url, data)
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_user_roles_with_patch_method(self, authenticated_client, db):
        """Тест списка ролей с PATCH методом (не поддерживается)"""
        url = reverse('user-roles-list')
        data = {'name': 'Patched Role'}
        response = authenticated_client.patch(url, data)
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_user_roles_with_delete_method(self, authenticated_client, db):
        """Тест списка ролей с DELETE методом (не поддерживается)"""
        url = reverse('user-roles-list')
        response = authenticated_client.delete(url)
        
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_user_roles_ordering(self, authenticated_client, db):
        """Тест правильной сортировки ролей по имени"""
        # Создаем роли в разном порядке
        UserRole.objects.create(name="Zebra")
        UserRole.objects.create(name="Alpha")
        UserRole.objects.create(name="Beta")
        
        url = reverse('user-roles-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        role_names = [role['name'] for role in response.data]
        assert role_names == ["Alpha", "Beta", "Zebra"]
