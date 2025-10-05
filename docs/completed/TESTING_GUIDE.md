# 🧪 Руководство по тестированию платформы

**Дата:** October 5, 2025  
**Статус:** Все сервисы запущены из monorepo  

---

## ✅ Что исправлено

### 1. Проблема с портами
**Было**: Запущены старые версии на портах 3001, 3003, 3005  
**Стало**: Все работает из monorepo на правильных портах  

```
❌ СТАРЫЕ ПОРТЫ (больше не используются):
   localhost:3001 - Marketplace (старая версия с ошибками)
   localhost:3003 - Social Network (старая версия)
   localhost:3005 - Stocks (старая версия)

✅ НОВЫЕ ПОРТЫ (monorepo):
   localhost:5173 - Portfolios
   localhost:4201 - AI Assistant
   localhost:4202 - Live Streaming
   localhost:4203 - Cryptocurrency
   localhost:4204 - Social Network
   localhost:4205 - Marketplace
   localhost:4206 - Stocks
```

### 2. OAuth авторизация
**Было**: Редирект на API страницу  
**Стало**: Правильный OAuth flow с Google  

### 3. Профиль пользователя
**Добавлено**: Страница `/profile` на всех фронтендах  

---

## 🧪 Как тестировать

### Тест 1: Проверка всех фронтендов ⏱️ 2 минуты

**Подождите 60-90 секунд после запуска**, затем откройте:

```bash
# 1. Portfolios (Vite - самый быстрый)
open http://localhost:5173

# 2. AI Assistant (Next.js)
open http://localhost:4201

# 3. Live Streaming
open http://localhost:4202

# 4. Cryptocurrency
open http://localhost:4203

# 5. Social Network
open http://localhost:4204

# 6. Marketplace
open http://localhost:4205

# 7. Stocks
open http://localhost:4206
```

**Что проверить:**
- ✅ Страница загружается (нет 404 или 500)
- ✅ Нет ошибок в консоли браузера
- ✅ Header и Footer отображаются
- ✅ Навигация работает

---

### Тест 2: Google OAuth авторизация ⏱️ 5 минут

#### Шаг 1: Обновить Google Console (одноразово)
1. Открыть: https://console.cloud.google.com/apis/credentials
2. Найти Client ID: `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`
3. Добавить **Authorized redirect URIs**:
   ```
   http://localhost:8001/api/accounts/google/callback/
   http://localhost:5173/?login=success
   http://localhost:4201/?login=success
   http://localhost:4202/?login=success
   http://localhost:4203/?login=success
   http://localhost:4204/?login=success
   http://localhost:4205/?login=success
   http://localhost:4206/?login=success
   ```
4. Добавить **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   http://localhost:4201
   http://localhost:4202
   http://localhost:4203
   http://localhost:4204
   http://localhost:4205
   http://localhost:4206
   http://localhost:8001
   ```
5. Сохранить и подождать 1-2 минуты

#### Шаг 2: Тестировать авторизацию
1. Открыть любой фронтенд (например http://localhost:4201)
2. Нажать на кнопку "Login" в header
3. **Ожидается**: Редирект на Google OAuth
4. Войти с Google аккаунтом
5. **Ожидается**: Редирект обратно на фронтенд с успешным логином

---

### Тест 3: Профиль пользователя ⏱️ 2 минуты

После успешной авторизации:

```bash
# AI Assistant
open http://localhost:4201/profile

# Marketplace
open http://localhost:4205/profile
```

**Что должно отображаться:**
- ✅ Фото профиля (или инициалы)
- ✅ Имя и фамилия
- ✅ Email
- ✅ Username
- ✅ User ID
- ✅ Дата регистрации
- ✅ Статус аккаунта (Active)
- ✅ Debug информация (JSON с данными пользователя)

**Кнопки:**
- 🔄 Refresh Profile - обновить данные
- 🚪 Logout - выйти из аккаунта

---

### Тест 4: Единая авторизация (SSO) ⏱️ 3 минуты

**Цель**: Проверить что авторизация работает на всех продуктах

#### Сценарий:
1. Открыть AI Assistant: http://localhost:4201
2. Авторизоваться через Google
3. Проверить профиль: http://localhost:4201/profile ✅
4. **Без повторного логина** открыть Marketplace: http://localhost:4205
5. Проверить профиль: http://localhost:4205/profile ✅
6. **Без повторного логина** открыть Social Network: http://localhost:4204
7. Проверить что вы залогинены ✅

**Ожидается**: Авторизация сохраняется на всех продуктах (Single Sign-On работает)

---

### Тест 5: Навигация между продуктами ⏱️ 2 минуты

**Проблема (ранее)**: При переходе с одного порта на другой появлялась 404

**Решение**: Каждый продукт работает на своем порту и имеет свой роутинг

#### Правильная навигация:
```
Marketplace (localhost:4205):
  - /popular-tab       ✅
  - /scripts-tab       ✅
  - /strategies-tab    ✅
  - /profile           ✅

Social Network (localhost:4204):
  - /feed              ✅
  - /profile           ✅
  - /messages          ✅
```

**❌ НЕ работает**: Переход с localhost:4205/popular-tab на localhost:4204/scripts-tab (разные порты!)

**✅ Работает**: 
- Ссылки в Header для перехода между продуктами
- Навигация внутри одного продукта

---

### Тест 6: Backend API ⏱️ 1 минута

```bash
# Проверить auth-service
curl http://localhost:8001/api/accounts/google/

# Ожидается:
{
  "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "message": "Redirect user to this URL"
}

# Проверить профиль (нужна авторизация)
curl -b cookies.txt http://localhost:8001/api/accounts/profile/
```

---

## 📊 Checklist для полного тестирования

### Infrastructure ✅
- [ ] PostgreSQL работает (localhost:5432)
- [ ] Redis работает (localhost:6379)
- [ ] RabbitMQ работает (localhost:5672)
- [ ] Auth-service работает (localhost:8001)

### Frontends ✅
- [ ] Portfolios (5173) загружается
- [ ] AI Assistant (4201) загружается
- [ ] Live Streaming (4202) загружается
- [ ] Cryptocurrency (4203) загружается
- [ ] Social Network (4204) загружается
- [ ] Marketplace (4205) загружается
- [ ] Stocks (4206) загружается

### OAuth ✅
- [ ] Google Console настроен
- [ ] Login кнопка работает
- [ ] Редирект на Google работает
- [ ] Callback редирект работает
- [ ] SSO работает между продуктами

### User Profile ✅
- [ ] /profile страница доступна
- [ ] Отображаются данные пользователя
- [ ] Email корректный
- [ ] Username корректный
- [ ] Refresh работает
- [ ] Logout работает

---

## 🐛 Известные проблемы и решения

### Проблема 1: "500 Internal Server Error"
**Причина**: Старая версия приложения запущена  
**Решение**: Остановить старые процессы
```bash
pkill -f "npm run dev"
pkill -f "next dev"
```

### Проблема 2: "404 Not Found" при переходе между вкладками
**Причина**: Переход между разными портами  
**Решение**: Использовать навигацию внутри одного продукта или ссылки в Header

### Проблема 3: "Login redirects to API page"
**Причина**: Не настроен Google Console  
**Решение**: См. "Тест 2: Google OAuth авторизация"

### Проблема 4: "Profile shows 401 Unauthorized"
**Причина**: Не авторизован  
**Решение**: Сначала авторизоваться через Login

### Проблема 5: Приложение долго грузится
**Причина**: Первая сборка Next.js (2-5 минут)  
**Решение**: Подождать. После первой сборки будет быстро

---

## 📝 Логи для диагностики

```bash
# Посмотреть логи конкретного приложения
tail -f /Users/devidanderson/Downloads/Резерв\ ГитХаб/3\ октября\ axa\ времянка\ 2/tyrian-monorepo/logs/ai-assistant.log

# Все логи
ls -la /Users/devidanderson/Downloads/Резерв\ ГитХаб/3\ октября\ axa\ времянка\ 2/tyrian-monorepo/logs/
```

---

## 🎯 Ожидаемый результат

После всех тестов:
- ✅ Все 7 фронтендов работают
- ✅ Auth-service работает
- ✅ Google OAuth работает
- ✅ SSO работает между продуктами
- ✅ Профиль пользователя отображается
- ✅ Данные сохраняются в базе
- ✅ Навигация внутри продуктов работает

---

## 🚀 Полезные ссылки

### Frontends
- Portfolios: http://localhost:5173
- AI Assistant: http://localhost:4201 | http://localhost:4201/profile
- Live Streaming: http://localhost:4202
- Cryptocurrency: http://localhost:4203
- Social Network: http://localhost:4204
- Marketplace: http://localhost:4205 | http://localhost:4205/profile
- Stocks: http://localhost:4206

### Backend
- Auth Service: http://localhost:8001
- Auth API: http://localhost:8001/api/accounts/google/

### Infrastructure
- Adminer (PostgreSQL UI): http://localhost:8080
- Redis Commander: http://localhost:8081
- RabbitMQ Management: http://localhost:15672
- MinIO Console: http://localhost:9001

---

**Создано:** October 5, 2025  
**Обновлено:** После исправления всех проблем  
**Статус:** ✅ Готово к тестированию!

