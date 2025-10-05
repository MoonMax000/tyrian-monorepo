from rest_framework import serializers


class StockPricesHistorySerializer(serializers.Serializer):
    num_trades = serializers.IntegerField()
    value = serializers.FloatField()
    open_price = serializers.FloatField()
    low_price = serializers.FloatField()
    high_price = serializers.FloatField()
    close_price = serializers.FloatField()
    volume = serializers.IntegerField()
    date = serializers.DateField()
