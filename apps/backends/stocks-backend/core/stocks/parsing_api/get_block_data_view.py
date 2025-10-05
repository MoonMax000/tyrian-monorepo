import logging

from project.settings import FORMATTER_BASE_URL
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from http_client.client import http_client


logger = logging.getLogger(__name__)


class GetBlockDataView(APIView):
    """
    Эндпойнт для получения данных для указанного блока.
    """

    permission_classes = []
    #permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Получение данных для указанного блока.",
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными для указанного блока.",
            ),
            401: "Пользователь не авторизован",
            403: "Доступ запрещен",
            404: "Данные для указанного блока не найдены",
        },
        tags=["Парсинг"],
    )
    def get(self, request, block_slug, country):

        if country.lower() not in ["ru", "us"]:
            return Response(
                {"error": "Страна должна быть ru или us."},
                status=400,
            )
        
        logger.debug(f"Запрос данных для блока: {block_slug}, страна: {country.lower()}")
        params = request.query_params

        data = parse_block_data(block_slug, country.lower(), params)
        logger.debug(f"Данные успешно получены для блока: {block_slug}")
        return Response(data)


def parse_block_data(block_slug: str, country: str, params: dict) -> dict:
    url = f"{FORMATTER_BASE_URL}/{block_slug}/{country}/"
    data = http_client.get(url, params=params)
    return data
