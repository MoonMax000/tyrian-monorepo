from typing import List, Optional
from fastapi import APIRouter, HTTPException
from app.schemas import (
    NotificationTypeCreate,
    NotificationTypeUpdate,
    NotificationTypeResponse,
)
from app.services import (
    create_notification_type,
    update_notification_type,
    delete_notification_type,
    get_notification_type,
    get_all_notification_types,
)

notification_type_router = APIRouter()


@notification_type_router.post(
    '/',
    response_model=NotificationTypeResponse,
    summary='Создание нового типа уведомлений',
)
async def create_notification_type_endpoint(type_data: NotificationTypeCreate):
    '''
    **Создает новый тип уведомлений.**

    - `code`: Уникальный код типа уведомления
    - `name`: Название типа уведомления
    - `default_text`: Шаблон текста уведомления по умолчанию
    - `is_active`: Флаг активности уведомления
    '''
    return await create_notification_type(type_data)


@notification_type_router.put(
    '/',
    response_model=Optional[NotificationTypeResponse],
    summary='Обновление типа уведомлений'
)
async def update_notification_type_endpoint(
    id: Optional[int] = None,
    code: Optional[str] = None,
    update_data: NotificationTypeUpdate = None
):
    '''
    **Обновляет тип уведомлений по ID или коду.**

    - Укажите либо `id`, либо `code` типа уведомления
    - Передайте `update_data` с изменяемыми полями
    '''
    updated_type = await update_notification_type(
        notification_type_id=id,
        notification_type_code=code,
        update_data=update_data,
    )
    if not updated_type:
        raise HTTPException(
            status_code=404,
            detail='Данные для обновления типа уведомления не были переданы.'
        )
    return updated_type


@notification_type_router.delete('/', response_model=bool, summary='Удаление типа уведомлений')
async def delete_notification_type_endpoint(
    id: Optional[int] = None,
    code: Optional[str] = None
):
    '''
    **Удаляет тип уведомлений по ID или коду.**

    - Укажите либо `id`, либо `code` типа уведомления
    '''
    if not await delete_notification_type(
        notification_type_id=id,
        notification_type_code=code,
    ):
        raise HTTPException(status_code=404, detail='Тип уведомлений не найден.')
    return True


@notification_type_router.get(
    '/',
    response_model=List[NotificationTypeResponse],
    summary='Получение всех типов уведомлений',
)
async def get_all_notification_types_endpoint():
    '''
    **Возвращает список всех типов уведомлений.**
    '''
    return await get_all_notification_types()


@notification_type_router.get(
    '/single',
    response_model=Optional[NotificationTypeResponse],
    summary='Получение типа уведомлений по ID или коду',
)
async def get_notification_type_endpoint(
    id: Optional[int] = None,
    code: Optional[str] = None
):
    '''
    **Возвращает тип уведомления по ID или коду.**

    - Укажите `id` или `code` типа уведомления
    '''
    if not id and not code:
        raise HTTPException(status_code=400, detail="Необходимо передать либо id, либо code.")

    notification_type = await get_notification_type(
        notification_type_id=id,
        notification_type_code=code,
    )

    if not notification_type:
        raise HTTPException(status_code=404, detail="Тип уведомлений не найден.")

    return notification_type
