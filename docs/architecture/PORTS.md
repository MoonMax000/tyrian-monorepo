# AXA Platform - Карта портов

## 🌐 Фронтенды

| Порт | Сервис | URL | Технология |
|------|--------|-----|------------|
| **3000** | Stream Frontend | http://localhost:3000 | Next.js |
| **3001** | Social Web | http://localhost:3001 | Next.js |
| **3002** | Stocks | http://localhost:3002 | Next.js |
| **3003** | CoinMarketCap | http://localhost:3003 | Next.js |
| **3005** | Marketplace | http://localhost:3005 | Next.js |
| **3006** | AI Profiles | http://localhost:3006 | Next.js |

---

## 🔌 API Endpoints

### Auth & User Management

| Порт | Сервис | Описание | Платформа |
|------|--------|----------|-----------|
| **8000** | Auth Sync | Синхронизация пользователей | Auth Server |
| **8001** | Auth Core | Основной API аутентификации | Auth Server |
| **8002** | Stream Auth | Аутентификация стриминга | Stream |
| **8010** | Social Web Auth | Аутентификация соцсети | Social Web |
| **8081** | CMC Auth | Аутентификация CMC | CoinMarketCap |

### Social Web Microservices

| Порт | Сервис | API Path | Описание |
|------|--------|----------|----------|
| **8003** | Profiles | `/api/v1/profile` | Профили пользователей |
| **8004** | Posts | `/api/v1/posts` | Посты |
| **8005** | Notifications | `/api/v1/notifications` | Уведомления |
| **8006** | Favorites | `/api/v1/favorites` | Избранное |
| **8007** | Subscriptions | `/api/v1/subscriptions` | Подписки |
| **8008** | Likes | `/api/v1/likes` | Лайки |

### Stocks & Trading

| Порт | Сервис | Описание | Технология |
|------|--------|----------|------------|
| **8050** | Stocks Core | Основной API биржи | Django |
| **8051** | Formatter | Форматирование данных | FastAPI |
| **8052** | FMP Client | Financial Modeling Prep | Python |
| **8053** | CMC Client | CoinMarketCap данные | Python |
| **8054** | Cbonds/Terrapin | Данные облигаций | Python |
| **8061** | Trading Terminal | Торговый терминал | Python |

---

## 🔀 Load Balancers & Gateways

| Порт | Сервис | Описание | URL |
|------|--------|----------|-----|
| **8080** | Traefik (Social) | API Gateway Social Web | http://localhost:8080 |
| **8082** | Traefik (Stream) | API Gateway Stream | http://localhost:8082 |
| **8090** | Traefik Dashboard (Social) | Мониторинг Social Web | http://localhost:8090 |
| **8092** | Traefik Dashboard (Stream) | Мониторинг Stream | http://localhost:8092 |

---

## 🗄️ Databases (PostgreSQL)

| Порт | Экземпляр | База данных | Сервисы |
|------|-----------|-------------|---------|
| **5432** | socweb-postgres | `socweb_*` (7 БД) | Social Web |
| **5433** | auth-db | `auth_db` | Auth Server |
| **5434** | cmc-postgres | `cmc_auth` | CoinMarketCap |
| **5435** | stocks-db | `td_db` | Stocks |
| **5436** | terminal-db | `tt_db` | Trading Terminal |
| **5437** | stream-postgres | `stream_auth` | Stream |

### Подключение к PostgreSQL

```bash
# Social Web
docker exec -it <container_name> psql -U postgres -d socweb_auth

# Stocks
docker exec -it td-db psql -U postgres -d td_db

# Auth Server
docker exec -it auth-db psql -U postgres -d auth_db
```

---

## 💾 Cache (Redis)

| Порт | Экземпляр | Назначение | Сервисы |
|------|-----------|------------|---------|
| **6375** | stocks-redis | Celery, кэш | Stocks |
| **6377** | stream-redis | Сессии, кэш | Stream |
| **6378** | cmc-redis | Кэш | CoinMarketCap |
| **6379** | socweb-redis | Сессии, кэш | Social Web |
| **6380** | global-redis | Celery, кэш | Auth Server |

### Подключение к Redis

```bash
# Проверка Redis
docker exec -it <redis_container> redis-cli ping

# Просмотр ключей
docker exec -it <redis_container> redis-cli keys "*"

# Получить значение
docker exec -it <redis_container> redis-cli get <key>
```

---

## 📨 Message Queues (RabbitMQ)

### AMQP Ports

| Порт | Экземпляр | Сервисы |
|------|-----------|---------|
| **5671** | socweb-rabbitmq | Social Web |
| **5672** | auth-rabbitmq, stream-rabbitmq | Auth Server, Stream |
| **5673** | cmc-rabbitmq | CoinMarketCap |

### Management UI

| Порт | Экземпляр | URL | Логин |
|------|-----------|-----|-------|
| **15671** | socweb-rabbitmq | http://localhost:15671 | guest/guest |
| **15672** | stream-rabbitmq | http://localhost:15672 | guest/guest |
| **15673** | cmc-rabbitmq | http://localhost:15673 | guest/guest |

---

## 🔍 Search & Storage

| Порт | Сервис | Описание | URL |
|------|--------|----------|-----|
| **9000** | MinIO | S3-совместимое хранилище | http://localhost:9000 |
| **9001** | MinIO Console | Управление MinIO | http://localhost:9001 |
| **9200** | Elasticsearch | Поиск по постам | http://localhost:9200 |

### Elasticsearch

