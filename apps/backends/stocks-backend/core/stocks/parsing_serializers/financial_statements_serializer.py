from rest_framework import serializers


class FinancialStatementsSerializer(serializers.Serializer):
    peRatio = serializers.FloatField()
    pbRatio = serializers.FloatField()
    enterpriseValueOverEBITDA = serializers.FloatField()
    netDebtToEBITDA = serializers.FloatField()
    roe = serializers.FloatField()
