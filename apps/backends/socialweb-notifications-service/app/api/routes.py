from fastapi import APIRouter
from app.api import (
    notification_router,
    notification_type_router,
    user_notification_settings_router,
    user_notification_type_settings_router,
)


api_router = APIRouter(prefix="/notifications")

# Подключаем маршруты уведомлений
api_router.include_router(
    notification_router, prefix='', tags=['Уведомления']
)
api_router.include_router(
    notification_type_router, prefix='/types', tags=['Типы уведомлений']
)
api_router.include_router(
    user_notification_settings_router,
    prefix='/settings',
    tags=['Настройки по способу отправки уведомлений пользователям'],
)
api_router.include_router(
    user_notification_type_settings_router,
    prefix='/type-settings',
    tags=['Настройки по типам уведомлений для пользователей'],
)
