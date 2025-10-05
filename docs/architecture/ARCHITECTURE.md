# AXA Platform - Архитектура

## 📐 Общая схема платформы

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            AXA PLATFORM                                       │
│                       (Микросервисная архитектура)                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐     ┌──────────────────────────┐
│   FRONTEND LAYER         │     │   API GATEWAY            │
├──────────────────────────┤     ├──────────────────────────┤
│ • Social Web (Next.js)   │────▶│ Traefik (port 8080)      │
│ • Stocks (Next.js)       │     │ • Load Balancer          │
│ • Marketplace (Next.js)  │     │ • API Router             │
│ • CMC (Next.js)          │     │ • Swagger Aggregator     │
│ • Stream (Next.js)       │     └──────────┬───────────────┘
│ • AI Profiles (Next.js)  │                │
│ • Stream Admin (Svelte)  │                │
└──────────────────────────┘                │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MICROSERVICES LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────┐            │
│  │  SOCIAL WEB (axanetwork)                                    │            │
│  ├─────────────────────────────────────────────────────────────┤            │
│  │ • Auth Service         (Go, port 8010)                      │            │
│  │ • Profiles Service     (Go, port 8003)                      │            │
│  │ • Posts Service        (Go, port 8004)                      │            │
│  │ • Notifications        (Go, port 8005)                      │            │
│  │ • Favorites            (Go, port 8006)                      │            │
│  │ • Subscriptions        (Go, port 8007)                      │            │
│  │ • Likes                (Go, port 8008)                      │            │
│  │ • Mail Service         (Go)                                 │            │
│  └─────────────────────────────────────────────────────────────┘            │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────┐            │
│  │  STOCKS (axanetwork)                                        │            │
│  ├─────────────────────────────────────────────────────────────┤            │
│  │ • Core Service         (Django, port 8050)                  │            │
│  │ • Formatter Service    (FastAPI, port 8051)                 │            │
│  │ • Cbonds Client        (Python, port 8054)                  │            │
│  │ • FMP Client           (Python, port 8052)                  │            │
│  │ • Terrapin Client      (Python, port 8054)                  │            │
│  │ • CMC Client           (Python, port 8053)                  │            │
│  │ • Celery Workers       (Python)                             │            │
│  └─────────────────────────────────────────────────────────────┘            │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────┐            │
│  │  COINMARKETCAP (axanetwork)                                 │            │
│  ├─────────────────────────────────────────────────────────────┤            │
│  │ • Auth Service         (Go, port 8081)                      │            │
│  │ • Mail Service         (Go)                                 │            │
│  └─────────────────────────────────────────────────────────────┘            │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────┐            │
│  │  STREAM (streaming network)                                 │            │
│  ├─────────────────────────────────────────────────────────────┤            │
│  │ • Auth Service         (Go, port 8002)                      │            │
│  │ • Chat Service         (Go)                                 │            │
│  │ • Media Service        (Go)                                 │            │
│  │ • Notify Service       (Go)                                 │            │
│  │ • Recommend Service    (Go)                                 │            │
│  │ • Streamer Service     (Go)                                 │            │
│  └─────────────────────────────────────────────────────────────┘            │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────┐            │
│  │  AUTH SERVER (axanetwork)                                   │            │
│  ├─────────────────────────────────────────────────────────────┤            │
│  │ • Auth Core            (Django, port 8001)                  │            │
│  │ • Auth Sync            (Go, port 8000)                      │            │
│  │ • Celery Workers       (Python)                             │            │
│  └─────────────────────────────────────────────────────────────┘            │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────┐            │
│  │  TRADING TERMINAL (axanetwork)                              │            │
│  ├─────────────────────────────────────────────────────────────┤            │
│  │ • Terminal Backend     (Python, port 8061)                  │            │
│  └─────────────────────────────────────────────────────────────┘            │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        INFRASTRUCTURE LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │ DATABASES        │  │ CACHE            │  │ MESSAGE QUEUE    │          │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤          │
│  │ PostgreSQL:      │  │ Redis:           │  │ RabbitMQ:        │          │
│  │ • Auth (5433)    │  │ • Global (6380)  │  │ • Auth (5672)    │          │
│  │ • SocWeb (5432)  │  │ • SocWeb (6379)  │  │ • SocWeb (5671)  │          │
│  │ • Stocks (5435)  │  │ • Stocks (6375)  │  │ • CMC (5673)     │          │
│  │ • CMC (5434)     │  │ • CMC (6378)     │  │ • Stream (5672)  │          │
│  │ • Stream (5437)  │  │ • Stream (6377)  │  │                  │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
│                                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │ STORAGE          │  │ SEARCH           │  │ MONITORING       │          │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤          │
│  │ MinIO (S3):      │  │ Elasticsearch:   │  │ Flower:          │          │
│  │ • Images (9000)  │  │ • Posts (9200)   │  │ • Auth (5556)    │          │
│  │ • Console (9001) │  │                  │  │ • Stocks (5555)  │          │
│  │                  │  │                  │  │                  │          │
│  │                  │  │                  │  │ Redis Commander: │          │
│  │                  │  │                  │  │ • Auth (8003)    │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           DOCKER NETWORKS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────┐               │
│  │  axanetwork                                              │               │
│  │  • Auth Server                                           │               │
│  │  • Social Web (все сервисы)                              │               │
│  │  • Stocks                                                │               │
│  │  • CoinMarketCap                                         │               │
│  │  • Trading Terminal                                      │               │
│  │  • Marketplace                                           │               │
│  │  • AI Profiles                                           │               │
│  └──────────────────────────────────────────────────────────┘               │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────┐               │
│  │  streaming                                               │               │
│  │  • Stream Auth                                           │               │
│  │  • Stream Chat                                           │               │
│  │  • Stream Media                                          │               │
│  │  • Stream Notify                                         │               │
│  │  • Stream Recommend                                      │               │
│  │  • Stream Streamer                                       │               │
│  └──────────────────────────────────────────────────────────┘               │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Взаимодействие сервисов

