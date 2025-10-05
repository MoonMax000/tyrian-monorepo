from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import permissions

from ..api import MoexApi
from ..serializers import NewsSerializer


class NewsView(generics.GenericAPIView):
    """
    Эндпойнт для получения новостей.
    """

    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Получение новостей.",
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными об новостях.",
                schema=NewsSerializer,
            ),
            401: "Пользователь не авторизован",
            403: "Доступ запрещен",
            404: "Новости не найдены",
        },
        tags=["Новости"],
    )
    def get(self, request):
        moex_api = MoexApi()
        data = moex_api.get_news()
        if not data:
            return Response({"error": "Новости не найдены."}, status=404)
        serializer = NewsSerializer(data, many=True)
        return Response(serializer.data)
