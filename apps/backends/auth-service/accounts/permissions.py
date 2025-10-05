from rest_framework.permissions import BasePermission # type: ignore
from rest_framework.exceptions import PermissionDenied # type: ignore


class IsSessionAuthenticated(BasePermission):
    """
    Разрешает доступ только пользователям с действующей сессией.
    Проверяет, что пользователь аутентифицирован через сессию.
    """
    
    def has_permission(self, request, view):
        # Проверяем, что пользователь аутентифицирован
        if not request.user.is_authenticated:
            return False
        
        # Проверяем, что сессия существует и валидна
        if not request.session.session_key:
            return False
        
        # Проверяем, что пользователь активен
        if not request.user.is_active:
            return False
        
        return True 