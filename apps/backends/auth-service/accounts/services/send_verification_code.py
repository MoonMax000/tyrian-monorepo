import random
import os
import logging
import secrets

from celery import shared_task # type: ignore

from django.core.mail import send_mail # type: ignore
from django.conf import settings # type: ignore
from django.core.cache import cache # type: ignore


logger = logging.getLogger(__name__)


two_fa_timeout = os.getenv('TWO_FA_CODE_TTL', 15*60)


@shared_task
def send_verification_code(email: str) -> str:

    # Генерируем криптографически сильный код верификации
    # https://docs.python.org/3/library/secrets.html#module-secrets

    code = str(secrets.randbelow(1000000)).zfill(6)
    
    # Сохраняем код в кэш
    cache.set(f'2fa_code_{email}', code, timeout=two_fa_timeout)
    
    # Отправляем email
    send_mail(
        '2FA код',
        f'Ваш код 2FA: {code}',
        settings.DEFAULT_FROM_EMAIL,
        [email],
    )
    
    logger.info(f"Two-factor authentication code sent to {email}")
    return code
