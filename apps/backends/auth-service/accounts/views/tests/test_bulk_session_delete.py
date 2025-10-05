import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient
from rest_framework import status

from accounts.models import LoginSession, SessionStatus

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    user, _ = User.objects.get_or_create(
        email='test@example.com',
        defaults={
            'username': 'testuser',
            'is_active': True,
        }
    )
    return user


@pytest.fixture
def other_user():
    user, _ = User.objects.get_or_create(
        email='other@example.com',
        defaults={
            'username': 'otheruser',
            'is_active': True,
        }
    )
    return user


@pytest.fixture
def active_sessions(user):
    sessions = []
    for i in range(3):
        session = LoginSession.objects.create(
            user=user,
            session_id=f'test-session-{i+1}',
            expires_at=timezone.now() + timedelta(hours=1),
            ip_address=f'192.168.1.{i+1}',
            fingerprint=f'test-fingerprint-{i+1}',
            status=SessionStatus.ACTIVE
        )
        sessions.append(session)
    return sessions


@pytest.fixture
def expired_sessions(user):
    sessions = []
    for i in range(2):
        session = LoginSession.objects.create(
            user=user,
            session_id=f'expired-session-{i+1}',
            expires_at=timezone.now() - timedelta(hours=1),
            ip_address=f'192.168.2.{i+1}',
            fingerprint=f'expired-fingerprint-{i+1}',
            status=SessionStatus.EXPIRED
        )
        sessions.append(session)
    return sessions


@pytest.fixture
def other_user_sessions(other_user):
    sessions = []
    for i in range(2):
        session = LoginSession.objects.create(
            user=other_user,
            session_id=f'other-session-{i+1}',
            expires_at=timezone.now() + timedelta(hours=1),
            ip_address=f'192.168.3.{i+1}',
            fingerprint=f'other-fingerprint-{i+1}',
            status=SessionStatus.ACTIVE
        )
        sessions.append(session)
    return sessions


@pytest.mark.django_db
class TestBulkSessionDeleteView:
    def test_delete_specific_sessions_success(self, api_client, user, active_sessions):
        """Тест успешного удаления конкретных сессий"""
        api_client.force_authenticate(user=user)
        
        session_ids = [active_sessions[0].id, active_sessions[1].id]
        data = {'session_ids': session_ids}
        
        response = api_client.delete('/api/accounts/sessions/bulk-delete/', data=data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['deleted_count'] == 2
        assert set(response.data['deleted_session_ids']) == set(session_ids)
        
        # Проверяем, что сессии удалены из БД
        assert not LoginSession.objects.filter(id__in=session_ids).exists()
        # Проверяем, что остальные сессии остались
        assert LoginSession.objects.filter(id=active_sessions[2].id).exists()

    def test_delete_all_active_sessions_empty_list(self, api_client, user, active_sessions, expired_sessions):
        """Тест удаления всех активных сессий при пустом списке"""
        api_client.force_authenticate(user=user)
        
        data = {'session_ids': []}
        
        response = api_client.delete('/api/accounts/sessions/bulk-delete/', data=data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['deleted_count'] == 3  # Только активные сессии
        
        # Проверяем, что активные сессии удалены
        assert not LoginSession.objects.filter(user=user, status=SessionStatus.ACTIVE).exists()
        # Проверяем, что истекшие сессии остались
        assert LoginSession.objects.filter(user=user, status=SessionStatus.EXPIRED).exists()

    def test_delete_all_active_sessions_no_session_ids_key(self, api_client, user, active_sessions):
        """Тест удаления всех активных сессий при отсутствии ключа session_ids"""
        api_client.force_authenticate(user=user)
        
        data = {}
        
        response = api_client.delete('/api/accounts/sessions/bulk-delete/', data=data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['deleted_count'] == 3

    def test_delete_sessions_not_found(self, api_client, user):
        """Тест удаления несуществующих сессий"""
        api_client.force_authenticate(user=user)
        
        data = {'session_ids': [999, 998]}
        
        response = api_client.delete('/api/accounts/sessions/bulk-delete/', data=data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'Sessions not found or do not belong to user' in response.data['detail']
        assert set(response.data['missing_sessions']) == {999, 998}

    def test_delete_sessions_partial_not_found(self, api_client, user, active_sessions):
        """Тест удаления сессий, когда часть не найдена"""
        api_client.force_authenticate(user=user)
        
        session_ids = [active_sessions[0].id, 999, 998]
        data = {'session_ids': session_ids}
        
        response = api_client.delete('/api/accounts/sessions/bulk-delete/', data=data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'Sessions not found or do not belong to user' in response.data['detail']
        assert response.data['found_sessions'] == [active_sessions[0].id]
        assert set(response.data['missing_sessions']) == {999, 998}

    def test_delete_other_user_sessions(self, api_client, user, other_user_sessions):
        """Тест попытки удаления чужих сессий"""
        api_client.force_authenticate(user=user)
        
        session_ids = [other_user_sessions[0].id, other_user_sessions[1].id]
        data = {'session_ids': session_ids}
        
        response = api_client.delete('/api/accounts/sessions/bulk-delete/', data=data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'Sessions not found or do not belong to user' in response.data['detail']
        assert set(response.data['missing_sessions']) == set(session_ids)

    def test_delete_sessions_unauthenticated(self, api_client, active_sessions):
        """Тест удаления сессий без аутентификации"""
        session_ids = [active_sessions[0].id]
        data = {'session_ids': session_ids}
        
        response = api_client.delete('/api/accounts/sessions/bulk-delete/', data=data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_sessions_invalid_data(self, api_client, user):
        """Тест удаления с неверными данными"""
        api_client.force_authenticate(user=user)
        
        data = {'session_ids': 'invalid'}  # Должен быть список
        
        response = api_client.delete('/api/accounts/sessions/bulk-delete/', data=data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_delete_sessions_invalid_session_ids(self, api_client, user):
        """Тест удаления с неверными ID сессий"""
        api_client.force_authenticate(user=user)
        
        data = {'session_ids': ['invalid', 'ids']}  # Должны быть числа
        
        response = api_client.delete('/api/accounts/sessions/bulk-delete/', data=data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_delete_sessions_no_active_sessions(self, api_client, user, expired_sessions):
        """Тест удаления всех активных сессий, когда их нет"""
        api_client.force_authenticate(user=user)
        
        data = {'session_ids': []}
        
        response = api_client.delete('/api/accounts/sessions/bulk-delete/', data=data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['deleted_count'] == 0
        assert 'No active sessions found' in response.data['detail']

    def test_delete_sessions_empty_list_no_sessions(self, api_client, user):
        """Тест удаления сессий, когда у пользователя нет сессий"""
        api_client.force_authenticate(user=user)
        
        data = {'session_ids': []}
        
        response = api_client.delete('/api/accounts/sessions/bulk-delete/', data=data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['deleted_count'] == 0

    def test_delete_sessions_unsupported_methods(self, api_client, user, active_sessions):
        """Тест неподдерживаемых HTTP методов"""
        api_client.force_authenticate(user=user)
        
        data = {'session_ids': [active_sessions[0].id]}
        
        # GET не поддерживается
        response = api_client.get('/api/accounts/sessions/bulk-delete/', data=data, format='json')
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
        
        # POST не поддерживается
        response = api_client.post('/api/accounts/sessions/bulk-delete/', data=data, format='json')
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
