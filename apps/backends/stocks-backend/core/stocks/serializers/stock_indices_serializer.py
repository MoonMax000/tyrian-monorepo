from rest_framework import serializers


class StockIndicesSerializer(serializers.Serializer):
    code = serializers.CharField()
    shortname = serializers.CharField()
    from_date = serializers.DateField()
    till_date = serializers.DateField()
    current_value = serializers.FloatField()
    last_change_percents = serializers.FloatField()
    last_change = serializers.FloatField()


class StockIndicesListSerializer(serializers.ListSerializer):
    child = StockIndicesSerializer()
