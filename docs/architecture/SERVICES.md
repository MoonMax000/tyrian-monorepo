# AXA Platform - Полный список сервисов

## 📋 Содержание
1. [Auth Server](#auth-server)
2. [Social Web](#social-web)
3. [Stocks](#stocks)
4. [CoinMarketCap](#coinmarketcap)
5. [Stream](#stream)
6. [Marketplace](#marketplace)
7. [Trading Terminal](#trading-terminal)
8. [AI Profiles](#ai-profiles)
9. [Дополнительные сервисы](#дополнительные-сервисы)
10. [Инфраструктура](#инфраструктура)

---

## Auth Server

### Основные сервисы

| Сервис | Технология | Порт | Описание | Директория |
|--------|------------|------|----------|------------|
| Auth Sync | Go | 8000 | API синхронизации пользователей | `AXA-auth-server-main/auth-sync` |
| Auth Core | Django | 8001 | Основной API аутентификации | `AXA-auth-server-main/auth-core` |
| Celery Worker | Python | - | Фоновые задачи | `AXA-auth-server-main/auth-core` |
| Celery Beat | Python | - | Планировщик задач | `AXA-auth-server-main/auth-core` |

### Инфраструктура

| Сервис | Порт | Описание |
|--------|------|----------|
| PostgreSQL | 5433 | База данных `auth_db` |
| Redis | 6380 | Кэш и Celery broker |
| Flower | 5556 | Мониторинг Celery |
| Redis Commander | 8003 | Управление Redis |

### Зависимости
- PostgreSQL
- Redis
- RabbitMQ (опционально)

### Docker Network
`axanetwork` (создаётся автоматически)

---

## Social Web

### Микросервисы

| Сервис | Технология | Порт | API Path | Описание | Директория |
|--------|------------|------|----------|----------|------------|
| Auth | Go | 8010 | `/api/v1/auth` | Аутентификация, регистрация | `AXA-socialweb-auth-main` |
| Profiles | Go | 8003 | `/api/v1/profile` | Профили пользователей | `AXA-socialweb-profiles-main` |
| Posts | Go | 8004 | `/api/v1/posts` | Создание и просмотр постов | `AXA-socialweb-posts-main` |
| Notifications | Go | 8005 | `/api/v1/notifications` | Уведомления | `AXA-socialweb-notifications-main` |
| Favorites | Go | 8006 | `/api/v1/favorites` | Избранное | `AXA-socialweb-favorites-main` |
| Subscriptions | Go | 8007 | `/api/v1/subscriptions` | Подписки на пользователей | `AXA-socialweb-subscriptions-main` |
| Likes | Go | 8008 | `/api/v1/likes` | Лайки постов | `AXA-socialweb-likes-main` |
| Mail | Go | - | - | Отправка почты | `AXA-socialweb-mail-main` |

### Фронтенд

| Сервис | Технология | Порт | Описание | Директория |
|--------|------------|------|----------|------------|
| Frontend | Next.js | 3001 | Веб-интерфейс соцсети | `AXA-socialweb-frontend-main` |

### Инфраструктура

| Сервис | Порт | Описание |
|--------|------|----------|
| Traefik | 8080 | API Gateway / Load Balancer |
| Traefik Dashboard | 8090 | Мониторинг Traefik |
| PostgreSQL | 5432 | Базы данных всех микросервисов |
| Redis | 6379 | Кэш и сессии |
| RabbitMQ | 5671 | Очереди сообщений |
| RabbitMQ Management | 15671 | Управление RabbitMQ |
| Elasticsearch | 9200 | Поиск по постам |
| MinIO | 9000 | Хранилище файлов (S3) |
| MinIO Console | 9001 | Управление MinIO |

### Базы данных PostgreSQL

| База данных | Сервис | Описание |
|-------------|--------|----------|
| `socweb_auth` | Auth | Пользователи, сессии |
| `socweb_profiles` | Profiles | Профили |
| `socweb_posts` | Posts | Посты |
| `socweb_notifications` | Notifications | Уведомления |
| `socweb_favorites` | Favorites | Избранное |
| `socweb_subscriptions` | Subscriptions | Подписки |
| `socweb_likes` | Likes | Лайки |

### Зависимости

```
Auth Service:
  - PostgreSQL (socweb-postgres)
  - Redis (socweb-redis)
  - RabbitMQ (socweb-rabbitmq)
  - MinIO (socweb-minio)
  - Elasticsearch (socweb-elasticsearch)

Profiles Service:
  - PostgreSQL
  - Redis
  - Auth Service (для валидации)

Posts Service:
  - PostgreSQL
  - Redis
  - Elasticsearch
  - Auth Service

Notifications Service:
  - PostgreSQL
  - RabbitMQ
  - Auth Service

Favorites/Subscriptions/Likes:
  - PostgreSQL
  - Auth Service
```

### Docker Network
`axanetwork` (внешняя)

---

## Stocks

### Основные сервисы

| Сервис | Технология | Порт | Описание | Директория |
|--------|------------|------|----------|------------|
| Core | Django | 8050 | Основной API | `AXA-stocks-backend-main/core` |
| Formatter | FastAPI | 8051 | Форматирование данных | `AXA-stocks-backend-main/formatter` |
| Celery Worker | Python | - | Фоновые задачи | `AXA-stocks-backend-main/core` |
| Celery Beat | Python | - | Планировщик | `AXA-stocks-backend-main/core` |

### Web Clients (агрегаторы данных)

| Сервис | Технология | Порт | Описание | Директория |
|--------|------------|------|----------|------------|
| Cbonds Client | Python | 8054 | Данные облигаций | `AXA-stocks-backend-main/web-clients/cbonds` |
| FMP Client | Python | 8052 | Financial Modeling Prep | `AXA-stocks-backend-main/web-clients/fmp` |
| Terrapin Client | Python | 8054 | Данные Terrapin | `AXA-stocks-backend-main/web-clients/terrapin` |
| CMC Client | Python | 8053 | CoinMarketCap данные | `AXA-stocks-backend-main/web-clients/cmc` |

### Фронтенд

| Сервис | Технология | Порт | Описание | Директория |
|--------|------------|------|----------|------------|
| Frontend | Next.js | 3002 | Дневник трейдера | `AXA-stocks-frontend-main` |

### Инфраструктура

| Сервис | Порт | Описание |
|--------|------|----------|
| PostgreSQL | 5435 | База данных `td_db` |
| Redis | 6375 | Celery broker, кэш |
| Flower | 5555 | Мониторинг Celery |

### Зависимости

```
Core Service:
  - PostgreSQL (stocks-db)
  - Redis (stocks-redis)
  - Formatter Service

Formatter Service:
  - Redis
  - Web Clients (Cbonds, FMP, Terrapin, CMC)

Celery:
  - Redis
  - PostgreSQL
```

### Docker Network
`axanetwork` (внешняя)

---

## CoinMarketCap

### Основные сервисы

| Сервис | Технология | Порт | Описание | Директория |
|--------|------------|------|----------|------------|
| Auth | Go | 8081 | Аутентификация | `AXA-coinmarketcap-auth-main` |
| Mail | Go | - | Почтовый сервис | `AXA-coinmarketcap-mail-main` |

### Фронтенд

| Сервис | Технология | Порт | Описание | Директория |
|--------|------------|------|----------|------------|
| Frontend | Next.js | 3003 | Крипто-платформа | `AXA-coinmarketcap-main` |

### Инфраструктура

| Сервис | Порт | Описание |
|--------|------|----------|
| PostgreSQL | 5434 | База данных `cmc_auth` |
| Redis | 6378 | Кэш |
| RabbitMQ | 5673 | Очереди сообщений |
| RabbitMQ Management | 15673 | Управление RabbitMQ |

### Зависимости

```
Auth Service:
  - PostgreSQL (cmc-postgres)
  - Redis (cmc-redis)
  - RabbitMQ (cmc-rabbitmq)

Mail Service:
  - RabbitMQ
```

### Docker Network
`axanetwork`

---

## Stream

### Микросервисы

| Сервис | Технология | Порт | API Path | Описание | Директория |
|--------|------------|------|----------|----------|------------|
| Auth | Go | 8002 | `/api/v1/auth` | Аутентификация | `stream-auth-service-master` |
| Chat | Go | - | `/api/v1/chat` | Чаты | `stream-chat-service-main` |
| Media | Go | - | `/api/v1/media` | Видео стримы | `stream-media-service-main` |
| Notify | Go | - | `/api/v1/notify` | Уведомления | `stream-notify-service-main` |
| Recommend | Go | 8007 | `/api/v1/recommend` | Рекомендации | `stream-recommend-service-main` |
| Streamer | Go | - | `/api/v1/streamer` | Управление стримерами | `stream-streamer-service-main` |

### Фронтенды

| Сервис | Технология | Порт | Описание | Директория |
|--------|------------|------|----------|------------|
| Frontend | Next.js | 3000 | Основной интерфейс | `stream-frontend-service-main` |
| Admin | Svelte | - | Админ панель | `stream-frontend-admin-service-main` |

### Инфраструктура

| Сервис | Порт | Описание |
|--------|------|----------|
| Traefik | 8082 | API Gateway |
| Traefik Dashboard | 8092 | Мониторинг |
| PostgreSQL | 5437 | База данных `stream_auth` |
| Redis | 6377 | Кэш и сессии |
| RabbitMQ | 5672 | Очереди |
| RabbitMQ Management | 15672 | Управление |

### Зависимости

```
Auth Service:
  - PostgreSQL (postgres)
  - Redis (redis)
  - RabbitMQ (rabbitmq)

Other Services:
  - Auth Service (для валидации)
  - RabbitMQ
  - Redis
```

### Docker Network
`streaming` (изолированная сеть)

### Kubernetes (опционально)
Конфигурации в `stream-infra-main/`

---

## Marketplace

### Фронтенд

| Сервис | Технология | Порт | Описание | Директория |
|--------|------------|------|----------|------------|
| Frontend | Next.js | 3005 | Объединяющий маркетплейс | `AXA-marketplace-main` |

### Интеграции
Marketplace является агрегатором и интегрируется со всеми другими платформами:
- Social Web
- Stocks
- CoinMarketCap
- Stream
- AI Profiles
- Trading Terminal
- Auth Server

### Зависимости
- Все другие сервисы платформы (через API)

### Docker Network
`axanetwork`

---

## Trading Terminal

### Основные сервисы

| Сервис | Технология | Порт | Описание | Директория |
|--------|------------|------|----------|------------|
| Backend | Python | 8061 | API торгового терминала | `AXA-trading-terminal-back-main` |

### Инфраструктура

Использует внешние сервисы:
- Auth Server Redis (6380)
- Возможно собственная PostgreSQL (5436)

### Зависимости

```
Terminal App:
  - Auth Server (global-redis)
  - PostgreSQL (terminal-core-db, если есть)
  - Внешние биржи (через API)
```

### Docker Network
`axanetwork`

---

## AI Profiles

### Фронтенд

| Сервис | Технология | Порт | Описание | Директория |
|--------|------------|------|----------|------------|
| Frontend | Next.js | 3006 | AI-ассистент и профили | `AXA-Turian-AI-profiles-main` |

### Интеграции
- Auth Server API (8001)

### Docker Network
`axanetwork`

---

## Дополнительные сервисы

### FastAPI Notifications

| Сервис | Технология | Порт | Описание | Директория |
|--------|------------|------|----------|------------|
| Notifications API | FastAPI | - | Сервис уведомлений | `fastapi_notifications-main` |

**Требует**:
- PostgreSQL
- Redis (опционально)

### TON NFT

| Проект | Технология | Описание | Директория |
|--------|------------|----------|------------|
| OTGC | Solidity | Смарт-контракты NFT | `OTGC-main` |
| TON NFT | JSON | NFT метаданные | `ton-nft-main` |

---

## Инфраструктура

### Сводная таблица PostgreSQL

| Экземпляр | Порт | База данных | Сервисы | Сеть |
|-----------|------|-------------|---------|------|
| auth-db | 5433 | `auth_db` | Auth Server | axanetwork |
| socweb-postgres | 5432 | `socweb_*` (7 БД) | Social Web | axanetwork |
| stocks-db | 5435 | `td_db` | Stocks | axanetwork |
| cmc-postgres | 5434 | `cmc_auth` | CoinMarketCap | axanetwork |
| stream-postgres | 5437 | `stream_auth` | Stream | streaming |
| terminal-db | 5436 | `tt_db` | Trading Terminal | axanetwork |

### Сводная таблица Redis

| Экземпляр | Порт | Назначение | Сервисы | Сеть |
|-----------|------|------------|---------|------|
| global-redis | 6380 | Celery, кэш | Auth Server | axanetwork |
| socweb-redis | 6379 | Сессии, кэш | Social Web | axanetwork |
| stocks-redis | 6375 | Celery, кэш | Stocks | axanetwork |
| cmc-redis | 6378 | Кэш | CoinMarketCap | axanetwork |
| stream-redis | 6377 | Сессии, кэш | Stream | streaming |

### Сводная таблица RabbitMQ

| Экземпляр | Порт (AMQP) | Порт (HTTP) | Сервисы | Сеть |
|-----------|-------------|-------------|---------|------|
| auth-rabbitmq | 5672 | - | Auth Server | axanetwork |
| socweb-rabbitmq | 5671 | 15671 | Social Web | axanetwork |
| cmc-rabbitmq | 5673 | 15673 | CoinMarketCap | axanetwork |
| stream-rabbitmq | 5672 | 15672 | Stream | streaming |

### Elasticsearch

| Экземпляр | Порт | Индексы | Сервисы | Сеть |
|-----------|------|---------|---------|------|
| socweb-elasticsearch | 9200 | `posts` | Social Web Posts | axanetwork |

### MinIO (S3)

| Экземпляр | Порт (API) | Порт (Console) | Buckets | Сервисы | Сеть |
|-----------|------------|----------------|---------|---------|------|
| socweb-minio | 9000 | 9001 | `images`, `covers` | Social Web | axanetwork |

### Traefik (Load Balancers)

| Экземпляр | Порт (HTTP) | Порт (Dashboard) | Сервисы | Сеть |
|-----------|-------------|------------------|---------|------|
| socweb-traefik | 8080 | 8090 | Social Web | axanetwork |
| stream-traefik | 8082 | 8092 | Stream | streaming |

### Мониторинг (Flower)

| Экземпляр | Порт | Сервисы | Сеть |
|-----------|------|---------|------|
| auth-flower | 5556 | Auth Server Celery | axanetwork |
| stocks-flower | 5555 | Stocks Celery | axanetwork |

---

## 🔗 Схема зависимостей

```
Auth Server (глобальный)
  ↓
  ├─→ Social Web Auth
  │     ↓
  │     ├─→ Profiles
  │     ├─→ Posts
  │     ├─→ Notifications
  │     ├─→ Favorites
  │     ├─→ Subscriptions
  │     ├─→ Likes
  │     └─→ Mail
  │
  ├─→ Stocks Core
  │     ↓
  │     ├─→ Formatter
  │     └─→ Web Clients (Cbonds, FMP, Terrapin, CMC)
  │
  ├─→ CoinMarketCap Auth
  │     └─→ Mail
  │
  ├─→ Stream Auth
  │     ↓
  │     ├─→ Chat
  │     ├─→ Media
  │     ├─→ Notify
  │     ├─→ Recommend
  │     └─→ Streamer
  │
  ├─→ Trading Terminal
  │
  └─→ Marketplace (интегрирует всё)
        └─→ AI Profiles
```

---

## 📊 Сводная статистика

### Количество сервисов

| Категория | Количество |
|-----------|------------|
| Фронтенды | 7 |
| Go микросервисы | 16 |
| Python сервисы | 9 |
| PostgreSQL экземпляров | 6 |
| Redis экземпляров | 5 |
| RabbitMQ экземпляров | 4 |
| Load Balancers | 2 |
| **Итого контейнеров** | **~60** |

### Используемые порты

**Фронтенды**: 3000, 3001, 3002, 3003, 3005, 3006  
**API**: 8000, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8010, 8050, 8051, 8052, 8053, 8054, 8061, 8081  
**Балансировщики**: 8080, 8082, 8090, 8092  
**PostgreSQL**: 5432, 5433, 5434, 5435, 5436, 5437  
**Redis**: 6375, 6377, 6378, 6379, 6380  
**RabbitMQ**: 5671, 5672, 5673, 15671, 15672, 15673  
**Мониторинг**: 5555, 5556, 8003, 9001  
**Поиск/Хранение**: 9000, 9200  

---

## 📝 Примечания

1. **Порты могут быть изменены** через переменные окружения в .env файлах
2. **GITHUB_TOKEN** может потребоваться для некоторых Go сервисов (приватные модули)
3. **Не все сервисы обязательны** для запуска - можно запускать подсистемы отдельно
4. **Рекомендуется 16-32GB RAM** для запуска всей платформы одновременно
5. **Docker сети изолируют** Social Web/Stocks/CMC (axanetwork) от Stream (streaming)

---

**Версия**: 1.0  
**Последнее обновление**: Октябрь 2025


