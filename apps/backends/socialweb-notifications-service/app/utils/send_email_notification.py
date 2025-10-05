from fastapi_mail import (
    FastMail,
    MessageSchema,
    ConnectionConfig,
)
from jinja2 import Template
from pydantic import EmailStr
from loguru import logger

from app.config import settings
from app.models import Notification
from app.utils import render_notification_message


# Конфигурация почтового сервера
conf = ConnectionConfig(
    MAIL_USERNAME=settings.email.SMTP_USERNAME,
    MAIL_PASSWORD=settings.email.SMTP_PASSWORD,
    MAIL_FROM=settings.email.SMTP_FROM_EMAIL,
    MAIL_PORT=settings.email.SMTP_PORT,
    MAIL_SERVER=settings.email.SMTP_HOST,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=settings.email.SMTP_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)


async def send_email_notification(notification: Notification, user_email: EmailStr):
    '''Отправляет уведомление по электронной почте через FastMail.'''
    if not settings.email.SMTP_HOST or not settings.email.SMTP_PORT:
        logger.warning('SMTP настройки отсутствуют. Отправка Email невозможна.')
        return

    if not user_email:
        logger.warning(f'Не указан email для пользователя {notification.user_id}.')
        return

    try:
        message_text = render_notification_message(notification)

        email_template = Template(
            '<html><body><h3>Уведомление</h3><p>{{ message }}</p></body></html>'
        )
        html_content = email_template.render(message=message_text)

        # Формирование сообщения
        message = MessageSchema(
            subject=f'Уведомление: {notification.notification_type.name}',
            recipients=[user_email],
            body=html_content,
            subtype='html',
        )

        # Отправка сообщения
        mail = FastMail(conf)
        await mail.send_message(message)

        logger.info(f'Уведомление отправлено по Email пользователю '
                    f'{notification.user_id} ({user_email}).')

    except Exception as e:
        logger.error(f'Ошибка при отправке email уведомления пользователю '
                     f'{notification.user_id}: {e}')
