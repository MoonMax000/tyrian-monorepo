from enum import Enum
import logging

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, serializers

from project.settings import FORMATTER_BASE_URL
from http_client import http_client

logger = logging.getLogger(__name__)


def parse_emission_by_id(params: dict, *kwargs) -> dict:
    logger.info(f"parse_emission_by_id called with params: {params}")
    url = f"{FORMATTER_BASE_URL}/emission/general/"
    logger.info(f"Making request to URL: {url}")
    data = http_client.get(url, params=params)
    logger.info(f"Received data from formatter: {type(data)}, length: {len(str(data)) if data else 0}")
    return data


class SingleEmissionSerializer(serializers.Serializer):
    data = serializers.JSONField(required=True)

class EmissionView(APIView):
    """
    Эндпойнт для получения облигации по id.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = SingleEmissionSerializer

    @swagger_auto_schema(
        operation_description="Получение облигаций.",
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными о облигациях.",
                schema=SingleEmissionSerializer(),
            ),
            400: "Ошибка валидации данных",
            500: "Ошибка сервера",
        },
        tags=["Облигации"],
    )
    def get(self, request, id):
        logger.info(f"EmissionView.get called with query_params: {request.query_params}")
            
        logger.info(f"Parsed parameters - id: {id}")

        params = {
            "id": id,
        }
        
        logger.info(f"Calling parse_emission_by_id with params: {params}")

        try:
            data = parse_emission_by_id(params)
            logger.info(f"Successfully received data from formatter")
        except Exception as e:
            logger.error(f"Exception in parse_emission_by_id: {str(e)}", exc_info=True)
            return Response({"error": "Failed to fetch data from external service"}, status=500)

        logger.info(f"Validating data with serializer")
        serializer = self.serializer_class(data={"data": data})
        if not serializer.is_valid():
            logger.error(f"Serializer validation failed: {serializer.errors}")
            return Response(
                {"error": serializer.errors},
                status=400,
            )

        return Response(serializer.data)
