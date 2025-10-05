from typing import List, Optional
from loguru import logger
from sqlalchemy.future import select

from app.database import get_async_session_context
from app.models import NotificationType
from app.schemas import (
    NotificationTypeCreate,
    NotificationTypeUpdate,
    NotificationTypeResponse,
)


async def create_notification_type(type_data: NotificationTypeCreate) -> NotificationTypeResponse:
    '''Создает новый тип уведомлений.'''
    async with get_async_session_context() as session:
        notification_type = NotificationType(
            code=type_data.code,
            name=type_data.name,
            default_text=type_data.default_text,
            is_active=type_data.is_active,
        )
        session.add(notification_type)
        await session.commit()
        await session.refresh(notification_type)
        logger.info(f'Создан новый тип уведомлений: {notification_type.code}.')

        return NotificationTypeResponse.from_orm(notification_type)


async def update_notification_type(
        notification_type_id: Optional[int] = None,
        notification_type_code: Optional[str] = None,
        update_data: NotificationTypeUpdate = None,
    ) -> Optional[NotificationTypeResponse]:
    '''Обновляет тип уведомлений по ID или коду.'''
    if not notification_type_id and not notification_type_code:
        logger.warning("Не переданы идентификаторы для обновления типа уведомлений.")
        return None

    async with get_async_session_context() as session:
        query = select(NotificationType)
        if notification_type_id:
            query = query.where(NotificationType.id == notification_type_id)
        elif notification_type_code:
            query = query.where(NotificationType.code == notification_type_code)

        result = await session.execute(query)
        notification_type = result.scalars().first()

        if not notification_type:
            return None

        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(notification_type, key, value)

        await session.commit()
        await session.refresh(notification_type)
        logger.info(f'Обновлен тип уведомлений: {notification_type.code}.')

        return NotificationTypeResponse.from_orm(notification_type)


async def delete_notification_type(
        notification_type_id: Optional[int] = None,
        notification_type_code: Optional[str] = None,
    ) -> bool:
    '''Удаляет тип уведомлений по ID или коду.'''
    if not notification_type_id and not notification_type_code:
        logger.warning("Не переданы идентификаторы для удаления типа уведомлений.")
        return False

    async with get_async_session_context() as session:
        query = select(NotificationType)
        if notification_type_id:
            query = query.where(NotificationType.id == notification_type_id)
        elif notification_type_code:
            query = query.where(NotificationType.code == notification_type_code)

        result = await session.execute(query)
        notification_type = result.scalars().first()

        if not notification_type:
            return False

        await session.delete(notification_type)
        await session.commit()
        logger.info(f'Удален тип уведомлений: {notification_type.code}.')

        return True


async def get_notification_type(
        notification_type_id: Optional[int] = None,
        notification_type_code: Optional[str] = None,
    ) -> Optional[NotificationTypeResponse]:
    '''Получает тип уведомлений по ID или коду.'''
    if not notification_type_id and not notification_type_code:
        logger.warning("Не переданы идентификаторы для получения типа уведомлений.")
        return None

    async with get_async_session_context() as session:
        query = select(NotificationType)
        if notification_type_id:
            query = query.where(NotificationType.id == notification_type_id)
        elif notification_type_code:
            query = query.where(NotificationType.code == notification_type_code)

        result = await session.execute(query)
        notification_type = result.scalars().first()

        if not notification_type:
            return None

        return NotificationTypeResponse.from_orm(notification_type)


async def get_all_notification_types() -> List[NotificationTypeResponse]:
    '''Получает все типы уведомлений.'''
    async with get_async_session_context() as session:
        result = await session.execute(select(NotificationType))
        notification_types = result.scalars().all()

        return [
            NotificationTypeResponse.from_orm(notification_type)
            for notification_type in notification_types
        ]
