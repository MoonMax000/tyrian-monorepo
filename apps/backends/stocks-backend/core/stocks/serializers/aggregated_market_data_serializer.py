from rest_framework import serializers


class StockAggregatedMarketDataItemSerializer(serializers.Serializer):
    market_title = serializers.CharField()
    trade_date = serializers.DateField()
    trades_number = serializers.IntegerField()
    value = serializers.FloatField()
    volume = serializers.IntegerField()
    updated_at = serializers.DateTimeField()


class StockAggregatedMarketDataSerializer(serializers.Serializer):
    data = StockAggregatedMarketDataItemSerializer(many=True)
    total_volume = serializers.IntegerField()
    total_trades = serializers.IntegerField()
    total_amount = serializers.FloatField()
    total_volume_without_repo = serializers.IntegerField()
    total_trades_without_repo = serializers.IntegerField()
    total_amount_without_repo = serializers.FloatField()
