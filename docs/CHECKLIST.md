# AXA Platform - Чек-лист и диагностика

## ✅ Чек-лист перед запуском

### Системные требования

- [ ] Docker установлен и запущен
- [ ] Docker Compose установлен
- [ ] Node.js 18+ установлен
- [ ] Минимум 16GB RAM доступно
- [ ] Минимум 20GB свободного места на диске
- [ ] Порты 3000-3006, 5432-5437, 6375-6380, 8000-8090 свободны

### Проверка Docker

```bash
# Запустите эти команды
docker --version              # Должно быть 24.0+
docker-compose --version      # Должно быть 2.0+
docker ps                     # Должно работать без ошибок
```

---

## 🚀 Шаги запуска

### Минимальный запуск (Social Web)

- [ ] 1. Создать Docker сети
  ```bash
  docker network create axanetwork
  docker network create streaming
  ```

- [ ] 2. Запустить Auth Server
  ```bash
  cd AXA-auth-server-main
  # Создать .env файл (см. QUICK_START.md)
  docker-compose up -d
  ```

- [ ] 3. Подождать 30 секунд для инициализации

- [ ] 4. Запустить Social Web Auth
  ```bash
  cd ../AXA-socialweb-auth-main
  # Создать .env файл (см. QUICK_START.md)
  docker-compose up -d
  ```

- [ ] 5. Подождать 60 секунд (PostgreSQL, Redis, RabbitMQ, Elasticsearch)

- [ ] 6. Запустить микросервисы Social Web
  ```bash
  # Profiles, Posts, Notifications, Favorites, Subscriptions, Likes
  # См. QUICK_START.md для команд
  ```

- [ ] 7. Запустить фронтенд Social Web
  ```bash
  cd ../AXA-socialweb-frontend-main
  npm install
  npm run dev
  ```

- [ ] 8. Открыть http://localhost:3001

---

## 🔍 Проверка работоспособности

### После запуска Auth Server

- [ ] Auth Core API: http://localhost:8001/health/
- [ ] Auth Admin: http://localhost:8000/admin
- [ ] Flower: http://localhost:5556
- [ ] Redis Commander: http://localhost:8003

```bash
# Проверка контейнеров
docker ps | grep auth

# Должны быть запущены:
# - auth-core
# - auth-app
# - auth-celery
# - auth-celery-beat
# - auth-flower
# - auth-db
# - auth-global-redis
# - auth-redis-commander
```

### После запуска Social Web

- [ ] Traefik Dashboard: http://localhost:8090
- [ ] API Balancer: http://localhost:8080/api/v1/docs
- [ ] RabbitMQ: http://localhost:15671 (guest/guest)
- [ ] MinIO Console: http://localhost:9001

```bash
# Проверка контейнеров
docker ps | grep socweb

# Должны быть запущены:
# - socweb-auth
# - socweb-postgres
# - socweb-redis
# - socweb-rabbitmq
# - socweb-elasticsearch
# - socweb-minio
# - socweb-traefik
```

### После запуска микросервисов

```bash
# Проверка всех микросервисов
docker ps | grep -E "socweb-(profiles|posts|notifications|favorites|subscriptions|likes)"

# Тест API через балансировщик
curl http://localhost:8080/api/v1/docs
```

### После запуска Stocks

- [ ] Stocks Backend: http://localhost:8050/health/
- [ ] Flower: http://localhost:5555
- [ ] Frontend: http://localhost:3002

```bash
docker ps | grep td-

# Должны быть:
# - td-backend
# - td-db
# - td-redis
# - td-formatter
# - td-celery-beat
# - td-flower
```

---

## 🐛 Диагностика проблем

### Проблема: Docker не запускается

**Симптомы**: `Cannot connect to the Docker daemon`

**Решение**:
```bash
# macOS
open -a Docker

# Подождать пока Docker Desktop запустится
```

---

### Проблема: Порт уже занят

**Симптомы**: `port is already allocated`

**Диагностика**:
```bash
# Найти процесс на порту (пример: порт 8080)
lsof -i :8080

# Результат покажет PID и имя процесса
```

**Решение**:
```bash
# Убить процесс
kill -9 <PID>

# Или изменить порт в .env файле
```

---

### Проблема: Контейнер не запускается

**Симптомы**: Контейнер сразу останавливается после запуска

**Диагностика**:
```bash
# Посмотреть логи
docker logs <container_name>

# Посмотреть все контейнеры (включая остановленные)
docker ps -a
```

**Решение**:
```bash
# Пересоздать контейнер
docker-compose down
docker-compose up -d

# Если проблема с билдом
docker-compose build --no-cache
docker-compose up -d
```

---

### Проблема: База данных не инициализируется

**Симптомы**: `database "xxx" does not exist`

**Диагностика**:
```bash
# Проверить логи PostgreSQL
docker logs <postgres_container_name>

# Подключиться к PostgreSQL
docker exec -it <postgres_container_name> psql -U postgres
```

**Решение**:
```bash
# Удалить volumes и пересоздать
docker-compose down -v
docker-compose up -d

# Подождать инициализации
sleep 30

# Применить миграции вручную (если нужно)
docker exec -it <container> python manage.py migrate
```

---

### Проблема: Redis connection refused

**Симптомы**: `Error connecting to Redis`

**Диагностика**:
```bash
# Проверить что Redis запущен
docker ps | grep redis

# Проверить Redis
docker exec -it <redis_container> redis-cli ping
# Должно вернуть: PONG
```

