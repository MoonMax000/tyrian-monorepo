import json
import pytest
from unittest.mock import patch, MagicMock
from django.contrib.auth import get_user_model
from accounts.services.send_user_to_rabbitmq import send_user_to_rabbitmq, _collect_user_data

User = get_user_model()


@pytest.mark.django_db
class TestSendUserToRabbitMQ:
    """Тесты для отправки пользователей в RabbitMQ"""

    @patch('accounts.services.send_user_to_rabbitmq.send_event_to_rabbitmq')
    def test_send_user_to_rabbitmq_success(self, mock_send, db):
        """Тест успешной отправки пользователя в RabbitMQ"""
        # Создаем тестового пользователя
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        
        # Очищаем мок после создания пользователя (сигнал уже сработал)
        mock_send.reset_mock()
        mock_send.return_value = True
        
        result = send_user_to_rabbitmq(user.id)
        
        assert result is True
        mock_send.assert_called_once()

    def test_send_user_to_rabbitmq_user_not_found(self):
        """Тест отправки несуществующего пользователя"""
        result = send_user_to_rabbitmq(99999)
        
        assert result is False

    @patch('accounts.services.send_user_to_rabbitmq.send_event_to_rabbitmq')
    def test_send_user_to_rabbitmq_send_failure(self, mock_send, db):
        """Тест неудачной отправки в RabbitMQ"""
        # Создаем тестового пользователя
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        
        # Очищаем мок после создания пользователя (сигнал уже сработал)
        mock_send.reset_mock()
        mock_send.return_value = False
        
        result = send_user_to_rabbitmq(user.id)
        
        assert result is False
        mock_send.assert_called_once()

    def test_collect_user_data(self, db):
        """Тест сбора данных пользователя"""
        # Создаем тестового пользователя
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123',
            name='Test User',
            website='https://example.com',
            bio='Test bio',
            phone='+1234567890'
        )
        
        data = _collect_user_data(user)
        
        assert data['TyrianID__c'] == str(user.id)
        assert data['PersonEmail'] == user.email
        assert data['LastName'] == user.name
        assert data['UserName__c'] == user.username
        assert data['Website'] == user.website
        assert data['BIO__c'] == user.bio
        assert data['Phone'] == user.phone
        assert data['AccountStatus__c'] == 'Active'

    def test_collect_user_data_with_role(self, db):
        """Тест сбора данных пользователя с ролью"""
        from accounts.models.user_role import UserRole
        
        # Создаем роль
        role = UserRole.objects.create(name='Test Role')
        
        # Создаем пользователя с ролью
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123',
            role=role
        )
        
        data = _collect_user_data(user)
        
        assert data['Role__c'] == role.name

    def test_collect_user_data_with_sectors(self, db):
        """Тест сбора данных пользователя с секторами"""
        from accounts.models import Sector
        
        # Создаем секторы
        sector1 = Sector.objects.create(name='crypto')
        sector2 = Sector.objects.create(name='forex')
        
        # Создаем пользователя с секторами
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        user.sectors.add(sector1, sector2)
        
        data = _collect_user_data(user)
        
        assert data['Sector__c'] == 'crypto,forex'

    def test_collect_user_data_deleted_user(self, db):
        """Тест сбора данных удаленного пользователя"""
        # Создаем пользователя
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        
        # Помечаем как удаленного
        user.is_deleted = True
        user.save()
        
        data = _collect_user_data(user)
        
        assert data['AccountStatus__c'] == 'Blocked'

    @patch('accounts.services.send_user_to_rabbitmq.send_event_to_rabbitmq')
    def test_send_user_to_rabbitmq_exception(self, mock_send, db):
        """Тест обработки исключений при отправке"""
        # Создаем тестового пользователя
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        
        # Очищаем мок после создания пользователя (сигнал уже сработал)
        mock_send.reset_mock()
        mock_send.side_effect = Exception("Test exception")
        
        result = send_user_to_rabbitmq(user.id)
        
        assert result is False
        mock_send.assert_called_once()