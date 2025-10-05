'''
Модуль конфигурации приложения.
'''
import os
import json
from typing import Optional, Dict
from dotenv import load_dotenv
from pydantic import BaseSettings, PostgresDsn, validator


ENV_FILE = '.env.test' if os.getenv('TEST_MODE') else '.env'
load_dotenv(ENV_FILE)


class DatabaseSettings(BaseSettings):
    '''
    Настройки подключения к базе данных PostgreSQL.

    Атрибуты:
        SQLALCHEMY_DATABASE_URI_ASYNC (Optional[PostgresDsn]): Асинхронная строка подключения.
        SQLALCHEMY_DATABASE_URI_SYNC (Optional[PostgresDsn]): Синхронная строка подключения.
        POSTGRES_USER (Optional[str]): Имя пользователя для подключения к базе.
        POSTGRES_PASSWORD (Optional[str]): Пароль для подключения.
        POSTGRES_SERVER (Optional[str]): Адрес сервера базы данных.
        POSTGRES_DB (Optional[str]): Имя базы данных.
    '''
    SQLALCHEMY_DATABASE_URI_ASYNC: Optional[PostgresDsn] = None
    SQLALCHEMY_DATABASE_URI_SYNC: Optional[PostgresDsn] = None

    POSTGRES_USER: Optional[str] = None
    POSTGRES_PASSWORD: Optional[str] = None
    POSTGRES_SERVER: Optional[str] = None
    POSTGRES_DB: Optional[str] = None

    @validator('SQLALCHEMY_DATABASE_URI_ASYNC', pre=True, always=True)
    def assemble_async_db_connection(
        cls, value: Optional[str], values: dict
    ) -> Optional[PostgresDsn]:
        '''Валидатор для автоматической сборки **асинхронного** DSN подключения к PostgreSQL.'''
        if value:
            return value

        return PostgresDsn.build(
            scheme='postgresql+asyncpg',
            user=values.get("POSTGRES_USER") or os.getenv("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD") or os.getenv("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER") or os.getenv("POSTGRES_SERVER"),
            path=f'/{values.get("POSTGRES_DB") or os.getenv("POSTGRES_DB")}',
        )

    @validator('SQLALCHEMY_DATABASE_URI_SYNC', pre=True, always=True)
    def assemble_sync_db_connection(
        cls, value: Optional[str], values: dict
    ) -> Optional[PostgresDsn]:
        """Валидатор для автоматической сборки **синхронного** DSN подключения к PostgreSQL."""
        if value:
            return value

        return PostgresDsn.build(
            scheme="postgresql",
            user=values.get("POSTGRES_USER") or os.getenv("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD") or os.getenv("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER") or os.getenv("POSTGRES_SERVER"),
            path=f'/{values.get("POSTGRES_DB") or os.getenv("POSTGRES_DB")}',
        )


class EmailSettings(BaseSettings):
    '''
    Настройки для отправки электронной почты.

    Атрибуты:
        SMTP_HOST (str): SMTP-сервер.
        SMTP_PORT (int): Порт SMTP-сервера.
        SMTP_USERNAME (str): Имя пользователя для SMTP.
        SMTP_PASSWORD (str): Пароль для SMTP.
        SMTP_FROM_EMAIL (str): Email-адрес отправителя уведомлений.
        SMTP_TLS (bool): Флаг использования TLS для подключения.
    '''
    SMTP_TLS: bool = True
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: Optional[str] = None


class TelegramSettings(BaseSettings):
    '''
    Настройки для Telegram уведомлений.

    Атрибуты:
        TELEGRAM_TOKEN (str): Токен Telegram бота.
    '''
    TELEGRAM_TOKEN: Optional[str] = None


class NotificationSettings(BaseSettings):
    '''
    Настройки типов уведомлений.
    '''
    NOTIFICATION_TYPES: Dict[str, Dict[str, str]] = {}

    @validator("NOTIFICATION_TYPES", pre=True, always=True)
    def parse_notification_types(cls, value: Optional[str]) -> Dict[str, Dict[str, str]]:
        '''Парсит JSON-объект из NOTIFICATION_TYPES.'''
        if isinstance(value, dict):
            return value
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError as error:
                raise ValueError(f'Ошибка обработки NOTIFICATION_TYPES из .env: {error}')
        return {}


class Settings(BaseSettings):
    '''Главный класс настроек приложения.'''
    PROJECT_NAME: Optional[str] = 'Notifications Library'
    DEBUG: bool = False
    database: DatabaseSettings = DatabaseSettings()
    email: EmailSettings = EmailSettings()
    telegram: TelegramSettings = TelegramSettings()
    notifications: NotificationSettings = NotificationSettings()

    class Config:
        env_file = ENV_FILE
        env_file_encoding = 'utf-8'


# Экземпляр настроек, который будет использоваться во всём приложении.
settings = Settings()
