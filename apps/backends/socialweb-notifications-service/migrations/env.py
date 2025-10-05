import importlib
import pkgutil
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool, create_engine, Table, Column, Integer, String

from app.base import Base
from app.config import settings


# Настройка логирования
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


def import_models():
    '''Загрузка моделей.'''
    import app.models
    package = app.models
    for _, module_name, _ in pkgutil.iter_modules(package.__path__):
        importlib.import_module(f"{package.__name__}.{module_name}")

import_models()

target_metadata = Base.metadata


def get_url():
    '''Получаем URL базы данных из конфигурации.'''
    return settings.database.SQLALCHEMY_DATABASE_URI_SYNC


def run_migrations_offline():
    '''Запуск миграций в оффлайн-режиме.'''
    context.configure(
        url=get_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    '''Запуск миграций в онлайн-режиме.'''
    connectable = create_engine(get_url(), poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
