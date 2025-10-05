from django.http import JsonResponse # type: ignore
from django.utils import timezone # type: ignore
from django_login_control.models import UserLockout
from responses import AccountLockedResponse


class UserLockoutMiddleware:
    """Middleware для проверки блокировки пользователя"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Проверяем блокировку только для аутентифицированных пользователей
        if hasattr(request, 'user') and request.user and request.user.is_authenticated:
            try:
                # Ищем активную блокировку для пользователя
                active_lockout = UserLockout.objects.filter(
                    user=request.user,
                    blocked_until__gt=timezone.now(),
                    status='active'
                ).first()
                
                if active_lockout:
                    # Возвращаем ошибку 403 с информацией о блокировке
                    return AccountLockedResponse(int(active_lockout.blocked_until.timestamp()))
                    
            except Exception:
                # В случае ошибки пропускаем проверку
                pass
        
        response = self.get_response(request)
        return response
