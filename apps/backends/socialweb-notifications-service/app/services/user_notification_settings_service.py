from typing import Optional
from loguru import logger
from sqlalchemy.future import select

from app.database import get_async_session_context
from app.models import UserNotificationSettings
from app.schemas import (
    UserNotificationSettingsCreate,
    UserNotificationSettingsUpdate,
    UserNotificationSettingsResponse,
)


async def create_user_notification_settings(
    settings_data: UserNotificationSettingsCreate
) -> UserNotificationSettingsResponse:
    '''Создает настройки уведомлений для пользователя.'''
    async with get_async_session_context() as session:
        settings = UserNotificationSettings(
            user_id=settings_data.user_id,
            email_enabled=settings_data.email_enabled,
            telegram_enabled=settings_data.telegram_enabled,
            console_enabled=settings_data.console_enabled,
        )
        session.add(settings)
        await session.commit()
        await session.refresh(settings)
        logger.info(f'Созданы настройки уведомлений для пользователя {settings.user_id}.')

        return UserNotificationSettingsResponse.from_orm(settings)


async def update_user_notification_settings(
    user_id: int, update_data: UserNotificationSettingsUpdate
) -> Optional[UserNotificationSettingsResponse]:
    '''Обновляет настройки уведомлений пользователя.'''
    async with get_async_session_context() as session:
        result = await session.execute(
            select(UserNotificationSettings).where(UserNotificationSettings.user_id == user_id)
        )
        settings = result.scalars().first()

        if not settings:
            return None

        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(settings, key, value)

        await session.commit()
        await session.refresh(settings)
        logger.info(f'Обновлены настройки уведомлений для пользователя {settings.user_id}.')

        return UserNotificationSettingsResponse.from_orm(settings)


async def get_user_notification_settings(user_id: int) -> Optional[UserNotificationSettingsResponse]:
    '''Получает настройки уведомлений пользователя.'''
    async with get_async_session_context() as session:
        result = await session.execute(
            select(UserNotificationSettings).where(UserNotificationSettings.user_id == user_id)
        )
        settings = result.scalars().first()

        if not settings:
            return None

        return UserNotificationSettingsResponse.from_orm(settings)


async def delete_user_notification_settings(user_id: int) -> bool:
    '''Удаляет настройки уведомлений пользователя.'''
    async with get_async_session_context() as session:
        result = await session.execute(
            select(UserNotificationSettings).where(UserNotificationSettings.user_id == user_id)
        )
        settings = result.scalars().first()

        if not settings:
            return False

        await session.delete(settings)
        await session.commit()
        logger.info(f'Удалены настройки уведомлений для пользователя {user_id}.')

        return True
