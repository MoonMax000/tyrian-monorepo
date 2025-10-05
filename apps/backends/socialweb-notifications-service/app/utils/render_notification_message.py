from loguru import logger
from jinja2 import Template, TemplateSyntaxError

from app.models import Notification


def render_notification_message(notification: Notification) -> str:
    '''Рендеринг сообщения уведомления с подстановкой данных.'''
    try:
        template = Template(notification.notification_type.default_text)
        return template.render(**(notification.data or {}))
    except TemplateSyntaxError as error:
        logger.error(f'Ошибка рендеринга шаблона уведомления: {error}')
        return notification.notification_type.default_text
