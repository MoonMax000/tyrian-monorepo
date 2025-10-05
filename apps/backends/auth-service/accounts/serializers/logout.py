from rest_framework import serializers

class LogoutSuccessResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Logged out successfully") 