import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
 
app = Celery('core')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Настройки для периодических задач
app.conf.beat_schedule = {
    'cleanup-expired-sessions': {
        'task': 'accounts.services.cleanup_expired_sessions.cleanup_expired_sessions',
        'schedule': crontab(minute='*'),  # Каждую минуту
    },
    'cleanup-unlinked-sessions': {
        'task': 'accounts.services.cleanup_unlinked_sessions.cleanup_unlinked_sessions',
        'schedule': crontab(minute=15),  # Каждый час в 15 минут
    },
    'sync-users-with-services': {
        'task': 'accounts.services.sync_users_with_services.sync_users_with_services',
        'schedule': crontab(minute=0),  # Каждый час в 0 минут
    },
    'send-all-users-to-rabbitmq': {
        'task': 'accounts.services.send_user_to_rabbitmq.send_all_users_to_rabbitmq',
        'schedule': crontab(hour=0, minute=0),  # Каждый час в 0 минут
    },
    'check-and-delete-users': {
        'task': 'accounts.services.delete_accounts.check_and_delete_users',
        'schedule': crontab(minute='*'),  # Каждую минуту
    },
}
