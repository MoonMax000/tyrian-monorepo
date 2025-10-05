from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions

from ..models import Stock
from ..api import MoexApi
from ..serializers import StockCurrentInfoSerializer


class StockCurrentInfoView(generics.GenericAPIView):
    """
    Эндпойнт для получения текущей информации по акции.
    """

    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Получение текущей информации по акции.",
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными о акции.",
                schema=StockCurrentInfoSerializer,
            ),
            401: "Пользователь не авторизован",
            403: "Доступ запрещен",
            404: "Акция не найдена",
        },
        tags=["MOEX"],
    )
    def get(self, request, ticker) -> Response:
        """
        Получение текущей информации по акции.

        Args:
            request (Request): Объект запроса.
            ticker (str): Тикер (кодовое обозначение) акции.

        Returns:
            Response: Ответ с данными о акции.
        """
        if not ticker.isalpha():
            return Response(
                {"error": "Ticker must be a string of alphabetic characters."},
                status=400,
            )
        if ticker.upper() not in Stock.objects.values_list("ticker", flat=True):
            return Response({"error": "Stock not found."}, status=404)
        moex_api = MoexApi()
        data = moex_api.get_stock_current_info(ticker=ticker.upper())
        if not data:
            return Response({"error": "Данные не найдены."}, status=404)
        serializer = StockCurrentInfoSerializer(data)
        return Response(serializer.data)
