from rest_framework import serializers
from accounts.models import Sector


class SectorSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Sector"""
    
    class Meta:
        model = Sector
        fields = ('id', 'name')
