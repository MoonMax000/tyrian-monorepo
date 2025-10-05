from enum import Enum

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import serializers

from project.settings import FORMATTER_BASE_URL
from http_client import http_client


class Sectors(Enum):
    BASIC_MATERIALS = "Basic Materials"
    COMMUNICATION_SERVICES = "Communication Services"
    CONSUMER_CYCLICAL = "Consumer Cyclical"
    CONSUMER_DEFENSIVE = "Consumer Defensive"
    ENERGY = "Energy"
    FINANCIAL_SERVICES = "Financial Services"
    HEALTHCARE = "Healthcare"
    INDUSTRIALS = "Industrials"
    REAL_ESTATE = "Real Estate"
    TECHNOLOGY = "Technology"
    UTILITIES = "Utilities"


SECTORS_CHOICES = [item.value for item in Sectors]
SORTING_FIELDS = [
    'change_percent_1h',
    'change_percent_24h',
    'change_percent_7d',
    'volume_24h',
    'market_cap',
    'name'
]
SORTING_DIRECTIONS = ['asc', 'desc']
DATA_TYPES = ['gainers', 'losers']


def parse_market_leaders_type(params: dict, *kwargs) -> dict:
    url = f"{FORMATTER_BASE_URL}/market-leaders-type/us/"
    data = http_client.get(url, params=params)
    return data


class MarketLeadersTypeSerializer(serializers.Serializer):
    data = serializers.JSONField(required=True)


class MarketLeadersTypeView(generics.GenericAPIView):
    """
    Эндпойнт для получения данных о gainers (акциях с наибольшим ростом) 
    или losers (акциях с наибольшим падением).
    """

    permission_classes = [permissions.AllowAny]
    serializer_class = MarketLeadersTypeSerializer

    @swagger_auto_schema(
        operation_description="Получение данных о gainers (акциях с наибольшим ростом) или losers (акциях с наибольшим падением).",
        manual_parameters=[
            openapi.Parameter(
                'type',
                openapi.IN_QUERY,
                description="Тип данных: gainers (рост) или losers (падение). По умолчанию gainers",
                type=openapi.TYPE_STRING,
                enum=DATA_TYPES,
                required=False
            ),
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description="Количество записей (по умолчанию 25)",
                type=openapi.TYPE_INTEGER,
                required=False
            ),
            openapi.Parameter(
                'sector',
                openapi.IN_QUERY,
                description="Сектор для фильтрации. Допустимые значения: " + ", ".join(SECTORS_CHOICES),
                type=openapi.TYPE_STRING,
                enum=SECTORS_CHOICES,
                required=False
            ),
            openapi.Parameter(
                'sort_by',
                openapi.IN_QUERY,
                description="Поле для сортировки. Допустимые значения: " + ", ".join(SORTING_FIELDS),
                type=openapi.TYPE_STRING,
                enum=SORTING_FIELDS,
                required=False
            ),
            openapi.Parameter(
                'sort_direction',
                openapi.IN_QUERY,
                description="Направление сортировки. Допустимые значения: " + ", ".join(SORTING_DIRECTIONS),
                type=openapi.TYPE_STRING,
                enum=SORTING_DIRECTIONS,
                required=False
            ),
        ],
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными о gainers или losers.",
                schema=MarketLeadersTypeSerializer(),
            ),
            400: "Некорректные параметры запроса",
            401: "Пользователь не авторизован",
            403: "Доступ запрещен",
            404: "Данные не найдены",
        },
        tags=["Акции"],
    )
    def get(self, request):
        """
        Query parameters:
        type: тип данных (gainers/losers)
        limit: количество записей
        sector: сектор для фильтрации
        sort_by: поле для сортировки
        sort_direction: направление сортировки
        """
        data_type = request.query_params.get("type", "gainers")
        limit = request.query_params.get("limit", 25)
        sector = request.query_params.get("sector", None)
        sort_by = request.query_params.get("sort_by", None)
        sort_direction = request.query_params.get("sort_direction", "desc")

        # Валидация типа данных
        if data_type not in DATA_TYPES:
            return Response({
                "error": f"Недопустимое значение type. Допустимые значения: {DATA_TYPES}"
            }, status=400)

        try:
            limit = int(limit)
            if limit <= 0:
                return Response({"error": "limit должен быть положительным целым числом."}, status=400)
        except (ValueError, TypeError):
            return Response({"error": "limit должен быть целым числом."}, status=400)

        if sector is not None:
            if sector not in SECTORS_CHOICES:
                return Response({
                    "error": f"Недопустимое значение sector. Допустимые значения: {SECTORS_CHOICES}"
                }, status=400)

        if sort_by is not None:
            if sort_by not in SORTING_FIELDS:
                return Response({
                    "error": f"Недопустимое значение sort_by. Допустимые значения: {SORTING_FIELDS}"
                }, status=400)

        if sort_direction not in SORTING_DIRECTIONS:
            return Response({
                "error": f"Недопустимое значение sort_direction. Допустимые значения: {SORTING_DIRECTIONS}"
            }, status=400)

        params = {
            "limit": limit,
            "type": data_type,
        }

        if sector:
            params["sector"] = sector
        if sort_by:
            params["sort_by"] = sort_by
        if sort_direction:
            params["sort_direction"] = sort_direction

        data = parse_market_leaders_type(params)

        serializer = self.serializer_class(data={"data": data})
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=400,
            )
        return Response(serializer.data)
