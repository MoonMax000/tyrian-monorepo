import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from accounts.models import LoginSession, SessionStatus
from accounts.serializers.login_session import LoginSessionSerializer
from accounts.serializers.bulk_session_delete import BulkSessionDeleteSerializer

logger = logging.getLogger(__name__)


@extend_schema(
    tags=['User Sessions'],
    summary='Получить список активных сессий пользователя',
    description='Возвращает список всех активных сессий текущего аутентифицированного пользователя.',
    responses={
        200: LoginSessionSerializer(many=True),
        401: OpenApiResponse(description='Пользователь не аутентифицирован')
    }
)
class UserSessionsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Получить список активных сессий пользователя"""
        logger.info(f"User {request.user.id} requested active sessions list")
        
        # Получаем только активные сессии текущего пользователя
        sessions = LoginSession.objects.filter(
            user=request.user,
            status=SessionStatus.ACTIVE
        ).order_by('-created_at')
        
        serializer = LoginSessionSerializer(sessions, many=True)
        return Response(serializer.data)


@extend_schema(
    tags=['User Sessions'],
    summary='Получить информацию о сессии по ID',
    description='Возвращает информацию о конкретной сессии пользователя по её ID.',
    parameters=[
        OpenApiParameter(
            name='session_id',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            required=True,
            description='ID сессии для получения информации'
        )
    ],
    responses={
        200: LoginSessionSerializer,
        401: OpenApiResponse(description='Пользователь не аутентифицирован'),
        404: OpenApiResponse(description='Сессия не найдена или не принадлежит пользователю')
    }
)
class UserSessionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        """Получить информацию о сессии по ID"""
        logger.info(f"User {request.user.id} requested session {session_id}")
        
        try:
            session = LoginSession.objects.get(
                id=session_id,
                user=request.user
            )
            serializer = LoginSessionSerializer(session)
            return Response(serializer.data)
        except LoginSession.DoesNotExist:
            return Response(
                {'detail': 'Session not found or does not belong to user'}, 
                status=status.HTTP_404_NOT_FOUND
            )


@extend_schema(
    tags=['User Sessions'],
    summary='Удалить сессию по ID',
    description='Удаляет конкретную сессию пользователя по её ID. Сессия должна принадлежать текущему пользователю.',
    parameters=[
        OpenApiParameter(
            name='session_id',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            required=True,
            description='ID сессии для удаления'
        )
    ],
    responses={
        200: OpenApiResponse(description='Сессия успешно удалена'),
        401: OpenApiResponse(description='Пользователь не аутентифицирован'),
        404: OpenApiResponse(description='Сессия не найдена или не принадлежит пользователю'),
        500: OpenApiResponse(description='Внутренняя ошибка сервера')
    }
)
class UserSessionDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, session_id):
        """Удалить сессию по ID"""
        logger.info(f"User {request.user.id} requested to delete session {session_id}")
        
        try:
            session = LoginSession.objects.get(
                id=session_id,
                user=request.user
            )
            
            # Удаляем сессию
            session.delete()
            
            logger.info(f"Session {session_id} deleted for user {request.user.id}")
            return Response(
                {'detail': 'Session deleted successfully'}, 
                status=status.HTTP_200_OK
            )
            
        except LoginSession.DoesNotExist:
            return Response(
                {'detail': 'Session not found or does not belong to user'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error deleting session {session_id} for user {request.user.id}: {e}")
            return Response(
                {'detail': 'Failed to delete session'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@extend_schema(
    tags=['User Sessions'],
    summary='Пакетное удаление сессий пользователя',
    description='''
    Удаляет несколько сессий пользователя по их ID. 
    
    **Способы использования:**
    - Передать список ID сессий для удаления конкретных сессий
    - Передать пустой список [] для удаления всех активных сессий
    - Не передавать поле session_ids (или передать null) для удаления всех активных сессий
    
    **Примеры запросов:**
    ```json
    // Удалить конкретные сессии
    {
        "session_ids": [1, 2, 3, 4]
    }
    
    // Удалить все активные сессии
    {
        "session_ids": []
    }
    
    // Или без поля (удалит все)
    {}
    ```
    ''',
    request=BulkSessionDeleteSerializer,
    responses={
        200: OpenApiResponse(
            description='Сессии успешно удалены',
            examples={
                'specific_sessions': {
                    'summary': 'Удаление конкретных сессий',
                    'value': {
                        'detail': 'Successfully deleted 3 sessions',
                        'deleted_count': 3,
                        'deleted_session_ids': [1, 2, 3]
                    }
                },
                'all_sessions': {
                    'summary': 'Удаление всех активных сессий',
                    'value': {
                        'detail': 'Successfully deleted 5 active sessions',
                        'deleted_count': 5
                    }
                },
                'no_sessions': {
                    'summary': 'Нет сессий для удаления',
                    'value': {
                        'detail': 'No active sessions found',
                        'deleted_count': 0
                    }
                }
            }
        ),
        400: OpenApiResponse(
            description='Неверные данные запроса',
            examples={
                'sessions_not_found': {
                    'summary': 'Сессии не найдены',
                    'value': {
                        'detail': 'Sessions not found or do not belong to user: [999, 998]',
                        'found_sessions': [],
                        'missing_sessions': [999, 998]
                    }
                },
                'invalid_data': {
                    'summary': 'Неверный формат данных',
                    'value': {
                        'session_ids': ['This field must be a list of integers.']
                    }
                }
            }
        ),
        401: OpenApiResponse(description='Пользователь не аутентифицирован'),
        500: OpenApiResponse(description='Внутренняя ошибка сервера')
    }
)
class BulkSessionDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        """Пакетное удаление сессий пользователя"""
        serializer = BulkSessionDeleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        session_ids = serializer.validated_data.get('session_ids', [])
        user = request.user
        
        try:
            if not session_ids:
                # Если список пустой - удаляем все активные сессии пользователя
                logger.info(f"User {user.id} requested deletion of all active sessions")
                sessions_to_delete = LoginSession.objects.filter(
                    user=user,
                    status=SessionStatus.ACTIVE
                )
                deleted_count = sessions_to_delete.count()
                
                if deleted_count == 0:
                    return Response({
                        'detail': 'No active sessions found',
                        'deleted_count': 0
                    }, status=status.HTTP_200_OK)
                
                # Удаляем все активные сессии одним запросом
                sessions_to_delete.delete()
                
                logger.info(f"Successfully deleted {deleted_count} active sessions for user {user.id}")
                return Response({
                    'detail': f'Successfully deleted {deleted_count} active sessions',
                    'deleted_count': deleted_count
                }, status=status.HTTP_200_OK)
            
            else:
                # Удаляем сессии по переданным ID
                logger.info(f"User {user.id} requested deletion of sessions: {session_ids}")
                
                # Получаем сессии, принадлежащие пользователю
                sessions_to_delete = LoginSession.objects.filter(
                    id__in=session_ids,
                    user=user
                )
                
                # Проверяем, что все запрошенные сессии принадлежат пользователю
                found_session_ids = set(sessions_to_delete.values_list('id', flat=True))
                requested_session_ids = set(session_ids)
                
                if found_session_ids != requested_session_ids:
                    missing_ids = requested_session_ids - found_session_ids
                    return Response({
                        'detail': f'Sessions not found or do not belong to user: {list(missing_ids)}',
                        'found_sessions': list(found_session_ids),
                        'missing_sessions': list(missing_ids)
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                deleted_count = sessions_to_delete.count()
                
                if deleted_count == 0:
                    return Response({
                        'detail': 'No sessions found',
                        'deleted_count': 0
                    }, status=status.HTTP_200_OK)
                
                # Удаляем сессии одним запросом
                sessions_to_delete.delete()
                
                logger.info(f"Successfully deleted {deleted_count} sessions for user {user.id}")
                return Response({
                    'detail': f'Successfully deleted {deleted_count} sessions',
                    'deleted_count': deleted_count,
                    'deleted_session_ids': list(found_session_ids)
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            logger.error(f"Error in bulk session deletion for user {user.id}: {e}")
            return Response(
                {'detail': 'Failed to delete sessions'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
