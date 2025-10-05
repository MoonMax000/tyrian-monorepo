# accounts/signals/create_user_profile.py
from django.db.models.signals import post_save  # type: ignore
from django.dispatch import receiver  # type: ignore
from django.conf import settings  # type: ignore
from ..models import UserProfile  # Импорт модели профиля


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    '''
    Сигнал для автоматического создания профиля пользователя 
    при создании нового пользователя в системе.

    Логика:
    1. Срабатывает после сохранения модели User (post_save)
    2. Проверяет, что пользователь именно создан (не обновлен)
    3. Создает связанный профиль с часовым поясом по умолчанию

    '''
    if created:
        UserProfile.objects.create(
            user=instance,
            # MSK будет установлен автоматически из default поля модели
        )
        # Для отладки
        # logger.info(f'Created profile for {instance.email}')
