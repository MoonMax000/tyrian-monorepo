from rest_framework import serializers

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class EmailVerificationRequestSerializer(serializers.Serializer):
    """Сериализатор для запроса верификации email"""
    email = serializers.EmailField()
 
class EmailVerificationConfirmSerializer(serializers.Serializer):
    """Сериализатор для подтверждения верификации email"""
    email = serializers.EmailField()
    code = serializers.CharField()
    password = serializers.CharField(write_only=True, required=False)

    def validate_password(self, value):
        """Валидация пароля с использованием Django валидаторов"""
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def validate(self, attrs):
        """Валидация данных с акцентом на пароль"""
        password = attrs.get("password")
        if password:
            try:
                validate_password(password)
            except ValidationError as e:
                raise serializers.ValidationError({"password": e.messages})
        return attrs

class EmailVerificationRequestSuccessResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Verification code sent")


class EmailVerificationConfirmSuccessResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Email verified")


class EmailVerificationErrorResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Invalid or expired code")


class EmailVerificationValidationErrorResponseSerializer(serializers.Serializer):
    email = serializers.ListField(
        child=serializers.CharField(),
        help_text="Enter a valid email address."
    )
    code = serializers.ListField(
        child=serializers.CharField(),
        help_text="This field is required."
    ) 