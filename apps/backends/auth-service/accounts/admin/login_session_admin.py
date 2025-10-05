import logging
from typing import Any, Dict, List

from django.contrib import admin  # type: ignore

from ..models import LoginSession


logger = logging.getLogger(__name__)


@admin.register(LoginSession)
class LoginSessionAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "created_at",
        "expires_at",
        "status",
        "ip_address",
        "fingerprint",
    )
    search_fields = ("user__email",)
    list_filter = ("user__email", "status",)
    readonly_fields = (
        "user",
        "session_id",
        "created_at",
        "expires_at",
        "status",
        "ip_address",
        "fingerprint",
    )

    # Деактивировать кнопку "Add new"
    def has_add_permission(self, request):
        return False

    # Атрибуты для совместимости с jazzmin
    filter_input_length: Dict[str, Any] = {}
    autocomplete_fields: List[str] = []
    raw_id_fields: List[str] = []
    fieldsets = None
    inlines: List[str] = []
