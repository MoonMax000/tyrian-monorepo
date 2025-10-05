import logging

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions

from ..models import Stock
from ..api import MoexApi
from ..serializers import StockPricesHistorySerializer


logger = logging.getLogger(__name__)


class StockPricesHistoryView(generics.GenericAPIView):
    """
    Эндпойнт для получения истории цены по акции.
    """

    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Получение истории цены по акции.",
        manual_parameters=[
            openapi.Parameter(
                "start_date",
                openapi.IN_QUERY,
                description="Дата начала (формат: YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
            openapi.Parameter(
                "end_date",
                openapi.IN_QUERY,
                description="Дата окончания (формат: YYYY-MM-DD)",
                type=openapi.TYPE_STRING,
                required=False,
            ),
        ],
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными о акции.",
                schema=StockPricesHistorySerializer,
            ),
            401: "Пользователь не авторизован",
            403: "Доступ запрещен",
            404: "Акция не найдена",
        },
        tags=["MOEX"],
    )
    def get(self, request, ticker):
        logger.info(f"Getting stock prices history for {ticker.upper()}")
        if not ticker.isalpha():
            return Response(
                {"error": "Ticker must be a string of alphabetic characters."},
                status=400,
            )
        if ticker.upper() not in Stock.objects.values_list("ticker", flat=True):
            return Response({"error": "Stock not found."}, status=404)
        start_date = request.query_params.get("start_date", "")
        end_date = request.query_params.get("end_date", "")
        moex_api = MoexApi()
        logger.info(
            f"Getting stock prices history for {ticker.upper()} from {start_date} to {end_date}"
        )
        data = moex_api.get_stock_prices_history(
            ticker=ticker.upper(), start_date=start_date, end_date=end_date
        )
        if not data:
            return Response({"error": "Данные не найдены."}, status=404)
        serializer = StockPricesHistorySerializer(data, many=True)
        return Response(serializer.data)
