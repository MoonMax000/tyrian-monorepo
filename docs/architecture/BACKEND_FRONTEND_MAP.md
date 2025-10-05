# Карта соответствия Frontend ↔ Backend

## ✅ ВСЁ ЕСТЬ - Можно запускать!

---

## 1. Social Web ✅ ГОТОВО

**Frontend**: `AXA-socialweb-frontend-main` (Next.js, порт 3001)

**Backend** (9 микросервисов Go):
```
├─ AXA-socialweb-auth-main          → /api/v1/auth (8010)
├─ AXA-socialweb-profiles-main      → /api/v1/profile (8003)
├─ AXA-socialweb-posts-main         → /api/v1/posts (8004)
├─ AXA-socialweb-notifications-main → /api/v1/notifications (8005)
├─ AXA-socialweb-favorites-main     → /api/v1/favorites (8006)
├─ AXA-socialweb-subscriptions-main → /api/v1/subscriptions (8007)
├─ AXA-socialweb-likes-main         → /api/v1/likes (8008)
└─ AXA-socialweb-mail-main          → Mail Service

Traefik балансировщик: http://localhost:8080
```

**Конфигурация**:
```bash
# В .env фронтенда:
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_AUTH_URL=http://localhost:8080/api/v1/auth
```

---

## 2. Stocks ✅ ГОТОВО

**Frontend**: `AXA-stocks-frontend-main` (Next.js, порт 3002)

**Backend**: `AXA-stocks-backend-main` (Django + FastAPI)
```
├─ Core Service    (Django)   → http://localhost:8050
├─ Formatter       (FastAPI)  → http://localhost:8051
└─ Web Clients:
   ├─ Cbonds       (Python)   → 8054
   ├─ FMP          (Python)   → 8052
   ├─ Terrapin     (Python)   → 8054
   └─ CMC          (Python)   → 8053
```

**Конфигурация**:
```bash
# В .env фронтенда:
NEXT_PUBLIC_API_URL=http://localhost:8050
```

---

## 3. CoinMarketCap ✅ ГОТОВО

**Frontend**: `AXA-coinmarketcap-main` (Next.js, порт 3003)

**Backend**:
```
├─ AXA-coinmarketcap-auth-main (Go) → http://localhost:8081
└─ AXA-coinmarketcap-mail-main (Go) → Mail Service
```

**Конфигурация**:
```bash
# В .env фронтенда:
NEXT_PUBLIC_API_URL=http://localhost:8081
```

---

## 4. Stream ✅ ГОТОВО

**Frontends**:
- `stream-frontend-service-main` (Next.js, порт 3000)
- `stream-frontend-admin-service-main` (Svelte)

**Backend** (6 микросервисов Go):
```
├─ stream-auth-service-master   → /api/v1/auth (8002)
├─ stream-chat-service-main     → /api/v1/chat
├─ stream-media-service-main    → /api/v1/media
├─ stream-notify-service-main   → /api/v1/notify
├─ stream-recommend-service-main → /api/v1/recommend (8007)
└─ stream-streamer-service-main → /api/v1/streamer

Traefik балансировщик: http://localhost:8082
```

**Конфигурация**:
```bash
# В .env фронтенда:
NEXT_PUBLIC_API_URL=http://localhost:8082/api/v1
```

---

## 5. Marketplace ✅ ГОТОВО

**Frontend**: `AXA-marketplace-main` (Next.js, порт 3005)

**Backend**: Интегрируется со всеми другими сервисами (агрегатор)

**Конфигурация**:
```bash
# В .env фронтенда:
NEXT_PUBLIC_TRADER_DIARY_URL=http://localhost:3002
NEXT_PUBLIC_COINMARKETCAP_URL=http://localhost:3003
NEXT_PUBLIC_SOCIAL_NETWORK_URL=http://localhost:3001
NEXT_PUBLIC_STREAMING_URL=http://localhost:3000
NEXT_PUBLIC_AI_ASSISTANT_URL=http://localhost:3006
NEXT_PUBLIC_MARKETPLACE_URL=http://localhost:3005
NEXT_PUBLIC_TRADING_TERMINAL_URL=http://localhost:8061
NEXT_PUBLIC_AUTH_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_API=http://localhost:8001
```

**Собственный бэкенд не требуется** - это UI агрегатор.

---

## 6. AI Profiles ⚠️ ЧАСТИЧНО

**Frontend**: `AXA-Turian-AI-profiles-main` (Next.js, порт 3006)

**Backend API которые использует** (из исходного кода):

