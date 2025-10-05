from enum import Enum

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import serializers

from project.settings import FORMATTER_BASE_URL
from http_client import http_client


def parse_tvl_ranking_crypto(params: dict, *kwargs) -> dict:
    url = f"{FORMATTER_BASE_URL}/crypto_tvl_ranking/general/"
    data = http_client.get(url, params=params)
    return data


class CryptoTVLRankingSerializer(serializers.Serializer):
    data = serializers.JSONField(required=True)



class CryptoTVLRankingTView(generics.GenericAPIView):
    """
    Эндпойнт для получения gainers-losers трендов Криптовалюты.
    """

    permission_classes = [permissions.AllowAny]
    serializer_class = CryptoTVLRankingSerializer

    @swagger_auto_schema(
        operation_description="Получение TVL Ranking Криптовалюты.",
        manual_parameters=[
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description="Количество записей (по умолчанию 5)",
                type=openapi.TYPE_INTEGER,
                required=False
            ),
        ],
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными о Криптовалюте.",
                schema=CryptoTVLRankingSerializer(),
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
        limit
        '''
        limit = request.query_params.get("limit", 5)
        try:
            limit = int(limit)
            if limit <= 0:
                return Response({"error": "limit должен быть положительным целым числом."}, status=400)
        except (ValueError, TypeError):
            return Response({"error": "limit должен быть целым числом."}, status=400)

        params = {
            "limit": limit,
        }

        data = parse_tvl_ranking_crypto(params)

        serializer = self.serializer_class(data={"data": data})
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=400,
            )
        return Response(serializer.data)
