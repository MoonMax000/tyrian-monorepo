from rest_framework import serializers


class NewsSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    published_at = serializers.DateTimeField()
    modified_at = serializers.DateTimeField()
