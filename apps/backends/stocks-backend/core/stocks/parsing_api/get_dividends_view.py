from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import serializers

from project.settings import FORMATTER_BASE_URL
from http_client import http_client


def parse_dividends(country: str, params: dict) -> dict:
    url = f"{FORMATTER_BASE_URL}/dividends/{country}/"
    data = http_client.get(url, params=params)
    return data


class DividendsSerializer(serializers.Serializer):
    date = serializers.CharField(required=True)
    dividends = serializers.FloatField(required=True)
    paymentDate = serializers.CharField(required=True)
    declarationDate = serializers.CharField(required=True)
    
class DividendsView(generics.GenericAPIView):
    """
    Эндпойнт для получения Дивидендов.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DividendsSerializer

    @swagger_auto_schema(
        operation_description="Получение Дивиденды.",
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
                description="Успешный ответ с данными о Дивиденды.",
                schema=DividendsSerializer(many=True),
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
        limit = request.query_params.get("limit", None)
        if limit is not None:
            limit = int(limit)

        params = {
            "ticker": ticker.upper(),
            "limit": limit,
        }
        data = parse_dividends(country.lower(), params)
        serializer = self.serializer_class(data=data, many=True)
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=400,
            )
        return Response(serializer.data)