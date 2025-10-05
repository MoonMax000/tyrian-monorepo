from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserLockout
from .tasks import send_user_lockout_email, release_user_lockout


@receiver(post_save, sender=UserLockout)
def send_lockout_notification(sender, instance, created, **kwargs):
    """Отправляет email пользователю при создании блокировки и запускает задачу снятия блокировки"""
    if created:
        # В тестах Celery работает в eager mode, поэтому используем delay() для совместимости
        send_user_lockout_email.delay(instance.id)
        # Запускаем задачу снятия блокировки
        release_user_lockout.delay(instance.id)
