# 📦 Framework Preset - Tyrian Trade Monorepo

**Версия документа:** 1.0  
**Дата:** 5 октября 2025

---

## 🎨 Frontend Frameworks

### Next.js Applications (6 приложений)

**Framework:** Next.js 15.2.4 (App Router)  
**UI Library:** React 18.3.1  
**Language:** TypeScript 5.x  
**Styling:** Tailwind CSS 3.x

#### Приложения:

| Приложение      | Порт  | Framework        | Описание                |
|-----------------|-------|------------------|-------------------------|
| ai-assistant    | 4201  | Next.js 15 + React | AI Trading Assistant   |
| live-streaming  | 4202  | Next.js 15 + React | Live Streaming Platform|
| cryptocurrency  | 4203  | Next.js 15 + React | Crypto Trading         |
| social-network  | 4204  | Next.js 15 + React | Social Media for Traders|
| marketplace     | 4205  | Next.js 15 + React | Trading Marketplace    |
| stocks          | 4206  | Next.js 15 + React | Stock Trading Platform |

#### Ключевые особенности Next.js:
```json
{
  "framework": "Next.js",
  "version": "15.2.4",
  "features": [
    "App Router (не Pages Router!)",
    "Server Components",
    "Client Components ('use client')",
    "Route Groups - (base), (auth), etc.",
    "Parallel Routes",
    "Dynamic Routes",
    "API Routes (Route Handlers)"
  ],
  "rendering": [
    "SSR (Server-Side Rendering)",
    "SSG (Static Site Generation)",
    "ISR (Incremental Static Regeneration)"
  ]
}
```

#### Конфигурация Next.js:

**`next.config.js` важные опции:**
```javascript
module.exports = {
  // Transpile shared monorepo packages
  transpilePackages: ['@tyrian/ui', '@tyrian/api', '@tyrian/types', '@tyrian/feature-flags'],
  
  // Webpack aliases для shared libraries
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@tyrian/ui': path.resolve(__dirname, '../libs/shared/ui/src'),
      '@tyrian/api': path.resolve(__dirname, '../libs/shared/api/src'),
      // ...
    };
    return config;
  },
  
  // TypeScript - игнорировать ошибки билда (опционально)
  typescript: {
    ignoreBuildErrors: false, // Изменить на true только в крайнем случае
  },
};
```

---

### Vite + React Application (1 приложение)

**Framework:** Vite 7.0.0  
**UI Library:** React 18.3.1  
**Language:** TypeScript  
**Styling:** CSS Modules / Tailwind CSS

| Приложение | Порт | Framework      | Описание              |
|-----------|------|----------------|-----------------------|
| portfolios| 5173 | Vite + React   | Portfolio Management  |

#### Ключевые особенности Vite:
```json
{
  "framework": "Vite",
  "version": "7.0.0",
  "features": [
    "Lightning fast HMR (Hot Module Replacement)",
    "Native ES modules",
    "Optimized build with Rollup",
    "TypeScript support out of the box"
  ],
  "plugins": [
    "@vitejs/plugin-react - React Fast Refresh",
    "vite-tsconfig-paths - TypeScript path mapping"
  ]
}
```

---

### Shared Frontend Libraries

**Монорепо shared packages:**

```
libs/shared/
├── ui/                    # Shared React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── UserProfile.tsx
│   ├── GoogleLoginButton.tsx
│   └── ...
│
├── api/                   # API clients
│   ├── auth-client.ts
│   ├── fetch-wrapper.ts
│   └── ...
│
├── types/                 # TypeScript types
│   ├── user.types.ts
│   ├── api.types.ts
│   └── ...
│
└── feature-flags/         # Feature flag management
    └── flags.ts
```

**Используемые UI библиотеки:**

```json
{
  "ui_libraries": {
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.index",
    "@radix-ui/react-*": "latest",
    "react-hook-form": "^7.x",
    "react-query": "^4.x",
    "zustand": "^4.x"
  }
}
```

---

## ⚙️ Backend Frameworks

