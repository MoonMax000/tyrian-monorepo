# Financial Data Aggregator

Система агрегации и анализа финансовых данных из различных источников.

## Архитектура

### Core (Django)
- Основное приложение
- База данных PostgreSQL
- Celery для фоновых задач
- Redis для кеширования
- Flower для мониторинга Celery

### Formatter (FastAPI)
- Сервис форматирования данных
- Получает запросы от Core
- Маршрутизирует запросы к web-clients
- Форматирует ответы для Core

### Web Clients (в разработке)
- Cbonds Client - получение данных из Cbonds
- FMP Client - получение данных из Financial Modeling Prep

## Структура проекта

```
backend/
├── core/ # Django приложение
│ ├── project/ # Основной код
│ ├── Dockerfile
│ └── requirements.txt
├── formatter/ # Formatter сервис
│ ├── main.py
│ ├── Dockerfile
│ └── requirements.txt
├── web-clients/ # Клиенты для внешних API
│ ├── cbonds/
│ └── fmp/
├── docs/ # Документация
│ └── api/
├── docker-compose.yaml # Основной compose файл
└── Makefile # Команды для управления```

## Порты сервисов
- Core (Django): 9999
- Formatter: 8001
- Cbonds Client: 8002 (в разработке)
- FMP Client: 8003 (в разработке)
- Flower: 5555
- Redis: 6379
- PostgreSQL: 5432

## Запуск проекта

### Предварительные требования
- Docker
- Docker Compose
- Make

### Настройка окружения
1. Создать .env файл в core/project/
2. Создать .env файл в formatter/

### Команды запуска

```bash
make run
```

### Остановка сервисов

```bash
make stop
```

### Остановка и запуск сервисов с обновлением кода

```bash
make rerun
```

### Проверка работоспособности
- Core: http://localhost:9999/health/
- Formatter: http://localhost:8001/health
- Flower: http://localhost:5555

## Разработка

### Добавление нового web-client
1. Создать папку в web-clients/
2. Добавить необходимые файлы (Dockerfile, requirements.txt, код)
3. Добавить сервис в docker-compose.yaml
4. Обновить документацию

### Тестирование


```bash
# Запуск тестов
make pytest
```

## Документация
- [API Documentation](docs/api/)
- [Deployment Guide](docs/deployment.md)
