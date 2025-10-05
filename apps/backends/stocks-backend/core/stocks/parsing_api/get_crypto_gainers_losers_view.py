from enum import Enum

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import serializers

from project.settings import FORMATTER_BASE_URL
from http_client import http_client

class CryptoFilter(Enum):
    gainers = "gainers"
    losers = "losers"
    # tvl_ranking = "tvl_ranking"
    # market_cap_ranking = "market_cap_ranking"


FILTER_CHOICES = [item.value for item in CryptoFilter]


def parse_gainers_losers_crypto(params: dict, *kwargs) -> dict:
    url = f"{FORMATTER_BASE_URL}/crypto_gainers_losers/general/"
    data = http_client.get(url, params=params)
    return data


class CryptoGainersLosersSerializer(serializers.Serializer):
    data = serializers.JSONField(required=True)


SORTING_FIELDS = [
    'percent_change_24h',
    ]

class CryptoGainersLosersView(generics.GenericAPIView):
    """
    Эндпойнт для получения gainers-losers трендов Криптовалюты.
    """

    permission_classes = [permissions.AllowAny]
    serializer_class = CryptoGainersLosersSerializer

    @swagger_auto_schema(
        operation_description="Получение gainers-losers трендов Криптовалюты.",
        manual_parameters=[
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description="Количество записей (по умолчанию 100)",
                type=openapi.TYPE_INTEGER,
                required=False
            ),
            openapi.Parameter(
                'filter',
                openapi.IN_QUERY,
                description="Вид фильтра. Допустимые значения: " + ", ".join(FILTER_CHOICES),
                type=openapi.TYPE_STRING,
                enum=FILTER_CHOICES,
                required=False
            ),
        ],
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными о Криптовалюте.",
                schema=CryptoGainersLosersSerializer(),
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
        filter = request.query_params.get("filter", None)
        try:
            limit = int(limit)
            if limit <= 0:
                return Response({"error": "limit должен быть положительным целым числом."}, status=400)
        except (ValueError, TypeError):
            return Response({"error": "limit должен быть целым числом."}, status=400)

        if filter is not None:
            if filter not in FILTER_CHOICES:
                return Response({
                    "error": f"Недопустимое значение category. Допустимые значения: {FILTER_CHOICES}"
                }, status=400)

        params = {
            "limit": limit,
            "sort_dir": "asc" if filter == "losers" else "desc",
        }

        data = parse_gainers_losers_crypto(params)

        serializer = self.serializer_class(data={"data": data})
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=400,
            )
        return Response(serializer.data)
