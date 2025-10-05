from sqladmin import Admin
from app.admin.notification_admin import NotificationAdmin
from app.admin.notification_type_admin import NotificationTypeAdmin
from app.admin.user_notification_settings_admin import UserNotificationSettingsAdmin
from app.admin.user_notification_type_admin import UserNotificationTypeSettingsAdmin


def register_library_admin(admin: Admin):
    '''Функция для регистрации всех админок библиотеки уведомлений.'''
    admin.add_view(NotificationAdmin)
    admin.add_view(NotificationTypeAdmin)
    admin.add_view(UserNotificationSettingsAdmin)
    admin.add_view(UserNotificationTypeSettingsAdmin)
