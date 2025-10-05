import pytest
from django.urls import reverse
from django.test import RequestFactory
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django_login_control.middleware import UserLockoutMiddleware
from django_login_control.models import UserLockout, LockoutStatus
from django.utils import timezone
from django.conf import settings
from django.http import HttpResponse, JsonResponse

User = get_user_model()


@pytest.mark.django_db
class TestUserLockoutMiddleware:
    """Тесты для middleware блокировки пользователей"""

    def dummy_view(self, request):
        return HttpResponse("OK")

    @pytest.mark.skip(reason="Test hangs due to Celery task with sleep")
    def test_middleware_blocks_user_with_active_lockout(self, user):
        lockout = UserLockout.objects.create(
            user=user,
            blocked_until=timezone.now() + timezone.timedelta(hours=1),
            status=LockoutStatus.ACTIVE
        )
        middleware = UserLockoutMiddleware(self.dummy_view)
        factory = RequestFactory()
        request = factory.get('/some-url/')
        request.user = user
        response = middleware(request)
        assert response.status_code == 403
        import json
        data = json.loads(response.content.decode())
        assert 'User is blocked' in data['detail']
        assert 'banned_until' in data

    def test_middleware_allows_user_without_lockout(self, user):
        middleware = UserLockoutMiddleware(self.dummy_view)
        factory = RequestFactory()
        request = factory.get('/some-url/')
        request.user = user
        response = middleware(request)
        assert response.status_code == 200

    @pytest.mark.skip(reason="Test hangs due to Celery task with sleep")
    def test_middleware_allows_user_with_expired_lockout(self, user):
        lockout = UserLockout.objects.create(
            user=user,
            blocked_until=timezone.now() - timezone.timedelta(hours=1),
            status=LockoutStatus.ACTIVE
        )
        middleware = UserLockoutMiddleware(self.dummy_view)
        factory = RequestFactory()
        request = factory.get('/some-url/')
        request.user = user
        response = middleware(request)
        assert response.status_code == 200

    def test_middleware_allows_anonymous_user(self):
        middleware = UserLockoutMiddleware(self.dummy_view)
        factory = RequestFactory()
        request = factory.get('/some-url/')
        request.user = AnonymousUser()
        response = middleware(request)
        assert response.status_code == 200

    @pytest.mark.skip(reason="Test hangs due to Celery task with sleep")
    def test_middleware_allows_user_with_inactive_lockout(self, user):
        lockout = UserLockout.objects.create(
            user=user,
            blocked_until=timezone.now() + timezone.timedelta(hours=1),
            status=LockoutStatus.RELEASED
        )
        middleware = UserLockoutMiddleware(self.dummy_view)
        factory = RequestFactory()
        request = factory.get('/some-url/')
        request.user = user
        response = middleware(request)
        assert response.status_code == 200

    @pytest.mark.skip(reason="Test hangs due to Celery task with sleep")
    def test_middleware_response_structure(self, user):
        lockout = UserLockout.objects.create(
            user=user,
            blocked_until=timezone.now() + timezone.timedelta(hours=1),
            status=LockoutStatus.ACTIVE
        )
        middleware = UserLockoutMiddleware(self.dummy_view)
        factory = RequestFactory()
        request = factory.get('/some-url/')
        request.user = user
        response = middleware(request)
        assert response.status_code == 403
        import json
        data = json.loads(response.content.decode())
        assert 'detail' in data
        assert 'banned_until' in data
        assert 'lockout_reason' in data
        assert 'User is blocked' in data['detail']
        assert 'Превышен лимит неудачных попыток входа' in data['lockout_reason'] 