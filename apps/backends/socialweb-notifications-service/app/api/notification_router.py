from typing import List, Optional
from fastapi import APIRouter, HTTPException
from app.schemas import (
    NotificationCreate,
    NotificationUpdate,
    NotificationResponse,
)
from app.services.notification_service import (
    create_notification,
    get_notifications,
    get_unread_notifications,
    get_notification_by_id,
    update_notification,
    delete_notification,
    mark_all_notifications_as_read,
    mark_notification_as_read,
    get_notification_counts,
)


notification_router = APIRouter()


@notification_router.post(
    '/',
    response_model=NotificationResponse,
    summary='Создание нового уведомления',
)
async def create_notification_endpoint(
    notification_data: NotificationCreate,
    user_email: Optional[str] = None,
    user_telegram_id: Optional[int] = None,
):
    '''
    **Создает новое уведомление.**

    - `notification_data`: Данные для создания уведомления
    - `user_email`: (опционально) Email пользователя, на который отправляется уведомление
    - `user_telegram_id`: (опционально) Telegram ID пользователя,
    если уведомление должно быть отправлено в Telegram
    '''
    return await create_notification(notification_data, user_email, user_telegram_id)


@notification_router.get(
    '/',
    response_model=List[NotificationResponse],
    summary='Получение всех уведомлений пользователя',
)
async def get_all_notifications(user_id: int):
    '''
    **Возвращает список всех уведомлений пользователя.**

    - `user_id`: ID пользователя, для которого запрашиваются уведомления
    '''
    return await get_notifications(user_id)


@notification_router.get(
    '/unread',
    response_model=List[NotificationResponse],
    summary='Получение непрочитанных уведомлений пользователя',
)
async def get_unread_notifications_endpoint(user_id: int):
    '''
    **Возвращает список непрочитанных уведомлений пользователя.**

    - `user_id`: ID пользователя
    '''
    return await get_unread_notifications(user_id)


@notification_router.get(
    '/{notification_id}',
    response_model=Optional[NotificationResponse],
    summary='Получение уведомления по ID',
)
async def get_notification_by_id_endpoint(notification_id: int):
    '''
    **Возвращает конкретное уведомление по его ID.**

    - `notification_id`: ID уведомления
    '''
    notification = await get_notification_by_id(notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail='Уведомление не найдено.')
    return notification


@notification_router.put(
    '/{notification_id}',
    response_model=Optional[NotificationResponse],
    summary='Обновление уведомления',
)
async def update_notification_endpoint(notification_id: int, update_data: NotificationUpdate):
    '''
    **Обновляет существующее уведомление.**

    - `notification_id`: ID уведомления
    - `update_data`: Данные для обновления уведомления
    '''
    updated_notification = await update_notification(notification_id, update_data)
    if not updated_notification:
        raise HTTPException(status_code=404, detail='Уведомление не найдено.')
    return updated_notification


@notification_router.delete(
    '/{notification_id}',
    response_model=bool,
    summary='Удаление уведомления по ID',
)
async def delete_notification_endpoint(notification_id: int):
    '''
    **Удаляет уведомление по ID.**

    - `notification_id`: ID уведомления
    '''
    if not await delete_notification(notification_id):
        raise HTTPException(status_code=404, detail='Уведомление не найдено.')
    return True


@notification_router.post(
    '/mark_all_read',
    response_model=int,
    summary='Отметка всех уведомлений как прочитанные',
)
async def mark_all_notifications_as_read_endpoint(user_id: int):
    '''
    **Отмечает все уведомления пользователя как прочитанные.**

    - `user_id`: ID пользователя
    '''
    return await mark_all_notifications_as_read(user_id)


@notification_router.post(
    '/{notification_id}/mark_read',
    response_model=bool,
    summary='Отметка уведомления как прочитанное',
)
async def mark_notification_as_read_endpoint(notification_id: int):
    '''
    **Отмечает конкретное уведомление как прочитанное.**

    - `notification_id`: ID уведомления
    '''
    return await mark_notification_as_read(notification_id)


@notification_router.get(
    '/count',
    response_model=dict,
    summary='Получение количества всех и непрочитанных уведомлений',
)
async def get_notification_counts_endpoint(user_id: int):
    '''
    **Возвращает количество всех уведомлений и количество непрочитанных.**

    - `user_id`: ID пользователя
    '''
    return await get_notification_counts(user_id)
