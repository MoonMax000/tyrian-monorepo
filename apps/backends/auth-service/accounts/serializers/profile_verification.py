from rest_framework import serializers # type: ignore
from django.core.validators import RegexValidator


class ProfileVerificationRequestSerializer(serializers.Serializer):
    """Сериализатор для запроса верификации изменения критических полей"""
    
    FIELD_CHOICES = [
        ('password', 'Password'),
        ('phone', 'Phone'),
        ('backup_email', 'Backup Email'),
        ('backup_phone', 'Backup Phone'),
        ('verification_method', 'Verification Method'),
        ('is_active', 'Is Active'),
        ('is_deleted', 'Is Deleted'),
    ]
    
    fields_to_change = serializers.ListField(
        child=serializers.ChoiceField(choices=FIELD_CHOICES),
        min_length=1,
        max_length=len(FIELD_CHOICES),
        help_text="Список полей для изменения"
    )


class ProfileVerificationConfirmSerializer(serializers.Serializer):
    """Сериализатор для подтверждения изменения критических полей"""
    
    token = serializers.CharField(
        help_text="Токен верификации"
    )
    new_values = serializers.DictField(
        help_text="Новые значения полей (ключ - название поля, значение - новое значение)"
    )
    code = serializers.CharField(
        help_text="Код верификации"
    )

    def validate_new_values(self, value):
        """Валидация новых значений в зависимости от поля"""
        # Здесь можно добавить дополнительную валидацию
        # в зависимости от типа поля
        return value


class ProfileVerificationRequestSuccessResponseSerializer(serializers.Serializer):
    """Сериализатор для успешного запроса верификации изменения критических полей"""
    
    detail = serializers.CharField(
        help_text="Код верификации отправлен"
    )
    verification_method = serializers.CharField(
        help_text="Метод верификации"
    )
    fields_to_change = serializers.ListField(
        help_text="Список полей для изменения"
    )
    token = serializers.CharField(
        help_text="Токен верификации"
    )
