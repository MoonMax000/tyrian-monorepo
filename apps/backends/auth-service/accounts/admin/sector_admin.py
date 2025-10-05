from django.contrib import admin
from accounts.models import Sector


@admin.register(Sector)
class SectorAdmin(admin.ModelAdmin):
    """Админка для управления секторами"""
    
    list_display = ('id', 'name',)
    list_filter = ('name',)
    search_fields = ('name',)
    ordering = ('name',)
