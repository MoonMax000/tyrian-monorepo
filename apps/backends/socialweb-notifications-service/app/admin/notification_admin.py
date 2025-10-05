from sqladmin import ModelView
from starlette.requests import Request
from app.models import Notification


class NotificationAdmin(ModelView, model=Notification):
    name = "уведомление"
    name_plural = "Уведомления пользователей"

    column_list = [
        Notification.id,
        Notification.user_id,
        Notification.notification_type_id,
        Notification.is_read,
        Notification.read_at,
        Notification.created_at,
    ]

    labels = {
        'id': 'ID',
        'user_id': 'Пользователь',
        'notification_type_id': 'Тип уведомления',
        'data': 'Дополнительные данные для рендеринга сообщения',
        'is_read': 'Прочитано?',
        'read_at': 'Дата прочтения',
        'created_at': 'Дата создания',
    }

    column_labels = labels
    form_labels = labels

    form_excluded_columns = ['is_read', 'read_at', 'created_at']

    def is_visible(self, request: Request) -> bool:
        return True

    def is_accessible(self, request: Request) -> bool:
        return True
