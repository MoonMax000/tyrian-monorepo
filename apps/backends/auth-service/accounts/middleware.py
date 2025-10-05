import logging
import json
from django.contrib.auth.hashers import identify_hasher # type: ignore
from django.utils.deprecation import MiddlewareMixin # type: ignore

logger = logging.getLogger(__name__)


class PasswordHasherLoggingMiddleware(MiddlewareMixin):
    """Middleware для логирования используемого PASSWORD HASHER"""
    
    def process_request(self, request):
        # Логируем информацию о PASSWORD HASHERS при каждом запросе
        from django.conf import settings
        logger.info(f"Available PASSWORD_HASHERS: {settings.PASSWORD_HASHERS}")
        return None


class RequestLoggingMiddleware(MiddlewareMixin):
    """Middleware для логирования запросов и ответов"""
    
    def process_request(self, request):
        logger.info(f"Request: {request.method} {request.path}")
        return None
    
    def process_response(self, request, response):
        logger.info(f"Response: {response.status_code} for {request.method} {request.path}")
        return response


class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Логируем информацию о запросе
        logger.info("=== RequestLoggingMiddleware ===")
        logger.info(f"Request method: {request.method}")
        logger.info(f"Request path: {request.path}")
        logger.info(f"Request content type: {request.content_type}")
        logger.info(f"Request headers: {dict(request.headers)}")
        
        # Логируем тело запроса
        if request.method in ['POST', 'PUT', 'PATCH']:
            try:
                if hasattr(request, 'body'):
                    logger.info(f"Request body (raw): {request.body}")
                
                # Пытаемся получить данные из request.data (если уже обработаны)
                if hasattr(request, 'data'):
                    logger.info(f"Request data: {request.data}")
                
                # Пытаемся получить данные из request.POST
                if hasattr(request, 'POST'):
                    logger.info(f"Request POST: {dict(request.POST)}")
                    
            except Exception as e:
                logger.error(f"Error logging request body: {e}")
        
        response = self.get_response(request)
        
        # Логируем ответ
        logger.info(f"Response status: {response.status_code}")
        logger.info(f"Response headers: {dict(response.headers)}")
        
        # Логируем тело ответа для ошибок
        if response.status_code >= 400:
            try:
                if hasattr(response, 'content'):
                    logger.info(f"Response content: {response.content}")
                if hasattr(response, 'data'):
                    logger.info(f"Response data: {response.data}")
            except Exception as e:
                logger.error(f"Error logging response body: {e}")
        
        logger.info("=== End RequestLoggingMiddleware ===")
        
        return response 