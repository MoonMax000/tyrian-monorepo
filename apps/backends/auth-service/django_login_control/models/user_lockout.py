from django.conf import settings # type: ignore
from django.db import models # type: ignore
from .lockout_status import LockoutStatus


class UserLockout(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lockouts',
        )
    created_at = models.DateTimeField(auto_now_add=True)
    blocked_until = models.DateTimeField()
    status = models.CharField(
        max_length=16,
        choices=LockoutStatus.choices,
        default=LockoutStatus.ACTIVE,
        )

    def __str__(self):
        return f"{self.user.email} @ {self.blocked_until}" 
