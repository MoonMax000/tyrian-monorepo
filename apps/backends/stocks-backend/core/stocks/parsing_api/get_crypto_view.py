from enum import Enum

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import serializers

from project.settings import FORMATTER_BASE_URL
from http_client import http_client

class SpecialCategoryTypeORM(Enum):
    all = "all"
    nfts = "nfts"
    rehypo = "rehypo"
    binance_alpha = "binance_alpha"
    memes = "memes"
    sol = "sol"
    bnb = "bnb"
    internet_capital_markets = "internet_capital_markets"
    ai = "ai"
    ai_agents = "ai_agents"
    rwa = "rwa"
    gaming = "gaming"
    depin = "depin"
    defai = "defai"

CATEGORY_CHOICES = [item.value for item in SpecialCategoryTypeORM]

def parse_crypto(params: dict, category: str) -> dict:
    if category and category != SpecialCategoryTypeORM.all.value:
        url = f"{FORMATTER_BASE_URL}/crypto_with_category/general/"
        params.update({"category_special_type": category})
    else:
        url = f"{FORMATTER_BASE_URL}/crypto/general/"
        params.update({
            "sort_by": "market_cap",
            "cryptocurrency_type": "all",
            "tag": "all",
            "with_historical_data": False,
            "interval": "2h",
            "batch_size": 50,
            "weeks_shift_period": 1
        })
    data = http_client.get(url, params=params)
    return data


class CryptoSerializer(serializers.Serializer):
    data = serializers.JSONField(required=True)


SORTING_FIELDS = [
    'percent_change_1h',
    'percent_change_24h',
    'percent_change_7d',
    'price',
    'volume_24h',
    'market_cap',
    'name',
    ]

SORTING_DIECTIONS = ["asc", "desc"]

class CryptoView(generics.GenericAPIView):
    """
    Эндпойнт для получения Криптовалюты.
    """

    permission_classes = [permissions.AllowAny]
    serializer_class = CryptoSerializer

    @swagger_auto_schema(
        operation_description="Получение Криптовалюты.",
        manual_parameters=[
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description="Количество записей (по умолчанию 100)",
                type=openapi.TYPE_INTEGER,
                required=False
            ),
            openapi.Parameter(
                'page',
                openapi.IN_QUERY,
                description="Номер страницы(По умолчанию 1)",
                type=openapi.TYPE_INTEGER,
                required=False
            ),
            openapi.Parameter(
                'category',
                openapi.IN_QUERY,
                description="Фильтр по категории. Допустимые значения: " + ", ".join(CATEGORY_CHOICES),
                type=openapi.TYPE_STRING,
                enum=CATEGORY_CHOICES,
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
                description="Направление сортировки. Допустимые значения: " + ", ".join(SORTING_DIECTIONS),
                type=openapi.TYPE_STRING,
                enum=SORTING_DIECTIONS,
                required=False
            ),
        ],
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными о Криптовалюте.",
                schema=CryptoSerializer(),
            ),
            401: "Пользователь не авторизован",
            403: "Доступ запрещен",
            404: "Страна не найдена",
        },
        tags=["Криптовалюта"],
    )
    def get(self, request):
        '''
        Query parameters:
        sort_direction: SORTING_DIECTIONS
        sort_by: SORTING_FIELDS
        '''
        limit = request.query_params.get("limit", 100)
        page = request.query_params.get("page", 1)
        category = request.query_params.get("category", None)
        sort_by = request.query_params.get("sort_by", "price")
        sort_direction = request.query_params.get("sort_direction", "asc")
        try:
            limit = int(limit)
            if limit <= 0:
                return Response({"error": "limit должен быть положительным целым числом."}, status=400)
        except (ValueError, TypeError):
            return Response({"error": "limit должен быть целым числом."}, status=400)

        try:
            page = int(page)
            if page <= 0:
                return Response({"error": "page должен быть положительным целым числом."}, status=400)
        except (ValueError, TypeError):
            return Response({"error": "page должен быть целым числом."}, status=400)

        if category is not None:
            if category not in CATEGORY_CHOICES:
                return Response({
                    "error": f"Недопустимое значение category. Допустимые значения: {CATEGORY_CHOICES}"
                }, status=400)

        if sort_by not in SORTING_FIELDS:
            return Response({
                "error": f"Недопустимое значение sort_by. Допустимые значения: {SORTING_FIELDS}"
            }, status=400)

        if sort_direction not in SORTING_DIECTIONS:
            return Response({
                "error": f"Недопустимое значение sort_direction. Допустимые значения: {SORTING_DIECTIONS}"
            }, status=400)

        start = (page - 1) * limit + 1

        params = {
            "limit": limit,
            "start": start,
            "sort_by": sort_by,
            "sort_direction": sort_direction,
        }

        data = parse_crypto(params, category)

        serializer = self.serializer_class(data={"data": data})
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=400,
            )
        return Response(serializer.data)