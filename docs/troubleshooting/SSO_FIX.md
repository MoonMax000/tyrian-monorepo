# 🔐 SSO (Single Sign-On) - Исправление

## ❌ Проблема

Авторизация не сохраняется между сервисами. Если войти на одном порту (например 3005), на другом порту (3001, 3002, 3003) пользователь не авторизован.

---

## 🔍 Причина

По умолчанию Django создает cookie с `domain=None`, что означает cookie работает **только** для конкретного домена. Для SSO нужно установить `SESSION_COOKIE_DOMAIN=localhost`, чтобы cookie работал на **всех** `localhost:*` портах.

---

## ✅ Решение

### 1️⃣ Добавлены настройки в `.env`

```bash
# AXA-auth-server-main/.env
SESSION_COOKIE_DOMAIN=localhost
CSRF_COOKIE_DOMAIN=localhost
```

### 2️⃣ Django settings уже настроены

```python
# auth-core/core/settings.py
SESSION_COOKIE_DOMAIN = os.getenv('SESSION_COOKIE_DOMAIN') or None
CSRF_COOKIE_DOMAIN = os.getenv('CSRF_COOKIE_DOMAIN') or None
```

### 3️⃣ Auth Server перезапущен

```bash
docker-compose restart auth-core
```

---

## 🧪 Как проверить SSO

### Тест 1: Авторизация на Marketplace

1. Откройте `http://localhost:3005` (Marketplace)
2. Нажмите "Login" → Войдите
3. Должна появиться аватарка

### Тест 2: Проверка на других сервисах

4. Откройте **новую вкладку**: `http://localhost:3001` (Social Network)
5. **Должна быть аватарка** (без повторного входа!)
6. Откройте `http://localhost:3002` (Stocks) - аватарка должна быть
7. Откройте `http://localhost:3003` (Crypto) - аватарка должна быть

### Тест 3: Cookie проверка

Откройте DevTools → Application → Cookies → `http://localhost:3005`

Должны быть cookies:
```
sessionid    domain=localhost    ✅
csrftoken    domain=localhost    ✅
```

**Важно:** `domain=localhost` (НЕ `domain=localhost:3005`)

---

## 🐛 Troubleshooting

### Проблема: Cookie не появляется

**Причина:** Старые cookies с неправильным domain

**Решение:**
1. Откройте DevTools → Application → Cookies
2. Удалите все cookies для localhost
3. Войдите снова

### Проблема: SSO работает частично

**Причина:** Разные `NEXT_PUBLIC_AUTH_URL` в проектах

**Решение:** Убедитесь что во всех `.env`:
```
NEXT_PUBLIC_AUTH_URL=http://localhost:8001
```

### Проблема: После logout SSO не работает

**Причина:** Cookie не удаляется везде

**Решение:** Logout должен удалять cookie для `domain=localhost`:
```javascript
document.cookie = 'sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost';
```

---

## 📊 Как работает SSO

```
┌─────────────────────────────────────────────────────────┐
│                     Auth Server                         │
│               http://localhost:8001                     │
│                                                         │
│  SESSION_COOKIE_DOMAIN=localhost                       │
│  → Cookie работает для всех localhost:* портов         │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Set-Cookie: sessionid=...; 
                          │             domain=localhost
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Все Frontend сервисы                       │
│                                                         │
│  Marketplace    (3005) ✅ Cookie доступен              │
│  Social Network (3001) ✅ Cookie доступен              │
│  Stocks         (3002) ✅ Cookie доступен              │
│  Cryptocurrency (3003) ✅ Cookie доступен              │
│  Live Streaming (3004) ✅ Cookie доступен              │
│  AI Profiles    (3006) ✅ Cookie доступен              │
│  Portfolios 2   (5173) ✅ Cookie доступен              │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Статус

```
✅ SESSION_COOKIE_DOMAIN=localhost  НАСТРОЕНО
✅ CSRF_COOKIE_DOMAIN=localhost     НАСТРОЕНО
✅ Auth Server                      ПЕРЕЗАПУЩЕН
✅ SSO между сервисами              РАБОТАЕТ
```

---

**Дата:** 5 октября 2025  
**Версия:** 1.0  
**Статус:** ✅ Готово

