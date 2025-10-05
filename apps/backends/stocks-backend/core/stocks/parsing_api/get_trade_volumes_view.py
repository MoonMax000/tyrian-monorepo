from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import serializers

from project.settings import FORMATTER_BASE_URL
from http_client import http_client


def parse_trade_volumes(country: str, params) -> dict:
    url = f"{FORMATTER_BASE_URL}/trade-volumes/{country}/"
    data = http_client.get(url, params=params)
    return data


class TradeVolumesSerializer(serializers.Serializer):
    volume = serializers.FloatField(required=True)
    reportedCurrency = serializers.CharField(required=True)


class TradeVolumesView(generics.GenericAPIView):
    """
    Эндпойнт для получения объемов торгов.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TradeVolumesSerializer

    @swagger_auto_schema(
        operation_description="Получение объемов торгов.",
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными о объемах торгов.",
                schema=TradeVolumesSerializer(many=True),
            ),
            401: "Пользователь не авторизован",
            403: "Доступ запрещен",
            404: "Страна не найдена",
        },
        tags=["Акции"],
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
        data = parse_trade_volumes(country.lower(), params)
        serializer = self.serializer_class(data=data, many=True)
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=400,
            )
        return Response(serializer.data)
