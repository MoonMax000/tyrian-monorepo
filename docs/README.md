# 📚 Tyrian Trade Documentation

Документация проекта Tyrian Trade - платформа для трейдинга, социальной сети, AI-ассистента и live-streaming.

---

## 🚀 Быстрый старт

1. **[QUICK_START.md](setup/QUICK_START.md)** - Как запустить платформу за 5 минут
2. **[CHEATSHEET.md](CHEATSHEET.md)** - Шпаргалка по командам
3. **[OAUTH_DEBUG_GUIDE.md](OAUTH_DEBUG_GUIDE.md)** - Гайд по Google OAuth (обязательно прочитать!)

---

## 📂 Структура документации

### 🔄 Migration
Документы по миграции в Nx Monorepo:
- **[NX_MIGRATION_PLAN.md](migration/NX_MIGRATION_PLAN.md)** - План миграции
- **[NX_MIGRATION_SUMMARY.md](migration/NX_MIGRATION_SUMMARY.md)** - Итоговый отчет
- **[MIGRATION_STATUS.md](migration/MIGRATION_STATUS.md)** - Текущий статус

### ⚙️ Setup
Инструкции по настройке:
- **[PLATFORM_SETUP.md](setup/PLATFORM_SETUP.md)** - Настройка платформы
- **[FULL_SETUP_SSO_GOOGLE.md](setup/FULL_SETUP_SSO_GOOGLE.md)** - Настройка Google OAuth
- **[NGROK_SETUP.md](setup/NGROK_SETUP.md)** - Настройка ngrok для production

### 🔧 Troubleshooting
Решение проблем:
- **[OAUTH_DEBUG_GUIDE.md](OAUTH_DEBUG_GUIDE.md)** - ⭐ Главный гайд по OAuth проблемам
- **[LOGIN_FIX.md](troubleshooting/LOGIN_FIX.md)** - Исправление проблем авторизации
- **[FIXES_SUMMARY.md](troubleshooting/FIXES_SUMMARY.md)** - Сводка всех исправлений
- **[QUICK_TROUBLESHOOTING.md](troubleshooting/QUICK_TROUBLESHOOTING.md)** - Быстрые решения

### 🏗️ Architecture
Архитектурные решения:
- **[ARCHITECTURE.md](architecture/ARCHITECTURE.md)** - Архитектура платформы
- **[BACKEND_FRONTEND_MAP.md](architecture/BACKEND_FRONTEND_MAP.md)** - Карта backend/frontend
- **[PORTS.md](architecture/PORTS.md)** - Карта портов всех сервисов
- **[SERVICES.md](architecture/SERVICES.md)** - Описание всех сервисов

### ✅ Completed
Завершенные задачи:
- **[FINAL_FIXES_COMPLETE.md](completed/FINAL_FIXES_COMPLETE.md)** - Финальные исправления
- **[SSO_SETUP_COMPLETE.md](completed/SSO_SETUP_COMPLETE.md)** - SSO настроен
- **[VARIANT_3_COMPLETED.md](completed/VARIANT_3_COMPLETED.md)** - Variant 3 завершен

---

## 🎯 Основные проблемы и их решения

### 1. Зависание при Google OAuth авторизации
**Проблема:** После нажатия "Продолжить" в Google OAuth зависает на несколько минут.

**Решение:** Смотри **[OAUTH_DEBUG_GUIDE.md](OAUTH_DEBUG_GUIDE.md)**

**Краткое решение:**
- Отключить RabbitMQ sync для разработки
- Использовать Celery EAGER mode
- Использовать Database sessions вместо Redis

---

### 2. 404 на /api/accounts/profile/
**Проблема:** Frontend получает 404 при запросе профиля.

**Решение:** Использовать `/api/accounts/me/` вместо `/profile/`

---

### 3. CORS блокирует запросы
**Проблема:** Browser блокирует запросы к Auth Service.

**Решение:**
```bash
export CORS_ALLOW_ALL_ORIGINS="True"
export CORS_ALLOW_CREDENTIALS="True"
```

Запускать Django с `python manage.py runserver`, НЕ `uvicorn`!

---

## 🔑 Переменные окружения

