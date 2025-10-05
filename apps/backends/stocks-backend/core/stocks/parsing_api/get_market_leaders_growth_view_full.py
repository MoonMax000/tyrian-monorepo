from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import serializers
from enum import Enum

from project.settings import FORMATTER_BASE_URL
from http_client import http_client


class Sectors(Enum):
    basic_materials = "Basic Materials"
    communication_services = "Communication Services"
    consumer_cyclical = "Consumer Cyclical"
    consumer_defensive = "Consumer Defensive"
    energy = "Energy"
    financial_services = "Financial Services"
    healthcare = "Healthcare"
    industrials = "Industrials"
    real_estate = "Real Estate"
    technology = "Technology"
    utilities = "Utilities"

SECTORS_CHOICES = [item.value for item in Sectors]

SORTING_FIELDS = [
    'change_percent_1h',
    'change_percent_24h',
    'change_percent_7d',
    'volume_24h',
    'market_cap',
    'name',
]

SORTING_DIRECTIONS = ["asc", "desc"]


def parse_market_leaders_growth_full(country: str, params: dict = None) -> dict:
    url = f"{FORMATTER_BASE_URL}/market-leaders-growth-full/{country}/"
    data = http_client.get(url, params=params)
    return data


class MarketLeadersGrowthFullSerializer(serializers.Serializer):
    data = serializers.JSONField(required=True)


class MarketLeadersGrowthFullView(generics.GenericAPIView):
    """
    Эндпойнт для получения полных данных лидеров по росту.
    """

    permission_classes = []
    # permission_classes = [permissions.IsAuthenticated]
    serializer_class = MarketLeadersGrowthFullSerializer

    @swagger_auto_schema(
        operation_description="Получение полных данных лидеров по росту.",
        manual_parameters=[
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
                description="Фильтр по сектору. Допустимые значения: " + ", ".join(SECTORS_CHOICES),
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
                description="Успешный ответ с полными данными о лидерах по росту.",
                schema=MarketLeadersGrowthFullSerializer(many=True),
            ),
            401: "Пользователь не авторизован",
            403: "Доступ запрещен",
            404: "Страна не найдена",
        },
        tags=["Акции"],
    )
    def get(self, request, country):

        if country.lower() not in ["ru", "us"]:
            return Response(
                {"error": "Страна должна быть ru или us."},
                status=400,
            )
        
        limit = request.query_params.get("limit", 25)
        sector = request.query_params.get("sector", None)
        sort_by = request.query_params.get("sort_by", "market_cap")
        sort_direction = request.query_params.get("sort_direction", "desc")
        
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
            "sort_by": sort_by,
            "sort_direction": sort_direction,
        }
        
        if sector:
            params["sector"] = sector
        
        data = parse_market_leaders_growth_full(country.lower(), params)
        serializer = self.serializer_class(data={"data": data})
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=400,
            )
        return Response(serializer.data)
