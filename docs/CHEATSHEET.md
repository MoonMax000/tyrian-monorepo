# AXA Platform - Шпаргалка

## ⚡ Быстрый запуск

```bash
# 1. Создать сети
docker network create axanetwork
docker network create streaming

# 2. Запустить всё (автоматически)
./start-platform.sh minimal   # Только Social Web
./start-platform.sh full      # Всё сразу

# 3. Остановить всё
./stop-platform.sh
```

---

## 🌐 Основные URL

| Что | URL |
|-----|-----|
| **Social Web** | http://localhost:3001 |
| **Stocks** | http://localhost:3002 |
| **Marketplace** | http://localhost:3005 |
| **API Gateway** | http://localhost:8080 |
| **Traefik Dashboard** | http://localhost:8090 |
| **RabbitMQ** | http://localhost:15671 (guest/guest) |
| **MinIO** | http://localhost:9001 |

---

## 🔧 Docker команды

```bash
# Посмотреть все контейнеры
docker ps

# Логи конкретного контейнера
docker logs <container_name> -f

# Перезапустить контейнер
docker restart <container_name>

# Остановить контейнер
docker stop <container_name>

# Удалить остановленные контейнеры
docker container prune

# Полная очистка
docker system prune -a --volumes
```

---

## 📦 Docker Compose

```bash
# Запустить
docker-compose up -d

# Остановить
docker-compose down

# Остановить и удалить данные
docker-compose down -v

# Пересобрать и запустить
docker-compose up -d --build

# Логи
docker-compose logs -f

# Перезапустить сервис
docker-compose restart <service_name>
```

---

## 🗄️ База данных

```bash
# Подключиться к PostgreSQL
docker exec -it <postgres_container> psql -U postgres -d <database_name>

# Список баз данных
\l

# Подключиться к базе
\c <database_name>

# Список таблиц
\dt

# Выйти
\q

# Backup
docker exec <postgres_container> pg_dump -U postgres <db_name> > backup.sql

# Restore
docker exec -i <postgres_container> psql -U postgres <db_name> < backup.sql
```

---

## 💾 Redis

```bash
# Подключиться к Redis
docker exec -it <redis_container> redis-cli

# Проверка
PING

# Все ключи
KEYS *

# Получить значение
GET <key>

# Удалить ключ
DEL <key>

# Очистить всё
FLUSHALL

# Выйти
exit
```

---

## 📨 RabbitMQ

```bash
# Management UI
http://localhost:15671
http://localhost:15672
http://localhost:15673

# Логин: guest / guest

# Посмотреть очереди
# Queues tab

# Отправить тестовое сообщение
# Queues → <queue_name> → Publish message
```

---

## 🔍 Диагностика

```bash
# Проверка портов
lsof -i :8080

# Убить процесс на порту
kill -9 <PID>

# Проверка сетей Docker
docker network ls
docker network inspect axanetwork

# Проверка volumes
docker volume ls

# Использование ресурсов
docker stats

# Информация о контейнере
docker inspect <container_name>
```

---

## 🐛 Решение проблем

### Порт занят
```bash
lsof -i :<port>
kill -9 <PID>
```

### Контейнер не запускается
```bash
docker logs <container_name>
docker-compose down
docker-compose up -d
```

### База не инициализируется
```bash
docker-compose down -v
docker-compose up -d
```

### Redis недоступен
```bash
docker exec -it <redis_container> redis-cli ping
docker-compose restart redis
```

### Нехватка памяти
- Увеличить память Docker Desktop
- Запускать сервисы по частям

---

## 📝 Файлы конфигурации

| Файл | Назначение |
|------|-----------|
| `.env` | Переменные окружения |
| `docker-compose.yml` | Конфигурация контейнеров |
| `Dockerfile` | Инструкции сборки |
| `package.json` | Зависимости Node.js |
| `requirements.txt` | Зависимости Python |
| `go.mod` | Зависимости Go |

---

## 🚀 NPM команды (фронтенд)

