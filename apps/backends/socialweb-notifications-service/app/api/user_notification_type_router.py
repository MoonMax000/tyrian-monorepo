from typing import List, Optional
from fastapi import APIRouter, HTTPException

from app.schemas import (
    UserNotificationTypeSettingsCreate,
    UserNotificationTypeSettingsResponse,
)
from app.services import (
    create_user_notification_type_settings,
    create_all_notification_type_settings,
    update_user_notification_type_settings,
    get_user_notification_type_settings,
    delete_user_notification_type_settings,
)


user_notification_type_settings_router = APIRouter()


@user_notification_type_settings_router.post(
    '/',
    response_model=UserNotificationTypeSettingsResponse,
    summary='Создание настроек по типам уведомлений для пользователя',
)
async def create_user_notification_type_settings_endpoint(
        type_settings_data: UserNotificationTypeSettingsCreate,
    ):
    '''
    **Создает настройки по типам уведомлений для пользователя.**
    
    - `user_id`: ID пользователя
    - `notification_type_id`: ID типа уведомления
    - `enabled`: Включено ли уведомление данного типа
    '''
    return await create_user_notification_type_settings(type_settings_data)


@user_notification_type_settings_router.post(
    '/{user_id}/initialize',
    response_model=List[UserNotificationTypeSettingsResponse],
    summary='Создание настроек уведомлений для пользователя по всем доступным типам',
)
async def create_all_user_notification_type_settings_endpoint(user_id: int):
    '''
    **Создает настройки уведомлений для пользователя по всем доступным типам.**
    
    - `user_id`: ID пользователя
    '''
    return await create_all_notification_type_settings(user_id)


@user_notification_type_settings_router.put(
    '/{user_id}/{notification_type_id}',
    response_model=Optional[UserNotificationTypeSettingsResponse],
    summary='Обновление статуса включения уведомления для пользователя',
)
async def update_user_notification_type_settings_endpoint(
        user_id: int,
        notification_type_id: int,
        enabled: bool,
    ):
    '''
    **Обновляет поле enabled для указанного типа уведомлений пользователя.**
    
    - `user_id`: ID пользователя
    - `notification_type_id`: ID типа уведомления
    - `enabled`: Включено ли уведомление
    '''
    updated_setting = await update_user_notification_type_settings(
        user_id, notification_type_id, enabled
    )
    if not updated_setting:
        raise HTTPException(status_code=404, detail='Настройки уведомлений не найдены.')
    return updated_setting


@user_notification_type_settings_router.get(
    '/{user_id}',
    response_model=List[UserNotificationTypeSettingsResponse],
    summary='Получение настроек по типам уведомлений пользователя',
)
async def get_user_notification_type_settings_endpoint(user_id: int):
    '''
    **Возвращает настройки по типам уведомлений пользователя.**
    
    - `user_id`: ID пользователя
    '''
    settings = await get_user_notification_type_settings(user_id)
    if not settings:
        raise HTTPException(status_code=404, detail='Настройки уведомлений не найдены.')
    return settings


@user_notification_type_settings_router.delete(
    '/{user_id}',
    response_model=bool,
    summary='Удаление всех настроек по типам уведомлений пользователя',
)
async def delete_user_notification_type_settings_endpoint(user_id: int):
    '''
    **Удаляет все настройки по типам уведомлений пользователя.**
    
    - `user_id`: ID пользователя
    '''
    if not await delete_user_notification_type_settings(user_id):
        raise HTTPException(status_code=404, detail='Настройки уведомлений не найдены.')
    return True
