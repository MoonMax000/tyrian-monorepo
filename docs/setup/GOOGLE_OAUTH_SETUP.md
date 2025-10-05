# 🔐 НАСТРОЙКА GOOGLE OAUTH

## ✅ ВАШ ДАННЫЕ:
```
Client ID: YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
Client Secret: YOUR_GOOGLE_CLIENT_SECRET
```

---

## 📋 ЧТО НУЖНО СДЕЛАТЬ В GOOGLE CONSOLE:

### 1. Добавить Authorized redirect URIs
Перейдите в: https://console.cloud.google.com/apis/credentials

Добавьте эти URI в **"Authorized redirect URIs"**:
```
http://localhost:8001/api/accounts/google/callback/
http://localhost:3005/auth/callback
http://localhost:3001/auth/callback
http://localhost:3002/auth/callback
http://localhost:3003/auth/callback
http://localhost:3004/auth/callback
http://localhost:3006/auth/callback
http://localhost:5173/auth/callback
```

### 2. Authorized JavaScript origins
Добавьте:
```
http://localhost:8001
http://localhost:3001
http://localhost:3002
http://localhost:3003
http://localhost:3004
http://localhost:3005
http://localhost:3006
http://localhost:5173
```

---

## 🔧 УЖЕ НАСТРОЕНО:

### Auth Server (.env)
✅ GOOGLE_CLIENT_ID
✅ GOOGLE_CLIENT_SECRET  
✅ GOOGLE_REDIRECT_URI
✅ CORS для всех фронтендов
✅ SESSION_COOKIE_DOMAIN=localhost (единые сессии)

### Единая авторизация между сервисами
✅ Все фронтенды используют один Auth Server (localhost:8001)
✅ Cookie сессии работают на всех localhost портах
✅ CORS настроен для cross-origin запросов

---

## ⚠️ ЧТО ОСТАЛОСЬ:

### Нужно добавить Google OAuth endpoint в Django

Есть 2 варианта:

#### Вариант 1: Использовать django-allauth (РЕКОМЕНДУЕТСЯ)
```bash
pip install django-allauth
```

#### Вариант 2: Создать кастомный endpoint (простой)
Я могу создать простой Google OAuth view для вашего Auth Server.

**Какой вариант предпочитаете?**

---

## 🎯 КАК РАБОТАЕТ ЕДИНАЯ АВТОРИЗАЦИЯ:

1. **Пользователь логинится на любом сервисе** (например, Marketplace)
2. **Запрос идёт на Auth Server** (localhost:8001)
3. **Auth Server создаёт сессию** с cookie domain=localhost
4. **Cookie доступна на всех localhost портах**
5. **Пользователь авторизован везде!** ✅

---

## 📊 ТЕКУЩИЙ СТАТУС:

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| Auth Server | ✅ Работает | http://localhost:8001 |
| Google Client ID | ✅ Настроен | В .env |
| CORS | ✅ Настроен | Все фронтенды |
| Session Cookie | ✅ Настроен | domain=localhost |
| Google OAuth Endpoint | ⏳ Нужно создать | См. выше |
| Google Console Redirects | ⏳ Нужно добавить | См. инструкцию |

---

## 🚀 СЛЕДУЮЩИЕ ШАГИ:

1. **Добавить redirect URIs в Google Console** (5 минут)
2. **Выбрать вариант Google OAuth** (allauth или кастомный)
3. **Протестировать авторизацию**

