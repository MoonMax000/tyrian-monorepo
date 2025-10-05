# tasks.py
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from accounts.models import User
from django.conf import settings # type: ignore
from .delete_user import delete_user


@shared_task
def check_and_delete_users():
    """Периодическая задача для проверки и удаления пользователей"""
    deletion_threshold = timezone.now() - timedelta(seconds=settings.USER_DELETION_TIMEOUT_IN_SECONDS)
    
    users_to_delete = User.objects.filter(
        is_deleted=True,
        deletion_requested_at__lte=deletion_threshold
    )
    
    for user in users_to_delete:
        delete_user(user)
