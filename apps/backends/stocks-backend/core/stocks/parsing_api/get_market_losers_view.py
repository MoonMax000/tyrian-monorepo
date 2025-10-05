from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import serializers

from project.settings import FORMATTER_BASE_URL
from http_client import http_client


def parse_market_losers(country: str) -> dict:
    url = f"{FORMATTER_BASE_URL}/market-losers/{country}/"
    data = http_client.get(url)
    return data


class MarketLosersSerializer(serializers.Serializer):
    icon = serializers.CharField()
    symbol = serializers.CharField()
    name = serializers.CharField()
    price = serializers.FloatField()
    changesPercentage = serializers.FloatField()


class MarketLosersView(generics.GenericAPIView):
    """
    Эндпойнт для получения лидеров по падению.
    """

    permission_classes = []
    # permission_classes = [permissions.IsAuthenticated]
    serializer_class = MarketLosersSerializer

    @swagger_auto_schema(
        operation_description="Получение лидеров по падению.",
        manual_parameters=[
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description="Количество записей (по умолчанию - все записи)",
                type=openapi.TYPE_INTEGER,
                required=False
            ),
        ],
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными о лидерах по падению.",
                schema=MarketLosersSerializer(many=True),
            ),
            401: "Пользователь не авторизован",
            403: "Доступ запрещен",
            404: "Страна не найдена",
        },
        tags=["Главная страница"],
    )
    def get(self, request, country):

        if country.lower() not in ["ru", "us"]:
            return Response(
                {"error": "Страна должна быть ru или us."},
                status=400,
            )
        
        data = parse_market_losers(country.lower())
        serializer = self.serializer_class(data, many=True)
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=400,
            )
        return Response(serializer.data)
