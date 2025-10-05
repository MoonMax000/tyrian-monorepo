from typing import List, Optional
from loguru import logger
from sqlalchemy.future import select

from app.database import get_async_session_context
from app.models import (
    NotificationType,
    UserNotificationTypeSettings,
)
from app.schemas import (
    UserNotificationTypeSettingsCreate,
    UserNotificationTypeSettingsResponse,
)


async def create_user_notification_type_settings(
    type_settings_data: UserNotificationTypeSettingsCreate
) -> UserNotificationTypeSettingsResponse:
    '''Создает настройки по типу уведомления для пользователя.'''
    async with get_async_session_context() as session:
        type_setting = UserNotificationTypeSettings(
            user_id=type_settings_data.user_id,
            notification_type_id=type_settings_data.notification_type_id,
            enabled=type_settings_data.enabled,
        )
        session.add(type_setting)
        await session.commit()
        await session.refresh(type_setting)
        logger.info(f'Созданы настройки типа уведомления {type_setting.notification_type.code} '
                    f'для пользователя {type_setting.user_id}.')

        return UserNotificationTypeSettingsResponse(
            **type_setting.__dict__,
            notification_type_code=type_setting.notification_type.code,
        )


async def create_all_notification_type_settings(
        user_id: int
    ) -> List[UserNotificationTypeSettingsResponse]:
    '''Создает настройки по всем доступным типам уведомлений для пользователя.'''
    async with get_async_session_context() as session:
        result = await session.execute(select(NotificationType))
        notification_types = result.scalars().all()

        if not notification_types:
            logger.warning("Нет доступных типов уведомлений для создания.")
            return []

        created_settings = []
        for notification_type in notification_types:
            type_setting = UserNotificationTypeSettings(
                user_id=user_id,
                notification_type_id=notification_type.id,
            )
            session.add(type_setting)
            created_settings.append(
                UserNotificationTypeSettingsResponse(
                    **type_setting.__dict__,
                    notification_type_code=notification_type.code,
                )
            )

        await session.commit()
        logger.info(f'Созданы настройки уведомлений для пользователя {user_id} по всем типам.')

        return created_settings


async def update_user_notification_type_settings(
    user_id: int, notification_type_id: int, enabled: bool
) -> Optional[UserNotificationTypeSettingsResponse]:
    '''Обновляет поле enabled для указанного типа уведомления пользователя.'''
    async with get_async_session_context() as session:
        result = await session.execute(
            select(UserNotificationTypeSettings)
            .where(
                UserNotificationTypeSettings.user_id == user_id,
                UserNotificationTypeSettings.notification_type_id == notification_type_id,
            )
        )
        type_setting = result.scalars().first()

        if not type_setting:
            return None

        type_setting.enabled = enabled
        await session.commit()
        await session.refresh(type_setting)
        logger.info(f'Обновлено поле enabled для типа уведомления '
                    f'{type_setting.notification_type.code} пользователя {type_setting.user_id}.')

        return UserNotificationTypeSettingsResponse(
            **type_setting.__dict__,
            notification_type_code=type_setting.notification_type.code,
        )


async def get_user_notification_type_settings(
        user_id: int
    ) -> Optional[UserNotificationTypeSettingsResponse]:
    '''Получает настройки для типа уведомления пользователя.'''
    async with get_async_session_context() as session:
        result = await session.execute(
            select(UserNotificationTypeSettings)
            .where(UserNotificationTypeSettings.user_id == user_id)
        )
        settings = result.scalars().all()

        if not settings:
            return None

        return [
            UserNotificationTypeSettingsResponse(
                **setting.__dict__,
                notification_type_code=setting.notification_type.code,
            )
            for setting in settings
        ]


async def delete_user_notification_type_settings(user_id: int) -> bool:
    '''Удаляет настройки для типа уведомления пользователя.'''
    async with get_async_session_context() as session:
        result = await session.execute(
            select(UserNotificationTypeSettings)
            .where(UserNotificationTypeSettings.user_id == user_id)
        )
        settings = result.scalars().all()

        if not settings:
            return False

        for setting in settings:
            await session.delete(setting)
        await session.commit()
        logger.info(f'Удалены все настройки по типам уведомлений для пользователя {user_id}.')

        return True
