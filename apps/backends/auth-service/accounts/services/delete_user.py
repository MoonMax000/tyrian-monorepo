import logging

from accounts.models import User
from .deactivate_user_sessions import deactivate_user_sessions


logger = logging.getLogger(__name__)


def delete_user(user: User) -> None:
    """Удаляет пользователя"""
    logger.info(f"Deleting user {user.id} ({user.email})")
    deactivate_user_sessions(user.id)
    user.delete()
    logger.info(f"Deleted user {user.id} ({user.email})")
