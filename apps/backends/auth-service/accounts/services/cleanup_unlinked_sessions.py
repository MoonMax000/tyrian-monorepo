import os
import redis
import logging
from datetime import datetime, timezone
from celery import shared_task # type: ignore
from accounts.models import LoginSession, SessionStatus

logger = logging.getLogger(__name__)


@shared_task
def cleanup_unlinked_sessions():
    """
    Задача для очистки несвязанных сессий.
    Запускается каждую минуту и удаляет все LoginSession с отсутствующей сессией.
    """
    logger.debug("Starting cleanup of unlinked sessions")
    
    try:
        # Получаем текущее время
        now = datetime.now(timezone.utc)
        
        # Находим все активные сессии с истекшим сроком
        active_sessions = LoginSession.objects.filter(
            status=SessionStatus.ACTIVE,
        )
        
        logger.debug(f"Found {active_sessions.count()} active sessions")
        
        if active_sessions.count() == 0:
            logger.info("No active sessions found")
            return
        
        redis_host = os.getenv('REDIS_HOST', 'global-redis')
        redis_port = int(os.getenv('REDIS_PORT', 6379))
        redis_db = 0
        
        redis_client = redis.Redis(
            host=redis_host,
            port=redis_port,
            db=redis_db,
            decode_responses=True
        )

        deleted_count = 0
        for session in active_sessions:
            cache_key = f":1:django.contrib.sessions.cache{session.session_id}"
            if not redis_client.exists(cache_key):
                session.delete()
                logger.info(f"Deleted unlinked session: {session.session_id}")
                deleted_count += 1
        logger.info(f"Successfully deleted {deleted_count} unlinked sessions")
        
    except Exception as exc:
        logger.error(f"Error during cleanup of unlinked sessions: {exc}")
        # Не поднимаем исключение, чтобы задача не падала
        # и продолжала выполняться по расписанию 
