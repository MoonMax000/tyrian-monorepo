import logging

from rest_framework.views import APIView # type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from drf_spectacular.utils import extend_schema, OpenApiResponse

from ..serializers import PasswordChangeSerializer
from ..services import deactivate_user_sessions
from ..utils import send_lazy_email
from ..exceptions import DeactivationUserSessionsException


logger = logging.getLogger(__name__)

@extend_schema(
    tags=['User'],
    summary='Изменение пароля',
    description='Изменяет пароль текущего аутентифицированного пользователя.',
    request=PasswordChangeSerializer,
    responses={
        200: OpenApiResponse(description='Пароль успешно изменен'),
        400: OpenApiResponse(description='Неверный старый пароль или ошибка валидации'),
        401: OpenApiResponse(description='Пользователь не аутентифицирован')
    }
)
class PasswordChangeView(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_403_FORBIDDEN)
        serializer = PasswordChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({'detail': 'Wrong old password'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        logger.info(f"User {user.id} changed password")
        try:
            deactivate_user_sessions(user.id)
        except DeactivationUserSessionsException as e:
            logger.error(f"Error during deactivation of sessions for user {user.id}: {e} \nThe password has been changed, but the sessions have not been deactivated")
        except Exception as e:
            logger.error(f"Unexpected error when deactivating sessions for user {user.id}: {e}\nThe password has been changed, but the sessions have not been deactivated")
        send_lazy_email.delay(
            'Password changed',
            f'Your password has been changed',
            user.email,
        )
        return Response({'detail': 'Password changed successfully'}, status=status.HTTP_200_OK) 