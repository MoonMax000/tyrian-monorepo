from rest_framework import serializers
from accounts.models import User

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class Login2FASerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    code = serializers.CharField()


class LoginSuccessResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Login successful")
    timestamp = serializers.IntegerField(help_text="Unix timestamp of login")
    is_2fa_enabled = serializers.BooleanField(help_text="Is to 2FA (set by user)")
    sessionid = serializers.CharField(help_text="Session ID for authentication")


class Login2FAResponseSerializer(serializers.Serializer):
    is_2fa_enabled = serializers.BooleanField(help_text="Is to 2FA (set by user)")
    sessionid = serializers.CharField(help_text="Session ID for authentication")

class LoginErrorResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Invalid credentials")
    remaining_attempts = serializers.IntegerField(help_text="Remaining attempts")


class LoginBlockedResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="User is blocked")
    banned_until = serializers.IntegerField(help_text="Unix timestamp of ban end")


class LoginValidationErrorResponseSerializer(serializers.Serializer):
    email = serializers.ListField(
        child=serializers.CharField(),
        help_text="This field is required."
    )
    password = serializers.ListField(
        child=serializers.CharField(),
        help_text="This field is required."
    ) 