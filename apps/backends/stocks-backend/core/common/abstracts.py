from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class AbstractDateTimeEntity(models.Model):
    """
    Абстрактный класс для включения полей создания и
    редактирования записи.
    """

    created_at = models.DateTimeField(
        verbose_name=_("Время создания"),
        default=timezone.now,
    )
    updated_at = models.DateTimeField(
        verbose_name=_("Время редактирования"),
        default=timezone.now,
    )

    class Meta:
        abstract = True
