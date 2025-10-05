from django.db import models #type: ignore


class UserRole(models.Model):
    name = models.CharField(
        max_length=128,
        unique=True,
        verbose_name="Role name"
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "User Role"
        verbose_name_plural = "User Roles"
        ordering = ["name"]
