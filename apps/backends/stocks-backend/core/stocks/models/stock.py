from django.db import models
from django.utils.translation import gettext_lazy as _

from common import AbstractDateTimeEntity


class Stock(AbstractDateTimeEntity):
    name = models.CharField(
        verbose_name=_("Название"),
        max_length=128,
        unique=True,
    )
    ticker = models.CharField(
        verbose_name=_("Тикер"),
        max_length=16,
        unique=True,
    )
    last_price = models.DecimalField(
        verbose_name=_("Последняя цена"),
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return self.name


class Article(models.Model):
    """
    Модель для хранения текста статьи.
    """
    title = models.CharField(verbose_name=_("Заголовок"))
    description = models.TextField(verbose_name=_("Краткое описание"), blank=True)
    content = models.TextField(verbose_name=_("Основной текст статьи"))

    def __str__(self):
        return f"Article {self.id}: {self.title}"

    class Meta:
        verbose_name = "Статья"
        verbose_name_plural = "Статьи"