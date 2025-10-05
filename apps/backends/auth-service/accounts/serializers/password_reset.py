from rest_framework import serializers

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
 
class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(help_text="Encrypted token from email link")
    new_password = serializers.CharField(write_only=True)


class PasswordResetRequestSuccessResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Password reset link sent")
    timestamp = serializers.IntegerField(help_text="Unix timestamp of password reset request")


class PasswordResetConfirmSuccessResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Password reset successful")
    timestamp = serializers.IntegerField(help_text="Unix timestamp of password reset confirmation")


class PasswordResetErrorResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Invalid or expired token")


class PasswordResetNotFoundResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Invalid credentials")


class PasswordResetValidationErrorResponseSerializer(serializers.Serializer):
    email = serializers.ListField(
        child=serializers.CharField(),
        help_text="Enter a valid email address."
    )
    token = serializers.ListField(
        child=serializers.CharField(),
        help_text="This field is required."
    )
    new_password = serializers.ListField(
        child=serializers.CharField(),
        help_text="This field is required."
    ) 