from rest_framework import serializers
from accounts.models import LoginSession


class LoginSessionSerializer(serializers.ModelSerializer):
    """Сериализатор для модели LoginSession"""
    
    class Meta:
        model = LoginSession
        fields = (
            "id",
            "session_id",
            "created_at",
            "expires_at",
            "ip_address",
            "fingerprint",
            "status",
        )
        read_only_fields = (
            "id",
            "session_id",
            "created_at",
            "expires_at",
            "ip_address",
            "fingerprint",
            "status",
        )
