from django.db import models # type: ignore
from .lockout_status import LockoutStatus

class IpLockout(models.Model):
    ip_address = models.GenericIPAddressField(max_length=48, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    blocked_until = models.DateTimeField()
    status = models.CharField(
        max_length=16,
        choices=LockoutStatus.choices,
        default=LockoutStatus.ACTIVE,
        )

    def __str__(self):
        return f"{self.ip_address} @ {self.blocked_until}"
