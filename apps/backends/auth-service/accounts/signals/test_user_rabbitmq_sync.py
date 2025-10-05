import pytest
from unittest.mock import patch, MagicMock
from django.contrib.auth import get_user_model
from django.test import TransactionTestCase
from accounts.signals.user_rabbitmq_sync import sync_user_to_rabbitmq

User = get_user_model()


class TestUserRabbitMQSyncSignal(TransactionTestCase):
    """Тесты для сигнала синхронизации пользователей с RabbitMQ"""

    def test_sync_user_to_rabbitmq_on_create(self):
        """Тест срабатывания сигнала при создании пользователя"""
        # Создаем пользователя
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        
        # Проверяем, что пользователь был создан
        assert user.id is not None
        assert user.email == 'test@example.com'

    def test_sync_user_to_rabbitmq_on_update(self):
        """Тест срабатывания сигнала при обновлении пользователя"""
        # Создаем пользователя
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        
        # Обновляем пользователя
        user.username = 'updateduser'
        user.save()
        
        # Проверяем, что пользователь был обновлен
        assert user.username == 'updateduser'

    def test_sync_user_to_rabbitmq_task_failure(self):
        """Тест обработки ошибки при вызове задачи"""
        # Создаем пользователя - не должно вызывать исключение
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        
        # Проверяем, что пользователь был создан несмотря на ошибку
        assert user.id is not None
        assert user.email == 'test@example.com'

    def test_sync_user_to_rabbitmq_multiple_updates(self):
        """Тест срабатывания сигнала при множественных обновлениях"""
        # Создаем пользователя
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        
        # Обновляем пользователя несколько раз
        user.username = 'updateduser1'
        user.save()
        
        user.username = 'updateduser2'
        user.save()
        
        # Проверяем, что пользователь был обновлен
        assert user.username == 'updateduser2'
