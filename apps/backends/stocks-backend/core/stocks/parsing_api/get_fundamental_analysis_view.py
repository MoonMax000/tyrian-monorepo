from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import serializers

from project.settings import FORMATTER_BASE_URL
from http_client import http_client


def parse_fundamental_analysis(country: str, ticker: str) -> dict:
    url = f"{FORMATTER_BASE_URL}/fundamental-analysis/{country}/"
    params = {"ticker": ticker}
    data = http_client.get(url, params=params)
    return data


class CompanyIndustryField(serializers.Serializer):
    company = serializers.FloatField(required=True)
    industry = serializers.FloatField(required=True)


class YearPriceField(serializers.Serializer):
    min = serializers.FloatField(required=True)
    max = serializers.FloatField(required=True)
    current = serializers.FloatField(required=True)


class FundamentalAnalysisSerializer(serializers.Serializer):
    peRatio = CompanyIndustryField()
    pbRatio = CompanyIndustryField()
    enterpriseValueOverEBITDA = CompanyIndustryField()
    netDebtToEBITDA = CompanyIndustryField()
    roe = CompanyIndustryField()
    year_price = YearPriceField()


class FundamentalAnalysisView(generics.GenericAPIView):
    """
    Эндпойнт для получения фундаментального анализа.
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FundamentalAnalysisSerializer

    @swagger_auto_schema(
        operation_description="Получение фундаментального анализа.",
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными о фундаментальном анализе.",
                schema=FundamentalAnalysisSerializer,
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
        data = parse_fundamental_analysis(country.lower(), ticker.upper())
        serializer = self.serializer_class(data=data)
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors},
                status=400,
            )
        return Response(serializer.data)
