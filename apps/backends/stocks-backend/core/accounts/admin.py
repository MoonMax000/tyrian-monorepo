from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "is_active")
    search_fields = ("email",)
    list_filter = ("is_active",)
    
    # Добавляем недостающие атрибуты для исправления ошибок шаблонов
    filter_input_length = 10  # Длина поля ввода для фильтров
