from project.settings import FORMATTER_BASE_URL
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions

from ..parsers import parse_financial_statements
from ..parsing_serializers import FinancialStatementsSerializer
from http_client import http_client


class FinancialStatementsView(generics.GenericAPIView):
    """
    Эндпойнт для получения финансовых отчетов.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FinancialStatementsSerializer

    @swagger_auto_schema(
        operation_description="Получение финансовых отчетов.",
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными об финансовых отчетах.",
                schema=FinancialStatementsSerializer,
            ),
            401: "Пользователь не авторизован",
            403: "Доступ запрещен",
            404: "Акция не найдена",
        },
        tags=["Акции"],
    )
    def get(self, request, country, ticker):
        if not ticker.isalpha():
            return Response(
                {"error": "Тикер должен состоять из букв."},
                status=400,
            )
        if country.lower() not in ["ru", "us"]:
            return Response(
                {"error": "Страна должна быть ru или us."},
                status=400,
            )
        
        data = parse_financial_statements(country.lower(), ticker)
        serializer = self.serializer_class(data)
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=400,
            )
        return Response(serializer.data)

def parse_financial_statements(country: str, ticker: str) -> dict:
    url = f"{FORMATTER_BASE_URL}/financial-statements/{country}/"
    data = http_client.get(url, params={"ticker": ticker})
    return data
