from django.conf import settings  # type: ignore
from django.db import models  # type: ignore
from zoneinfo import ZoneInfo
from timezone_field import TimeZoneField  # type: ignore


class UserProfile(models.Model):
    '''
    Модель расширенного профиля пользователя, связанная 1:1 с основной моделью User.
    Хранит дополнительные пользовательские настройки, включая часовой пояс.

    Особенности:
    - Создаётся автоматически при регистрации пользователя (через сигналы)
    - Удаляется при удалении связанного пользователя
    - Использует email пользователя как строковый идентификатор
    '''

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,         # Ссылка на кастомную модель пользователя проекта
        # Каскадное удаление профиля при удалении пользователя
        on_delete=models.CASCADE,
        # Использование user_id как первичного ключа (оптимизация запросов)
        primary_key=True,
        related_name='user_profiles',     # Доступ к профилю через user.user_profiles
        verbose_name='Связанный пользователь',
        help_text='Основной аккаунт, к которому привязан этот профиль'
    )

    time_zone = TimeZoneField(
        default='Europe/Moscow',            # MSK как пояс по умолчанию для новых пользователей
        choices_display='WITH_GMT_OFFSET',  # Формат вывода
        use_pytz=False,                     # Использовать zoneinfo вместо pytz
        verbose_name='Часовой пояс',
        help_text='Используется для корректного отображения времени в системе'
    )

    def __str__(self):
        '''
        Человекочитаемое представление объекта в админке и логировании.

        Использует email вместо username, так как:
        1. Email обычно уникален и постоянен
        2. Позволяет быстро идентифицировать пользователя
        3. Удобен для технической поддержки

        '''
        return f'{self.user.email}'

    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'
        db_table = 'user_profiles'
