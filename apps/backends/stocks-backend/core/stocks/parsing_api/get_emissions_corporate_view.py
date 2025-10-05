from enum import Enum
import logging
import math

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, serializers

from project.settings import FORMATTER_BASE_URL
from http_client import http_client

logger = logging.getLogger(__name__)


class BondKind(Enum):
    all_bonds = "All Bonds"
    long_term = "long-term"
    short_term = "short-term"
    fixed_rate = "fixed rate"
    floating_rate = "floating rate"
    zero_coupon = "zero coupon"


KIND_CHOICES = [item.value for item in BondKind]


def parse_emissions_corporate(params: dict, *kwargs) -> dict:
    logger.info(f"parse_emissions_corporate called with params: {params}")
    url = f"{FORMATTER_BASE_URL}/emissions-corporate/general/"
    logger.info(f"Making request to URL: {url}")
    data = http_client.get(url, params=params)
    logger.info(f"Received data from formatter: {type(data)}, length: {len(str(data)) if data else 0}")
    return data


class EmissionCorporateSerializer(serializers.Serializer):
    data = serializers.JSONField(required=True)

class EmissionsCorporateView(APIView):
    """
    Эндпойнт для получения корпоративных облигаций.
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = EmissionCorporateSerializer

    @swagger_auto_schema(
        operation_description="Получение облигаций.",
        manual_parameters=[
            openapi.Parameter(
                'limit',
                openapi.IN_QUERY,
                description="Количество записей на странице (по умолчанию 25)",
                type=openapi.TYPE_INTEGER,
                required=False
            ),
            openapi.Parameter(
                'kind',
                openapi.IN_QUERY,
                description="Вид корпоративной облигации. Допустимые значения: " + ", ".join(KIND_CHOICES),
                type=openapi.TYPE_STRING,
                enum=KIND_CHOICES,
                required=False
            ),
            openapi.Parameter(
                'sort_by',
                openapi.IN_QUERY,
                description="Поле для сортировки. Допустимые значения: ytm, name",
                type=openapi.TYPE_STRING,
                enum=["ytm", "name"],
                required=False
            ),
            openapi.Parameter(
                'sort_dir',
                openapi.IN_QUERY,
                description="Направление сортировки. Допустимые значения: asc, desc",
                type=openapi.TYPE_STRING,
                enum=["asc", "desc"],
                required=False
            ),
        ],
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными о облигациях.",
                schema=EmissionCorporateSerializer(),
            ),
            400: "Ошибка валидации данных",
            500: "Ошибка сервера",
        },
        tags=["Облигации"],
    )
    def get(self, request):
        logger.info(f"EmissionsCorporateView.get called with query_params: {request.query_params}")
        limit = request.query_params.get("limit", 25)
        page = request.query_params.get("page", 1)
        kind = request.query_params.get("kind", None)
        sort_by = request.query_params.get("sort_by", None)
        sort_dir = request.query_params.get("sort_dir", "desc")
        
        logger.info(f"Parsed parameters - limit: {limit}, page: {page}, kind: {kind}, sort_by: {sort_by}, sort_dir: {sort_dir}")
        
        try:
            limit = int(limit)
            if limit <= 0:
                logger.warning(f"Invalid limit value: {limit}")
                return Response({"error": "limit должен быть положительным целым числом."}, status=400)
        except (ValueError, TypeError):
            logger.warning(f"Failed to convert limit to int: {limit}")
            return Response({"error": "limit должен быть целым числом."}, status=400)

        try:
            page = int(page)
            if page <= 0:
                logger.warning(f"Invalid page value: {page}")
                return Response({"error": "page должен быть положительным целым числом."}, status=400)
        except (ValueError, TypeError):
            logger.warning(f"Failed to convert page to int: {page}")
            return Response({"error": "page должен быть положительным целым числом."}, status=400)

        if kind is not None:
            if kind not in KIND_CHOICES:
                logger.warning(f"Invalid kind value: {kind}, allowed: {KIND_CHOICES}")
                return Response({
                    "error": f"Недопустимое значение kind. Допустимые значения: {KIND_CHOICES}"
                }, status=400)

        if sort_by is not None and sort_by not in ["ytm", "name"]:
            logger.warning(f"Invalid sort_by value: {sort_by}")
            return Response({
                "error": "Недопустимое значение sort_by. Допустимые значения: ytm, name"
            }, status=400)

        if sort_dir not in ["asc", "desc"]:
            logger.warning(f"Invalid sort_dir value: {sort_dir}")
            return Response({
                "error": "Недопустимое значение sort_dir. Допустимые значения: asc, desc"
            }, status=400)

        params = {
            "kind": kind,
            "sort_by": sort_by,
            "sort_direction": sort_dir,
        }
        
        logger.info(f"Calling parse_emissions_corporate with params: {params}")

        try:
            data = parse_emissions_corporate(params)
            logger.info(f"Successfully received data from formatter")
        except Exception as e:
            logger.error(f"Exception in parse_emissions_corporate: {str(e)}", exc_info=True)
            return Response({"error": "Failed to fetch data from external service"}, status=500)

        logger.info(f"Validating data with serializer")
        serializer = self.serializer_class(data={"data": data})
        if not serializer.is_valid():
            logger.error(f"Serializer validation failed: {serializer.errors}")
            return Response(
                {"error": serializer.errors},
                status=400,
            )
        
        logger.info(f"Serializer validation successful, applying pagination")
        start = (page - 1) * limit
        
        try:
            # Получаем данные из сериализатора
            serialized_data = serializer.data
            logger.info(f"Serialized data structure: {type(serialized_data)}")
            
            # Применяем пагинацию к data внутри
            if "data" in serialized_data and isinstance(serialized_data["data"], list):
                data_list = serialized_data["data"]
                paginated_data = data_list[start:start + limit]
                result = {"data": paginated_data, "total": len(data_list), "page": page, "limit": limit, "sort_by": sort_by, "total_pages": math.ceil(len(data_list) / limit)}
                logger.info(f"Successfully returning paginated data, start: {start}, end: {start + limit}, total: {len(data_list)}")
            else:
                logger.warning(f"Data is not a list or missing 'data' key: {serialized_data}")
                result = serialized_data
            
            return Response(result)
        except Exception as e:
            logger.error(f"Error during pagination: {str(e)}", exc_info=True)
            return Response({"error": "Error during pagination"}, status=500)
