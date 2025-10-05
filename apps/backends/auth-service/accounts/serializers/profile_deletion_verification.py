from rest_framework import serializers # type: ignore


class ProfileDeletionVerificationConfirmSerializer(serializers.Serializer):
    """Сериализатор для подтверждения удаления профиля"""
    
    token = serializers.CharField(
        help_text="Токен верификации удаления"
    )
    code = serializers.CharField(
        max_length=6,
        min_length=6,
        help_text="Код верификации (6 цифр)"
    )
