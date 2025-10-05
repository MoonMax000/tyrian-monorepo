from rest_framework import serializers
from accounts.models.user_role import UserRole


class UserRoleSerializer(serializers.ModelSerializer):
    """Сериализатор для модели UserRole"""
    
    class Meta:
        model = UserRole
        fields = (
            "id",
            "name",
        )
