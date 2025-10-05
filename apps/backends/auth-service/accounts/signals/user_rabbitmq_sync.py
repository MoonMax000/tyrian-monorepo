# accounts/signals/user_rabbitmq_sync.py
import logging

from django.db import transaction
from django.db.models.signals import post_save  # type: ignore
from django.dispatch import receiver  # type: ignore
from django.conf import settings  # type: ignore

from ..services import send_user_to_rabbitmq

logger = logging.getLogger(__name__)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def sync_user_to_rabbitmq(sender, instance, created, **kwargs):
    """
    Сигнал для автоматической отправки данных пользователя в RabbitMQ
    при создании или изменении пользователя в системе.

    Логика:
    1. Срабатывает после сохранения модели User (post_save)
    2. Запускает фоновую задачу Celery для отправки данных в RabbitMQ
    3. Передает ID пользователя в задачу

    Args:
        sender: Модель, которая отправила сигнал (User)
        instance: Экземпляр модели User
        created: True если объект создан, False если обновлен
        **kwargs: Дополнительные аргументы
    """
    try:
        action = "created" if created else "updated"
        logger.info(f"User {instance.id} ({instance.email}) was {action}, triggering RabbitMQ sync")
        
        # Запускаем фоновую задачу Celery
        def launch_task():
            task_result = send_user_to_rabbitmq.delay(instance.id)
            logger.info(
                f"RabbitMQ sync task queued for user {instance.id} ({instance.email}), task ID: {task_result.id}")
        transaction.on_commit(launch_task)


    except Exception as e:
        logger.error(f"Failed to trigger RabbitMQ sync for user {instance.id} ({instance.email}): {str(e)}")
