import logging

from ..models import LoginSession
from ..exceptions import DeactivationUserSessionsException


logger = logging.getLogger(__name__)


def deactivate_user_sessions(user_id: int) -> None:
    """Деактивирует все сессии пользователя"""
    logger.debug(f"Deactivating sessions for user ID: {user_id}")
    
    try:
        # Находим все сессии пользователя
        user_sessions = LoginSession.objects.filter(user_id=user_id)
        sessions_count = user_sessions.count()
        logger.debug(f"Found {sessions_count} sessions for user {user_id}")
        
        if sessions_count == 0:
            logger.debug(f"No sessions to deactivate for user {user_id}")
            return
        
        # Удаляем сессии (это вызовет сигнал pre_delete для каждой сессии)
        deleted_count, deleted_objects = user_sessions.delete()
        
        logger.info(f"Successfully deactivated {deleted_count} sessions for user {user_id}")
        
    except Exception as exc:
        logger.error(f"Error during deactivation of sessions for user {user_id}: {exc}")
        raise DeactivationUserSessionsException(f"Error during deactivation of sessions for user {user_id}: {exc}") from exc
