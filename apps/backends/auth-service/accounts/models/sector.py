from django.db import models


class Sector(models.Model):
    """Модель секторов для пользователей"""
    
    name = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Название сектора"
    )
    
    class Meta:
        verbose_name = "Сектор"
        verbose_name_plural = "Секторы"
        ordering = ['name']
    
    def __str__(self):
        return self.name
