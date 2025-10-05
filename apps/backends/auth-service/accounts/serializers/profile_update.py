from rest_framework import serializers # type: ignore
from django.core.validators import RegexValidator
from django.contrib.auth import get_user_model
from accounts.models import Sector


User = get_user_model()


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления обычных полей профиля"""
    
    # Явно определяем поля изображений для правильного отображения в Swagger
    avatar = serializers.ImageField(required=False, allow_null=True)
    background_image = serializers.ImageField(required=False, allow_null=True)
    
    # Поле для множественного выбора секторов
    sectors = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Sector.objects.all(),
        required=False,
        allow_empty=True,
        help_text="Select one or more sectors of interest"
    )
    
    class Meta:
        model = User
        fields = [
            'avatar',
            'background_image', 
            'name',
            'username',
            'location',
            'website',
            'role',
            'sectors',
            'bio',
            'is_2fa_enabled',
        ]
        read_only_fields = ['email', 'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login']
    
    username = serializers.CharField(
        max_length=128,
        required=False,
        allow_blank=True,
        validators=[
            RegexValidator(
                regex=r'^[a-zA-Z0-9_-]+$',
                message='Username can only contain letters, numbers, hyphens and underscores'
            )
        ]
    )
    
    def validate_username(self, value):
        """Проверяем уникальность username"""
        if value:
            user = self.instance
            if User.objects.filter(username=value).exclude(pk=user.pk).exists():
                raise serializers.ValidationError("Username already exists")
        return value
