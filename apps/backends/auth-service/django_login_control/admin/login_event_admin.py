from django.contrib import admin
from ..models import LoginEvent
from import_export.admin import ExportMixin
from ..resources import LoginEventResource


@admin.register(LoginEvent)
class LoginEventAdmin(ExportMixin, admin.ModelAdmin):
    resource_classes = [LoginEventResource]
    list_display = ("user", "timestamp", "ip_address", "user_agent", "geo", "screen", "status",)
    search_fields = ("user__email",)
    list_filter = ("user__email", "status",)
    readonly_fields = ("user", "timestamp", "ip_address", "user_agent", "geo", "screen", "status",)
    
    # Деактивировать кнопку "Add new"
    def has_add_permission(self, request):
        return False
    
    # Деактивировать возможность удаления
    def has_delete_permission(self, request, obj=None):
        return False
