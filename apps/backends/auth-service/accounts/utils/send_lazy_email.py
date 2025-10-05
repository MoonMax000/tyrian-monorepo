import logging

from celery import shared_task # type: ignore

from django.core.mail import send_mail # type: ignore
from django.conf import settings # type: ignore


logger = logging.getLogger(__name__)


@shared_task
def send_lazy_email(subject: str, message: str, to_email: str) -> None:
    """Отправляет email в фоновом режиме"""
    
    # Отправляем email
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [to_email],
    )
    
    logger.info(f"Lazy Email sent to {to_email}")
