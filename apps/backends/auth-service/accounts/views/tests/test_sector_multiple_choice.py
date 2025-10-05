import pytest
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from accounts.serializers.profile_update import ProfileUpdateSerializer
from accounts.models import Sector

User = get_user_model()


@pytest.mark.django_db
class TestSectorMultipleChoice:
    """Тесты для множественного выбора секторов"""

    def test_serializer_handles_multiple_sectors(self):
        """Тест сериализатора с множественными секторами"""
        # Создаем секторы
        sector1 = Sector.objects.create(name='Stock Market')
        sector2 = Sector.objects.create(name='Crypto')
        sector3 = Sector.objects.create(name='Forex')
        
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            is_active=True
        )
        
        # Тестируем сериализатор
        data = {
            'sectors': [sector1.id, sector2.id, sector3.id]
        }
        serializer = ProfileUpdateSerializer(user, data=data, partial=True)
        assert serializer.is_valid()
        
        # Сохраняем
        serializer.save()
        
        # Проверяем результат
        user.refresh_from_db()
        assert user.sectors.count() == 3
        assert sector1 in user.sectors.all()
        assert sector2 in user.sectors.all()
        assert sector3 in user.sectors.all()

    def test_serializer_handles_empty_sectors(self):
        """Тест сериализатора с пустыми секторами"""
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            is_active=True
        )
        
        # Тестируем сериализатор
        data = {
            'sectors': []
        }
        serializer = ProfileUpdateSerializer(user, data=data, partial=True)
        assert serializer.is_valid()
        
        # Сохраняем
        serializer.save()
        
        # Проверяем результат
        user.refresh_from_db()
        assert user.sectors.count() == 0

    def test_serializer_handles_single_sector(self):
        """Тест сериализатора с одним сектором"""
        # Создаем сектор
        sector = Sector.objects.create(name='Crypto')
        
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            is_active=True
        )
        
        # Тестируем сериализатор
        data = {
            'sectors': [sector.id]
        }
        serializer = ProfileUpdateSerializer(user, data=data, partial=True)
        assert serializer.is_valid()
        
        # Сохраняем
        serializer.save()
        
        # Проверяем результат
        user.refresh_from_db()
        assert user.sectors.count() == 1
        assert sector in user.sectors.all()

    def test_serializer_validates_sector_choices(self):
        """Тест валидации выбора секторов"""
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            is_active=True
        )
        
        # Тестируем с несуществующим ID
        data = {
            'sectors': [99999]
        }
        serializer = ProfileUpdateSerializer(user, data=data, partial=True)
        assert not serializer.is_valid()
        assert 'sectors' in serializer.errors

    def test_serializer_serializes_sectors_correctly(self):
        """Тест сериализации секторов"""
        # Создаем секторы
        sector1 = Sector.objects.create(name='Stock Market')
        sector2 = Sector.objects.create(name='Crypto')
        
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            is_active=True
        )
        
        # Добавляем секторы
        user.sectors.add(sector1, sector2)
        
        # Тестируем сериализацию
        serializer = ProfileUpdateSerializer(user)
        data = serializer.data
        
        assert 'sectors' in data
        assert set(data['sectors']) == {sector1.id, sector2.id}

    def test_database_queries_with_sectors(self):
        """Тест запросов к базе данных с секторами"""
        # Создаем секторы
        sector1 = Sector.objects.create(name='Stock Market')
        sector2 = Sector.objects.create(name='Crypto')
        
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            is_active=True
        )
        
        # Добавляем секторы
        user.sectors.add(sector1, sector2)
        
        # Тестируем запросы
        user_with_sectors = User.objects.prefetch_related('sectors').get(id=user.id)
        sectors = list(user_with_sectors.sectors.all())
        
        assert len(sectors) == 2
        assert sector1 in sectors
        assert sector2 in sectors