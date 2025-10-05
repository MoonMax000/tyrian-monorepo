from django.conf import settings # type: ignore
from django.db import models # type: ignore

class LoginStatus(models.TextChoices):
    SUCCESS = 'success'
    FAILED = 'failed'

class LoginEvent(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='login_events',
        )
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(max_length=48, blank=True, null=True)
    user_agent = models.TextField(blank=True)
    geo = models.CharField(max_length=255)
    screen = models.CharField(max_length=64)
    status = models.CharField(
        max_length=16,
        choices=LoginStatus.choices,
        default=LoginStatus.SUCCESS,
        )

    def __str__(self):
        return f"{self.user.email} @ {self.timestamp} ({self.ip_address})" 