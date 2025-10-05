from sqladmin import ModelView
from app.models import UserNotificationTypeSettings


class UserNotificationTypeSettingsAdmin(ModelView, model=UserNotificationTypeSettings):
    name = "настройку по типам уведомлений"
    name_plural = "Настройки по типам уведомлений"

    column_list = [
        UserNotificationTypeSettings.user_id,
        UserNotificationTypeSettings.notification_type_id,
        UserNotificationTypeSettings.enabled,
    ]

    labels = {
        'user_id': 'Пользователь',
        'notification_type_id': 'Тип уведомления',
        'enabled': 'Активность',
    }

    column_labels = labels
    form_labels = labels
