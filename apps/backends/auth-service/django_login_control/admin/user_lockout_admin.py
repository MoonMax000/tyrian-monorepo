from django.contrib import admin
from ..models import UserLockout
from import_export.admin import ExportMixin
from ..resources import UserLockoutResource


@admin.register(UserLockout)
class UserLockoutAdmin(ExportMixin, admin.ModelAdmin):
    resource_classes = [UserLockoutResource]
    list_display = ("user", "created_at", "blocked_until", "status",)
    search_fields = ("user__email",)
    list_filter = ("user__email", "status",)
    readonly_fields = ("user", "created_at", "blocked_until", )

    # Деактивировать кнопку"Add new"
    def has_add_permission(self, request):
        return False
    
    # Деактивировать возможность удаления
    def has_delete_permission(self, request, obj=None):
        return True

