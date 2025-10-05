import logging
from datetime import datetime, timezone
from celery import shared_task # type: ignore
from accounts.models import LoginSession

logger = logging.getLogger(__name__)


@shared_task
def cleanup_expired_sessions():
    """
    Задача для очистки истекших сессий.
    Запускается каждую минуту и удаляет все LoginSession с активным статусом,
    у которых истек срок действия.
    """
    logger.debug("Starting cleanup of expired sessions")
    
    try:
        # Получаем текущее время
        now = datetime.now(timezone.utc)
        
        # Находим все активные сессии с истекшим сроком
        expired_sessions = LoginSession.objects.filter(
            status='active',
            expires_at__lt=now
        )
        
        # Подсчитываем количество сессий для удаления
        expired_count = expired_sessions.count()
        logger.debug(f"Found {expired_count} expired sessions")
        
        if expired_count == 0:
            logger.info("No expired sessions found")
            return
        
        # Удаляем истекшие сессии
        # Используем queryset.delete() для инициации сигнала pre_delete
        deleted_count, deleted_objects = expired_sessions.delete()
        
        logger.info(f"Successfully deleted {deleted_count} expired sessions")
        
    except Exception as exc:
        logger.error(f"Error during cleanup of expired sessions: {exc}")
        # Не поднимаем исключение, чтобы задача не падала
        # и продолжала выполняться по расписанию 