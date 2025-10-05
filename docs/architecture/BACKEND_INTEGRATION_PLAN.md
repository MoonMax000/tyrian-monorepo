# 🔧 План интеграции бэкендов с Shared Packages и Nx

**Дата:** 2025-10-05  
**Текущий статус:** Frontend Вариант 3 завершен ✅  
**Следующий этап:** Интеграция бэкендов

---

## 📊 **ТЕКУЩАЯ АРХИТЕКТУРА БЭКЕНДОВ**

### **Найдено бэкендов:**

```
🔐 АВТОРИЗАЦИЯ (4 сервиса):
├── AXA-auth-server-main (Django) - главный Auth Server
├── AXA-socialweb-auth-main - auth для Social Network
├── AXA-coinmarketcap-auth-main - auth для Crypto
└── stream-auth-service-master - auth для Streaming

👥 SOCIAL NETWORK (7 микросервисов):
├── favorites - избранное
├── likes - лайки
├── mail - почта
├── notifications - уведомления
├── posts - посты
├── profiles - профили
└── subscriptions - подписки

₿ CRYPTOCURRENCY (2 микросервиса):
├── auth - авторизация
└── mail - почтовые уведомления

📡 LIVE STREAMING (8 микросервисов):
├── auth-service - авторизация
├── chat-service - чат
├── infra - инфраструктура
├── media-service - медиа
├── notify-service - уведомления
├── payment - платежи
├── recommend-service - рекомендации
└── streamer-service - стриминг

📈 TRADING TERMINAL (1 сервис):
└── AXA-trading-terminal-back-main - бэкенд терминала
```

**ИТОГО:** ~22 микросервиса! 🎯

---

## 🎯 **СТРАТЕГИЯ ИНТЕГРАЦИИ**

### **ФАЗА 1: ВАРИАНТЫ ПОДКЛЮЧЕНИЯ БЭКЕНДОВ**

#### **🟢 Вариант A: Оставить как есть (Рекомендуется для начала)**

**Суть:**
- Бэкенды остаются **отдельными** микросервисами
- Frontend shared packages **только для UI**
- Каждый фронтенд общается со своими бэкендами
- **Общий Auth Server** (AXA-auth-server-main) для SSO

**Архитектура:**
```
Frontend (Shared UI):
├── Marketplace → API: AXA-auth-server
├── Social → API: AXA-socialweb-* микросервисы
├── Crypto → API: AXA-coinmarketcap-* микросервисы
├── Stocks → API: AXA-trading-terminal-back
└── Streaming → API: stream-* микросервисы

Backend (Микросервисы):
└── Все остаются независимыми
```

**Преимущества:**
- ✅ Минимальные изменения
- ✅ Микросервисы остаются автономными
- ✅ Легко масштабировать
- ✅ Разные команды могут работать независимо

**Недостатки:**
- ❌ Много микросервисов для управления
- ❌ Сложность деплоя (22 сервиса!)

---

#### **🟡 Вариант B: API Gateway (Средняя сложность)**

**Суть:**
- Создать **единый API Gateway** перед всеми микросервисами
- Frontend общается только с Gateway
- Gateway маршрутизирует запросы к нужным микросервисам

**Архитектура:**
```
Frontend (Shared UI) → API Gateway → Микросервисы
                           ↓
                     ┌──────┴──────┐
                     ↓             ↓
              Auth Services   Business Logic
                                  (posts, profiles, etc)
```

**Инструменты:**
- Kong Gateway
- Nginx + Lua
- Traefik
- AWS API Gateway

**Преимущества:**
- ✅ Единая точка входа
- ✅ Централизованная авторизация
- ✅ Rate limiting
- ✅ Мониторинг в одном месте

**Недостатки:**
- ❌ Дополнительный слой сложности
- ❌ Single point of failure (если Gateway падает)

---

#### **🔴 Вариант C: Nx Monorepo для ВСЕГО (Максимальная интеграция)**

**Суть:**
- Переместить **И фронтенды И бэкенды** в один Nx монорепо
- Shared packages для frontend **И** backend
- Единая система сборки и деплоя

**Архитектура:**
```
tyrian-platform-monorepo/
├── apps/
│   ├── frontend/
│   │   ├── marketplace/
│   │   ├── social/
│   │   └── ... 7 фронтендов
│   └── backend/
│       ├── auth-server/
│       ├── social-posts/
│       └── ... 22 микросервиса
├── packages/
│   ├── ui/ (frontend shared)
│   ├── feature-flags/ (frontend shared)
│   ├── api-clients/ (backend shared)
│   ├── db-models/ (backend shared)
│   └── auth-utils/ (backend shared)
└── tools/
```

**Преимущества:**
- ✅ Единая кодовая база
- ✅ Shared code между бэкендами
- ✅ Один CI/CD для всего
- ✅ Максимальная эффективность

