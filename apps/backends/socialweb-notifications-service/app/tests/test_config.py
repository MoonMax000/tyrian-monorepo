from app.config import settings


def test_config_loads_correctly():
    '''Проверяем, что настройки загружаются без ошибок.'''
    assert settings.PROJECT_NAME == 'Notifications Library - TEST'
    assert isinstance(settings.DEBUG, bool)


def test_database_settings():
    '''Проверяем настройки базы данных.'''
    if settings.database.SQLALCHEMY_DATABASE_URI_ASYNC:
        assert settings.database.SQLALCHEMY_DATABASE_URI_ASYNC.startswith('postgresql+asyncpg://')
    if settings.database.SQLALCHEMY_DATABASE_URI_SYNC:
        assert settings.database.SQLALCHEMY_DATABASE_URI_SYNC.startswith('postgresql://')


def test_email_settings():
    '''Проверяем настройки email.'''
    assert isinstance(settings.email.SMTP_TLS, bool)


def test_telegram_settings():
    '''Проверяем загрузку Telegram-токена.'''
    assert settings.telegram.TELEGRAM_TOKEN is None or isinstance(settings.telegram.TELEGRAM_TOKEN, str)

def test_notification_settings():
    '''Проверяем настройки уведомлений.'''
    assert isinstance(settings.notifications.NOTIFICATION_TYPES, dict)
