import os
import pytest
import psycopg2
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker

from app.base import Base
from app.database import get_async_session
from app.main import create_app
from app.models import (
    Notification,
    NotificationType,
    UserNotificationSettings,
    UserNotificationTypeSettings,
)

# URL тестовой базы
TEST_DATABASE_NAME = f"{os.getenv('POSTGRES_DB')}_test"
TEST_DATABASE_URL = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_SERVER')}/{TEST_DATABASE_NAME}"

# Создаём подключение
engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class User(Base):
    '''Тестовая модель пользователей.'''
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=True)
    telegram_id = Column(Integer, unique=True, nullable=True)


def create_test_database():
    '''Создаёт тестовую базу, если она не существует.'''
    connection = psycopg2.connect(
        dbname='postgres',
        user=os.getenv('POSTGRES_USER'),
        password=os.getenv('POSTGRES_PASSWORD'),
        host=os.getenv('POSTGRES_SERVER'),
    )
    connection.autocommit = True
    cursor = connection.cursor()

    cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{TEST_DATABASE_NAME}';")
    exists = cursor.fetchone()

    if not exists:
        print(f'Создаём тестовую базу {TEST_DATABASE_NAME}...')
        cursor.execute(f'CREATE DATABASE {TEST_DATABASE_NAME};')
    else:
        print(f'Тестовая база {TEST_DATABASE_NAME} уже существует.')

    cursor.close()
    connection.close()


def drop_test_database():
    '''Удаляет тестовую базу после тестов.'''
    connection = psycopg2.connect(
        dbname='postgres',
        user=os.getenv('POSTGRES_USER'),
        password=os.getenv('POSTGRES_PASSWORD'),
        host=os.getenv('POSTGRES_SERVER'),
    )
    connection.autocommit = True
    cursor = connection.cursor()

    print(f'Удаляем тестовую базу {TEST_DATABASE_NAME}...')
    cursor.execute(f'DROP DATABASE {TEST_DATABASE_NAME} WITH (FORCE);')

    cursor.close()
    connection.close()


@pytest.fixture(scope='session', autouse=True)
def setup_test_db():
    '''Создает тестовую базу перед тестами и удаляет после.'''
    create_test_database()
    Base.metadata.create_all(bind=engine)
    yield
    drop_test_database()


@pytest.fixture(scope='module')
def db():
    '''Создает новую сессию для тестов.'''
    session = TestingSessionLocal()
    print(f"🔍 Подключение сессии: {session.bind.url}")
    yield session
    session.commit()
    session.close()


@pytest.fixture(scope='function', autouse=True)
def clean_db(db):
    '''Перед каждым тестом удаляет все записи в базе.'''
    print("Очистка базы данных перед тестом...")
    for table in reversed(Base.metadata.sorted_tables):
        db.execute(table.delete())
    db.commit()
    print("База данных очищена!")


@pytest.fixture(scope="module")
def client(db):
    """Фикстура для тестирования API через TestClient с общей сессией"""
    app = create_app()

    async def override_get_db():
        yield db

    app.dependency_overrides[get_async_session] = override_get_db

    with TestClient(app) as client:
        yield client

    app.dependency_overrides.clear()


@pytest.fixture
def create_user(db):
    '''Фикстура для создания тестового пользователя.'''
    user = User(username='testuser', email='artem.gotlib@mail.ru', telegram_id=317817935)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def create_notification_type(db):
    '''Фикстура для создания типа уведомления.'''
    notif_type = NotificationType(
        code='LIKE_RECEIVED',
        name='Like Received',
        default_text='You have {{ like_count }} new likes!',
    )
    db.add(notif_type)
    db.commit()
    db.refresh(notif_type)
    print(f"✅ Создан тип уведомлений: {notif_type.code} (ID: {notif_type.id})")
    return notif_type


@pytest.fixture
def create_user_settings(db, create_user):
    '''Фикстура для создания настроек уведомлений пользователя.'''
    user_settings = UserNotificationSettings(
        user_id=create_user.id,
        email_enabled=True,
        telegram_enabled=False,
        console_enabled=True,
    )
    db.add(user_settings)
    db.commit()
    db.refresh(user_settings)
    return user_settings


@pytest.fixture
def create_user_notification_type_settings(db, create_user_settings, create_notification_type):
    '''Фикстура для создания пользовательских настроек типов уведомлений.'''
    user_notif_type_settings = UserNotificationTypeSettings(
        user_id=create_user_settings.user_id,
        notification_type_id=create_notification_type.id,
        enabled=True,
    )
    db.add(user_notif_type_settings)
    db.commit()
    db.refresh(user_notif_type_settings)
    return user_notif_type_settings


@pytest.fixture
def create_notification(db, create_notification_type, create_user):
    '''Фикстура для создания уведомления.'''
    notification = Notification(
        user_id=create_user.id,
        notification_type_id=create_notification_type.id,
        data={'like_count': 5},
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
