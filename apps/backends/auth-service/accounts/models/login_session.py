from django.conf import settings #type: ignore
from django.db import models #type: ignore


class SessionStatus(models.TextChoices):
    ACTIVE = 'active'
    EXPIRED = 'expired'


class LoginSession(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='login_sessions',
        )
    session_id = models.CharField(max_length=255, unique=True) # Not MUTABLE FIELD
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    ip_address = models.GenericIPAddressField(max_length=48, blank=True, null=True)
    fingerprint = models.TextField(blank=True)
    status = models.CharField(
        max_length=16,
        choices=SessionStatus.choices,
        default=SessionStatus.ACTIVE,
        )

    def __str__(self):
        return f"{self.user.email} @ {self.created_at}"
