'''
Модуль для инициализации FastAPI-приложения внутри библиотеки.
'''
from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.api.routes import api_router
from app.config import settings
from app.utils import initialize_notification_types


@asynccontextmanager
async def lifespan(app: FastAPI):
    '''Инициализация типов уведомлений при старте приложения.'''
    await initialize_notification_types()
    yield


def create_app() -> FastAPI:
    '''
    Функция создания FastAPI-приложения.

    Позволяет использовать библиотеку в качестве подключаемого модуля в других проектах.
    '''
    app = FastAPI(
        debug=settings.DEBUG,
        title=settings.PROJECT_NAME,
        lifespan=lifespan,
    )

    app.include_router(api_router)

    @app.get('/')
    async def root():
        '''Корневой эндпоинт для проверки работоспособности API.'''
        return {'message': 'Welcome to the Notifications Library API'}

    return app
