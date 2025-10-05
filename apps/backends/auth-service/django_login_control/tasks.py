from zoneinfo import ZoneInfo
import time
import logging

from celery import shared_task #type: ignore
from django.contrib.auth import get_user_model #type: ignore
from django.core.mail import send_mail #type: ignore
from django.conf import settings #type: ignore
from django.utils import timezone #type: ignore
from django_login_control.models import LoginEvent, LoginStatus, UserLockout, LockoutStatus, IpLockout
from accounts.models import UserProfile
import redis
import os

logger = logging.getLogger(__name__)

redis_client = redis.Redis(
            host=os.getenv('REDIS_HOST', 'global-redis'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            db=0,
            decode_responses=True
        )

@shared_task
def log_login_event(user_id, ip_address, user_agent, geo, screen, status=LoginStatus.SUCCESS):
    User = get_user_model()
    user = User.objects.get(pk=user_id)
    LoginEvent.objects.create(
        user=user,
        ip_address=ip_address,
        user_agent=user_agent,
        geo=geo,
        screen=screen,
        status=status,
    )


@shared_task
def send_user_lockout_email(lockout_id):
    """Отправляет email пользователю о блокировке аккаунта"""
    try:
        lockout = UserLockout.objects.get(pk=lockout_id)
        user = lockout.user
        wait_seconds = int((lockout.blocked_until - timezone.now()).total_seconds())
        if wait_seconds < 0:
            return

        # Email deduplication - только если время блокировки больше 0
        if wait_seconds > 0:
            if redis_client.set(f'user_lockout:{user.id}', wait_seconds, ex=wait_seconds, get=True) is not None:
                return

        user_profile = UserProfile.objects.get(pk=user.id)
        
        # Форматируем дату и время окончания блокировки
        utc_aware = lockout.blocked_until.replace(tzinfo=ZoneInfo("UTC"))
        local_time = utc_aware.astimezone(user_profile.time_zone)
        end_time = local_time.strftime("%d.%m.%Y %H:%M:%S %Z")
        
        subject = 'Уведомление о временной блокировке вашего аккаунта'
        message = f"""
Здравствуйте!

В целях безопасности доступ к вашему аккаунту был временно ограничен из-за нескольких неудачных попыток входа.

Ограничение автоматически будет снято: {end_time}

Если эти попытки входа совершались не вами, мы рекомендуем изменить пароль в качестве меры предосторожности.

С уважением,
Команда поддержки
info@tyriantrade.com
        """.strip()
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )
        
    except UserLockout.DoesNotExist:
        logger.error(f"UserLockout with id {lockout_id} not found, when trying to send email")



@shared_task
def release_user_lockout(lockout_id):
    """Ожидает указанное время и изменяет статус блокировки на RELEASED"""
    try:
        lockout = UserLockout.objects.get(pk=lockout_id)
        
        # Вычисляем время ожидания до окончания блокировки
        wait_seconds = (lockout.blocked_until - timezone.now()).total_seconds()
        
        if wait_seconds > 0:
            # Ожидаем указанное время
            time.sleep(wait_seconds)
        
        # Обновляем блокировку из базы данных (на случай изменений)
        lockout.refresh_from_db()
        
        # Устанавливаем статус RELEASED
        lockout.status = LockoutStatus.RELEASED
        lockout.save()
                
    except UserLockout.DoesNotExist:
        logger.error(f"UserLockout with id {lockout_id} does not exist, when trying to release")
    except Exception as e:
        logger.error(f"Error releasing user lockout: {e}")

@shared_task
def release_ip_lockout(lockout_id):
    """Ожидает указанное время и изменяет статус блокировки на RELEASED"""
    try:
        lockout = IpLockout.objects.get(pk=lockout_id)
        
        # Вычисляем время ожидания до окончания блокировки
        wait_seconds = (lockout.blocked_until - timezone.now()).total_seconds()
        
        if wait_seconds > 0:
            # Ожидаем указанное время
            time.sleep(wait_seconds)
        
        # Обновляем блокировку из базы данных (на случай изменений)
        lockout.refresh_from_db()
        
        # Устанавливаем статус RELEASED
        lockout.status = LockoutStatus.RELEASED
        lockout.save()
                
    except IpLockout.DoesNotExist:
        logger.error(f"IpLockout with id {lockout_id} does not exist, when trying to release")
    except Exception as e:
        logger.error(f"Error releasing ip lockout: {e}")