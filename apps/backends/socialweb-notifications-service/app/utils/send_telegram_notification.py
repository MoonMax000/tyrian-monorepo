import json
import aiohttp
from loguru import logger

from app.config import settings
from app.models import Notification
from app.utils import render_notification_message


async def send_telegram_notification(notification: Notification, telegram_chat_id: str):
    '''Отправляет уведомление в Telegram.'''
    if not settings.telegram.TELEGRAM_TOKEN:
        logger.warning('TELEGRAM_TOKEN отсутствует. Отправка Telegram уведомлений невозможна.')
        return

    if not telegram_chat_id:
        logger.warning(f'Не указан Telegram ID для пользователя {notification.user_id}.')
        return

    try:
        message_text = render_notification_message(notification)
        telegram_url = f'https://api.telegram.org/bot{settings.telegram.TELEGRAM_TOKEN}/sendMessage'

        async with aiohttp.ClientSession() as session:
            payload = {
                'chat_id': telegram_chat_id,
                'text': message_text,
                'parse_mode': 'HTML'
            }
            async with session.post(
                telegram_url, data=json.dumps(payload), headers={'Content-Type': 'application/json'}
            ) as response:
                response_data = await response.json()

                if response.status != 200 or not response_data.get('ok'):
                    logger.error(f'Ошибка при отправке Telegram уведомления: {response_data}')
                else:
                    logger.info(f'Уведомление отправлено в Telegram пользователю '
                                f'{notification.user_id} ({telegram_chat_id}).')

    except Exception as e:
        logger.error(f'Ошибка при отправке Telegram уведомления '
                     f'пользователю {notification.user_id}: {e}')