### Django + Django REST Framework (2 сервиса)

**Framework:** Django 5.2  
**API Framework:** Django REST Framework 3.14  
**Language:** Python 3.10+

| Сервис         | Порт | Framework | Описание                    |
|----------------|------|-----------|----------------------------|
| auth-service   | 8001 | Django 5.2| Centralized Auth (Google OAuth) |
| stocks-backend | 8002 | Django 5.2| Stocks Trading API         |

#### Ключевые компоненты Django:

```python
# requirements.txt
Django==5.2.0
djangorestframework==3.14.0
django-cors-headers==4.x
django-environ==0.11.0
celery==5.x
psycopg2-binary==2.9.x  # PostgreSQL
```

#### Django Settings (Production-Ready):

```python
# core/settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'rest_framework',
    'corsheaders',
    'accounts',  # Custom apps
]

# CORS (КРИТИЧНО!)
CORS_ALLOW_ALL_ORIGINS = True  # Только для разработки!
CORS_ALLOW_CREDENTIALS = True
CORS_EXPOSE_HEADERS = ['content-type', 'access-control-allow-origin']

# Sessions
SESSION_ENGINE = "django.contrib.sessions.backends.db"  # SQLite/PostgreSQL
# SESSION_ENGINE = "accounts.backends"  # Redis (для production)

# Celery
if DEBUG:
    CELERY_TASK_ALWAYS_EAGER = True  # Синхронный режим
else:
    CELERY_BROKER_URL = 'redis://localhost:6379/0'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

#### Важные команды Django:

```bash
# Разработка
python manage.py runserver 8001  # НЕ uvicorn!

# Миграции
python manage.py makemigrations
python manage.py migrate

# Создание суперпользователя
python manage.py createsuperuser

# Собрать статику
python manage.py collectstatic
```

---

### Go Microservices (12 сервисов)

**Language:** Go 1.20+  
**HTTP Framework:** Gin / net/http  
**Database:** PostgreSQL (pgx driver)

#### Список Go сервисов:

**Social Network (6 сервисов):**
- socialweb-posts-service
- socialweb-profiles-service
- socialweb-likes-service
- socialweb-subscriptions-service
- socialweb-favorites-service
- auth-sync-service

**Live Streaming (6 сервисов):**
- stream-auth-service
- stream-chat-service
- stream-media-service
- stream-notify-service
- stream-recommend-service
- stream-streamer-service

#### Go Project Structure:

```
go-service/
├── main.go              # Entry point
├── go.mod               # Dependencies
├── go.sum               # Checksums
├── handlers/            # HTTP handlers
├── models/              # Data models
├── database/            # DB connection
├── middleware/          # Middleware
└── config/              # Configuration
```

#### Типичный `go.mod`:

```go
module github.com/tyrian/socialweb-posts-service

go 1.20

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/jackc/pgx/v5 v5.4.0
    github.com/joho/godotenv v1.5.1
    github.com/redis/go-redis/v9 v9.0.5
)
```

#### Ключевые библиотеки Go:

```json
{
  "web_framework": "github.com/gin-gonic/gin",
  "database": "github.com/jackc/pgx/v5",
  "env_vars": "github.com/joho/godotenv",
  "redis": "github.com/redis/go-redis/v9",
  "jwt": "github.com/golang-jwt/jwt/v5",
  "validation": "github.com/go-playground/validator/v10"
}
```

#### Запуск Go сервиса:

```bash
# Development
go run main.go

# Build
go build -o service main.go

# Production
./service
```

---

### FastAPI (Python) (1 сервис)

**Framework:** FastAPI 0.104+  
**Language:** Python 3.10+  
**ASGI Server:** Uvicorn

| Сервис                           | Framework | Описание           |
|----------------------------------|-----------|-------------------|
| socialweb-notifications-service  | FastAPI   | Notifications API |

#### FastAPI Dependencies:

```python
# requirements.txt
fastapi==0.104.0
uvicorn[standard]==0.24.0
pydantic==2.4.0
sqlalchemy==2.0.0
asyncpg==0.29.0  # Async PostgreSQL
```

#### FastAPI App Structure:

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Notifications Service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Notifications Service"}
```

