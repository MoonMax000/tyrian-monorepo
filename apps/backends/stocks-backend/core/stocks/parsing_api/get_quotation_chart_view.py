from datetime import datetime

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import serializers

from http_client import http_client
from project.settings import FORMATTER_BASE_URL, FMP_DEFAULT_REPORTS_PERIOD


def parse_quotation_chart(country: str, params: dict) -> dict:
    url = f"{FORMATTER_BASE_URL}/quotation-chart/{country}/"
    data = http_client.get(url, params=params)
    return data


class QuotationChartSerializer(serializers.Serializer):
    date = serializers.CharField()
    revenue = serializers.FloatField()
    ebitda = serializers.FloatField()
    netIncome = serializers.FloatField()
    netIncomeRatio = serializers.FloatField()
    freeCashFlow = serializers.FloatField()
    totalLiabilities = serializers.FloatField()


class QuotationChartView(generics.GenericAPIView):
    """
    Эндпойнт для получения графика котировок.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = QuotationChartSerializer

    @swagger_auto_schema(
        operation_description="Получение данных для графика котировок.",
        manual_parameters=[
            openapi.Parameter(
                'start',
                openapi.IN_QUERY,
                description="Дата начала (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                format='date',
                required=True
            ),
            openapi.Parameter(
                'end', 
                openapi.IN_QUERY,
                description="Дата окончания (YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                format='date',
                required=True
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
                description="Успешный ответ с данными для графика.",
                schema=QuotationChartSerializer(many=True),
            ),
            400: "Неверный формат параметров",
            404: "Данные не найдены",
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
        period = request.query_params.get("period", FMP_DEFAULT_REPORTS_PERIOD)
        if period not in ["annual", "quarter"]:
            return Response(
                {"error": "Период должен быть annual или quarter."},
                status=400,
            )        
        start = request.query_params.get("start", datetime.now().replace(year=datetime.now().year - 1).strftime("%Y-%m-%d"))
        end = request.query_params.get("end", datetime.now().strftime("%Y-%m-%d"))

        params = {
            "ticker": ticker.upper(),
            "start": start,
            "end": end,
            "period": period,
        }
        data = parse_quotation_chart(country.lower(), params)
        serializer = self.serializer_class(data=data, many=True)
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=400,
            )
        return Response(serializer.data)
