import secrets
import logging

from django.core.mail import send_mail # type: ignore
from django.conf import settings 
from django.core.cache import cache # type: ignore

from ..utils import send_lazy_email, seconds_to_human_readable


logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self, email: str):
        self.email = email

    def send(self, subject: str, body: str):
        send_mail(
            subject,
            body,
            settings.DEFAULT_FROM_EMAIL,
            [self.email],
        )

    def get_verification_code(self) -> str:
        """Генерирует криптографически сильный код верификации"""
        return str(secrets.randbelow(1000000)).zfill(6)

    def send_email_verification(self, keep_in_cache: bool = True) -> str:
        """Отправляет код верификации почты на указанный email"""
        code = self.get_verification_code()
        
        # Сохраняем код в кэш
        if keep_in_cache:
            cache.set(f'verify_code_{self.email}', code, timeout=settings.EMAIL_VERIFICATION_TOKEN_TTL)

        self.send(
            'Верификация email',
            f'Ваш код верификации: {code}',
        )

        return code

    def send_email_change_verification(self, new_email: str = None, keep_in_cache: bool = True) -> str:
        """Отправляет код верификации для изменения почты на указанный email"""
        code = self.get_verification_code()
        if not new_email:
            raise ValueError('New email is required')
            
        # Сохраняем код в кэш
        if keep_in_cache:
            cache.set(f'change_email_verify_code_{self.email}', code, timeout=settings.EMAIL_CHANGE_TOKEN_TTL)

        self.send(
            'Email Change Verification',
            f'Your confirmation code for changing your email to {new_email}: {code}',

        )

        return code

    def send_account_deletion_notification(self) -> None:
        """Отправляет уведомление об удалении аккаунта на email пользователя"""

        human_readable_time = seconds_to_human_readable(settings.USER_DELETION_TIMEOUT_IN_SECONDS)
        send_lazy_email.delay(
            'Attention! Your account will be deleted!',
            f'You can restore your account within {human_readable_time}',
            self.email,
        )
