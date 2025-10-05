import logging
from datetime import datetime
from django.db import transaction  # type: ignore

from rest_framework import status # type: ignore
from rest_framework.response import Response  # type: ignore
from rest_framework.views import APIView # type: ignore
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample

from django.contrib.auth import authenticate, login #type:ignore
from django.views.decorators.csrf import csrf_exempt # type: ignore
from django.utils.decorators import method_decorator # type: ignore
from django.core.cache import cache # type: ignore
from django.middleware.csrf import get_token # type: ignore

from django_login_control.tasks import log_login_event
from django_login_control.services import may_user_log_in, create_user_lockout, create_ip_lockout
from django_login_control.models import LoginStatus

from ..models import User, LoginSession
from ..services import send_verification_code
from ..serializers import (
    LoginSerializer,
    LoginSuccessResponseSerializer,
    LoginErrorResponseSerializer,
    LoginValidationErrorResponseSerializer,
    Login2FAResponseSerializer,
    Login2FASerializer,
    LoginBlockedResponseSerializer,
)

from responses import IpBlockedResponse, AccountLockedResponse, InvalidCredentialsResponse


logger = logging.getLogger(__name__)


def create_login_session(user, request):
    logger.debug(f"Starting login session creation for user: {user.email} (ID: {user.id})")
    
    expires_at = request.session.get_expiry_date()
    ip_address = request.META.get("HTTP_X_REAL_IP", "") or request.META.get("HTTP_X_FORWARDED_FOR", "")
    fingerprint = request.META.get("HTTP_USER_AGENT", "")
    
    logger.debug(f"Session expiry date: {expires_at}")
    logger.debug(f"IP address: {ip_address}")
    logger.debug(f"User agent: {fingerprint[:100]}...")  # Обрезаем для читаемости
    
    logger.debug("User authentication successful, calling login()")
    login(request, user)

    # Добавить кастомные данные в сессию
    request.session['user_email'] = user.email
    logger.debug(f"Added user_email to session: {user.email}")

    # TODO: add ip_address into session

    # Обновляем ключ сессии
    request.session.cycle_key()
    logger.debug("Session refreshed in Redis")

    # Session ID появляется только после записи сессии в кэш!
    session_id = request.session.session_key
    logger.debug(f"Session ID: {session_id}")
    
    if not LoginSession.objects.filter(session_id=session_id).exists():
        logger.debug(f"Creating new LoginSession record for session: {session_id}")
        login_session = LoginSession.objects.create(
            user=user,
            session_id=session_id,
            expires_at=expires_at,
            ip_address=ip_address,
            fingerprint=fingerprint,
        )
        logger.debug(f"Login session created with id: {login_session.id}")
    else:
        logger.debug(f"LoginSession record already exists for session: {session_id}")
        login_session = LoginSession.objects.get(session_id=session_id)
    
    logger.debug(f"Login session creation completed for user: {user.email} (Session ID: {session_id}, LoginSession ID: {login_session.id})")


