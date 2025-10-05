from typing import List, Optional
from loguru import logger
from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.future import select

from app.database import get_async_session_context
from app.models import (
    Notification,
    UserNotificationSettings,
    UserNotificationTypeSettings,
)
from app.schemas import (
    NotificationCreate,
    NotificationUpdate,
    NotificationResponse,
)
from app.utils import (
    render_notification_message,
    send_email_notification,
    send_telegram_notification,
)


async def create_notification(
        notification_data: NotificationCreate,
        user_email: Optional[str] = None,
        user_telegram_id: Optional[int] = None,
    ) -> NotificationResponse:
    '''Создание нового уведомления.'''
    async with get_async_session_context() as session:
        # Проверяем настройки пользователя
        result = await session.execute(
            select(UserNotificationSettings)
            .where(UserNotificationSettings.user_id == notification_data.user_id)
        )
        user_settings = result.scalars().first()

        if not user_settings:
            logger.error(
                f'Настройки уведомлений не найдены для пользователя: {notification_data.user_id}.'
            )
            raise HTTPException(
                status_code=404,
                detail='Настройки уведомлений не найдены. ' \
                       'Проверьте настройки уведомлений для текущего пользователя.',
            )

        notification = Notification(
            user_id=notification_data.user_id,
            notification_type_id=notification_data.notification_type_id,
            data=notification_data.data,
        )
        session.add(notification)
        await session.commit()
        await session.refresh(notification)
        logger.info(f'Создано новое уведомление для пользователя {notification.user_id}.')

        # Отправляем уведомление по почте, если включено и email передан
        if user_settings.email_enabled and user_email:
            await send_email_notification(notification, user_email)

        # Отправляем уведомление в Telegram, если включено и telegram_id передан
        if user_settings.telegram_enabled and user_telegram_id:
            await send_telegram_notification(notification, user_telegram_id)

        return NotificationResponse(
            **notification.__dict__,
            notification_type_code=notification.notification_type.code,
            notification_type_name=notification.notification_type.name,
            notification_text=render_notification_message(notification),
        )


async def get_notifications(user_id: int) -> List[NotificationResponse]:
    '''Получает список всех уведомлений пользователя.'''
    async with get_async_session_context() as session:
        # Получаем включенные типы уведомлений для пользователя
        query = select(UserNotificationTypeSettings).where(
            UserNotificationTypeSettings.user_id == user_id,
            UserNotificationTypeSettings.enabled is True,
        )
        result = await session.execute(query)
        allowed_types = {r.notification_type_id for r in result.scalars().all()}

        # Получаем уведомления только с разрешенными типами
        query = select(Notification).where(
            Notification.user_id == user_id,
            Notification.notification_type_id.in_(allowed_types),
        )
        result = await session.execute(query)
        notifications = result.scalars().all()

        return [
            NotificationResponse(
                **notification.__dict__,
                notification_type_code=notification.notification_type.code,
                notification_type_name=notification.notification_type.name,
                notification_text=render_notification_message(notification),
            )
            for notification in notifications
        ]


async def get_unread_notifications(user_id: int) -> List[NotificationResponse]:
    '''Получает непрочитанные уведомления пользователя.'''
    async with get_async_session_context() as session:
        # Получаем включенные типы уведомлений для пользователя
        query = select(UserNotificationTypeSettings).where(
            UserNotificationTypeSettings.user_id == user_id,
            UserNotificationTypeSettings.enabled is True,
        )
        result = await session.execute(query)
        allowed_types = {r.notification_type_id for r in result.scalars().all()}

        query = select(Notification).where(
            Notification.user_id == user_id,
            Notification.notification_type_id.in_(allowed_types),
            Notification.is_read is False,
        )
        result = await session.execute(query)
        notifications = result.scalars().all()

        return [
            NotificationResponse(
                **notification.__dict__,
                notification_type_code=notification.notification_type.code,
                notification_type_name=notification.notification_type.name,
                notification_text=render_notification_message(notification),
            )
            for notification in notifications
        ]


async def get_notification_by_id(notification_id: int) -> Optional[NotificationResponse]:
    '''Получает уведомление по ID.'''
    async with get_async_session_context() as session:
        result = await session.execute(
            select(Notification).where(Notification.id == notification_id)
        )
        notification = result.scalars().first()
        if notification:
            return NotificationResponse(
                **notification.__dict__,
                notification_type_code=notification.notification_type.code,
                notification_type_name=notification.notification_type.name,
                notification_text=render_notification_message(notification),
            )
        return None


async def update_notification(
        notification_id: int,
        update_data: NotificationUpdate
    ) -> Optional[NotificationResponse]:
    '''Обновляет уведомление по ID.'''
    async with get_async_session_context() as session:
        result = await session.execute(
            select(Notification).where(Notification.id == notification_id)
        )
        notification = result.scalars().first()

        if not notification:
            return None

        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(notification, key, value)

        await session.commit()
        await session.refresh(notification)
        logger.info(f'Уведомление {notification.id} успешно обновлено.')

        return NotificationResponse(
            **notification.__dict__,
            notification_type_code=notification.notification_type.code,
            notification_type_name=notification.notification_type.name,
            notification_text=render_notification_message(notification),
        )


async def delete_notification(notification_id: int) -> bool:
    '''Удаляет уведомление по ID.'''
    async with get_async_session_context() as session:
        result = await session.execute(
            select(Notification).where(Notification.id == notification_id)
        )
        notification = result.scalars().first()

        if not notification:
            return False

        await session.delete(notification)
        await session.commit()
        logger.info(f'Уведомление {notification_id} успешно удалено.')

        return True


async def mark_all_notifications_as_read(user_id: int) -> int:
    '''Отмечает все непрочитанные уведомления пользователя как прочитанные.'''
    async with get_async_session_context() as session:
        query = select(Notification).where(
            Notification.user_id == user_id,
            Notification.is_read is False,
        )
        result = await session.execute(query)
        notifications = result.scalars().all()

        for notification in notifications:
            notification.is_read = True

        await session.commit()
        logger.info(f'Все уведомления пользователя {user_id} отмечены как прочитанные.')

        return len(notifications)


async def mark_notification_as_read(notification_id: int) -> bool:
    '''Отмечает уведомление как прочитанное.'''
    async with get_async_session_context() as session:
        result = await session.execute(
            select(Notification).where(Notification.id == notification_id)
        )
        notification = result.scalars().first()

        if not notification:
            return False

        notification.is_read = True
        await session.commit()
        await session.refresh(notification)
        logger.info(f'Уведомлениe {notification.id} отмечено как прочитанное.')

        return True


async def get_notification_counts(user_id: int) -> dict:
    '''Возвращает количество всех и непрочитанных уведомлений пользователя.'''
    async with get_async_session_context() as session:
        total_count = await session.scalar(
            select(func.count()).where(Notification.user_id == user_id)
        )

        unread_count = await session.scalar(
            select(func.count()).where(
                Notification.user_id == user_id,
                Notification.is_read is False,
            )
        )

        return {"total_count": total_count, "unread_count": unread_count}
