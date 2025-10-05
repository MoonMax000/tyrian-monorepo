import logging
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from drf_spectacular.utils import extend_schema, OpenApiResponse # type: ignore

from django.contrib.auth import get_user_model # type: ignore
from django.core.cache import cache # type: ignore

from ..serializers.profile_update import ProfileUpdateSerializer

User = get_user_model()
logger = logging.getLogger(__name__)


@extend_schema(
    tags=['Profile'],
    summary='Обновление профиля пользователя',
    description='Изменяет обычные поля профиля пользователя без дополнительной верификации. Поддерживает загрузку изображений для avatar и background_image.',
    request=ProfileUpdateSerializer,
    responses={
        200: OpenApiResponse(description='Профиль успешно обновлен'),
        400: OpenApiResponse(description='Неверные данные запроса'),
        401: OpenApiResponse(description='Пользователь не аутентифицирован')
    }
)
class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        """Полное обновление профиля"""
        logger.debug(f"PUT request data: {request.data}")
        serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=False)
        if not serializer.is_valid():
            logger.error(f"Serializer validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        
        # Инвалидируем кэш для пользователя по email
        cache_key = f'user_by_email:{request.user.email}'
        cache.delete(cache_key)
        
        logger.info(f"User {request.user.id} updated profile")
        return Response({
            'detail': 'Profile updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    
    def patch(self, request):
        """Частичное обновление профиля"""
        serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Инвалидируем кэш для пользователя по email
        cache_key = f'user_by_email:{request.user.email}'
        cache.delete(cache_key)
        
        logger.info(f"User {request.user.id} partially updated profile")
        return Response({
            'detail': 'Profile partially updated successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
