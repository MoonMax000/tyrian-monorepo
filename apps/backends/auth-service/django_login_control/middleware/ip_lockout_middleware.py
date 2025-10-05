import logging
from django.utils import timezone # type: ignore
from django_login_control.models import IpLockout
from responses import IpBlockedResponse
from django.conf import settings # type: ignore


logger = logging.getLogger(__name__)


class IpLockoutMiddleware:
    """Middleware для проверки блокировки пользователя"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        ip_address = request.META.get("HTTP_X_REAL_IP", "") or request.META.get("HTTP_X_FORWARDED_FOR", "")
        if ip_address:
            try:
                # Ищем активную блокировку для ip
                active_lockout = IpLockout.objects.filter(
                    ip_address=ip_address,
                    blocked_until__gt=timezone.now(),
                    status='active'
                ).first()
                
                if active_lockout:
                    # Проверяем, может быть запросы от админа:
                    if str(request.user).startswith(f'{settings.ADMIN_USER}@'):
                        pass
                    # Возвращаем ошибку 403 с информацией о блокировке
                    return IpBlockedResponse(int(active_lockout.blocked_until.timestamp()), ip_address)
                    
            except Exception:
                # В случае ошибки пропускаем проверку
                pass
        
        response = self.get_response(request)
        return response
