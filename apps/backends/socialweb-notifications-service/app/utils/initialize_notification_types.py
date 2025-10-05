from loguru import logger
from sqlalchemy.future import select

from app.database import get_async_session_context
from app.config import settings
from app.models import NotificationType


async def initialize_notification_types():
    '''Создаёт недостающие типы уведомлений из .env при запуске.'''
    async with get_async_session_context() as session:
        existing_types = await session.execute(select(NotificationType))
        existing_codes = {nt.code for nt in existing_types.scalars().all()}

        new_types = []
        for code, data in settings.notifications.NOTIFICATION_TYPES.items():
            if code not in existing_codes:
                new_types.append(NotificationType(
                    code=code,
                    name=data['name'],
                    default_text=data['default_text'],
                ))

        if new_types:
            session.add_all(new_types)
            await session.commit()
            logger.info(f'Добавлены новые типы уведомлений: {[nt.code for nt in new_types]}')
        else:
            logger.info('Все типы уведомлений уже созданы.')