```bash
# Проверка здоровья
curl http://localhost:9200/_cluster/health

# Поиск по индексу posts
curl http://localhost:9200/posts/_search
```

---

## 📊 Monitoring & Management

| Порт | Сервис | Описание | URL |
|------|--------|----------|-----|
| **5555** | Flower (Stocks) | Celery мониторинг Stocks | http://localhost:5555 |
| **5556** | Flower (Auth) | Celery мониторинг Auth | http://localhost:5556 |
| **8003** | Redis Commander | Управление Redis Auth Server | http://localhost:8003 |

---

## 🎨 Визуальная карта портов

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTENDS (3000-3006)                         │
├─────────────────────────────────────────────────────────────────────┤
│ 3000: Stream    3001: Social    3002: Stocks    3003: CMC          │
│ 3005: Market    3006: AI                                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     API SERVICES (8000-8090)                         │
├─────────────────────────────────────────────────────────────────────┤
│ Auth & Users:    8000, 8001, 8002, 8010, 8081                      │
│ Social Web:      8003, 8004, 8005, 8006, 8007, 8008                │
│ Stocks/Trading:  8050, 8051, 8052, 8053, 8054, 8061                │
│ Balancers:       8080, 8082, 8090, 8092                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASES (5432-5437)                             │
├─────────────────────────────────────────────────────────────────────┤
│ PostgreSQL:      5432, 5433, 5434, 5435, 5436, 5437                │
│ Redis:           6375, 6377, 6378, 6379, 6380                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                  MESSAGE QUEUES (5671-5673, 15671-15673)            │
├─────────────────────────────────────────────────────────────────────┤
│ AMQP:            5671, 5672, 5673                                   │
│ Management:      15671, 15672, 15673                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                SEARCH, STORAGE, MONITORING (5555+, 9000+)           │
├─────────────────────────────────────────────────────────────────────┤
│ Flower:          5555, 5556                                         │
│ Redis UI:        8003                                               │
│ MinIO:           9000, 9001                                         │
│ Elasticsearch:   9200                                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Защищенные порты (только внутри Docker)

Следующие порты **НЕ** выставлены наружу и доступны только внутри Docker сетей:

### PostgreSQL (внутренние)
- Некоторые БД используют `expose` вместо `ports` в docker-compose

### Redis (внутренние)
- Некоторые Redis экземпляры доступны только внутри сети

### Микросервисы Stream
- Chat, Media, Notify, Streamer используют внутренние порты

---

## 📝 Быстрая справка

### Проверка занятых портов

```bash
# macOS/Linux
lsof -i :8080

# Все порты платформы
lsof -i :3001 -i :8080 -i :5432 -i :6379 -i :9200

# Windows (PowerShell)
netstat -ano | findstr "8080"
```

### Освобождение порта

```bash
# Найти процесс
lsof -i :8080

# Убить процесс
kill -9 <PID>

# Или остановить Docker контейнер
docker ps | grep <port>
docker stop <container_name>
```

### Изменение портов

Порты можно изменить через `.env` файлы:

```bash
# Пример: изменить порт Social Web frontend
# В AXA-socialweb-frontend-main/.env
FRONTEND_PORT=3010

# Пример: изменить порт Auth Server
# В AXA-auth-server-main/.env
CORE_API_PORT=8010
```

---

## 🔥 Горячие порты (часто используемые)

### Для разработки

| Порт | Что | Зачем |
|------|-----|-------|
| **3001** | Social Web | Основной интерфейс соцсети |
| **8080** | Traefik | Все API Social Web через балансировщик |
| **8090** | Traefik Dashboard | Мониторинг маршрутизации |
| **15671** | RabbitMQ UI | Проверка очередей |
| **9001** | MinIO | Управление файлами |

### Для отладки

| Порт | Что | Зачем |
|------|-----|-------|
| **5555/5556** | Flower | Celery задачи |
| **8003** | Redis Commander | Просмотр Redis |
| **9200** | Elasticsearch | Поиск и индексы |

### Для подключения БД

| Порт | База | Строка подключения |
|------|------|-------------------|
| **5432** | Social Web | `postgresql://postgres:postgres@localhost:5432/socweb_auth` |
| **5435** | Stocks | `postgresql://postgres:postgres@localhost:5435/td_db` |
| **5433** | Auth | `postgresql://postgres:postgres@localhost:5433/auth_db` |

---

## ⚠️ Конфликты портов

### Типичные конфликты

| Порт | Может конфликтовать с |
|------|----------------------|
| **3000** | Другие Node.js приложения |
| **5432** | Локальный PostgreSQL |
| **6379** | Локальный Redis |
| **8080** | Локальные веб-серверы |
| **9200** | Локальный Elasticsearch |

### Решение конфликтов

1. **Остановить локальные сервисы**
   ```bash
   # PostgreSQL
   brew services stop postgresql
   
   # Redis
   brew services stop redis
   
   # Elasticsearch
   brew services stop elasticsearch
   ```

2. **Изменить порты в .env файлах**

3. **Использовать другие порты для локальной разработки**

---

## 📊 Статистика портов

- **Всего используется портов**: ~50
- **Фронтенд портов**: 6
- **API портов**: 20+
- **БД портов**: 6 (PostgreSQL) + 5 (Redis)
- **Инфраструктура**: 10+

---

**Версия**: 1.0  
**Последнее обновление**: Октябрь 2025  
**Рекомендация**: Добавьте этот файл в закладки для быстрого доступа к портам!

