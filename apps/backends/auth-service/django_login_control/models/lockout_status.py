from django.db import models # type: ignore

class LockoutStatus(models.TextChoices):
    ACTIVE = 'active'
    RELEASED = 'released'

