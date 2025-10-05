from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions

from ..models import Stock
from ..api import MoexApi
from ..serializers import StockAggregatedMarketDataSerializer


class StockAggregatedMarketDataView(generics.GenericAPIView):
    """
    Эндпойнт для получения агрегированных данных по рынкам на MOEX.
    """

    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Получение агрегированных данных по рынкам на MOEX.",
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными об агрегированных данных.",
                schema=StockAggregatedMarketDataSerializer,
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
        date = request.query_params.get("date", None)
        moex_api = MoexApi()
        data = moex_api.get_stock_indices_aggregated_for_date(
            ticker=ticker.upper(), date=date
        )
        if not data:
            return Response({"error": "Агрегированные данные не найдены."}, status=404)

        total_volume = 0
        total_trades = 0
        total_amount = 0
        volume_repo = 0
        trades_repo = 0
        amount_repo = 0
        for item in data:
            total_volume += item["volume"]
            total_trades += item["trades_number"]
            total_amount += item["value"]
            if item["market_name"] == "repo":
                volume_repo = item["volume"]
                trades_repo = item["trades_number"]
                amount_repo = item["value"]
            item.pop("market_name")

        combined_data = {
            "data": data,
            "total_volume": total_volume,
            "total_trades": total_trades,
            "total_amount": total_amount,
            "total_volume_without_repo": total_volume - volume_repo,
            "total_trades_without_repo": total_trades - trades_repo,
            "total_amount_without_repo": total_amount - amount_repo,
        }

        serializer = StockAggregatedMarketDataSerializer(combined_data)
        return Response(serializer.data)