### 1. Social Web
```
User → Frontend (3001)
  ↓
Traefik Balancer (8080)
  ↓
Microservices:
  • /api/v1/auth → Auth Service (8010)
  • /api/v1/profile → Profiles (8003)
  • /api/v1/posts → Posts (8004)
  • /api/v1/notifications → Notifications (8005)
  • /api/v1/favorites → Favorites (8006)
  • /api/v1/subscriptions → Subscriptions (7007)
  • /api/v1/likes → Likes (8008)
  ↓
Infrastructure:
  • PostgreSQL (5432) - Данные
  • Redis (6379) - Кэш, сессии
  • RabbitMQ (5671) - Асинхронные задачи
  • Elasticsearch (9200) - Поиск по постам
  • MinIO (9000) - Файлы, изображения
```

### 2. Stocks (Биржа)
```
User → Frontend (3002)
  ↓
Core Service (8050) - Django REST
  ↓
Formatter (8051) - FastAPI
  ↓
Web Clients:
  • Cbonds → Получение данных облигаций
  • FMP → Financial Modeling Prep API
  • Terrapin → Данные с Terrapin
  • CMC → CoinMarketCap данные
  ↓
Infrastructure:
  • PostgreSQL (5435) - Данные
  • Redis (6375) - Кэш
  • Celery - Фоновые задачи (обновление данных)
```

### 3. CoinMarketCap
```
User → Frontend (3003)
  ↓
Auth Service (8081)
  ↓
Infrastructure:
  • PostgreSQL (5434) - Данные
  • Redis (6378) - Кэш
  • RabbitMQ (5673) - Почта
```

### 4. Stream
```
User → Frontend (3000)
  ↓
Traefik Balancer (8082)
  ↓
Microservices:
  • Auth (8002)
  • Chat - Чаты
  • Media - Видео стримы
  • Notify - Уведомления
  • Recommend - Рекомендации
  • Streamer - Управление стримерами
  ↓
Infrastructure:
  • PostgreSQL (5437)
  • Redis (6377)
  • RabbitMQ (5672)
```

### 5. Auth Server (Глобальный)
```
Request → Auth Sync API (8000)
  ↓
Auth Core (8001) - Django
  ↓
Celery Tasks:
  • Очистка сессий
  • Синхронизация с микросервисами
  ↓
Infrastructure:
  • PostgreSQL (5433)
  • Redis (6380)
  • RabbitMQ (5672)
```

---

## 🗂️ Структура данных

### PostgreSQL Databases

| База данных | Сервис | Порт | Назначение |
|------------|--------|------|------------|
| `auth_db` | Auth Server | 5433 | Глобальная аутентификация |
| `socweb_auth` | Social Web Auth | 5432 | Пользователи соцсети |
| `socweb_profiles` | Social Web Profiles | 5432 | Профили |
| `socweb_posts` | Social Web Posts | 5432 | Посты |
| `socweb_notifications` | Social Web Notifications | 5432 | Уведомления |
| `socweb_favorites` | Social Web Favorites | 5432 | Избранное |
| `socweb_subscriptions` | Social Web Subscriptions | 5432 | Подписки |
| `socweb_likes` | Social Web Likes | 5432 | Лайки |
| `td_db` | Stocks | 5435 | Дневник трейдера |
| `cmc_auth` | CoinMarketCap | 5434 | Крипто платформа |
| `stream_auth` | Stream | 5437 | Стриминг |
| `tt_db` | Trading Terminal | 5436 | Торговый терминал |

### Redis Instances