#### Запуск FastAPI:

```bash
# Development
uvicorn main:app --reload --port 8003

# Production
uvicorn main:app --host 0.0.0.0 --port 8003 --workers 4
```

---

## 🗄️ Databases & Infrastructure

### Databases:

| Database     | Использование                          |
|-------------|---------------------------------------|
| PostgreSQL  | Main database для всех сервисов       |
| SQLite      | Development (Django sessions)         |
| Redis       | Sessions, Cache, Celery queue (production) |

### Message Queue:

- **RabbitMQ** - для async tasks (отключен в development)
- **Celery** - task queue (EAGER mode в development)

### API Gateway / Reverse Proxy:

- **Nginx** - для production deployment
- **Localhost** - для development (прямое подключение к портам)

---

## 🛠️ Build Tools & Monorepo

### Nx Monorepo:

**Version:** Nx 20+

```json
{
  "monorepo_tool": "Nx",
  "version": "20.x",
  "features": [
    "Computation Caching",
    "Dependency Graph",
    "Affected Commands",
    "Integrated Tooling",
    "Code Generators"
  ]
}
```

### Package Manager:

**npm** (можно использовать yarn или pnpm)

```bash
npm --version  # 9+
node --version # 18+
```

---

## 🔧 Development Tools

### Frontend:

```json
{
  "typescript": "5.x",
  "eslint": "8.x",
  "prettier": "3.x",
  "tailwindcss": "3.x",
  "postcss": "8.x"
}
```

### Backend (Python):

```python
{
  "black": "23.x",       # Code formatter
  "flake8": "6.x",       # Linter
  "mypy": "1.x",         # Type checker
  "pytest": "7.x"        # Testing
}
```

### Backend (Go):

```bash
gofmt      # Built-in formatter
golangci-lint  # Linter
go test    # Built-in testing
```

---

## 📦 Docker & Containerization

### Dockerfiles:

```dockerfile
# Frontend (Next.js)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]

# Backend (Django)
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]

# Backend (Go)
FROM golang:1.20-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o service .

FROM alpine:latest
COPY --from=builder /app/service /service
CMD ["/service"]
```

---

## 🚀 Deployment

### Development:

```bash
# Frontend
npx nx serve <app-name>

# Django
python manage.py runserver 8001

# Go
go run main.go

# FastAPI
uvicorn main:app --reload
```

### Production:

```bash
# Docker Compose
docker-compose up -d

# Kubernetes
kubectl apply -f k8s/
```

---

## 📊 Summary Table

| Category    | Technology       | Count | Ports       |
|-------------|-----------------|-------|-------------|
| Frontend    | Next.js 15      | 6     | 4201-4206   |
| Frontend    | Vite + React    | 1     | 5173        |
| Backend     | Django 5.2      | 2     | 8001-8002   |
| Backend     | Go 1.20+        | 12    | 8003+       |
| Backend     | FastAPI         | 1     | 8003+       |
| **Total**   | **All Services**| **22**| **Multiple**|

---

## 🎯 Best Practices

### Frontend:
✅ Используй Next.js App Router (не Pages Router)  
✅ Используй TypeScript для type safety  
✅ Используй shared components из `@tyrian/ui`  
✅ Используй `'use client'` для client-side компонентов  
✅ Очищай `.next` cache при проблемах  

### Backend (Django):
✅ Запускай с `python manage.py runserver`, НЕ `uvicorn`  
✅ Используй EAGER mode Celery для development  
✅ Database sessions для development, Redis для production  
✅ Всегда настраивай CORS правильно  

### Backend (Go):
✅ Используй `go mod` для управления зависимостями  
✅ Следуй стандартной структуре проекта Go  
✅ Используй context для cancellation  
✅ Обрабатывай ошибки явно  

---

**Документ обновлен:** 5 октября 2025  
**Версия:** 1.0.0

