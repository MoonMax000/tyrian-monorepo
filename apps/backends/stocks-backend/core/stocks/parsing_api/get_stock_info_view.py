import httpx

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import serializers

from project.settings import FORMATTER_BASE_URL
from http_client import http_client


def parse_stock_info(country: str, params: dict) -> dict:
    url = f"{FORMATTER_BASE_URL}/stock-info/{country}/"
    data = http_client.get(url, params=params)
    return data


class StockInfoSerializer(serializers.Serializer):
    icon = serializers.CharField()
    price = serializers.FloatField()
    changesPercentage = serializers.FloatField()
    symbol = serializers.CharField()
    name = serializers.CharField()
    exchange = serializers.CharField()
    previousClose = serializers.FloatField()


class StockInfoView(generics.GenericAPIView):
    """
    Эндпойнт для получения информации об акции.
    """

    # permission_classes = [permissions.IsAuthenticated]
    permission_classes = []
    serializer_class = StockInfoSerializer

    @swagger_auto_schema(
        operation_description="Получение информации об акции.",
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными о акции.",
                schema=StockInfoSerializer,
            ),
            401: "Пользователь не авторизован",
            403: "Доступ запрещен",
            404: "Символ акции не найден",
        },
        tags=["Главная страница"],
    )
    def get(self, request, country, ticker):
        if country.lower() not in ["ru", "us"]:
            return Response(
                {"error": "Страна должна быть ru или us."},
                status=400,
            )
        if not ticker.isalpha():
            return Response(
                {"error": "Тикер должен состоять из букв."},
                status=400,
            )
        params = {
            "ticker": ticker.upper(),
        }
        data = parse_stock_info(country.lower(), params)
        serializer = self.serializer_class(data=data)
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=400,
            )
        return Response(serializer.data)
