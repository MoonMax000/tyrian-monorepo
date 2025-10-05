from app.models import (
    Notification,
    NotificationType,
    UserNotificationSettings,
    UserNotificationTypeSettings,
)


def test_create_all_models(
        db,
        create_notification_type,
        create_user_settings,
        create_user_notification_type_settings,
        create_notification,
    ):
    '''Проверяем, что все модели созданы правильно.'''
    assert db.query(Notification).count() == 1
    assert db.query(NotificationType).count() == 1
    assert db.query(UserNotificationSettings).count() == 1
    assert db.query(UserNotificationTypeSettings).count() == 1


def test_update_notification_type(db, create_notification_type):
    '''Проверяем обновление типа уведомления.'''
    notif_type = db.query(NotificationType).first()
    notif_type.name = "Updated Type"
    db.commit()

    updated_type = db.query(NotificationType).first()
    assert updated_type.name == "Updated Type"


def test_delete_notification_type(db, create_notification_type):
    '''Проверяем удаление типа уведомления.'''
    notif_type = db.query(NotificationType).first()
    db.delete(notif_type)
    db.commit()

    assert db.query(NotificationType).count() == 0


def test_disable_notification_type_for_user(db, create_user_notification_type_settings):
    '''Проверяем отключение типа уведомления для пользователя.'''
    user_setting = db.query(UserNotificationTypeSettings).first()
    user_setting.enabled = False
    db.commit()

    updated_setting = db.query(UserNotificationTypeSettings).first()
    assert not updated_setting.enabled


def test_delete_user_settings(db, create_user_settings):
    '''Проверяем удаление настроек уведомлений пользователя.'''
    user_setting = db.query(UserNotificationSettings).first()
    db.delete(user_setting)
    db.commit()

    assert db.query(UserNotificationSettings).count() == 0


def test_create_notification_with_custom_data(db, create_notification_type, create_user):
    '''Проверяем создание уведомления с кастомными данными.'''
    notification = Notification(
        user_id=create_user.id,
        notification_type_id=create_notification_type.id,
        data={"custom_key": "value"},
    )
    db.add(notification)
    db.commit()

    saved_notification = db.query(Notification).first()
    assert saved_notification.data["custom_key"] == "value"


def test_delete_notification(db, create_notification):
    '''Проверяем удаление уведомления.'''
    db.delete(create_notification)
    db.commit()

    assert db.query(Notification).count() == 0
