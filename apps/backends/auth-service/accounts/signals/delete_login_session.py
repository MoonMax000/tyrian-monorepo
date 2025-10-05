import logging
import redis
import os
from django.core.cache import cache  # type: ignore
from django.db.models.signals import pre_delete  # type: ignore
from django.dispatch import receiver  # type: ignore
from ..models import LoginSession

logger = logging.getLogger(__name__)


@receiver(pre_delete, sender=LoginSession)
def delete_login_session(sender, instance, **kwargs):
    '''При удалении сессии из админки удаляет связанную сессию из кэша (Redis)'''
    session_id = instance.session_id
    user_email = instance.user.email if instance.user else 'Unknown'
    user_id = instance.user.id if instance.user else 'Unknown'

    logger.debug(
        f"LoginSession DELETE SIGNAL: ID={instance.id}, SessionID={session_id}, User={user_email}")

    if not session_id:
        error_msg = f"Cannot delete LoginSession: session_id is null for user {user_email}"
        logger.error(error_msg)
        raise ValueError(error_msg)

    cache_key = f":1:django.contrib.sessions.cache{session_id}"

    try:
        # Используем прямой доступ к Redis, как в JsonSessionStore
        redis_host = os.getenv('REDIS_HOST', 'global-redis')
        redis_port = int(os.getenv('REDIS_PORT', 6379))
        redis_db = 0

        redis_client = redis.Redis(
            host=redis_host,
            port=redis_port,
            db=redis_db,
            decode_responses=True
        )

        # Проверяем, существует ли ключ перед удалением
        exists_before = redis_client.exists(cache_key)
        logger.debug(
            f"Session {session_id} exists before deletion: {exists_before}")

        # Удаляем сессию из Redis
        result = redis_client.delete(cache_key)
        logger.info(f"Redis delete result for session {session_id}: {result}")

        # Проверяем, существует ли ключ после удаления
        exists_after = redis_client.exists(cache_key)
        logger.debug(
            f"Session {session_id} exists after deletion: {exists_after}")

        if result > 0:
            logger.info(
                f"Successfully removed session {session_id} from cache for user {user_email}")
        else:
            logger.warning(
                f"Session {session_id} was not found in cache for user {user_email}")

    except Exception as exc:
        error_msg = f"Error deleting session {session_id} from cache for user {user_email}: {exc}"
        logger.error(error_msg)
        # Отменяем удаление, вызывая исключение
        raise ValueError(error_msg)
