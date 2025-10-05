from typing import Optional
from fastapi import APIRouter, HTTPException

from app.schemas import (
    UserNotificationSettingsCreate,
    UserNotificationSettingsUpdate,
    UserNotificationSettingsResponse,
)
from app.services.user_notification_settings_service import (
    create_user_notification_settings,
    update_user_notification_settings,
    get_user_notification_settings,
    delete_user_notification_settings,
)


user_notification_settings_router = APIRouter()


@user_notification_settings_router.post(
    '/',
    response_model=UserNotificationSettingsResponse,
    summary='Создание настроек уведомлений для пользователя',
)
async def create_user_notification_settings_endpoint(settings_data: UserNotificationSettingsCreate):
    '''
    **Создает настройки уведомлений для пользователя.**
    
    - `user_id`: ID пользователя
    - `email_enabled`: Включены ли уведомления по Email
    - `telegram_enabled`: Включены ли уведомления в Telegram
    - `console_enabled`: Включены ли уведомления в консоли
    '''
    return await create_user_notification_settings(settings_data)


@user_notification_settings_router.put(
    '/{user_id}',
    response_model=Optional[UserNotificationSettingsResponse],
    summary='Обновление настроек уведомлений пользователя',
)
async def update_user_notification_settings_endpoint(
        user_id: int,
        update_data: UserNotificationSettingsUpdate,
    ):
    '''
    **Обновляет настройки уведомлений пользователя.**
    
    - `user_id`: ID пользователя
    - `update_data`: Данные для обновления настройки уведомлений пользователя
    '''
    updated_settings = await update_user_notification_settings(user_id, update_data)
    if not updated_settings:
        raise HTTPException(status_code=404, detail='Настройки уведомлений не найдены.')
    return updated_settings


@user_notification_settings_router.get(
    '/{user_id}',
    response_model=Optional[UserNotificationSettingsResponse],
    summary='Получение настроек уведомлений пользователя',
)
async def get_user_notification_settings_endpoint(user_id: int):
    '''
    **Возвращает настройки уведомлений пользователя.**
    
    - `user_id`: ID пользователя
    '''
    settings = await get_user_notification_settings(user_id)
    if not settings:
        raise HTTPException(status_code=404, detail='Настройки уведомлений не найдены.')
    return settings


@user_notification_settings_router.delete(
    '/{user_id}',
    response_model=bool,
    summary='Удаление настроек уведомлений пользователя',
)
async def delete_user_notification_settings_endpoint(user_id: int):
    '''
    **Удаляет настройки уведомлений пользователя.**
    
    - `user_id`: ID пользователя
    '''
    if not await delete_user_notification_settings(user_id):
        raise HTTPException(status_code=404, detail='Настройки уведомлений не найдены.')
    return True
