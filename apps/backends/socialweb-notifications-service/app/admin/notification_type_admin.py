from sqladmin import ModelView
from app.models import NotificationType


class NotificationTypeAdmin(ModelView, model=NotificationType):
    name = "тип уведомления"
    name_plural = "Типы уведомлений"

    column_list = [
        NotificationType.id,
        NotificationType.code,
        NotificationType.name,
        NotificationType.default_text,
        NotificationType.is_active
    ]

    labels = {
        'id': 'ID',
        'code': 'Код типа уведомления',
        'name': 'Название типа уведомления',
        'default_text': 'Шаблон текста уведомления',
        'is_active': 'Активность',
    }

    column_labels = labels
    form_labels = labels
