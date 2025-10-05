from django.contrib import admin  # type: ignore
from ..models import UserRole


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    '''
    Административная панель для модели UserRole.
    '''
    
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)
    
    fieldsets = (
        (None, {
            'fields': ('name',)
        }),
    )
