from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions

from ..models import Stock
from ..api import MoexApi
from ..serializers import StockIndicesListSerializer


class StockIndicesView(generics.GenericAPIView):
    """
    Эндпойнт для получения списка индексов в которые входит бумага прямо сейчас.
    """

    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Получение списка индексов в которые входит бумага прямо сейчас.",
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными об индексах.",
                schema=StockIndicesListSerializer,
            ),
            401: "Пользователь не авторизован",
            403: "Доступ запрещен",
            404: "Акция не найдена",
        },
        tags=["MOEX"],
    )
    def get(self, request, ticker):
        if not ticker.isalpha():
            return Response(
                {"error": "Тикер должен состоять из букв."},
                status=400,
            )
        if ticker.upper() not in Stock.objects.values_list("ticker", flat=True):
            return Response({"error": "Бумага не найдена."}, status=404)
        moex_api = MoexApi()
        data = moex_api.get_stock_indices(ticker=ticker.upper())
        if not data:
            return Response({"error": "Индексы не найдены."}, status=404)
        serializer = StockIndicesListSerializer(data)
        return Response(serializer.data)
