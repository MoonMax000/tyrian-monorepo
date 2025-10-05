from django.contrib import admin
from ..models import IpLockout
from import_export.admin import ExportMixin
from ..resources import IpLockoutResource


@admin.register(IpLockout)
class IpLockoutAdmin(ExportMixin, admin.ModelAdmin):
    resource_classes = [IpLockoutResource]
    list_display = ("ip_address", "created_at", "blocked_until", "status",)
    search_fields = ("ip_address",)
    list_filter = ("ip_address", "status",)
    readonly_fields = ("ip_address", "created_at", "blocked_until", )

    # Деактивировать кнопку"Add new"
    def has_add_permission(self, request):
        return False
    
    # Деактивировать возможность удаления
    def has_delete_permission(self, request, obj=None):
        return True
