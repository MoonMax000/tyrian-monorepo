import pytest
import json
from django.urls import reverse
from rest_framework import status
from accounts.models import User


@pytest.mark.django_db
class TestASUserControlView:
    url = reverse('as-user-control')

    def test_create_user_success(self, client):
        data = json.dumps({
            "email": "test@test.com",
            "password": "testpass123"
        })
        response = client.post(self.url, data, content_type='application/json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(email="test@test.com").exists()

    def test_create_existing_user(self, client):
        # Создаем пользователя
        User.objects.create_user(email="exists@test.com", password="testpass123")
        
        data = json.dumps({
            "email": "exists@test.com",
            "password": "newpass123"
        })
        response = client.post(self.url, data, content_type='application/json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "User already exists" in str(response.content)

    def test_create_user_invalid_email(self, client):
        data = json.dumps({
            "email": "invalid-email",
            "password": "testpass123"
        })
        response = client.post(self.url, data, content_type='application/json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data

    def test_update_user_password_success(self, client):
        # Создаем пользователя
        user = User.objects.create_user(email="update@test.com", password="oldpass123")
        
        data = json.dumps({
            "email": "update@test.com",
            "password": "newpass123"
        })
        response = client.patch(self.url, data, content_type='application/json')
        
        assert response.status_code == status.HTTP_200_OK
        
        # Проверяем, что пароль обновился
        user.refresh_from_db()
        assert user.check_password("newpass123")

    def test_update_nonexistent_user(self, client):
        data = json.dumps({
            "email": "nonexistent@test.com",
            "password": "newpass123"
        })
        response = client.patch(self.url, data, content_type='application/json')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "User not found" in str(response.content)

    @pytest.mark.parametrize("http_method,test_data", [
        ("post", {}),  # Пустой запрос для POST
        ("post", {"email": "test@test.com"}),  # Только email для POST
        ("post", {"password": "testpass123"}),  # Только password для POST
        ("patch", {"email": "test@test.com"}),  # Только email для PATCH
    ])
    def test_missing_required_fields(self, client, http_method, test_data):
        # Для PATCH нужно сначала создать пользователя
        if http_method == "patch":
            User.objects.create_user(email="test@test.com", password="oldpass123")
            
        method = getattr(client, http_method)
        response = method(self.url, json.dumps(test_data), content_type='application/json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST 