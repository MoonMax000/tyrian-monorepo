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
def active_session(user):
    return LoginSession.objects.create(
        user=user,
        session_id='test-session-1',
        expires_at=timezone.now() + timedelta(hours=1),
        ip_address='192.168.1.1',
        fingerprint='test-fingerprint',
        status=SessionStatus.ACTIVE
    )


@pytest.fixture
def expired_session(user):
    return LoginSession.objects.create(
        user=user,
        session_id='test-session-2',
        expires_at=timezone.now() - timedelta(hours=1),
        ip_address='192.168.1.2',
        fingerprint='test-fingerprint-2',
        status=SessionStatus.EXPIRED
    )


@pytest.fixture
def other_user_session(other_user):
    return LoginSession.objects.create(
        user=other_user,
        session_id='other-session-1',
        expires_at=timezone.now() + timedelta(hours=1),
        ip_address='192.168.1.3',
        fingerprint='other-fingerprint',
        status=SessionStatus.ACTIVE
    )


@pytest.mark.django_db
class TestUserSessionsListView:
    def test_get_sessions_success(self, api_client, user, active_session, expired_session):
        """Тест успешного получения списка активных сессий"""
        api_client.force_authenticate(user=user)
        response = api_client.get('/api/accounts/sessions/')
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1  # Только активная сессия
        assert response.data[0]['id'] == active_session.id
        assert response.data[0]['session_id'] == 'test-session-1'
        assert response.data[0]['status'] == 'active'

    def test_get_sessions_empty_list(self, api_client, user):
        """Тест получения пустого списка сессий"""
        api_client.force_authenticate(user=user)
        response = api_client.get('/api/accounts/sessions/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data == []

    def test_get_sessions_unauthenticated(self, api_client):
        """Тест получения сессий без аутентификации"""
        response = api_client.get('/api/accounts/sessions/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_get_sessions_only_own_sessions(self, api_client, user, other_user_session):
        """Тест получения только своих сессий"""
        api_client.force_authenticate(user=user)
        response = api_client.get('/api/accounts/sessions/')
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0  # Нет своих активных сессий


@pytest.mark.django_db
class TestUserSessionDetailView:
    def test_get_session_detail_success(self, api_client, user, active_session):
        """Тест успешного получения детальной информации о сессии"""
        api_client.force_authenticate(user=user)
        response = api_client.get(f'/api/accounts/sessions/{active_session.id}/')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == active_session.id
        assert response.data['session_id'] == 'test-session-1'
        assert response.data['status'] == 'active'
        assert response.data['ip_address'] == '192.168.1.1'

    def test_get_session_detail_not_found(self, api_client, user):
        """Тест получения несуществующей сессии"""
        api_client.force_authenticate(user=user)
        response = api_client.get('/api/accounts/sessions/999/')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert 'Session not found' in response.data['detail']

    def test_get_session_detail_other_user_session(self, api_client, user, other_user_session):
        """Тест получения чужой сессии"""
        api_client.force_authenticate(user=user)
        response = api_client.get(f'/api/accounts/sessions/{other_user_session.id}/')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert 'Session not found' in response.data['detail']

    def test_get_session_detail_unauthenticated(self, api_client, active_session):
        """Тест получения сессии без аутентификации"""
        response = api_client.get(f'/api/accounts/sessions/{active_session.id}/')
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestUserSessionDeleteView:
    def test_delete_session_success(self, api_client, user, active_session):
        """Тест успешного удаления сессии"""
        api_client.force_authenticate(user=user)
        response = api_client.delete(f'/api/accounts/sessions/{active_session.id}/delete/')
        
        assert response.status_code == status.HTTP_200_OK
        assert 'Session deleted successfully' in response.data['detail']
        assert not LoginSession.objects.filter(id=active_session.id).exists()

    def test_delete_session_not_found(self, api_client, user):
        """Тест удаления несуществующей сессии"""
        api_client.force_authenticate(user=user)
        response = api_client.delete('/api/accounts/sessions/999/delete/')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert 'Session not found' in response.data['detail']

    def test_delete_session_other_user_session(self, api_client, user, other_user_session):
        """Тест удаления чужой сессии"""
        api_client.force_authenticate(user=user)
        response = api_client.delete(f'/api/accounts/sessions/{other_user_session.id}/delete/')
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert 'Session not found' in response.data['detail']
        # Сессия другого пользователя должна остаться
        assert LoginSession.objects.filter(id=other_user_session.id).exists()

    def test_delete_session_unauthenticated(self, api_client, active_session):
        """Тест удаления сессии без аутентификации"""
        response = api_client.delete(f'/api/accounts/sessions/{active_session.id}/delete/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_session_unsupported_methods(self, api_client, user, active_session):
        """Тест неподдерживаемых HTTP методов для удаления сессии"""
        api_client.force_authenticate(user=user)
        
        # GET не поддерживается
        response = api_client.get(f'/api/accounts/sessions/{active_session.id}/delete/')
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
        
        # POST не поддерживается
        response = api_client.post(f'/api/accounts/sessions/{active_session.id}/delete/')
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
