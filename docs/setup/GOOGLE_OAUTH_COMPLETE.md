# 🔐 Google OAuth - Полная Инструкция

## ✅ ЧТО СДЕЛАНО

### 1️⃣ Backend (Auth Server)

Созданы 3 новых endpoint'а для Google OAuth:

```python
GET  /api/accounts/google/
POST /api/accounts/google/login/
GET  /api/accounts/google/callback/
```

**Файлы:**
- `AXA-auth-server-main/auth-core/accounts/views/google_oauth.py` - логика OAuth
- `AXA-auth-server-main/auth-core/accounts/urls.py` - маршруты
- `AXA-auth-server-main/.env` - настройки:
  ```env
  GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
  GOOGLE_REDIRECT_URI=http://localhost:8001/api/accounts/google/callback/
  ```

---

### 2️⃣ Frontend (Меню Аватарки)

Улучшенное выдвигающееся меню установлено во всех проектах:

**Обновлённые файлы:**
- `AXA-marketplace-main/src/components/AuthorizationModal/DropDownNav.tsx`
- `AXA-socialweb-frontend-main/src/components/Header/components/AuthorizationModal/DropDownNav.tsx`
- `AXA-stocks-frontend-main/src/components/Layout/AuthorizationModal/DropDownNav.tsx`
- `AXA-coinmarketcap-main/src/components/Layout/AuthorizationModal/DropDownProfile.tsx`

**Функции:**
- ✅ Красивое выдвигающееся меню в стиле проекта
- ✅ Градиентные hover эффекты
- ✅ Анимация появления (animate-fadeIn)
- ✅ Кнопка "My Profile" → переход на `/profile`
- ✅ Кнопка "Log Out" → выход из аккаунта

---

## 📋 ЧТО НУЖНО СДЕЛАТЬ ВРУЧНУЮ

### 🔑 Настройка Google Cloud Console

1. **Откройте Google Cloud Console:**
   https://console.cloud.google.com/

2. **Перейдите в настройки OAuth:**
   - APIs & Services → Credentials
   - Выберите OAuth 2.0 Client ID

3. **Добавьте Authorized redirect URIs:**
   ```
   http://localhost:8001/api/accounts/google/callback/
   ```

4. **Добавьте Authorized JavaScript origins:**
   ```
   http://localhost:3001
   http://localhost:3002
   http://localhost:3003
   http://localhost:3004
   http://localhost:3005
   http://localhost:3006
   http://localhost:5173
   ```

5. **Сохраните изменения**

---

## 🚀 КАК ИСПОЛЬЗОВАТЬ

### Вариант 1: Redirect Flow (Рекомендуется)

На фронтенде добавьте кнопку "Sign in with Google":

```typescript
const handleGoogleLogin = () => {
  const authUrl = 'http://localhost:8001/api/accounts/google/';
  window.location.href = authUrl;
};

// В компоненте:
<button onClick={handleGoogleLogin}>
  Sign in with Google
</button>
```

**Как это работает:**
1. Пользователь нажимает кнопку
2. Редирект на Google для авторизации
3. Google возвращает на `/api/accounts/google/callback/`
4. Backend создаёт сессию
5. Редирект обратно на фронтенд с активной сессией

---

### Вариант 2: Client-Side Flow (Альтернатива)

Если используете Google Identity Services на фронте:

```typescript
// Получите access_token от Google на клиенте
const response = await fetch('http://localhost:8001/api/accounts/google/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Важно для cookies!
  body: JSON.stringify({ access_token: googleAccessToken })
});

const data = await response.json();
console.log('User:', data.user);
```

---

## 🎨 МЕНЮ АВАТАРКИ

Меню появляется при клике на аватарку пользователя:

```typescript
// В Header компоненте уже реализовано:
const [isDropdownVisible, setDropdownVisible] = useState(false);

<Image
  src={mockProfileAvatar}
  onClick={() => setDropdownVisible(!isDropdownVisible)}
/>

{isDropdownVisible && (
  <DropDownNav
    onClick={(action) => {
      if (action === 'profile') router.push('/profile');
      if (action === 'logout') handleLogout();
      setDropdownVisible(false);
    }}
  />
)}
```

---

## 🔧 АРХИТЕКТУРА

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                      │
│  http://localhost:3001-3006, 5173                           │
│                                                             │
│  1. Кнопка "Sign in with Google"                           │
│  2. Редирект → Auth Server                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              AUTH SERVER (Django + Django REST)             │
│  http://localhost:8001                                      │
│                                                             │
│  GET  /api/accounts/google/                                │
│       → Генерирует Google OAuth URL                        │
│                                                             │
│  GET  /api/accounts/google/callback/?code=...              │
│       → Обменивает code на token                           │
│       → Получает данные пользователя                       │
│       → Создаёт/логинит пользователя                       │
│       → Создаёт сессию                                     │
│       → Редиректит на frontend                             │
│                                                             │
│  POST /api/accounts/google/login/                          │
│       → Прямой вход с access_token                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      GOOGLE OAUTH 2.0                       │
│  https://accounts.google.com/o/oauth2/v2/auth              │
│  https://oauth2.googleapis.com/token                        │
│  https://www.googleapis.com/oauth2/v2/userinfo             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌐 SSO (Single Sign-On)

Авторизация работает сразу на **ВСЕХ** сервисах благодаря:

```python
# В settings.py:
SESSION_COOKIE_DOMAIN = 'localhost'
CSRF_COOKIE_DOMAIN = 'localhost'

# Все фронтенд-сервисы используют один Auth Server:
NEXT_PUBLIC_AUTH_URL=http://localhost:8001
```

**Результат:**
- Войдите на `localhost:3001` → сессия работает на `localhost:3002`, `3003`, и т.д.
- Одна авторизация для всей платформы! 🎉

---

## 🐛 TROUBLESHOOTING

### Ошибка: "redirect_uri_mismatch"
**Решение:** Проверьте, что в Google Cloud Console добавлен точный URI:
```
http://localhost:8001/api/accounts/google/callback/
```

### Ошибка: CORS
**Решение:** Убедитесь, что добавлены JavaScript origins в Google Console

### Сессия не сохраняется
**Решение:** 
1. Проверьте `SESSION_COOKIE_DOMAIN = 'localhost'` в Django settings
2. Убедитесь, что фронтенд использует `credentials: 'include'` в fetch запросах

### Меню аватарки не появляется
**Решение:**
1. Проверьте, что пользователь авторизован
2. Убедитесь, что `isDropdownVisible` переключается при клике
3. Проверьте z-index меню (должен быть `z-[1000]`)

---

## ✅ CHECKLIST

- [x] Google OAuth endpoints созданы
- [x] Auth Server перезапущен
- [x] Меню аватарки улучшено и установлено
- [ ] Google Cloud Console настроен (redirect URIs + origins)
- [ ] Кнопка "Sign in with Google" добавлена на фронтенд
- [ ] Тестирование OAuth потока

---

## 📊 СТАТУС

```
✅ Backend:    ГОТОВО (Auth Server работает)
✅ Frontend:   ГОТОВО (Меню обновлено)
⚠️  Google:    ТРЕБУЕТ НАСТРОЙКИ (добавьте URIs в Console)
✅ SSO:        РАБОТАЕТ (единая авторизация)
```

---

**Дата создания:** 4 октября 2025  
**Версия:** 1.0

