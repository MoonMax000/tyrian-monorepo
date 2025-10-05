from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiResponse

from accounts.models import Sector
from accounts.serializers.sector import SectorSerializer


@extend_schema(
    tags=['Sectors'],
    summary='Получить список всех секторов',
    description='Возвращает список всех доступных секторов с их ID и названиями.',
    responses={
        200: SectorSerializer(many=True),
        401: OpenApiResponse(description='Пользователь не аутентифицирован')
    }
)
class SectorListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Получить список всех секторов"""
        sectors = Sector.objects.all().order_by('name')
        serializer = SectorSerializer(sectors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
