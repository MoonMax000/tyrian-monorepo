from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import serializers

from project.settings import FORMATTER_BASE_URL
from http_client import http_client


def parse_holders_table(country: str, params) -> dict:
    url = f"{FORMATTER_BASE_URL}/holders-table/{country}/"
    data = http_client.get(url, params=params)
    return data


class HoldersTableViewSerializer(serializers.Serializer):
    holder = serializers.CharField(required=True)
    shares = serializers.IntegerField(required=True)
    sharesPercent = serializers.FloatField(required=True)
    value = serializers.FloatField(required=True)
    holderType = serializers.CharField(required=True)


class HoldersTableView(generics.GenericAPIView):
    """
    Эндпойнт для получения таблицы акционеров.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = HoldersTableViewSerializer

    @swagger_auto_schema(
        operation_description="Получение таблицы акционеров.",
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
                description="Успешный ответ с данными о таблице акционеров.",
                schema=HoldersTableViewSerializer(many=True),
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
            limit = limit.strip("'.,!")
            limit = int(limit)

        params = {
            "ticker": ticker.upper(),
            "limit": limit,
        }
        data = parse_holders_table(country.lower(), params)
        serializer = self.serializer_class(data=data, many=True)
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=400,
            )
        return Response(serializer.data)
