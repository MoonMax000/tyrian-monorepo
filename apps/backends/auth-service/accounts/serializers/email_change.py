from rest_framework import serializers


class ChangeEmailVerificationRequestSerializer(serializers.Serializer):
    """Сериализатор для запроса верификации изменения email"""
    
    current_email = serializers.EmailField(
        help_text="Текущий email пользователя"
    )
    new_email = serializers.EmailField(
        help_text="Новый email для изменения"
    )


class EmailChangeConfirmSerializer(serializers.Serializer):
    """Сериализатор для подтверждения изменения email"""
    
    token = serializers.CharField(
        help_text="Токен верификации изменения email"
    )
    code = serializers.CharField(
        help_text="Код верификации для изменения email"
    )

class EmailChangeSerializer(serializers.Serializer):
    """Сериализатор для финального изменения email"""
    code = serializers.CharField(
        help_text="Код верификации для нового email"
    )


# Response serializers
class ChangeEmailVerificationRequestSuccessResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Email change verification sent")


class EmailChangeConfirmSuccessResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="New email change verification sent")


class EmailChangeSuccessResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Email changed successfully")


class EmailChangeErrorResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Error message")


class EmailChangeValidationErrorResponseSerializer(serializers.Serializer):
    current_email = serializers.ListField(
        child=serializers.CharField(),
        help_text="Enter a valid email address."
    )
    new_email = serializers.ListField(
        child=serializers.CharField(),
        help_text="Enter a valid email address."
    )
    token = serializers.ListField(
        child=serializers.CharField(),
        help_text="This field is required."
    )
    code = serializers.ListField(
        child=serializers.CharField(),
        help_text="This field is required."
    )