@extend_schema(
    tags=['Authentication'],
    summary='Вход в систему',
    description='Аутентификация пользователя по email и паролю',
    request=LoginSerializer,
    responses={
        200: Login2FAResponseSerializer,
        201: LoginSuccessResponseSerializer,
        400: LoginValidationErrorResponseSerializer,
        401: LoginErrorResponseSerializer,
        403: LoginBlockedResponseSerializer
    },
    examples=[
        OpenApiExample(
            'Request Example',
            value={'email': 'user@example.com', 'password': 'password123'},
            request_only=True
        )
    ]
)
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        logger.debug(f"=== LOGIN REQUEST STARTED ===")
        logger.debug(f"Request method: {request.method}")
        logger.debug(f"Request path: {request.path}")
        logger.debug(f"Request IP: {request.META.get('REMOTE_ADDR', 'Unknown')}")
        logger.debug(f"User agent: {request.META.get('HTTP_USER_AGENT', 'Unknown')}")
        
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        logger.debug(f"Login attempt for email: {email}")
        
        user = User.objects.filter(email=email).first()
        if user:
            logger.debug(f"User found: {user.email} (ID: {user.id}, Active: {user.is_active})")
            # Проверяем активность пользователя
            if not user.is_active:
                logger.warning(f"Login attempt for inactive user: {email}")
                return Response({"detail": "User is not active"}, status=status.HTTP_403_FORBIDDEN)
        else:
            logger.debug(f"Invalid email: {email}")

        may_user_login, response = may_user_log_in(request, user=user, email=email)
        if not may_user_login:
            logger.debug(f"User login blocked: {email}")
            return response

        if user.is_2fa_enabled:
            logger.info(f"User {email} is to 2FA")
            send_verification_code.delay(email)
            return Response({"is_to_2fa": user.is_2fa_enabled}, status=status.HTTP_200_OK)

        logger.debug(f"Attempting authentication for user: {email}")
        user = authenticate(
            request,
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"]
        )
        logger.debug(f"Authenticated user: {user}")

        # Параметры запроса для сохранения в логах
        ip_address = request.META.get("HTTP_X_REAL_IP", "") or request.META.get("HTTP_X_FORWARDED_FOR", "")
        user_agent = request.META.get("HTTP_USER_AGENT", "")
        geo = request.data.get("geo", "")
        screen = request.META.get("HTTP_X_SCREEN_RESOLUTION", "")

        logger.debug(f"Request metadata - IP: {ip_address}, Geo: {geo}, Screen: {screen}")

        if user is not None:
            logger.debug(f"Authentication successful for user: {user.email} (ID: {user.id})")
            try:
                create_login_session(user, request)
                logger.debug(f"Login session created successfully for user: {user.email}")
            except Exception as e:
                logger.error(f"Error creating login session: {e}")
                return Response({"detail": "Error creating login session"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Логирование через Celery
            log_login_event.delay(user.id, ip_address, user_agent, geo, screen)
            logger.debug(f"Login event logged via Celery for user: {user.email}")
            
            logger.debug("Login successful, returning response")
            logger.debug(f"=== LOGIN REQUEST COMPLETED SUCCESSFULLY ===")

            return Response({
                "detail": "Login successful",
                "timestamp": int(datetime.now().timestamp()),
                "is_to_2fa": user.is_2fa_enabled,
            }, status=status.HTTP_201_CREATED)
        else:
            logger.warning("User authentication failed")
            # Используем user из базы данных для логирования, а не результат authenticate
            db_user = User.objects.filter(email=serializer.validated_data["email"]).first()

            ip_remaining_attempts = 0
            # Проверяем и создаём блокировку, если нужно
            if not db_user: # Maria logic 😄
                ip_lockout, ip_remaining_attempts = create_ip_lockout(ip_address)
                if ip_lockout:
                    logger.debug(f"Ip {ip_address} is blocked until {ip_lockout.blocked_until}")
                    return IpBlockedResponse(int(ip_lockout.blocked_until.timestamp()), ip_address)

            if db_user:
                log_login_event.delay(db_user.id, ip_address, user_agent, geo, screen, status=LoginStatus.FAILED)
                user_lockout, user_remaining_attempts = create_user_lockout(db_user)
                if user_lockout:
                    logger.debug(f"User {db_user.email} is blocked until {user_lockout.blocked_until}")
                    return AccountLockedResponse(user_lockout.blocked_until)
            logger.debug(f"=== LOGIN REQUEST FAILED ===")
            logger.debug(f"Login failed for user {db_user.email}, ip remaining attempts: {ip_remaining_attempts}, user remaining attempts {user_remaining_attempts}")

            return InvalidCredentialsResponse(max(ip_remaining_attempts, user_remaining_attempts))

@extend_schema(
    tags=['Authentication'],
    summary='Вход в систему с 2FA',
    description='Аутентификация пользователя по email и паролю с 2FA',
    request=Login2FASerializer,
    responses={
        201: LoginSuccessResponseSerializer,
        400: LoginValidationErrorResponseSerializer,
        401: LoginErrorResponseSerializer,
        403: LoginBlockedResponseSerializer,
    },
    examples=[
        OpenApiExample(
            'Request Example',
            value={'email': 'user@example.com', 'password': 'password123', 'code': '123456'},
            request_only=True
        )
    ]
)
@method_decorator(csrf_exempt, name='dispatch')
class Login2FAView(APIView):
    def post(self, request):
        logger.debug(f"=== 2FA LOGIN REQUEST STARTED ===")
        logger.debug(f"Request method: {request.method}")
        logger.debug(f"Request path: {request.path}")
        logger.debug(f"Request IP: {request.META.get('REMOTE_ADDR', 'Unknown')}")
        logger.debug(f"User agent: {request.META.get('HTTP_USER_AGENT', 'Unknown')}")

        serializer = Login2FASerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        code = serializer.validated_data['code']
        logger.debug(f"2FA login attempt for email: {email} with code: {code}")
        
        user = User.objects.filter(email=email).first()
        if user:
            logger.debug(f"User found: {user.email} (ID: {user.id}, Active: {user.is_active})")
            # Проверяем активность пользователя
            if not user.is_active:
                logger.warning(f"2FA login attempt for inactive user: {email}")
                return Response({"detail": "User is not active"}, status=status.HTTP_403_FORBIDDEN)
        else:
            logger.debug(f"Email not found: {email}")

        may_user_login, response = may_user_log_in(request, user=user, email=email)
        if not may_user_login:
            logger.debug(f"User 2FA login blocked: {email}")
            return response

        # Параметры запроса для сохранения в логах
        ip_address = request.META.get("HTTP_X_REAL_IP", "") or request.META.get("HTTP_X_FORWARDED_FOR", "")
        user_agent = request.META.get("HTTP_USER_AGENT", "")
        geo = request.data.get("geo", "")
        screen = request.META.get("HTTP_X_SCREEN_RESOLUTION", "")
        
        logger.debug(f"Request metadata - IP: {ip_address}, Geo: {geo}, Screen: {screen}")

        cached_code = cache.get(f'2fa_code_{email}')
        logger.debug(f"2FA code check - Cached: {cached_code}, Provided: {code}")

        if not cached_code or cached_code != code:
            logger.error(f"User {email} failed to authenticate with 2FA code")
            log_login_event.delay(user.id, ip_address, user_agent, geo, screen, status=LoginStatus.FAILED)
            logger.debug(f"=== 2FA LOGIN REQUEST FAILED - INVALID CODE ===")
            return Response({"detail": "Invalid 2FA code"}, status=status.HTTP_401_UNAUTHORIZED)

        cache.delete(f'2fa_code_{email}')
        logger.debug(f"2FA code deleted from cache for user: {email}")

        logger.debug(f"Attempting authentication for user: {email}")
        user = authenticate(
            request,
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"]
        )
        logger.debug(f"Authenticated user: {user}")

        if user is not None:
            logger.debug(f"2FA authentication successful for user: {user.email} (ID: {user.id})")
            try:
                create_login_session(user, request)
                logger.debug(f"2FA login session created successfully for user: {user.email}")
            except Exception as e:
                logger.error(f"Error creating 2FA login session: {e}")
                return Response({"detail": "Error creating login session"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Логирование через Celery
            log_login_event.delay(user.id, ip_address, user_agent, geo, screen)
            logger.debug(f"2FA login event logged via Celery for user: {user.email}")

            logger.debug("2FA login successful, returning response")
            logger.debug(f"=== 2FA LOGIN REQUEST COMPLETED SUCCESSFULLY ===")

            return Response({
                "detail": "Login successful",
                "timestamp": int(datetime.now().timestamp())
            }, status=status.HTTP_201_CREATED)
        else:
            logger.warning("2FA user authentication failed")
            # Используем user из базы данных для логирования, а не результат authenticate
            db_user = User.objects.filter(email=serializer.validated_data["email"]).first()

            ip_remaining_attempts = 0
            # Проверяем и создаём блокировку, если нужно
            if not db_user: # Maria logic 😄
                ip_lockout, ip_remaining_attempts = create_ip_lockout(ip_address)
                if ip_lockout:
                    logger.debug(f"Ip {ip_address} is blocked until {ip_lockout.blocked_until}")
                    return IpBlockedResponse(int(ip_lockout.blocked_until.timestamp()), ip_address)

            user_remaining_attempts = 0

            if db_user:
                log_login_event.delay(db_user.id, ip_address, user_agent, geo, screen, status=LoginStatus.FAILED)
                user_lockout, user_remaining_attempts = create_user_lockout(db_user)
                if user_lockout:
                    logger.debug(f"User {db_user.email} is blocked until {user_lockout.blocked_until}")
                    return AccountLockedResponse(int(user_lockout.blocked_until.timestamp()))
            logger.debug(f"=== 2FA LOGIN REQUEST FAILED ===")
            logger.debug(f"Login failed for user {db_user.email}, ip remaining attempts: {ip_remaining_attempts}, user remaining attempts {user_remaining_attempts}")
            return InvalidCredentialsResponse(max(ip_remaining_attempts, user_remaining_attempts))



@extend_schema(
    tags=['Authentication'],
    summary='Получение CSRF токена',
    description='Получение CSRF токена для защиты от CSRF атак',
    responses={
        200: OpenApiResponse(
            description='CSRF токен'
        )
    }
)
@method_decorator(csrf_exempt, name='dispatch')
class CsrfTokenView(APIView):
    def get(self, request):
        # Получаем CSRF токен
        csrf_token = get_token(request)
        
        # Устанавливаем CSRF токен в cookie
        response = Response({
            'csrf_token': csrf_token
        }, status=status.HTTP_200_OK)
        
        # Устанавливаем CSRF cookie
        response.set_cookie(
            'csrftoken',
            csrf_token,
            max_age=31449600,  # 1 год
            domain=None,
            secure=False,
            httponly=False,
            samesite='Lax'
        )
        
        return response
        

@extend_schema(
    tags=['Authentication'],
    summary='Проверка учетных данных',
    description='Проверяет правильность email и пароля без выполнения аутентификации',
    request=LoginSerializer,
    responses={
        200: OpenApiResponse(description='Учетные данные корректны'),
        400: LoginValidationErrorResponseSerializer,
        401: LoginErrorResponseSerializer,
        404: OpenApiResponse(description='Пользователь не найден'),
        403: OpenApiResponse(description='Пользователь неактивен')
    },
    examples=[
        OpenApiExample(
            'Request Example',
            value={'email': 'user@example.com', 'password': 'password123'},
            request_only=True
        )
    ]
)
@method_decorator(csrf_exempt, name='dispatch')
class ValidateCredentialsView(APIView):
    def post(self, request):
        
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        user = User.objects.filter(email=email).first()
        
        if user and not user.is_active:
            logger.warning(f"Credentials validation attempt for inactive user: {email}")
            return Response({"detail": "User is not active"}, status=status.HTTP_403_FORBIDDEN)
 
        may_user_login, response = may_user_log_in(request, user=user, email=email)
        if not may_user_login:
            return response
        
        # Проверяем учетные данные без аутентификации
        user = authenticate(
            request,
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"]
        )
        logger.debug(f"Credentials validation for user: {user}")
                
        if user is not None:
            logger.info("Credentials validation successful")
            return Response({"detail": "Credentials are valid"}, status=status.HTTP_200_OK)
        else:
            # Параметры запроса для сохранения в логах
            user_agent = request.META.get("HTTP_USER_AGENT", "")
            geo = request.data.get("geo", "")
            screen = request.META.get("HTTP_X_SCREEN_RESOLUTION", "")
            ip_address = request.META.get("HTTP_X_REAL_IP", "") or request.META.get(
                "HTTP_X_FORWARDED_FOR", "")

            logger.warning("Credentials validation failed")

            # Используем user из базы данных для логирования, а не результат authenticate
            db_user = User.objects.filter(email=serializer.validated_data["email"]).first()

            ip_remaining_attempts = 0
            # Проверяем и создаём блокировку, если нужно
            if not db_user: # Maria logic 😄
                ip_lockout, ip_remaining_attempts = create_ip_lockout(ip_address)

                if ip_lockout:
                    logger.debug(f"Ip {ip_address} is blocked until {ip_lockout.blocked_until}")
                    return IpBlockedResponse(int(ip_lockout.blocked_until.timestamp()), ip_address)

            user_remaining_attempts = 0

            if db_user:
                log_login_event.delay(db_user.id, ip_address, user_agent, geo, screen, status=LoginStatus.FAILED)
                user_lockout, user_remaining_attempts = create_user_lockout(db_user)
                if user_lockout:
                    logger.debug(f"User {db_user.email} is blocked until {user_lockout.blocked_until}")
                    return AccountLockedResponse(int(user_lockout.blocked_until.timestamp()))
            logger.debug(f"=== LOGIN REQUEST FAILED ===")
            logger.debug(f"Login failed for user {db_user.email}, ip remaining attempts: {ip_remaining_attempts}, user remaining attempts {user_remaining_attempts}")
            return InvalidCredentialsResponse(max(ip_remaining_attempts, user_remaining_attempts))
