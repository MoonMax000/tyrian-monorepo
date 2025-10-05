"""project URL Configuration
"""

import datetime

from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include, re_path
from django.views.generic import TemplateView

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from rest_framework import permissions

from . import settings


def current_datetime(request):
    # Заглушка для главной страницы сайта
    now = datetime.datetime.now()
    html = "<html><body>It is now %s.</body></html>" % now
    return HttpResponse(html)


api_urls = [
    path("auth/", include("djoser.urls")),
    path("auth/", include("accounts.urls")),
    path("auth/", include("djoser.urls.jwt")),
    path("stocks/", include("stocks.urls")),
]


schema_view = get_schema_view(
    openapi.Info(
        title="Trader's Diary API",
        default_version="v1",
        description="API сервиса Дневника трейдера",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    patterns=[
        path("api/", include(api_urls)),
    ],
    public=True,
    permission_classes=(permissions.AllowAny,),
    url=settings.BASE_URL,
)


urlpatterns = [
    path("api/", include(api_urls)),
    path("admin/", admin.site.urls),
    path("", current_datetime),
]


if settings.DEBUG:
    import debug_toolbar

    urlpatterns = [
        path("__debug__/", include("debug_toolbar.urls")),
    ] + urlpatterns


# Медиа файлы
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


# Swagger
if settings.DEBUG:
    urlpatterns = [
        path(
            "swagger-ui/",
            TemplateView.as_view(
                template_name="swaggerui/swaggerui.html",
                extra_context={"schema_url": "openapi-schema"},
            ),
            name="swagger-ui",
        ),
        re_path(
            r"^swagger(?P<format>\.json|\.yaml)$",
            schema_view.without_ui(cache_timeout=0),
            name="schema-json",
        ),
    ] + urlpatterns