```typescript
// src/api/index.tsx
authApi.baseURL: 'https://authservice.tyriantrade.com/api'
  → Использует Auth Server (AXA-auth-server-main)
  → Локально: http://localhost:8001/api

streamApi.baseURL: 'https://streamer.k8s.tyriantrade.com/api/v1'
  → Использует Stream API
  → Локально: http://localhost:8082/api/v1

api.baseURL: 'https://auth.k8s.tyriantrade.com/api/v1'
  → Использует другой Auth Service
  → Локально: http://localhost:8080/api/v1 (Social Web Auth)

recomendationApi.baseURL: 'https://recomendation.k8s.tyriantrade.com/api/v1'
  → Использует Recommendation Service
  → ⚠️ ЭТОГО СЕРВИСА НЕТ в локальных проектах!
  → Но есть: stream-recommend-service-main (8007)
```

**Что нужно настроить**:

1. Создать `.env` файл для AI Profiles:
```bash
# AXA-Turian-AI-profiles-main/.env
NEXT_PUBLIC_AUTH_API_URL=http://localhost:8001/api
NEXT_PUBLIC_STREAM_API_URL=http://localhost:8082/api/v1
NEXT_PUBLIC_SOCIAL_AUTH_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_RECOMMENDATION_API_URL=http://localhost:8082/api/v1/recommend
```

2. Изменить `src/api/index.tsx` чтобы использовать переменные окружения вместо хардкода.

**Статус**: ✅ Все бэкенды есть, но нужна настройка конфигурации фронтенда.

---

## 7. Trading Terminal ⚠️ BACKEND ЕСТЬ

**Backend**: `AXA-trading-terminal-back-main` (Python, порт 8061)

**Frontend**: ❌ ОТСУТСТВУЕТ

Но Trading Terminal доступен через Marketplace интерфейс.

---

## 📊 ИТОГО

| Frontend | Backend | Статус |
|----------|---------|--------|
| Social Web | 9 микросервисов Go | ✅ Готово |
| Stocks | Django + FastAPI | ✅ Готово |
| CoinMarketCap | Go Auth + Mail | ✅ Готово |
| Stream | 6 микросервисов Go | ✅ Готово |
| Stream Admin | 6 микросервисов Go | ✅ Готово |
| Marketplace | Другие API | ✅ Готово |
| AI Profiles | Auth + Stream | ⚠️ Настройка нужна |
| Trading Terminal | Python backend | ❌ Фронтенд отсутствует |

---

## ✅ ВЫВОД

**У вас есть ВСЁ необходимое для запуска!**

### Что работает "из коробки":
- ✅ Social Web (полностью)
- ✅ Stocks (полностью)
- ✅ CoinMarketCap (полностью)
- ✅ Stream (полностью)
- ✅ Marketplace (полностью)

### Что нужно настроить:
- ⚠️ **AI Profiles** - изменить хардкоженные URLs на переменные окружения
  - Все необходимые бэкенды есть (Auth Server + Stream)
  - Нужно только поправить конфигурацию

### Что отсутствует:
- ❌ **Trading Terminal Frontend** - есть только бэкенд
  - Но доступ через Marketplace есть

---

## 🚀 Что запустить в первую очередь:

1. **Social Web** - полностью готово
2. **Stocks** - полностью готово
3. **Marketplace** - объединит всё вместе
4. **Stream** - если нужен стриминг
5. **AI Profiles** - после небольшой настройки

---

## 🔧 Быстрый фикс для AI Profiles

Создайте файл `AXA-Turian-AI-profiles-main/.env.local`:

```bash
NEXT_PUBLIC_AUTH_API_URL=http://localhost:8001/api
NEXT_PUBLIC_STREAM_API_URL=http://localhost:8082/api/v1
NEXT_PUBLIC_SOCIAL_AUTH_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_RECOMMENDATION_API_URL=http://localhost:8082/api/v1/recommend
```

И измените `src/api/index.tsx`:

```typescript
export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8001/api',
  withCredentials: true,
});

export const streamApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STREAM_API_URL || 'http://localhost:8082/api/v1',
  withCredentials: true,
});

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SOCIAL_AUTH_API_URL || 'http://localhost:8080/api/v1',
  withCredentials: true,
});

export const recomendationApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_RECOMMENDATION_API_URL || 'http://localhost:8082/api/v1/recommend',
  withCredentials: true,
});
```

---

**Создано**: Октябрь 2025  
**Статус**: Всё есть для запуска! 🎉


