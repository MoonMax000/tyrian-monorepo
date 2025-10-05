"""Django settings for the project."""

from datetime import timedelta
from environs import Env
import os
from pathlib import Path

env = Env()
env.read_env()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = env.str("SECRET_KEY")
AXA_SERVICES_SECRET_KEY = env.str("AXA_SERVICES_SECRET_KEY")

DEBUG = env.bool("DEBUG")

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")
if DEBUG:
    ALLOWED_HOSTS.extend(['localhost', '127.0.0.1'])

# Приложения Django
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

# Внешние библиотеки
EXTERNAL_LIBS = [
    "debug_toolbar",
    "django_celery_beat",
    "rest_framework",
    "rest_framework.authtoken",
    "djoser",
    "corsheaders",
]

# Внешние библиотеки
EXTERNAL_LIBS_MUST_BE_FIRST = [
    "jazzmin",
]

# Приложения самого проекта
PROJECT_APPS = [
    "accounts.apps.AccountsConfig",
    "stocks.apps.StocksConfig",
]

INSTALLED_APPS = (
    EXTERNAL_LIBS_MUST_BE_FIRST + DJANGO_APPS + EXTERNAL_LIBS + PROJECT_APPS
)


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "debug_toolbar.middleware.DebugToolbarMiddleware",
    "project.middleware.NormalizePathMiddleware",
]

# Настройки кэширования и сессий через Redis
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": f"redis://host.docker.internal:6378/0",
    }
}


SESSION_ENGINE = "accounts.backends"
SESSION_CACHE_ALIAS = "default"


ROOT_URLCONF = "project.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            os.path.join(BASE_DIR, "templates"),
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "project.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": env.str("DB_NAME"),
        "USER": env.str("DB_USER"),
        "PASSWORD": env.str("DB_PASS"),
        "HOST": env.str("DB_HOST"),
        "PORT": env("DB_PORT"),
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = "ru-RU"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = "static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "templates/static"),
]
MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

AUTH_USER_MODEL = "accounts.User"

if DEBUG:
    INTERNAL_IPS = ALLOWED_HOSTS

# Настройки email
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = env.str("EMAIL_HOST")
EMAIL_PORT = env("EMAIL_PORT")
EMAIL_USE_SSL = env.bool("EMAIL_USE_SSL")
EMAIL_HOST_PASSWORD = env.str("EMAIL_HOST_PASSWORD")
EMAIL_HOST_USER = env.str("EMAIL_HOST_USER")
DEFAULT_FROM_EMAIL = env.str("DEFAULT_FROM_EMAIL")

# Настройки Redis
REDIS_HOST = "127.0.0.1"
REDIS_PORT = 6378

# Настройки Celery
CELERY_BROKER_URL = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"
CELERY_RESULT_BACKEND = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"

# Настройки Swagger
BASE_URL = env.str("BASE_URL")

# Данные от сервиса авторизации
AUTH_SERVICE_API_URL = env.str("AUTH_SERVICE_API_URL")
AUTH_SERVICE_API_KEY = env.str("AUTH_SERVICE_API_KEY")

# Настройки CSRF
CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS")


# Настройки CORS
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS")

# Дополнительные настройки CORS
CORS_ALLOW_ALL_ORIGINS = env.bool("CORS_ALLOW_ALL_ORIGINS", default=False)
CORS_ALLOWED_ORIGIN_REGEXES = env.list("CORS_ALLOWED_ORIGIN_REGEXES", default=[])

# Разрешенные методы HTTP
CORS_ALLOWED_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

# Разрешенные заголовки
CORS_ALLOWED_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
    "x-auth-token",
    "x-api-key",
]

# Заголовки, которые будут доступны клиенту
CORS_EXPOSE_HEADERS = [
    "content-type",
    "content-length",
    "x-auth-token",
    "x-api-key",
]

# Максимальное время кэширования preflight запросов (в секундах)
CORS_PREFLIGHT_MAX_AGE = 86400

# Разрешить передачу cookies
CORS_ALLOW_CREDENTIALS = True

SWAGGER_SETTINGS = {
    "USE_SESSION_AUTH": True,
    "SECURITY_DEFINITIONS": None,
}

# Настройки логирования
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {message}",
            "style": "{",
        },
        "simple": {
            "format": "{levelname} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
        "telegram": {
            "level": "ERROR",
            "class": "errformer.handlers.TelegramErrformerHandler",
            "formatter": "verbose",
        },
    },
    "loggers": {
        "": {  # Корневой логгер (все логи)
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": True,
        },
        "django": {
            "handlers": ["console"],
            "level": "DEBUG",
            "propagate": False,
        },
        "stocks": {
            "handlers": ["console", "telegram"],
            "level": "DEBUG",
            "propagate": False,
        },
        "django_redis": {
            "level": "DEBUG",
            "handlers": ["console"],
        },
    },
}


# Настройки кэширования
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"redis://{REDIS_HOST}:{REDIS_PORT}/0",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}

# Настройки Errformer
ERRFORMER_TELEGRAM_BOT_TOKEN = env.str("ERRFORMER_TELEGRAM_BOT_TOKEN")
ERRFORMER_ADMIN_CHAT_ID = env.str("ERRFORMER_ADMIN_CHAT_ID")
ERRFORMER_INCLUDE_TRACEBACK = False
ERRFORMER_PROJECT_NAME = "Axa stocks"

# Настройки Formatter
FORMATTER_HOST = env.str("FORMATTER_HOST", "stocks-formatter")
FORMATTER_PORT = env("FORMATTER_PORT", 8051)
FORMATTER_PREFIX = env.str("FORMATTER_PREFIX", "/api/v1")
FORMATTER_BASE_URL = f"http://{FORMATTER_HOST}:{FORMATTER_PORT}{FORMATTER_PREFIX}/get-block"
# Настройки DRF
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'accounts.backends.EmailSessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}


# Настройки для источников данных
FMP_DEFAULT_REPORTS_PERIOD = "quarter"

# Настройки Jazzmin
JAZZMIN_SETTINGS = {
    "site_title": "Admin Panel",
    "site_header": "Admin Panel",
    "site_brand": "Admin Panel",
    "site_logo": None,
    "welcome_sign": "Добро пожаловать в панель администратора",
    "copyright": "Admin Panel",
    "search_model": ["accounts.User"],
    "user_avatar": None,
    "topmenu_links": [
        {"name": "Home", "url": "admin:index", "permissions": ["auth.view_user"]},
    ],
    "show_sidebar": True,
    "navigation_expanded": True,
    "icons": {
        "auth": "fas fa-users-cog",
        "accounts.user": "fas fa-user",
        "stocks": "fas fa-chart-line",
    },
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
    "related_modal_active": False,
    "custom_css": None,
    "custom_js": None,
    "show_ui_builder": False,
    "changeform_format": "horizontal_tabs",
    "changeform_format_overrides": {
        "accounts.user": "collapsible",
    },
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": False,
    "accent": "accent-primary",
    "navbar": "navbar-white navbar-light",
    "no_navbar_border": False,
    "navbar_fixed": False,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": False,
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": False,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": False,
    "theme": "default",
    "dark_mode_theme": None,
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success"
    }
}
