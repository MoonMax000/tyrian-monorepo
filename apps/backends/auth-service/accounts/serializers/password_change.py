from rest_framework import serializers

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)


class PasswordChangeSuccessResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Password changed successfully")
    timestamp = serializers.IntegerField(help_text="Unix timestamp of password change")


class PasswordChangeErrorResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Wrong old password")


class PasswordChangeValidationErrorResponseSerializer(serializers.Serializer):
    old_password = serializers.ListField(
        child=serializers.CharField(),
        help_text="This field is required."
    )
    new_password = serializers.ListField(
        child=serializers.CharField(),
        help_text="This field is required."
    ) 