```bash
# Установить зависимости
npm install

# Запустить dev сервер
npm run dev

# Собрать production
npm run build

# Запустить production
npm start

# Очистить кэш
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 🔐 Логины по умолчанию

| Сервис | URL | Логин | Пароль |
|--------|-----|-------|--------|
| Auth Server Admin | http://localhost:8000/admin | admin@admin.ru | admin |
| RabbitMQ | http://localhost:15671 | guest | guest |
| Flower | http://localhost:5555 | - | - |

---

## 📊 Проверка здоровья

```bash
# API endpoints
curl http://localhost:8001/health/  # Auth Server
curl http://localhost:8050/health/  # Stocks
curl http://localhost:8080/api/v1/docs  # Social Web

# Elasticsearch
curl http://localhost:9200/_cluster/health

# Redis
docker exec -it <redis> redis-cli ping

# PostgreSQL
docker exec -it <postgres> pg_isready
```

---

## 🎯 Типичные сценарии

### Запуск только Social Web
```bash
cd AXA-auth-server-main && docker-compose up -d && cd ..
cd AXA-socialweb-auth-main && docker-compose up -d && cd ..
# Запустить остальные микросервисы...
cd AXA-socialweb-frontend-main && npm run dev
```

### Запуск только Stocks
```bash
cd AXA-stocks-backend-main && docker-compose up -d && cd ..
cd AXA-stocks-frontend-main && npm run dev
```

### Полная перезагрузка
```bash
./stop-platform.sh all
docker system prune -a --volumes
./start-platform.sh full
```

---

## 📂 Структура проекта (кратко)

```
.
├── README.md              # Главная документация
├── QUICK_START.md         # Быстрый старт
├── ARCHITECTURE.md        # Архитектура
├── SERVICES.md            # Список сервисов
├── PORTS.md               # Карта портов
├── CHECKLIST.md           # Чек-лист
├── CHEATSHEET.md          # Эта шпаргалка
├── start-platform.sh      # Автозапуск
├── stop-platform.sh       # Остановка
│
├── AXA-auth-server-main/          # Auth
├── AXA-socialweb-*-main/          # Social Web (9)
├── AXA-stocks-*-main/             # Stocks (2)
├── AXA-coinmarketcap-*-main/      # CMC (3)
├── AXA-marketplace-main/          # Marketplace
├── AXA-trading-terminal-*-main/   # Terminal
├── AXA-Turian-AI-profiles-main/   # AI
└── stream-*-main/                 # Stream (10)
```

---

## 🔢 Числа

- **Всего проектов**: 31
- **Микросервисов**: 25+
- **PostgreSQL**: 6 экземпляров
- **Redis**: 5 экземпляров
- **RabbitMQ**: 4 экземпляра
- **Фронтендов**: 7
- **Портов**: ~50

---

## 🎓 Полезные ссылки

| Документация | Файл |
|-------------|------|
| Полная установка | [PLATFORM_SETUP.md](PLATFORM_SETUP.md) |
| Быстрый старт | [QUICK_START.md](QUICK_START.md) |
| Архитектура | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Список сервисов | [SERVICES.md](SERVICES.md) |
| Карта портов | [PORTS.md](PORTS.md) |
| Чек-лист | [CHECKLIST.md](CHECKLIST.md) |

---

## 💡 Советы

1. **Запускайте по частям** - не все сразу
2. **Используйте ./start-platform.sh** - автоматизация
3. **Следите за логами** - `docker logs -f`
4. **Проверяйте порты** - `lsof -i :<port>`
5. **Бэкапьте данные** - `pg_dump`, `docker cp`
6. **Читайте логи ошибок** - они информативны
7. **Используйте health checks** - curl endpoints

---

## 📞 Если что-то пошло не так

1. Проверьте логи: `docker logs <container>`
2. Проверьте статус: `docker ps -a`
3. Проверьте .env файлы
4. Посмотрите [CHECKLIST.md](CHECKLIST.md) - раздел "Диагностика"
5. Попробуйте перезапустить: `docker-compose restart`
6. Крайний случай: `./stop-platform.sh all && ./start-platform.sh`

---

**Сохраните эту шпаргалку!** Она содержит 90% команд, которые вам понадобятся.

---

**Версия**: 1.0  
**Последнее обновление**: Октябрь 2025