**Недостатки:**
- ❌ Очень сложная миграция (6-12 месяцев!)
- ❌ Требует переобучения команды
- ❌ Огромный монорепо

---

## 🎯 **МОЯ РЕКОМЕНДАЦИЯ: ПОЭТАПНЫЙ ПОДХОД**

### **ЭТАП 1 (СЕЙЧАС): Вариант A + Унификация Auth**

**Срок:** 1-2 недели

1. **Использовать AXA-auth-server-main** как единственный Auth Server
2. Убрать отдельные auth серверы (socialweb-auth, coinmarketcap-auth, stream-auth)
3. Настроить SSO через один Auth Server
4. Frontend shared packages уже готовы ✅

**Что делать:**

```bash
# 1. Настроить Auth Server для всех продуктов
cd AXA-auth-server-main

# 2. Добавить endpoints для каждого продукта:
# - /api/accounts/marketplace/
# - /api/accounts/social/
# - /api/accounts/crypto/
# - /api/accounts/stocks/
# - /api/accounts/stream/

# 3. Обновить фронтенды чтобы использовали единый Auth
# (Уже частично сделано через .env.local)

# 4. Остановить отдельные auth серверы
```

**Результат:**
- ✅ Один Auth Server вместо 4
- ✅ SSO работает
- ✅ 3 микросервиса меньше (19 вместо 22)

---

### **ЭТАП 2 (ЧЕРЕЗ 1 МЕСЯЦ): API Gateway**

**Срок:** 2-3 недели

1. **Установить Kong Gateway** или Nginx
2. Настроить маршрутизацию
3. Добавить rate limiting
4. Настроить мониторинг

**Архитектура после Этапа 2:**
```
Frontend → Kong Gateway → Микросервисы
  (Shared UI)     ↓
              [Auth, Rate Limit, Monitoring]
```

**Что делать:**

```bash
# 1. Установить Kong
docker pull kong

# 2. Создать kong.yml конфигурацию:
services:
  - name: auth-service
    url: http://auth-server:8001
    routes:
      - paths: [/api/auth]
  
  - name: social-posts
    url: http://social-posts:8000
    routes:
      - paths: [/api/social/posts]
  
  # ... для каждого микросервиса

# 3. Обновить фронтенды:
# API_BASE_URL=http://localhost:8000 (Kong Gateway)
```

**Результат:**
- ✅ Единая точка входа для всех API
- ✅ Централизованная авторизация
- ✅ Rate limiting
- ✅ Легче деплоить

---

### **ЭТАП 3 (ЧЕРЕЗ 3-6 МЕСЯЦЕВ): Shared Backend Utils**

**Срок:** 1-2 месяца

Создать **shared packages для бэкендов**:

```
shared/
├── frontend/ (уже есть)
│   ├── ui/
│   ├── feature-flags/
│   └── types/
└── backend/ (новое)
    ├── auth-utils/
    ├── db-models/
    ├── api-clients/
    └── common-middleware/
```

**Что делать:**

1. **Создать @tyrian/backend-auth**:
```python
# shared/backend/auth-utils/jwt_utils.py
def verify_jwt(token: str) -> dict:
    # Общая логика проверки JWT
    pass
```

2. **Создать @tyrian/backend-models**:
```python
# shared/backend/db-models/user.py
class User(BaseModel):
    id: UUID
    email: str
    # Общая модель пользователя
```

3. **Подключить к микросервисам**:
```python
# В любом микросервисе:
from tyrian_backend_auth import verify_jwt
from tyrian_backend_models import User
```

**Результат:**
- ✅ Нет дублирования кода в бэкендах
- ✅ Единые модели данных
- ✅ Единая логика авторизации

---

### **ЭТАП 4 (ЧЕРЕЗ 6-12 МЕСЯЦЕВ): Nx Monorepo для всего**

**Срок:** 3-6 месяцев

Переместить **ВСЁ** в Nx монорепо (Вариант C).

См. `ГОТОВНОСТЬ_К_ВАРИАНТУ_2.md` для деталей.

---

## 🔧 **КОНКРЕТНЫЕ ШАГИ ДЛЯ ЭТАПА 1 (СЕЙЧАС)**

### **ШАГ 1: Унификация Auth Server (3-5 дней)**

#### **1.1. Настроить AXA-auth-server-main**

```bash
cd AXA-auth-server-main

# Обновить settings.py:
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'tyriantrade.ngrok.pro',  # ваш домен
]

# Добавить CORS для всех фронтендов:
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',  # Marketplace
    'http://localhost:3001',  # Social
    'http://localhost:3002',  # Crypto
    'http://localhost:3003',  # Stocks
    'http://localhost:3004',  # Stream
    'http://localhost:3005',  # AI
    'http://localhost:5173',  # Portfolios
]

# Настроить SESSION_COOKIE_DOMAIN:
SESSION_COOKIE_DOMAIN = 'localhost'  # для dev
# SESSION_COOKIE_DOMAIN = '.tyriantrade.com'  # для production
```

