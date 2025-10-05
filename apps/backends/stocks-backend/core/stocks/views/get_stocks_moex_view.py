from rest_framework import generics
from rest_framework import permissions
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from ..models import Stock
from ..serializers import StockListSerializer


class StockListView(generics.ListAPIView):
    """
    Класс для получения списка всех акций.
    /api/stocks [GET]
    """

    serializer_class = StockListSerializer
    permission_classes = [] # [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Получить список всех акций.",
        responses={
            200: openapi.Response(
                description="Список всех акций.",
                schema=StockListSerializer,
            ),
            401: "Пользователь не авторизован",
            403: "Доступ запрещен",
        },
        tags=["MOEX"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return Stock.objects.all()
