import logging

from datetime import timedelta
from typing import Tuple

from rest_framework.response import Response # type: ignore

from django.utils import timezone # type: ignore
from django.conf import settings # type: ignore

from django_login_control.models import LoginEvent, LoginStatus, UserLockout, LockoutStatus
from django_login_control.tasks import send_user_lockout_email, release_user_lockout
from responses import InvalidCredentialsResponse, IpBlockedResponse, AccountLockedResponse

from django_login_control.tasks import log_login_event

from .ip_lockout_service import is_ip_banned, create_ip_lockout


logger = logging.getLogger(__name__)


def is_user_banned(user) -> Tuple[bool, int]:
    '''
    Проверяет, заблокирован ли пользователь, и если да, то возвращает время до разблокировки.
    '''
    if not user.is_active:
        return True, 0

    # Проверяем, есть ли уже активная блокировка
    if UserLockout.objects.filter(user=user, status=LockoutStatus.ACTIVE).exists():
        lockout = UserLockout.objects.filter(
            user=user, status=LockoutStatus.ACTIVE).last()
        return True, int(lockout.blocked_until.timestamp())

    return False, 0


def create_user_lockout(user) -> Tuple[UserLockout | None, int]:
    '''
    Создает блокировку пользователя, если превышен лимит неудачных попыток входа.
    Возвращает созданную блокировку или None, если блокировка не нужна + количество
    оставшихся до блокировки попыток.
    '''

    # Проверяем, есть ли уже активная блокировка
    if UserLockout.objects.filter(user=user, status=LockoutStatus.ACTIVE).exists():
        return None, 0

    # Получаем количество неудачных попыток за последний период
    wrong_attempts_duration = getattr(
        settings, 'WRONG_ATTEMPTS_DURATION', 3600)
    wrong_attempts_number = getattr(settings, 'WRONG_ATTEMPTS_NUMBER', 3)
    user_ban_duration = getattr(settings, 'USER_BAN_DURATION', 600)

    failed_attempts = user.login_events.filter(
        status=LoginStatus.FAILED,
        timestamp__gte=timezone.now() - timedelta(seconds=wrong_attempts_duration),
    ).count()
    remaining_attempts = wrong_attempts_number - \
        failed_attempts if failed_attempts < wrong_attempts_number else 0

    # Если количество попыток превышает лимит, создаем блокировку
    if failed_attempts >= wrong_attempts_number:
        blocked_until = timezone.now() + timedelta(seconds=user_ban_duration)
        lockout = UserLockout.objects.create(
            user=user,
            blocked_until=blocked_until,
            status=LockoutStatus.ACTIVE
        )
        send_user_lockout_email.delay(lockout.id)
        release_user_lockout.delay(lockout.id)
        return lockout, remaining_attempts

    return None, remaining_attempts


def may_user_log_in(request, user=None, email: str | None = None) -> Tuple[bool, Response | int | None]:
    '''
    Реализует проверку, может ли пользователь войти в систему (не заблокирован, активен).
    '''
    # Проверяем блокировку по Ip
    ip_address = request.META.get("HTTP_X_REAL_IP", "") or request.META.get(
        "HTTP_X_FORWARDED_FOR", "")

    if ip_address is not None:
        is_ip_blocked, blocked_until = is_ip_banned(ip_address=ip_address)
        if is_ip_blocked:
            return False, IpBlockedResponse(blocked_until, ip_address)

    if not user:
        if ip_address is None:
            logger.error(f"User with email {email} not found")
            return False, InvalidCredentialsResponse(-4)
        else:
            user_agent = request.META.get("HTTP_USER_AGENT", "")
            geo = request.data.get("geo", "")
            screen = request.META.get("HTTP_X_SCREEN_RESOLUTION", "")
            log_login_event.delay(
                getattr(settings, 'ANONYMOUS_USER_ID', '1'), ip_address, user_agent, geo, screen, LoginStatus.FAILED)

            _, ip_remaining_attempts = create_ip_lockout(ip_address)

            logger.debug(
                f"Login failed for email {email} user not found, ip remaining attempts: {ip_remaining_attempts}")

            return False, InvalidCredentialsResponse(ip_remaining_attempts)

    if not user.is_active:
        if ip_address is None:
            logger.error(f"User with email {email} is not active")
            return False, InvalidCredentialsResponse(-5)
        else:
            user_agent = request.META.get("HTTP_USER_AGENT", "")
            geo = request.data.get("geo", "")
            screen = request.META.get("HTTP_X_SCREEN_RESOLUTION", "")
            log_login_event.delay(
                getattr(settings, 'ANONYMOUS_USER_ID', '1'), ip_address, user_agent, geo, screen, LoginStatus.FAILED)

            _, ip_remaining_attempts = create_ip_lockout(ip_address)

            logger.debug(
                f"Login failed for email {email} user not active, ip remaining attempts: {ip_remaining_attempts}")

            return False, InvalidCredentialsResponse(ip_remaining_attempts)

    # Проверяем блокировку
    is_user_blocked, blocked_until = is_user_banned(user=user)
    if is_user_blocked:
        return False, AccountLockedResponse(blocked_until)

    return True, None