#### **1.2. Обновить все фронтенды**

В каждом проекте создать `src/api/auth.ts`:

```typescript
// shared/packages/api/src/auth.ts
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8001';

export async function login(email: string, password: string) {
  const res = await fetch(`${AUTH_BASE_URL}/api/accounts/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // ВАЖНО для cookies!
  });
  return res.json();
}

export async function getProfile() {
  const res = await fetch(`${AUTH_BASE_URL}/api/accounts/profile/`, {
    credentials: 'include',
  });
  return res.json();
}

export async function logout() {
  const res = await fetch(`${AUTH_BASE_URL}/api/accounts/logout/`, {
    method: 'POST',
    credentials: 'include',
  });
  return res.json();
}
```

#### **1.3. Создать shared API client package**

```bash
cd shared/packages
mkdir -p api/src
cd api

# package.json:
cat > package.json << 'EOF'
{
  "name": "@tyrian/api",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "dependencies": {
    "axios": "^1.6.0"
  }
}
EOF

# src/index.ts:
cat > src/index.ts << 'EOF'
export * from './auth';
export * from './config';
EOF
```

#### **1.4. Подключить к фронтендам**

```bash
# В каждом фронтенде:
cd AXA-marketplace-main
npm pkg set dependencies.@tyrian/api='file:../shared/packages/api'
npm install
```

**Использование:**

```typescript
// В любом компоненте:
import { login, getProfile, logout } from '@tyrian/api';

async function handleLogin() {
  const user = await login(email, password);
  console.log('Logged in:', user);
}
```

---

### **ШАГ 2: Настроить микросервисы Social Network (1 неделя)**

**Проблема:** У Social Network 7 отдельных микросервисов.

**Решение:** API Gateway перед ними.

#### **2.1. Docker Compose для всех микросервисов**

Создать `docker-compose.all-social.yml`:

```yaml
version: '3.8'

services:
  # API Gateway (Nginx)
  gateway:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx-social.conf:/etc/nginx/nginx.conf
    depends_on:
      - posts
      - profiles
      - likes
      - favorites
      - subscriptions
      - notifications
      - mail

  # Микросервисы
  posts:
    build: ./AXA-socialweb-posts-main
    expose:
      - "8000"
  
  profiles:
    build: ./AXA-socialweb-profiles-main
    expose:
      - "8000"
  
  # ... остальные
```

#### **2.2. Nginx конфигурация**

```nginx
http {
  upstream posts_backend {
    server posts:8000;
  }
  
  upstream profiles_backend {
    server profiles:8000;
  }
  
  server {
    listen 80;
    
    location /api/social/posts/ {
      proxy_pass http://posts_backend/;
    }
    
    location /api/social/profiles/ {
      proxy_pass http://profiles_backend/;
    }
    
    # ... остальные
  }
}
```

#### **2.3. Запуск**

```bash
docker-compose -f docker-compose.all-social.yml up -d
```

**Результат:**
- ✅ Все микросервисы Social Network за одним портом (8080)
- ✅ Frontend обращается к `localhost:8080/api/social/*`

---

## 📊 **ИТОГОВАЯ АРХИТЕКТУРА ПОСЛЕ ЭТАПА 1**

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (7 проектов)                   │
│                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐             │
│  │Marketplace │ │  Social    │ │   Crypto   │ ...         │
│  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘             │
│        │              │              │                      │
│        └──────────────┼──────────────┘                      │
│                       │                                     │
│                @tyrian/ui, @tyrian/feature-flags           │
│                @tyrian/api ← НОВОЕ!                         │
└───────────────────────┼─────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │     AXA-auth-server-main      │ ← Единый Auth!
        │         (Django)              │
        └───────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Social       │ │ Crypto       │ │ Streaming    │
│ Microservices│ │ Microservices│ │ Microservices│
│ (7 services) │ │ (2 services) │ │ (8 services) │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 🎯 **ЧТО ДЕЛАТЬ ДАЛЬШЕ?**

### **Выберите один из вариантов:**

1. **"Начать с Этапа 1"** - унификация Auth Server
2. **"Сразу делать API Gateway"** - более быстрый путь
3. **"Хочу Nx для всего"** - долго но правильно
4. **"Оставить как есть"** - пока работает

**Мой совет:**  
👉 **Начните с Этапа 1** (унификация Auth) - это быстро (1-2 недели) и даст большой результат!

---

**Готов помочь с любым из этапов! Что выбираете?** 🚀

