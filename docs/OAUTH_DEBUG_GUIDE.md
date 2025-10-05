# 🔐 Google OAuth Debug Guide

## Проблема: Зависание при OAuth авторизации

### Симптомы
- ✅ Окно Google OAuth открывается
- ✅ Пользователь выбирает аккаунт
- ✅ Нажимает "Продолжить"
- ❌ **Зависает на несколько минут**
- ❌ Никаких ошибок в консоли браузера

---

## Причина

**RabbitMQ и Celery sync в Django Signals блокировали HTTP response!**

### Что происходило:

```python
# accounts/signals/user_rabbitmq_sync.py
@receiver(post_save, sender=User)
def sync_user_to_rabbitmq(sender, instance, created, **kwargs):
    # Этот signal вызывался при каждом сохранении User
    # Пытался подключиться к RabbitMQ (который не запущен)
    # Celery пытался подключиться к Redis (20 retries по 1 секунде = 20+ секунд зависания)
```

### Логи показывали:

```
INFO accounts.signals.user_rabbitmq_sync User 3 was created, triggering RabbitMQ sync
ERROR celery.backends.redis Connection to Redis lost: Retry (0/20) now.
ERROR celery.backends.redis Connection to Redis lost: Retry (1/20) in 1.00 second.
ERROR celery.backends.redis Connection to Redis lost: Retry (2/20) in 1.00 second.
...
```

**Request зависал пока Celery пытался подключиться!**

---

## Решение

### 1. Отключить RabbitMQ Sync для разработки

**Файл:** `accounts/signals/__init__.py`

```python
from .delete_login_session import delete_login_session
from .create_user_profile import create_user_profile
# ВРЕМЕННО ОТКЛЮЧЕНО для разработки (RabbitMQ недоступен)
# from .user_rabbitmq_sync import sync_user_to_rabbitmq

__all__ = ('delete_login_session', 'create_user_profile')  # 'sync_user_to_rabbitmq' отключен
```

---

### 2. Включить Celery EAGER mode для разработки

**Файл:** `core/settings.py`

```python
# Celery
# Отключаем Celery для тестов И режима разработки (если нет Redis)
if TESTING or DEBUG:
    # Синхронный режим - tasks выполняются немедленно без Redis/RabbitMQ
    CELERY_BROKER_URL = 'memory://'
    CELERY_RESULT_BACKEND = 'rpc://'
    CELERY_TASK_ALWAYS_EAGER = True
    CELERY_TASK_EAGER_PROPAGATES = True
    print("🔧 CELERY: Running in EAGER mode (без Redis)")
    # Используем локальный кэш для разработки
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        }
    }
else:
    # Production mode - используем Redis
    CELERY_BROKER_URL = f'redis://{os.getenv("REDIS_HOST", "global-redis")}:{os.getenv("REDIS_PORT", 6378)}/0'
    CELERY_RESULT_BACKEND = CELERY_BROKER_URL
```

**Что это дает:**
- ✅ Celery tasks выполняются **синхронно** в том же процессе
- ✅ Не требуется Redis/RabbitMQ
- ✅ Мгновенный response от Auth Service
- ✅ Никаких таймаутов

---

### 3. Использовать Database Sessions вместо Redis

**Файл:** `core/settings.py`

```python
# Session settings
# Используем database sessions вместо Redis для разработки
SESSION_ENGINE = "django.contrib.sessions.backends.db"
# SESSION_ENGINE = "accounts.backends"  # Закомментировано - требует Redis
SESSION_CACHE_ALIAS = "default"
SESSION_COOKIE_AGE = int(os.getenv('SESSION_COOKIE_AGE', 60 * 60 * 24 * 7))  # 7 дней
```

**Что это дает:**
- ✅ Sessions сохраняются в SQLite database
- ✅ Не требуется Redis
- ✅ Работает из коробки

---

## Дополнительная проблема: 404 на `/api/accounts/profile/`

### Симптом
Frontend делал запрос к `/api/accounts/profile/`, но получал 404.

### Причина
Endpoint не существует. Правильный endpoint: **`/api/accounts/me/`**

### Решение

**Исправить в Frontend компонентах:**

**Файл:** `libs/shared/ui/src/lib/components/Header.tsx`
```typescript
// БЫЛО:
const response = await fetch('http://localhost:8001/api/accounts/profile/', {

// СТАЛО:
const response = await fetch('http://localhost:8001/api/accounts/me/', {
```

**Файл:** `libs/shared/ui/src/lib/components/UserProfile.tsx`
```typescript
// БЫЛО:
const response = await fetch(`${authServiceUrl}/api/accounts/profile/`, {

// СТАЛО:
const response = await fetch(`${authServiceUrl}/api/accounts/me/`, {
```

---

## Как диагностировать такие проблемы в будущем

### 1. Проверить логи Django Auth Service

```bash
tail -f /tmp/auth-service.log
```

**Смотреть на:**
- `ERROR celery.backends.redis` - Celery не может подключиться к Redis
- `ERROR accounts.backends.json_session_store Timeout` - Session store недоступен
- `INFO accounts.signals.user_rabbitmq_sync` - RabbitMQ sync пытается выполниться

---

### 2. Проверить CORS и Endpoints

```bash
# Проверить что endpoint существует
curl -s http://localhost:8001/api/accounts/me/

# Проверить CORS headers
curl -s -I -H "Origin: http://localhost:4205" http://localhost:8001/api/accounts/me/
```

---

### 3. Использовать тестовую страницу

Создать простой HTML тестер:

```html
<!DOCTYPE html>
<html>
<head><title>OAuth Test</title></head>
<body>
  <button onclick="testLogin()">Test Login</button>
  <script>
    async function testLogin() {
      const start = Date.now();
      const response = await fetch('http://localhost:8001/api/accounts/google/');
      const duration = Date.now() - start;
      console.log(`Fetch completed in ${duration}ms`);
      const data = await response.json();
      console.log(data);
    }
  </script>
</body>
</html>
```

Запустить:
```bash
cd tyrian-monorepo
python3 -m http.server 3000
# Открыть http://localhost:3000/test.html
```

---

## Чеклист для запуска Auth Service в разработке

### Обязательные переменные окружения:

```bash
export DEBUG="True"
export ALLOWED_HOSTS="localhost,127.0.0.1"
export DJANGO_SETTINGS_MODULE="core.settings"

# CORS (КРИТИЧНО!)
export CORS_ALLOW_ALL_ORIGINS="True"
export CORS_ALLOW_CREDENTIALS="True"

# CSRF
export CSRF_TRUSTED_ORIGINS="http://localhost:3000,http://localhost:4201,http://localhost:4202,http://localhost:4203,http://localhost:4204,http://localhost:4205,http://localhost:4206,http://localhost:5173"

# Google OAuth
export GOOGLE_CLIENT_ID="your-client-id"
export GOOGLE_CLIENT_SECRET="your-client-secret"
export GOOGLE_REDIRECT_URI="http://localhost:8001/api/accounts/google/callback/"

# Frontend URL для редиректа
export MARKETPLACE_URL="http://localhost:4205"

# Database (SQLite для разработки)
export DATABASE_URL="sqlite:///db.sqlite3"
```

### Запуск:

```bash
cd AXA-auth-server-main/auth-core
source venv/bin/activate
python manage.py migrate
python manage.py runserver 8001
```

**ВАЖНО:** Использовать `python manage.py runserver`, НЕ `uvicorn`!  
Иначе Django middleware (включая CORS) не будет применяться!

---

## Production: Как включить Redis/RabbitMQ

### 1. Раскомментировать RabbitMQ sync

**Файл:** `accounts/signals/__init__.py`
```python
from .user_rabbitmq_sync import sync_user_to_rabbitmq  # Раскомментировать
__all__ = ('delete_login_session', 'create_user_profile', 'sync_user_to_rabbitmq')
```

---

### 2. Установить переменные окружения

```bash
export DEBUG="False"
export REDIS_HOST="your-redis-host"
export REDIS_PORT="6379"
export RABBITMQ_URL="amqp://user:pass@host:5672//"
```

---

### 3. Использовать Redis sessions

**Файл:** `core/settings.py`
```python
if not DEBUG:
    SESSION_ENGINE = "accounts.backends"  # Redis session backend
```

---

## Итоговые файлы для запуска

### `START_AUTH.sh`
```bash
#!/bin/bash

cd "/path/to/AXA-auth-server-main/auth-core"
source venv/bin/activate

export DEBUG="True"
export ALLOWED_HOSTS="localhost,127.0.0.1"
export CORS_ALLOW_ALL_ORIGINS="True"
export CORS_ALLOW_CREDENTIALS="True"
export CSRF_TRUSTED_ORIGINS="http://localhost:3000,http://localhost:4201,..."
export GOOGLE_CLIENT_ID="..."
export GOOGLE_CLIENT_SECRET="..."
export GOOGLE_REDIRECT_URI="http://localhost:8001/api/accounts/google/callback/"
export MARKETPLACE_URL="http://localhost:4205"
export DATABASE_URL="sqlite:///db.sqlite3"

python manage.py migrate
python manage.py runserver 8001
```

---

## Полезные команды для дебага

```bash
# Проверить что Auth Service работает
curl -s http://localhost:8001/api/accounts/google/ | jq

# Проверить сессию пользователя (с cookies)
curl -s -b "sessionid=xxx" http://localhost:8001/api/accounts/me/ | jq

# Посмотреть все endpoints
curl -s http://localhost:8001/api/accounts/ | jq

# Мониторить логи в реальном времени
tail -f /tmp/auth-service.log | grep -E "(ERROR|WARNING|INFO)"

# Проверить процессы на портах
lsof -i :8001
lsof -i :4205
```

---

## Ключевые выводы

1. ✅ **Django Signals могут блокировать HTTP response!**  
   → Использовать Celery в EAGER mode для разработки

2. ✅ **Redis/RabbitMQ не нужны для разработки!**  
   → Database sessions + in-memory Celery

3. ✅ **Всегда проверять логи Django на ERROR/WARNING**  
   → `tail -f` - твой лучший друг

4. ✅ **CORS должен быть настроен ПРАВИЛЬНО**  
   → `CORS_ALLOW_ALL_ORIGINS=True` для разработки

5. ✅ **Использовать `manage.py runserver`, НЕ uvicorn**  
   → Иначе middleware не работает

---

## Дальнейшие улучшения

### Для Production:
1. Настроить Celery workers отдельно
2. Использовать Redis для sessions и cache
3. Настроить RabbitMQ для async tasks
4. Добавить monitoring для Celery tasks

### Для разработки:
1. Создать `docker-compose.dev.yml` с Redis/RabbitMQ (опционально)
2. Добавить health checks для всех сервисов
3. Автоматизировать запуск всех сервисов одной командой

---

**Дата создания:** 5 октября 2025  
**Версия:** 1.0  
**Статус:** ✅ Проверено и работает

