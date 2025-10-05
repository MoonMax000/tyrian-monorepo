import logging
import redis

from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from django.contrib.auth import logout # type: ignore
from django.core.cache import cache # type: ignore

from ..models import LoginSession
from ..permissions import IsSessionAuthenticated
from ..services import deactivate_user_sessions
from ..exceptions import DeactivationUserSessionsException


logger = logging.getLogger(__name__)

@extend_schema(
    tags=['Authentication'],
    summary='Выход из системы',
    description='Завершает сеанс текущего аутентифицированного пользователя.',
    request=None,
    responses={
        200: OpenApiResponse(description='Успешный выход из системы'),
        401: OpenApiResponse(description='Пользователь не аутентифицирован')
    }
)
class LogoutView(APIView):
    # permission_classes = [IsSessionAuthenticated]

    def post(self, request):
        if not request.user.is_authenticated:
            logger.debug("Logout attempt by unauthenticated user")
            return Response({'detail': 'Authentication required'}, status=status.HTTP_403_FORBIDDEN)
        
        user_id = getattr(request.user, 'id', None)
        user_email = getattr(request.user, 'email', 'Unknown')
        session_key = request.session.session_key if request.session else None
        
        logger.debug(f"User logout initiated: {user_email} (ID: {user_id})")
        
        # Проверяем существование LoginSession перед logout
        if session_key:
            try:
                login_session = LoginSession.objects.get(session_id=session_key)
                logger.debug(f"Found LoginSession: ID={login_session.id}, Status={login_session.status}")
            except LoginSession.DoesNotExist:
                logger.debug(f"No LoginSession found for session key: {session_key}")
        
        logout(request)
        logger.info(f"User {user_email} (ID: {user_id}) logged out successfully")
        
        return Response({'detail': 'Logged out successfully'}, status=status.HTTP_200_OK)

@extend_schema(
    tags=['Authentication'],
    summary='Выход из всех устройств',
    description='Завершает все сеансы текущего аутентифицированного пользователя.',
    request=None,
    responses={
        200: OpenApiResponse(description='Успешный выход из системы'),
        401: OpenApiResponse(description='Пользователь не аутентифицирован')
    }
)
class FullLogoutView(APIView):
    # permission_classes = [IsSessionAuthenticated]

    def post(self, request):
        if not request.user.is_authenticated:
            logger.debug("Full logout attempt by unauthenticated user")
            return Response({'detail': 'Authentication required'}, status=status.HTTP_403_FORBIDDEN)
        
        user = request.user
        user_id = getattr(user, 'id', None)
        user_email = getattr(user, 'email', 'Unknown')
        session_key = request.session.session_key if request.session else None
        
        logger.debug(f"Full logout initiated for user: {user_email} (ID: {user_id})")
        
        # Проверяем существование LoginSession перед logout
        if session_key:
            try:
                login_session = LoginSession.objects.get(session_id=session_key)
                logger.debug(f"Found current LoginSession: ID={login_session.id}, Status={login_session.status}")
            except LoginSession.DoesNotExist:
                logger.debug(f"No LoginSession found for current session key: {session_key}")
        
        # Проверяем количество активных сессий пользователя
        active_sessions_count = LoginSession.objects.filter(user=user, status='active').count()
        logger.debug(f"User has {active_sessions_count} active sessions before full logout")
        
        logout(request)
        
        try:
            deactivate_user_sessions(user.id)
            logger.debug(f"Successfully deactivated all sessions for user {user_email}")
        except DeactivationUserSessionsException as e:
            logger.error(f"Error during deactivation of sessions for user {user_email} (ID: {user_id}): {e}")
            logger.error("The user has been logged out, but the sessions have not been deactivated")
        except Exception as e:
            logger.error(f"Unexpected error when deactivating sessions for user {user_email} (ID: {user_id}): {e}")
            logger.error("The user has been logged out, but the sessions have not been deactivated")

        logger.info(f"User {user_email} (ID: {user_id}) logged out from all devices successfully")

        return Response({'detail': 'Logged out successfully'}, status=status.HTTP_200_OK) 