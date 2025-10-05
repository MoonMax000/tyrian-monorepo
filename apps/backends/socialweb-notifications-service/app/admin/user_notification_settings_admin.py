from sqladmin import ModelView
from app.models import UserNotificationSettings


class UserNotificationSettingsAdmin(ModelView, model=UserNotificationSettings):
    name = 'настройку по способу отправки уведомлений'
    name_plural = 'Настройки по способу отправки уведомлений'

    column_list = [
        UserNotificationSettings.user_id,
        UserNotificationSettings.email_enabled,
        UserNotificationSettings.telegram_enabled,
        UserNotificationSettings.console_enabled,
    ]

    labels = {
        'user_id': 'Пользователь',
        'email_enabled': 'Статус уведомлений по Email',
        'telegram_enabled': 'Статус уведомлений по Telegram',
        'console_enabled': 'Статус уведомлений в Консоль',
    }

    column_labels = labels
    form_labels = labels
