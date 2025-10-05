from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers
from accounts.models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ("email", "password")

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

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user


class RegisterSuccessResponseSerializer(serializers.Serializer):
    detail = serializers.CharField()
    timestamp = serializers.IntegerField()


class RegisterErrorResponseSerializer(serializers.Serializer):
    email = serializers.ListField(
        child=serializers.CharField(),
        help_text=["User with this email already exists."]
    )
    password = serializers.ListField(
        child=serializers.CharField(),
        help_text=["This field is required."]
    ) 