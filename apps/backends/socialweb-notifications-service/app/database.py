'''
Модуль для управления подключением к базе данных.
'''
import contextlib
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
    async_sessionmaker,
)
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from app.config import settings


# Асинхронный движок и фабрика сессий (FastAPI, асинхронные процессы)
engine_async = create_async_engine(
    settings.database.SQLALCHEMY_DATABASE_URI_ASYNC,
    pool_size=10,
    max_overflow=-1,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine_async,
    expire_on_commit=False,
    class_=AsyncSession,
    autoflush=False,
)

# Синхронный движок и фабрика сессий (миграции, фоновые процессы)
engine_sync = create_engine(
    settings.database.SQLALCHEMY_DATABASE_URI_SYNC
)

SessionLocalSync = sessionmaker(
    bind=engine_sync,
    expire_on_commit=False,
)

async def get_async_session() -> AsyncSession:
    '''Функция получения асинхронной сессии.'''
    async with AsyncSessionLocal() as session:
        yield session

def get_sync_session():
    '''Функция получения синхронной сессии.'''
    with SessionLocalSync() as session:
        yield session

# Контекстный менеджер для асинхронных сессий
get_async_session_context = contextlib.asynccontextmanager(get_async_session)
