from rest_framework import serializers
from ..models import Stock


class StockListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ["name", "ticker", "last_price"]