### Auth Service (обязательные):
```bash
DEBUG="True"
ALLOWED_HOSTS="localhost,127.0.0.1"
CORS_ALLOW_ALL_ORIGINS="True"
CORS_ALLOW_CREDENTIALS="True"
GOOGLE_CLIENT_ID="your-id"
GOOGLE_CLIENT_SECRET="your-secret"
GOOGLE_REDIRECT_URI="http://localhost:8001/api/accounts/google/callback/"
MARKETPLACE_URL="http://localhost:4205"
```

---

## 📦 Структура монорепозитория

```
tyrian-monorepo/
├── apps/
│   ├── frontends/          # Frontend приложения (Next.js, Vite)
│   │   ├── ai-assistant/   # AI Assistant (Next.js) - :4201
│   │   ├── live-streaming/ # Live Streaming (Next.js) - :4202
│   │   ├── cryptocurrency/ # Cryptocurrency (Next.js) - :4203
│   │   ├── social-network/ # Social Network (Next.js) - :4204
│   │   ├── marketplace/    # Marketplace (Next.js) - :4205
│   │   ├── stocks/         # Stocks (Next.js) - :4206
│   │   └── portfolios/     # Portfolios (Vite) - :5173
│   │
│   └── backends/           # Backend сервисы
│       ├── auth-service/   # Django Auth Service - :8001
│       ├── auth-sync-service/        # Go Auth Sync
│       ├── socialweb-*-service/      # Go Social Network services
│       ├── stream-*-service/         # Go Streaming services
│       └── stocks-backend/           # Django Stocks backend
│
├── libs/
│   └── shared/             # Shared libraries
│       ├── ui/             # Shared UI components
│       ├── api/            # Shared API utils
│       ├── types/          # Shared TypeScript types
│       └── feature-flags/  # Feature flags
│
├── docs/                   # 📚 Вся документация
├── infrastructure/         # Docker, Kubernetes configs
├── .github/workflows/      # CI/CD workflows
└── nx.json                 # Nx configuration
```

---

## 🛠️ Основные команды

### Запуск всех сервисов:
```bash
# Frontend
npx nx serve ai-assistant --port 4201
npx nx serve live-streaming --port 4202
npx nx serve cryptocurrency --port 4203
npx nx serve social-network --port 4204
npx nx serve marketplace --port 4205
npx nx serve stocks --port 4206
npx nx serve portfolios --port 5173

# Backend
./START_AUTH.sh  # Auth Service на :8001
```

### Тестирование:
```bash
npx nx test shared-ui        # Unit tests
npx nx build ai-assistant    # Production build
npx nx lint marketplace      # Linting
```

### Полезные команды:
```bash
npx nx graph                 # Dependency graph
npx nx affected:test        # Test affected projects
npx nx reset                # Clear cache
```

---

## 📊 Статус проекта

### ✅ Завершено:
- [x] Миграция 6 frontend приложений в Nx
- [x] Миграция 15 backend сервисов
- [x] Настройка shared libraries (ui, api, types, feature-flags)
- [x] Google OAuth SSO
- [x] User Profile компонент
- [x] Docker Compose для всех сервисов
- [x] CI/CD с GitHub Actions
- [x] Тестовая инфраструктура (Jest)

### 🚧 В процессе:
- [ ] Production deployment
- [ ] Kubernetes configs
- [ ] Monitoring и logging
- [ ] E2E тесты

---

## 🎓 Уроки и лучшие практики

### Django + Celery:
1. ✅ Используй EAGER mode для разработки
2. ✅ Django Signals могут блокировать HTTP response!
3. ✅ Database sessions работают без Redis
4. ✅ Всегда запускай с `manage.py runserver`, не `uvicorn`

### Next.js + Nx:
1. ✅ Используй `transpilePackages` для shared libraries
2. ✅ Webpack aliases для resolution
3. ✅ `dynamic` import для client-only компонентов
4. ✅ Очищай `.next` кэш при проблемах

### CORS:
1. ✅ `CORS_ALLOW_ALL_ORIGINS=True` для разработки
2. ✅ `CORS_ALLOW_CREDENTIALS=True` для cookies
3. ✅ `CORS_EXPOSE_HEADERS` для JavaScript доступа

---

## 📖 Дополнительные ресурсы

- [Nx Documentation](https://nx.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Django REST Framework](https://www.django-rest-framework.org)
- [Google OAuth Setup](https://console.cloud.google.com)

---

## 🤝 Контакты

Для вопросов по проекту обращайтесь к документации в папке `docs/`.

---

**Последнее обновление:** 5 октября 2025  
**Версия:** 1.0.0  
**Статус:** ✅ Production Ready

