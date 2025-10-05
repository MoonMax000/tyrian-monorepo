# 📢 Notification Library

**Notification Library** – это универсальная библиотека для управления уведомлениями пользователей в приложениях на основе FastAPI, SQLAlchemy и SQLAdmin.

## 📌 Функциональность

✅ Управление уведомлениями пользователей  
✅ Гибкая настройка способов получения уведомлений (Email, Telegram, консоль)  
✅ Подключаемая админка через `sqladmin`  
✅ Автоматическое создание типов уведомлений из конфигурации  
✅ Готовая система хранения и управления настройками уведомлений пользователей  
✅ Поддержка тестирования

## 🚀 Установка

```sh
# ⛔️ Пока недоступно
pip install fastapi-notifications 
```
Или если используешь исходный код:
```sh
git clone https://github.com/Capstane/fastapi_notifications.git
cd fastapi_notifications
pip install -r requirements.txt
```

## ⚙️ Настройки .env
Библиотека использует конфигурацию через переменные окружения.  
Создай файл .env и укажи в нём настройки:
```sh
# Основные настройки
PROJECT_NAME="Notifications Library API"
DEBUG=False

# Подключение к PostgreSQL (опционально 1-й вариант или 2-й вариант)
# 1-й вариант подключения
SQLALCHEMY_DATABASE_URI_ASYNC="postgresql+asyncpg://your_postgres_user:your_postgres_password@localhost/your_postgres_db"
SQLALCHEMY_DATABASE_URI_SYNC="postgresql://your_postgres_user:your_postgres_password@localhost/your_postgres_db"

# 2-й вариант подключения
POSTGRES_SERVER=localhost
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_postgres_db

# Настройки почты для Email-уведомлений (опционально)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM_EMAIL=no-reply@example.com
SMTP_TLS=True

# Настройки для Telegram-уведомлений (опционально)
TELEGRAM_TOKEN=""

# Типы уведомлений (JSON-формат)
# Используйте {{ }} для подстановки переменных в текст уведомлений
NOTIFICATION_TYPES={"NEW_ORDER": {"name": "Новый заказ", "default_text": "Ваш заказ оформлен!"}, "PAYMENT_SUCCESS": {"name": "Оплата успешна", "default_text": "Ваш платеж успешно проведен!"}}
```
📌 Примечание:
При запуске библиотеки типы уведомлений создаются автоматически из переменной NOTIFICATION_TYPES, если их ещё нет в базе.

## 📦 Использование
🔹 1. Добавление моделей в базу данных  
```sh
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from notifications.models import Base as notification_base

DATABASE_URL = "postgresql://user:password@localhost/dbname"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Добавлем создание таблиц уведомлений в базе данных вашего проекта
notification_base.metadata.create_all(bind=engine)
```

Не забудьте применить миграции:  
```sh
alembic upgrade head
```

🔹 2. Подключение админки  
Библиотека поддерживает удобное управление уведомлениями через sqladmin. Подключи её в свой FastAPI-проект:
```sh
from sqladmin import Admin
from fastapi import FastAPI
from sqlalchemy import create_engine
from notifications.admin import register_library_admin

app = FastAPI()

DATABASE_URL = "postgresql://user:password@localhost/dbname"
engine = create_engine(DATABASE_URL)

admin = Admin(app, engine)

# Добавляем уведомления в админку вашего проекта
register_library_admin(admin)
```
Теперь в панели администратора можно управлять таблицами уведомлений.


🔹 3. Настройки уведомлений пользователей  
Прежде чем отправлять уведомления, нужно настроить их для пользователей.  
Для этого используются два метода:

✅ Создание общих настроек уведомлений для пользователя
```sh
from notifications.services import create_user_notification_settings
from notifications.schemas import UserNotificationSettingsCreate

async def setup_user_notifications(user_id: int):
    """Создаёт основные настройки уведомлений для пользователя."""
    settings_data = UserNotificationSettingsCreate(
        user_id=user_id,
        email_enabled=True,
        telegram_enabled=True,
        console_enabled=True
    )

    return await create_user_notification_settings(settings_data)
```
📌 Что делает этот метод?  
Включает Email, Telegram и консольные уведомления (можно изменить параметры).  
Если настройки уже существуют, вызовет ошибку.

✅ Настройка конкретных типов уведомлений для пользователя
```sh
from notifications.services import create_user_notification_type_settings
from notifications.schemas import UserNotificationTypeSettingsCreate

async def enable_specific_notification(user_id: int, notification_type_id: int):
    """Включает или отключает конкретный тип уведомлений для пользователя."""
    type_settings_data = UserNotificationTypeSettingsCreate(
        user_id=user_id,
        notification_type_id=notification_type_id,
        enabled=True  # Можно передавать False, если нужно отключить
    )

    return await create_user_notification_type_settings(type_settings_data)
```
📌 Как это работает?  
Позволяет управлять конкретными типами уведомлений (например, включить уведомления о заказах, но отключить о бонусах).  
Если настройки не существуют, создаётся новая запись.


🔹 4. Создание уведомлений  
Для создания нового уведомления в системе используй метод create_notification:
```sh
from notifications.services import create_notification
from notifications.schemas import NotificationCreate

async def send_new_order_notification(user_id: int, order_id: int, user_email: str = None, user_telegram_id: int = None):
    """Создаёт уведомление о новом заказе для пользователя."""
    notification_data = NotificationCreate(
        user_id=user_id,
        notification_type_id=1,  # ID типа уведомления, например, "NEW_ORDER"
        data={"order_id": order_id}
    )

    return await create_notification(
        notification_data=notification_data,
        user_email=user_email,
        user_telegram_id=user_telegram_id
    )
```
📌 Как это работает?

Передаём user_id, notification_type_id и data (словарь с динамическими параметрами для текста уведомления).  
Уведомление автоматически отправляется по Email и/или Telegram, если у пользователя включены соответствующие настройки и переданы user_email или user_telegram_id.  
Если пользовательские настройки не найдены, вызывается ошибка 404.


🔹 5. Тестирование библиотеки  
Библиотека уже содержит тесты, которые можно запустить с помощью pytest:
```sh
set PYTHONPATH=%CD% && set TEST_MODE=1 && pytest -v
```
📌 Как это работает?  
Перед тестированием создаётся отдельная тестовая база данных.  
После каждого теста база очищается, чтобы избежать конфликтов данных.

## 📢 Готово к использованию! 🚀
Теперь твой проект поддерживает гибкую систему уведомлений с возможностью интеграции в админку и кастомизации типов уведомлений.