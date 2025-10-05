from django.contrib.auth.models import AbstractUser # type: ignore
from django.db import models # type: ignore
from .managers import UserManager


class User(AbstractUser):
    username = None
    email = models.EmailField(
        verbose_name="email",
        null=False,
        unique=True,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[str] = []

    objects = UserManager()

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["email"]
