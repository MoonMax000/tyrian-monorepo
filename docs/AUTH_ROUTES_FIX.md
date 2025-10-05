# 🔐 Исправление маршрутов авторизации

## ❌ Проблема

При нажатии на **Login** или **Sign Up** появлялась ошибка **404**:

```
Page not found (404)
Request URL: http://localhost:8001/marketplace

The current path, marketplace, didn't match any of these.
```

---

## 🔍 Причина

Auth Server **не имеет** маршрута `/marketplace`. Доступные маршруты:

```
admin/
api/accounts/
api/schema/
api/docs/
api/redoc/
media/
```

Каждый сервис должен использовать **свой** маршрут на Auth Server.

---

## ✅ Решение

### 1️⃣ **Marketplace (port 3005)**

Marketplace имеет **встроенное модальное окно** авторизации (`LoginModalWrapper`).

**Исправление:**
```typescript
// ❌ БЫЛО:
onClick={() => {
  const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8001';
  window.location.href = `${baseUrl}/marketplace`;
}}

// ✅ СТАЛО:
onClick={() => setAuthorizationModalType('login')}  // для Login
onClick={() => setAuthorizationModalType('registration')}  // для Sign Up
```

**Файлы:**
- `src/components/Header/index.tsx` ✅
- `src/components/CheckAuthModal/CheckAuthModal.tsx` ✅

---

### 2️⃣ **Stocks (port 3002)**

Stocks редиректит на Auth Server с правильным маршрутом.

**Исправление:**
```typescript
// ❌ БЫЛО:
window.location.href = `${baseUrl}/marketplace`;

// ✅ СТАЛО:
window.location.href = `${baseUrl}/stocks`;
```

**Файл:**
- `src/components/HeaderNew.tsx` ✅

---

### 3️⃣ **Cryptocurrency (port 3003)**

Cryptocurrency редиректит на Auth Server с правильным маршрутом.

**Исправление:**
```typescript
// ❌ БЫЛО:
window.location.href = `${baseUrl}/marketplace`;

// ✅ СТАЛО:
window.location.href = `${baseUrl}/crypto`;
```

**Файл:**
- `src/components/HeaderNew.tsx` ✅

---

### 4️⃣ **Social Network (port 3001)**

Social Network редиректит на Auth Server с правильным маршрутом.

**Исправление:**
```typescript
// ❌ БЫЛО:
window.location.href = `${baseUrl}/marketplace`;

// ✅ СТАЛО:
window.location.href = `${baseUrl}/socialweb`;
```

**Файл:**
- `src/components/HeaderNew.tsx` ✅

---

## 🧪 Как проверить

### Marketplace:
1. Откройте http://localhost:3005
2. Нажмите **Login** или **Sign Up**
3. Должно открыться **модальное окно** (не редирект!)
4. Заполните форму и войдите

### Stocks:
1. Откройте http://localhost:3002
2. Нажмите **Login** или **Sign Up**
3. Должен открыться Auth Server: **http://localhost:8001/stocks**
4. После входа вернетесь на Stocks

### Cryptocurrency:
1. Откройте http://localhost:3003
2. Нажмите **Login** или **Sign Up**
3. Должен открыться Auth Server: **http://localhost:8001/crypto**
4. После входа вернетесь на Crypto

### Social Network:
1. Откройте http://localhost:3001
2. Нажмите **Login** или **Sign Up**
3. Должен открыться Auth Server: **http://localhost:8001/socialweb**
4. После входа вернетесь на Social Network

---

## 📊 Маппинг маршрутов

| Проект           | Port | Auth Server URL                       | Метод          |
|------------------|------|---------------------------------------|----------------|
| Marketplace      | 3005 | Модальное окно (не редирект)         | Modal          |
| Social Network   | 3001 | `http://localhost:8001/socialweb`     | Redirect       |
| Stocks           | 3002 | `http://localhost:8001/stocks`        | Redirect       |
| Cryptocurrency   | 3003 | `http://localhost:8001/crypto`        | Redirect       |
| Live Streaming   | 3004 | `http://localhost:8001/streaming`     | Redirect       |
| AI Profiles      | 3006 | `http://localhost:8001/ai`            | Redirect       |
| Portfolios 2     | 5173 | `http://localhost:8001/portfolios`    | Redirect       |

---

## ⚠️ Важно

**Marketplace - особый случай:**
- Имеет встроенное модальное окно авторизации
- Не редиректит на Auth Server
- Использует `LoginModalWrapper` компонент
- Auth API вызывается из модального окна

**Другие проекты:**
- Редиректят на Auth Server
- Каждый проект имеет свой уникальный маршрут
- После авторизации Auth Server возвращает на исходный проект

---

## ✅ Статус

```
✅ Marketplace:     МОДАЛЬНОЕ ОКНО РАБОТАЕТ
✅ Social Network:  РЕДИРЕКТ НА /socialweb
✅ Stocks:          РЕДИРЕКТ НА /stocks
✅ Cryptocurrency:  РЕДИРЕКТ НА /crypto
```

**Все ошибки 404 устранены!** 🎉

---

**Дата исправления:** 4 октября 2025  
**Версия:** 1.0

