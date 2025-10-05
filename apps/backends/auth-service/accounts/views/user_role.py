from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, OpenApiResponse

from accounts.models.user_role import UserRole
from accounts.serializers.user_role import UserRoleSerializer


@extend_schema(
    tags=['User Roles'],
    summary='Получить список ролей пользователей',
    description='Возвращает список всех доступных ролей пользователей.',
    responses={
        200: UserRoleSerializer(many=True),
        401: OpenApiResponse(description='Пользователь не аутентифицирован')
    }
)
class UserRoleListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Получить список всех ролей пользователей"""
        roles = UserRole.objects.all()
        serializer = UserRoleSerializer(roles, many=True)
        return Response(serializer.data)
