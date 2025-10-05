from rest_framework.authentication import SessionAuthentication # type: ignore
from drf_spectacular.extensions import OpenApiAuthenticationExtension

import logging

logger = logging.getLogger(__name__)


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        logger.info(f"Enforcing CSRF for request {request}")
        return  # Не проверяем CSRF


class CsrfExemptSessionAuthenticationScheme(OpenApiAuthenticationExtension):
    target_class = CsrfExemptSessionAuthentication
    name = 'CsrfExemptSessionAuth'

    def get_security_definition(self, auto_schema):
        return {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        } 