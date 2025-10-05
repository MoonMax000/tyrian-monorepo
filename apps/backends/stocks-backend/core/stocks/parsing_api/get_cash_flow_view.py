from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import serializers

from http_client.client import http_client
from project.settings import FORMATTER_BASE_URL, FMP_DEFAULT_REPORTS_PERIOD


def parse_cash_flow(country: str, params: dict) -> dict:
    url = f"{FORMATTER_BASE_URL}/cash-flow/{country}/"
    data = http_client.get(url, params=params)
    return data


class CashFlowSerializer(serializers.Serializer):
    date = serializers.CharField(required=True)
    netCashProvidedByOperatingActivities = serializers.FloatField(required=True)
    netCashUsedForInvestingActivites = serializers.FloatField(required=True)
    netCashUsedProvidedByFinancingActivities = serializers.FloatField(required=True)
    reportedCurrency = serializers.CharField(required=True)


class CashFlowView(generics.GenericAPIView):
    """
    Эндпойнт для получения денежного потока.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CashFlowSerializer

    @swagger_auto_schema(
        operation_description="Получение денежного потока.",
        manual_parameters=[
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description="Количество записей (по умолчанию - все записи)",
                type=openapi.TYPE_INTEGER,
                required=False
            ),
            openapi.Parameter(
                'period',
                openapi.IN_QUERY,
                description=f"Период: annual или quarter (год или квартал), по умолчанию - {FMP_DEFAULT_REPORTS_PERIOD}",
                type=openapi.TYPE_STRING,
                required=False,
            ),
        ],
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными о денежном потоке.",
                schema=CashFlowSerializer(many=True),
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
        period = request.query_params.get("period", FMP_DEFAULT_REPORTS_PERIOD)
        if period not in ["annual", "quarter"]:
            return Response(
                {"error": "Период должен быть annual или quarter."},
                status=400,
            )
        if limit is not None:
            limit = int(limit)

        params = {
            "ticker": ticker.upper(),
            "limit": limit,
            "period": period,
        }
        data = parse_cash_flow(country.lower(), params)
        serializer = self.serializer_class(data=data, many=True)
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=400,
            )
        return Response(serializer.data)
