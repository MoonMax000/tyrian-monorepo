import logging

from datetime import timedelta
from typing import Tuple

from rest_framework.response import Response # type: ignore

from django.utils import timezone # type: ignore
from django.conf import settings # type: ignore

from django_login_control.models import LoginEvent, LoginStatus, IpLockout, LockoutStatus
from django_login_control.tasks import release_ip_lockout

logger = logging.getLogger(__name__)


def is_ip_banned(ip_address: str) -> Tuple[bool, int]:
    '''
    Проверяет, заблокирован ли ip, и если да, то возвращает время до разблокировки.
    '''
    # Проверяем, есть ли уже активная блокировка
    if IpLockout.objects.filter(ip_address=ip_address, status=LockoutStatus.ACTIVE).exists():
        lockout = IpLockout.objects.filter(
            ip_address=ip_address, status=LockoutStatus.ACTIVE).last()
        return True, int(lockout.blocked_until.timestamp())

    return False, 0


def create_ip_lockout(ip_address: str) -> Tuple[IpLockout | None, int]:
    '''
    Создает блокировку пользователя, если превышен лимит неудачных попыток входа.
    Возвращает созданную блокировку или None, если блокировка не нужна + количество
    оставшихся до блокировки попыток.
    '''

    # Проверяем, есть ли уже активная блокировка
    if IpLockout.objects.filter(ip_address=ip_address, status=LockoutStatus.ACTIVE).exists():
        return None, 0

    # Получаем количество неудачных попыток за последний период
    wrong_attempts_duration = getattr(
        settings, 'WRONG_ATTEMPTS_DURATION', 3600)
    ip_wrong_attempts_number = getattr(settings, 'IP_WRONG_ATTEMPTS_NUMBER', 6)
    ip_ban_duration = getattr(settings, 'IP_BAN_DURATION', 600)

    failed_attempts = LoginEvent.objects.filter(
        status=LoginStatus.FAILED,
        ip_address=ip_address,
        timestamp__gte=timezone.now() - timedelta(seconds=wrong_attempts_duration),
    ).count()
    remaining_attempts = ip_wrong_attempts_number - \
        failed_attempts if failed_attempts < ip_wrong_attempts_number else 0

    # Если количество попыток превышает лимит, создаем блокировку
    if failed_attempts >= ip_wrong_attempts_number:
        blocked_until = timezone.now() + timedelta(seconds=ip_ban_duration)
        lockout = IpLockout.objects.create(
            ip_address=ip_address,
            blocked_until=blocked_until,
            status=LockoutStatus.ACTIVE
        )
        # TODO: send email to admin
        # send_ip_lockout_email.delay(lockout.id)
        release_ip_lockout.delay(lockout.id)
        return lockout, remaining_attempts

    return None, remaining_attempts