**Решение**:
```bash
# Перезапустить Redis
docker-compose restart redis

# Проверить правильность REDIS_ADDR в .env
```

---

### Проблема: RabbitMQ connection failed

**Симптомы**: `AMQP connection error`

**Диагностика**:
```bash
# Проверить RabbitMQ
docker ps | grep rabbitmq

# Проверить логи
docker logs <rabbitmq_container>

# Открыть Management UI
# http://localhost:15671 (guest/guest)
```

**Решение**:
```bash
# Перезапустить RabbitMQ
docker-compose restart rabbitmq

# Подождать готовности (healthcheck)
docker inspect <rabbitmq_container> | grep Health
```

---

### Проблема: Фронтенд не подключается к API

**Симптомы**: Ошибки в консоли браузера, CORS errors

**Диагностика**:
```bash
# Проверить переменные окружения
cat .env | grep NEXT_PUBLIC

# Проверить что API работает
curl http://localhost:8080/api/v1/docs
```

**Решение**:
1. Убедитесь что бэкенд запущен
2. Проверьте NEXT_PUBLIC_API_URL в .env
3. Перезапустите фронтенд
4. Очистите кэш браузера

---

### Проблема: GITHUB_TOKEN

**Симптомы**: Build fails с ошибкой доступа к приватным модулям

**Решение**:
```bash
# Вариант 1: Оставить пустым (если нет приватных модулей)
GITHUB_TOKEN=

# Вариант 2: Получить токен у разработчиков

# Вариант 3: Закомментировать проверку в Dockerfile
```

---

### Проблема: Нехватка памяти

**Симптомы**: Контейнеры падают, OOM errors

**Диагностика**:
```bash
# Проверить использование памяти
docker stats

# Проверить системную память
free -h  # Linux
vm_stat  # macOS
```

**Решение**:
1. Увеличить память для Docker Desktop (Settings → Resources → Memory)
2. Запускать сервисы по частям, а не все сразу
3. Закрыть другие приложения

---

### Проблема: Сеть не найдена

**Симптомы**: `network axanetwork not found`

**Решение**:
```bash
# Создать сети
docker network create axanetwork
docker network create streaming

# Проверить
docker network ls
```

---

## 📊 Статус сервисов - Быстрая проверка

### Команда для полной диагностики

```bash
#!/bin/bash
echo "=== Docker Status ==="
docker --version
echo ""

echo "=== Networks ==="
docker network ls | grep -E "axanetwork|streaming"
echo ""

echo "=== Running Containers ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | head -20
echo ""

echo "=== Container Count ==="
echo "Running: $(docker ps -q | wc -l)"
echo "Total: $(docker ps -aq | wc -l)"
echo ""

echo "=== API Health Checks ==="
curl -s -o /dev/null -w "Auth Server: %{http_code}\n" http://localhost:8001/health/
curl -s -o /dev/null -w "Social Web: %{http_code}\n" http://localhost:8080/api/v1/docs
curl -s -o /dev/null -w "Stocks: %{http_code}\n" http://localhost:8050/health/
echo ""

echo "=== Port Usage ==="
lsof -i :3001 -i :8080 -i :8001 | grep LISTEN
```

Сохраните как `check-status.sh` и запустите:
```bash
chmod +x check-status.sh
./check-status.sh
```

---

## 📝 Что работает сейчас?

### Полностью готово ✅

- [x] **Auth Server** - Глобальная аутентификация
- [x] **Social Web** - Полный функционал соцсети
  - [x] Auth Service
  - [x] Profiles
  - [x] Posts
  - [x] Notifications
  - [x] Favorites
  - [x] Subscriptions
  - [x] Likes
  - [x] Mail Service
  - [x] Frontend
- [x] **Stocks** - Дневник трейдера
  - [x] Core (Django)
  - [x] Formatter (FastAPI)
  - [x] Web Clients
  - [x] Frontend
- [x] **CoinMarketCap** - Крипто-платформа
  - [x] Auth Service
  - [x] Mail Service
  - [x] Frontend
- [x] **Stream** - Стриминг
  - [x] Auth Service
  - [x] Микросервисы
  - [x] Frontend
- [x] **Marketplace** - Маркетплейс
  - [x] Frontend

### Требует настройки ⚠️

- [ ] **Trading Terminal** - Нужны API ключи бирж
- [ ] **AI Profiles** - Нужна настройка AI сервисов
- [ ] **TON NFT** - Смарт-контракты (deploy)

### Инфраструктура ✅

- [x] Docker Networks (axanetwork, streaming)
- [x] PostgreSQL (6 экземпляров)
- [x] Redis (5 экземпляров)
- [x] RabbitMQ (4 экземпляра)
- [x] Elasticsearch
- [x] MinIO (S3)
- [x] Traefik (Load Balancers)
- [x] Flower (Monitoring)

---

## 🎯 Следующие шаги

1. **Запустить минимальную версию**
   ```bash
   ./start-platform.sh minimal
   ```

2. **Проверить работу**
   - Открыть http://localhost:3001
   - Зарегистрировать пользователя
   - Создать пост

3. **Добавить другие сервисы**
   ```bash
   ./start-platform.sh full
   ```

4. **Настроить production**
   - SSL сертификаты
   - Домены
   - Бэкапы
   - Мониторинг

---

**Версия**: 1.0  
**Последнее обновление**: Октябрь 2025


