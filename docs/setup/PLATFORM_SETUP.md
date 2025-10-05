# AXA Platform - Полная инструкция по запуску

## 📋 Оглавление
1. [Обзор платформы](#обзор-платформы)
2. [Предварительные требования](#предварительные-требования)
3. [Архитектура и сети](#архитектура-и-сети)
4. [Быстрый старт](#быстрый-старт)
5. [Подробный запуск по подсистемам](#подробный-запуск-по-подсистемам)
6. [Порты и доступы](#порты-и-доступы)
7. [Решение проблем](#решение-проблем)

---

## 🎯 Обзор платформы

Ваша платформа состоит из **7 основных подсистем**:

### 1. **Social Web** (Социальная сеть)
- **Фронтенд**: `AXA-socialweb-frontend-main` (Next.js)
- **Бэкенд микросервисы** (9 сервисов на Go):
  - `AXA-socialweb-auth-main` - Аутентификация (порт 8010)
  - `AXA-socialweb-profiles-main` - Профили (порт 8003)
  - `AXA-socialweb-posts-main` - Посты (порт 8004)
  - `AXA-socialweb-notifications-main` - Уведомления (порт 8005)
  - `AXA-socialweb-favorites-main` - Избранное (порт 8006)
  - `AXA-socialweb-subscriptions-main` - Подписки (порт 8007)
  - `AXA-socialweb-likes-main` - Лайки (порт 8008)
  - `AXA-socialweb-mail-main` - Почта
- **Инфраструктура**:
  - PostgreSQL (порт 5432)
  - Redis (порт 6379)
  - RabbitMQ (порты 5671, 15671)
  - MinIO (порты 9000, 9001)
  - Elasticsearch (порт 9200)
  - Traefik (балансировщик, порт 8080)

### 2. **Marketplace** (Маркетплейс)
- **Фронтенд**: `AXA-marketplace-main` (Next.js, порт 3000)
- Подключается к другим сервисам платформы

### 3. **CoinMarketCap** (Крипто-платформа)
- **Фронтенд**: `AXA-coinmarketcap-main` (Next.js, порт 3000)
- **Бэкенд**:
  - `AXA-coinmarketcap-auth-main` - Аутентификация (порт 8080)
  - `AXA-coinmarketcap-mail-main` - Почтовый сервис
- **Инфраструктура**:
  - PostgreSQL (порт 5432)
  - Redis (порт 6379)
  - RabbitMQ (порты 5671, 15671)

### 4. **Stocks** (Биржа/Дневник трейдера)
- **Фронтенд**: `AXA-stocks-frontend-main` (Next.js, порт 3000)
- **Бэкенд**: `AXA-stocks-backend-main` (Django + FastAPI)
  - Core (Django): порт 8050
  - Formatter (FastAPI): порт 8051
  - Web-клиенты: Cbonds, FMP, Terrapin, CMC
- **Инфраструктура**:
  - PostgreSQL (порт 5435)
  - Redis (порт 6375)
  - Celery + Flower (порт 5555)

### 5. **Trading Terminal** (Торговый терминал)
- **Бэкенд**: `AXA-trading-terminal-back-main` (Python, порт 8061)
- Подключается к внешним биржам

### 6. **Stream** (Стриминг платформа)
- **Фронтенды**:
  - `stream-frontend-service-main` - Основной (Next.js, порт 3000)
  - `stream-frontend-admin-service-main` - Админка (Svelte)
- **Бэкенд микросервисы** (на Go):
  - `stream-auth-service-master` - Аутентификация (порт 8002)
  - `stream-chat-service-main` - Чат
  - `stream-media-service-main` - Медиа
  - `stream-notify-service-main` - Уведомления
  - `stream-recommend-service-main` - Рекомендации
  - `stream-streamer-service-main` - Стримеры
- **Инфраструктура**: PostgreSQL, Redis, RabbitMQ, Traefik

### 7. **Auth Server** (Глобальная аутентификация)
- `AXA-auth-server-main` (Go + Django)
  - auth-sync (Go): порт из env
  - auth-core (Django): порт 8001
- **Инфраструктура**:
  - PostgreSQL
  - Redis (порт 6380)
  - RabbitMQ
  - Flower (порт 5555)
  - Redis Commander (порт 8002)

### 8. **AI Profiles** (Turian AI)
- `AXA-Turian-AI-profiles-main` (Next.js, порт 3000)

### 9. **Дополнительные сервисы**
- `fastapi_notifications-main` - Сервис уведомлений (FastAPI)
- `OTGC-main` - TON NFT смарт-контракты (Solidity)
- `ton-nft-main` - TON NFT

---

## 🔧 Предварительные требования

### Обязательное ПО:
```bash
# Проверьте наличие:
docker --version          # Docker 24.0+
docker-compose --version  # Docker Compose 2.0+
node --version           # Node.js 18+
npm --version            # npm 9+
go version              # Go 1.21+
python3 --version       # Python 3.11+
```

### Системные требования:
- **RAM**: минимум 16 GB (рекомендуется 32 GB)
- **Дисковое пространство**: минимум 50 GB
- **CPU**: 4+ ядра

### Установка зависимостей (если не установлены):

**macOS**:
```bash
# Установка Homebrew (если нет)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Установка необходимых инструментов
brew install docker docker-compose node go python@3.11
```

---

## 🌐 Архитектура и сети

Платформа использует **2 основные Docker-сети**:

### 1. `axanetwork` (основная сеть)
Используется большинством сервисов:
- Social Web (все микросервисы)
- Stocks
- Trading Terminal
- Auth Server
- Marketplace
- AI Profiles

### 2. `streaming` (отдельная сеть для стриминга)
- Все Stream сервисы

**Важно**: Сети создаются автоматически при первом запуске соответствующих docker-compose файлов.

---

## 🚀 Быстрый старт

### Шаг 1: Создание Docker-сети

```bash
# Создаём основную сеть (если ещё не создана)
docker network create axanetwork

# Создаём сеть для стриминга
docker network create streaming
```

### Шаг 2: Запуск базовой инфраструктуры

Начнём с **Auth Server** (глобальная аутентификация):

```bash
cd "AXA-auth-server-main"

# Создайте .env файл (пример ниже)
cat > .env << 'EOF'
# Database
DB_NAME=auth_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5433
DB_HOST=db

# Redis
REDIS_HOST=global-redis
REDIS_PORT=6380

# API Ports
API_PORT=8000
API_HOST=0.0.0.0
CORE_API_PORT=8001

# Admin
ADMIN_USER=admin@admin.ru
ADMIN_PASSWORD=admin

# RabbitMQ
INTERSERVICE_RABBITMQ_HOST=rabbitmq
INTERSERVICE_RABBITMQ_PORT=5672
INTERSERVICE_RABBITMQ_USER=guest
INTERSERVICE_RABBITMQ_PASSWORD=guest
OUTGOING_QUEUE_NAME=auth_outgoing

# Flower
FLOWER_PORT=5556

# Redis Commander
REDIS_COMMANDER_PORT=8003

# Domains
WHITELIST_DOMAINS=localhost,127.0.0.1

# GitHub Token (опционально, для приватных модулей)
GITHUB_TOKEN=
EOF

# Запуск
docker-compose up -d
```

### Шаг 3: Запуск Social Web (основная платформа)

```bash
cd "../AXA-socialweb-auth-main"

# Создайте .env файл
cat > .env << 'EOF'
# Основные порты
HTTP_PORT=8010
HTTP_PORT_EXT=8080
HTTP_PORT_EXT_TA=8090

# База данных
POSTGRES_HOST=socweb-postgres
POSTGRES_PORT=5432
POSTGRES_DB=socweb_auth
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Redis
REDIS_ADDR=socweb-redis:6379
REDIS_PORT=6379
REDIS_DB=0

# URLs для редиректов
PUBLIC_EMAIL_CONFIRMATION_URL=http://localhost:8010/api/v1/auth/email/confirm
PUBLIC_PASSWORD_RESET_CONFIRMATION_URL=http://localhost:8010/front?token=
PUBLIC_URL=http://localhost:8010/
PUBLIC_ERROR_URL=http://localhost:8010/

# Session Redis
SESSION_ID_REDIS_URL=redis://socweb-redis:6379/0
USER_INFO_REDIS_URL=redis://socweb-redis:6379/0

# RabbitMQ
RMQ_CONN_URL=amqp://guest:guest@socweb-rabbitmq:5671/
RMQ_MAIL_EXCHANGE=mail
RMQ_MAIL_EXCHANGE_AUTOCREATE_ENABLED=true
RABBITMQ_PORT=5671
RABBITMQ_HTTP_PORT=15671

# MinIO/S3
S3_REGION=ru-1
S3_ENDPOINT=test-streaming.s3.ru-1.storage.selcloud.ru
S3_ACCESS_KEY=Q3AM3UQ867SPQQA43P2F
S3_SECRET_ACCESS_KEY=zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG
S3_AVATARS_BUCKET_NAME=images
S3_COVERS_BUCKET_NAME=covers
CDN_PUBLIC_URL=https://038ce6c9-bad5-4bb7-8da2-495126d7d90f.selstorage.ru

# Secret key
SECRET_KEY=super_secret_key_very_long_change_me_in_production

# Elasticsearch
ES_PORT=9200
ES_PASSWORD=admin123

# Другие сервисы
PROFILES_HTTP_PORT=8003
POSTS_HTTP_PORT=8004
NOTIFICATIONS_HTTP_PORT=8005
FAVORITES_HTTP_PORT=8006
SUBSCRIPTIONS_HTTP_PORT=8007
LIKES_HTTP_PORT=8008

# GitHub Token
GITHUB_TOKEN=
EOF

# Запуск (включает Traefik балансировщик)
docker-compose up -d
```

### Шаг 4: Запуск остальных микросервисов Social Web

```bash
# Profiles
cd "../AXA-socialweb-profiles-main"
cat > .env << 'EOF'
HTTP_PORT=8003
GITHUB_TOKEN=
POSTGRES_DSN=postgres://postgres:postgres@socweb-postgres:5432/socweb_profiles?sslmode=disable
REDIS_ADDR=socweb-redis:6379
EOF
docker-compose up -d

# Posts
cd "../AXA-socialweb-posts-main"
cat > .env << 'EOF'
HTTP_PORT=8004
GITHUB_TOKEN=
POSTGRES_DSN=postgres://postgres:postgres@socweb-postgres:5432/socweb_posts?sslmode=disable
REDIS_ADDR=socweb-redis:6379
ES_ADDR=http://socweb-elasticsearch:9200
ES_PASSWORD=admin123
EOF
docker-compose up -d

# Notifications
cd "../AXA-socialweb-notifications-main"
cat > .env << 'EOF'
HTTP_PORT=8005
GITHUB_TOKEN=
POSTGRES_DSN=postgres://postgres:postgres@socweb-postgres:5432/socweb_notifications?sslmode=disable
RMQ_CONN_URL=amqp://guest:guest@socweb-rabbitmq:5671/
EOF
docker-compose up -d

# Favorites
cd "../AXA-socialweb-favorites-main"
cat > .env << 'EOF'
HTTP_PORT=8006
GITHUB_TOKEN=
POSTGRES_DSN=postgres://postgres:postgres@socweb-postgres:5432/socweb_favorites?sslmode=disable
EOF
docker-compose up -d

# Subscriptions
cd "../AXA-socialweb-subscriptions-main"
cat > .env << 'EOF'
HTTP_PORT=8007
GITHUB_TOKEN=
POSTGRES_DSN=postgres://postgres:postgres@socweb-postgres:5432/socweb_subscriptions?sslmode=disable
EOF
docker-compose up -d

# Likes
cd "../AXA-socialweb-likes-main"
cat > .env << 'EOF'
HTTP_PORT=8008
GITHUB_TOKEN=
POSTGRES_DSN=postgres://postgres:postgres@socweb-postgres:5432/socweb_likes?sslmode=disable
EOF
docker-compose up -d

# Mail
cd "../AXA-socialweb-mail-main"
cat > .env << 'EOF'
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
RMQ_CONN_URL=amqp://guest:guest@socweb-rabbitmq:5671/
RMQ_MAIL_EXCHANGE=mail
EOF
docker-compose up -d
```

### Шаг 5: Запуск фронтенда Social Web

```bash
cd "../AXA-socialweb-frontend-main"

# Создаём .env файл
cat > .env << 'EOF'
FRONTEND_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_AUTH_URL=http://localhost:8080/api/v1/auth
EOF

# Установка зависимостей и запуск
npm install
npm run dev
```

### Шаг 6: Запуск Stocks (биржа)

```bash
cd "../AXA-stocks-backend-main"

# Создаём .env файл
cat > core/project/.env << 'EOF'
# Database
DB_PORT=5435
POSTGRES_DB=td_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Redis
REDIS_PORT=6375

# HTTP
HTTP_PORT=8050
FORMATTER_PORT=8051

# Django
SECRET_KEY=your-secret-key-change-me
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Superuser
DJANGO_SUPERUSER_EMAIL=admin@admin.ru
DJANGO_SUPERUSER_PASSWORD=admin
EOF

# Запуск
docker-compose up -d

# Фронтенд
cd "../AXA-stocks-frontend-main"
cat > .env << 'EOF'
FRONTEND_PORT=3002
NEXT_PUBLIC_API_URL=http://localhost:8050
EOF
npm install
npm run dev
```

### Шаг 7: Запуск CoinMarketCap

```bash
cd "../AXA-coinmarketcap-auth-main"

cat > .env << 'EOF'
HTTP_PORT=8081
POSTGRES_PORT=5434
POSTGRES_DB=cmc_auth
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
REDIS_PORT=6378
RABBITMQ_PORT=5673
RABBITMQ_HTTP_PORT=15673
GITHUB_TOKEN=
EOF

docker-compose up -d

# Фронтенд
cd "../AXA-coinmarketcap-main"
cat > .env << 'EOF'
FRONTEND_PORT=3003
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_COINMARKETCAP_URL=http://localhost:3003
NEXT_PUBLIC_SOCIAL_NETWORK_URL=http://localhost:3001
NEXT_PUBLIC_STREAMING_URL=http://localhost:3004
NEXT_PUBLIC_MARKETPLACE_URL=http://localhost:3005
EOF
npm install
npm run dev
```

### Шаг 8: Запуск Marketplace

```bash
cd "../AXA-marketplace-main"

cat > .env << 'EOF'
FRONTEND_PORT=3005
NEXT_PUBLIC_TRADER_DIARY_URL=http://localhost:3002
NEXT_PUBLIC_COINMARKETCAP_URL=http://localhost:3003
NEXT_PUBLIC_SOCIAL_NETWORK_URL=http://localhost:3001
NEXT_PUBLIC_STREAMING_URL=http://localhost:3004
NEXT_PUBLIC_AI_ASSISTANT_URL=http://localhost:3006
NEXT_PUBLIC_PORTFOLIO_URL=
NEXT_PUBLIC_MARKETPLACE_URL=http://localhost:3005
NEXT_PUBLIC_TRADING_TERMINAL_URL=http://localhost:8061
NEXT_PUBLIC_AUTH_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_API=http://localhost:8001
EOF

npm install
npm run dev
```

### Шаг 9: Запуск Stream (стриминг)

```bash
cd "../stream-auth-service-master"

cat > .env << 'EOF'
HTTP_PORT=8002
HTTP_PORT_EXT=8082
HTTP_PORT_EXT_TA=8092
POSTGRES_PORT=5437
POSTGRES_DB=stream_auth
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
REDIS_PORT=6377
SESSION_ID_REDIS_URL=redis://redis:6379/0
USER_INFO_REDIS_URL=redis://redis:6379/0
RMQ_CONN_URL=amqp://guest:guest@rabbitmq:5672/
SECRET_KEY=super_secret_stream_key
GITHUB_TOKEN=
EOF

docker-compose up -d

# Фронтенд
cd "../stream-frontend-service-main"
docker-compose up -d
```

### Шаг 10: Запуск AI Profiles

```bash
cd "../AXA-Turian-AI-profiles-main"

cat > .env << 'EOF'
FRONTEND_PORT=3006
NEXT_PUBLIC_API_URL=http://localhost:8001
EOF

npm install
npm run dev
```

### Шаг 11: Запуск Trading Terminal

```bash
cd "../AXA-trading-terminal-back-main"

cat > app.env << 'EOF'
POSTGRES_HOST=terminal-core-db
POSTGRES_PORT=5436
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=tt_db
GLOBAL_REDIS_ADDR=host.docker.internal:6380
GLOBAL_REDIS_DB=0
EOF

docker-compose up -d
```

---

## 📊 Порты и доступы

### Auth Server
- **Auth Core (Django)**: http://localhost:8001
- **Auth Sync (Go)**: http://localhost:8000
- **Flower**: http://localhost:5556
- **Redis Commander**: http://localhost:8003

### Social Web
- **Фронтенд**: http://localhost:3001
- **Балансировщик (Traefik)**: http://localhost:8080
- **Traefik Dashboard**: http://localhost:8090
- **Auth Service**: http://localhost:8010
- **Profiles**: http://localhost:8003
- **Posts**: http://localhost:8004
- **Notifications**: http://localhost:8005
- **Favorites**: http://localhost:8006
- **Subscriptions**: http://localhost:8007
- **Likes**: http://localhost:8008
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **RabbitMQ Management**: http://localhost:15671
- **MinIO Console**: http://localhost:9001
- **Elasticsearch**: http://localhost:9200

### Stocks
- **Фронтенд**: http://localhost:3002
- **Core (Django)**: http://localhost:8050
- **Formatter (FastAPI)**: http://localhost:8051
- **Flower**: http://localhost:5555
- **PostgreSQL**: localhost:5435
- **Redis**: localhost:6375

### CoinMarketCap
- **Фронтенд**: http://localhost:3003
- **Auth Service**: http://localhost:8081
- **PostgreSQL**: localhost:5434
- **Redis**: localhost:6378
- **RabbitMQ Management**: http://localhost:15673

### Stream
- **Фронтенд**: http://localhost:3000 (или через docker)
- **Балансировщик**: http://localhost:8082
- **Traefik Dashboard**: http://localhost:8092
- **Auth Service**: http://localhost:8002
- **PostgreSQL**: localhost:5437
- **Redis**: localhost:6377
- **RabbitMQ Management**: http://localhost:15672

### Marketplace
- **Фронтенд**: http://localhost:3005

### AI Profiles
- **Фронтенд**: http://localhost:3006

### Trading Terminal
- **API**: http://localhost:8061

---

## 🔍 Проверка работы

### 1. Проверка Docker контейнеров

```bash
# Посмотреть все запущенные контейнеры
docker ps

# Посмотреть логи конкретного контейнера
docker logs <container_name>

# Посмотреть логи с отслеживанием
docker logs -f <container_name>
```

### 2. Проверка сетей

```bash
# Проверить созданные сети
docker network ls

# Посмотреть какие контейнеры в сети
docker network inspect axanetwork
docker network inspect streaming
```

### 3. Проверка баз данных

```bash
# Подключение к PostgreSQL Social Web
docker exec -it <postgres_container_name> psql -U postgres -d socweb_auth

# Подключение к PostgreSQL Stocks
docker exec -it td-db psql -U postgres -d td_db

# Проверка Redis
docker exec -it <redis_container_name> redis-cli ping
```

### 4. Проверка API

```bash
# Social Web Auth
curl http://localhost:8080/api/v1/auth/health

# Stocks Core
curl http://localhost:8050/health/

# Auth Server
curl http://localhost:8001/health/
```

---

## 🛠 Решение проблем

### Проблема: Конфликт портов

**Ошибка**: `port is already allocated`

**Решение**:
```bash
# Найти процесс на порту
lsof -i :8080

# Остановить процесс
kill -9 <PID>

# Или измените порт в .env файле
```

### Проблема: Контейнеры не могут соединиться

**Ошибка**: `connection refused` или `host not found`

**Решение**:
```bash
# Проверьте что контейнеры в одной сети
docker network inspect axanetwork

# Перезапустите контейнеры
docker-compose down
docker-compose up -d
```

### Проблема: База данных не инициализируется

**Ошибка**: `database doesn't exist`

**Решение**:
```bash
# Удалите volumes и пересоздайте
docker-compose down -v
docker-compose up -d

# Применить миграции вручную
docker exec -it <container> python manage.py migrate
# или
docker exec -it <container> go run main.go migrate
```

### Проблема: Фронтенд не подключается к API

**Решение**:
1. Проверьте переменные окружения в .env файлах
2. Убедитесь что API сервисы запущены
3. Проверьте CORS настройки на бэкенде
4. Откройте DevTools в браузере и проверьте Network tab

### Проблема: Нехватка памяти

**Ошибка**: `out of memory`

**Решение**:
```bash
# Увеличьте память для Docker Desktop
# Settings -> Resources -> Memory (минимум 8GB, рекомендуется 16GB)

# Или запускайте сервисы по частям, а не все сразу
```

### Проблема: GITHUB_TOKEN

Некоторые сервисы требуют GITHUB_TOKEN для установки приватных модулей.

**Решение**:
- Если у вас нет токена, попробуйте оставить поле пустым
- Если билд падает, запросите токен у разработчиков
- Или закомментируйте проверку токена в Dockerfile

---

## 📝 Порядок запуска (рекомендуемый)

Для корректной работы всей платформы запускайте в следующем порядке:

1. **Создание сетей**
2. **Auth Server** (глобальная аутентификация)
3. **Social Web Auth** (запустит всю инфраструктуру: PostgreSQL, Redis, RabbitMQ, Elasticsearch, Traefik)
4. **Social Web микросервисы** (profiles, posts, etc.)
5. **Social Web Frontend**
6. **Stocks Backend** (со своей БД и Redis)
7. **Stocks Frontend**
8. **CoinMarketCap Backend**
9. **CoinMarketCap Frontend**
10. **Stream Backend** (отдельная сеть)
11. **Stream Frontend**
12. **Marketplace**
13. **AI Profiles**
14. **Trading Terminal**

---

## 🎉 Готово!

После успешного запуска у вас будет работать полная платформа:

- ✅ Социальная сеть с микросервисной архитектурой
- ✅ Биржевая платформа (Stocks)
- ✅ Крипто-платформа (CoinMarketCap)
- ✅ Стриминг платформа
- ✅ Маркетплейс
- ✅ AI профили
- ✅ Торговый терминал

---

## 📞 Дополнительная помощь

Если возникли проблемы:
1. Проверьте логи контейнеров: `docker logs <container_name>`
2. Проверьте состояние сервисов: `docker ps -a`
3. Проверьте сети: `docker network inspect axanetwork`
4. Убедитесь что все .env файлы созданы
5. Проверьте что порты не заняты другими процессами

---

**Версия документации**: 1.0  
**Дата**: Октябрь 2025  
**Платформа**: macOS / Linux / Windows (с WSL2)