| Instance | Сервис | Порт | Назначение |
|----------|--------|------|------------|
| `global-redis` | Auth Server | 6380 | Celery, кэш |
| `socweb-redis` | Social Web | 6379 | Сессии, кэш |
| `stocks-redis` | Stocks | 6375 | Celery, кэш |
| `cmc-redis` | CoinMarketCap | 6378 | Кэш |
| `stream-redis` | Stream | 6377 | Сессии, кэш |

### RabbitMQ Instances

| Instance | Сервис | Порт | Назначение |
|----------|--------|------|------------|
| Auth RabbitMQ | Auth Server | 5672 | Межсервисные сообщения |
| SocWeb RabbitMQ | Social Web | 5671 | Почта, уведомления |
| CMC RabbitMQ | CoinMarketCap | 5673 | Почта |
| Stream RabbitMQ | Stream | 5672 | Уведомления, стримы |

---

## 🔐 Аутентификация

### Схема аутентификации

```
1. User вводит логин/пароль
   ↓
2. Frontend → Auth Service
   ↓
3. Auth Service проверяет в PostgreSQL
   ↓
4. Создается сессия в Redis
   ↓
5. Возвращается session_id
   ↓
6. Frontend сохраняет в cookies/localStorage
   ↓
7. При запросах к другим сервисам:
   Frontend отправляет session_id
   ↓
8. Каждый микросервис валидирует через Redis
```

### Типы аутентификации

1. **Auth Server (Глобальный)**
   - Email/Password
   - Создание пользователей для всех подсистем
   - Синхронизация между сервисами

2. **Social Web Auth**
   - Email/Password
   - Email подтверждение
   - Сброс пароля
   - OAuth (опционально)

3. **CoinMarketCap Auth**
   - Email/Password
   - Интеграция с Auth Server

4. **Stream Auth**
   - Email/Password
   - Для стримеров и зрителей

---

## 📊 Масштабирование

### Горизонтальное масштабирование

Каждый микросервис может быть масштабирован независимо:

```yaml
# Пример: увеличить количество инстансов
docker-compose up -d --scale socweb-posts-service=3
```

### Вертикальное масштабирование

Настройка ресурсов в `docker-compose.yml`:

```yaml
services:
  service-name:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

---

## 🔍 Мониторинг и логирование

### Доступные инструменты

1. **Traefik Dashboard** (8090, 8092)
   - Маршрутизация запросов
   - Статистика
   - Swagger агрегация

2. **Flower** (5555, 5556)
   - Celery задачи
   - Очереди
   - Воркеры

3. **RabbitMQ Management** (15671, 15672, 15673)
   - Очереди сообщений
   - Exchanges
   - Consumers

4. **Redis Commander** (8003)
   - Просмотр Redis данных
   - Управление ключами

5. **Docker Logs**
   ```bash
   docker logs <container_name> -f
   docker-compose logs -f
   ```

---

## 🚦 Health Checks

### Проверка сервисов

```bash
# Social Web
curl http://localhost:8080/api/v1/docs

# Stocks
curl http://localhost:8050/health/

# Auth Server
curl http://localhost:8001/health/

# CoinMarketCap
curl http://localhost:8081/api/v1/docs

# Stream
curl http://localhost:8082/api/v1/docs
```

---

## 📈 Производительность

### Рекомендуемые ресурсы

| Компонент | CPU | RAM | Disk |
|-----------|-----|-----|------|
| PostgreSQL | 2 cores | 2GB | 20GB |
| Redis | 1 core | 1GB | 5GB |
| RabbitMQ | 1 core | 512MB | 5GB |
| Elasticsearch | 2 cores | 2GB | 20GB |
| Go Services | 1 core | 512MB | - |
| Django Services | 2 cores | 1GB | - |
| Next.js Frontend | 1 core | 512MB | - |

**Итого для полной платформы**: 16-32GB RAM, 8+ CPU cores

---

## 🔒 Безопасность

### Защита

1. **API Gateway (Traefik)**
   - Rate limiting
   - CORS настройки
   - SSL/TLS (в продакшене)

2. **Аутентификация**
   - Session-based с Redis
   - Secure cookies
   - Password hashing (bcrypt/argon2)

3. **База данных**
   - Подготовленные запросы (защита от SQL injection)
   - Ограниченные права пользователей
   - Бэкапы

4. **Docker**
   - Изолированные сети
   - Лимиты ресурсов
   - Read-only файловые системы (где возможно)

---

## 📝 Дополнительные материалы

- `PLATFORM_SETUP.md` - Полная инструкция по установке
- `QUICK_START.md` - Быстрый старт
- `start-platform.sh` - Автоматический запуск
- `stop-platform.sh` - Остановка всех сервисов

---

**Версия**: 1.0  
**Последнее обновление**: Октябрь 2025


