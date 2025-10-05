from rest_framework import serializers


class StockCurrentInfoSerializer(serializers.Serializer):
    ticker = serializers.CharField(max_length=10)

    trading_regime = serializers.CharField(max_length=10)
    full_name = serializers.CharField(max_length=100)
    reg_number = serializers.CharField(max_length=10)
    issue_size = serializers.IntegerField()
    currency_id = serializers.CharField(max_length=10)
    settlement_date = serializers.DateField()
    prev_date = serializers.DateField()
    instrument_id = serializers.CharField(max_length=10)
    short_name = serializers.CharField(max_length=10)

    last_price = serializers.FloatField()
    low_price = serializers.FloatField()
    high_price = serializers.FloatField()
    last_change = serializers.FloatField()
    last_change_percents = serializers.FloatField()
    isin = serializers.CharField(max_length=12)

    trades_number = serializers.IntegerField()
    today_volume = serializers.IntegerField()
    capitalization = serializers.FloatField()
    board_id = serializers.CharField(max_length=10)
    value_today = serializers.FloatField()
