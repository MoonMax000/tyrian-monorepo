from accounts.models import User
from typing import Tuple


def check_user_is_valid_for_request(user: User | None = None) -> Tuple[bool, str]:
    """Проверяет, является ли пользователь валидным для запроса"""
    if not user or not getattr(user, 'is_authenticated', False):
        return False, "No user provided"
    if not user.is_active:
        return False, "User is not active"
    if user.is_deleted:
        return False, "User is deleted"
    
    return True, "User is valid"