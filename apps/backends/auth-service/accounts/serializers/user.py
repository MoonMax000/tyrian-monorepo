from rest_framework import serializers
from accounts.models import User

class UserSerializer(serializers.ModelSerializer):
    is_to_2fa = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "is_active",
            "avatar",
            "background_image",
            "name",
            "username",
            "location",
            "website",
            "role",
            "sectors",
            "bio",
            "backup_email",
            "phone",
            "backup_phone",
            "is_2fa_enabled",
            "is_deleted",
            "verification_method",
            "date_joined",
            "last_login",
            "is_to_2fa",
        )

    def get_is_to_2fa(self, obj):
        return obj.is_2fa_enabled

class UserByEmailSerializer(serializers.ModelSerializer):
    """Сериализатор для получения пользователя по email с минимальным набором полей"""
    
    class Meta:
        model = User
        fields = (
            "username",
            "avatar", 
            "email",
            "bio",
        )


class UserIdByEmailSerializer(serializers.ModelSerializer):
    """Сериализатор для получения id пользователя по email"""

    class Meta:
        model = User
        fields = (
            "id",
        )
