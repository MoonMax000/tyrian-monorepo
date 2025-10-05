# 🔐 Настройка Google OAuth - Простая инструкция

**Время:** 5 минут  
**Цель:** Заставить авторизацию работать  

---

## 🎯 Шаг 1: Открыть Google Console

Открой эту ссылку:
```
https://console.cloud.google.com/apis/credentials
```

**Что увидишь:**
- Список OAuth 2.0 Client IDs
- Найди: `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`
- Нажми на него (карандаш или имя)

---

## 🎯 Шаг 2: Добавить Redirect URIs

Найди раздел **"Authorized redirect URIs"**

Нажми **"+ ADD URI"** и добавь по одному:

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

**Итого:** 8 URIs

---

## 🎯 Шаг 3: Добавить JavaScript Origins

Найди раздел **"Authorized JavaScript origins"**

Нажми **"+ ADD URI"** и добавь:

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

**Итого:** 8 origins

---

## 🎯 Шаг 4: Сохранить

Нажми **"SAVE"** внизу страницы

⏰ **Подожди 1-2 минуты** пока изменения применятся

---

## 🧪 Шаг 5: Тестировать!

### 1. Открой AI Assistant
```
http://localhost:4201
```

### 2. Нажми "Login" в header

**Что должно произойти:**
- ✅ Редирект на Google OAuth
- ✅ Выбор аккаунта
- ✅ Разрешение доступа
- ✅ Редирект обратно на localhost:4201
- ✅ Ты залогинен!

### 3. Проверь профиль
```
http://localhost:4201/profile
```

**Что должно показать:**
- ✅ Твой email
- ✅ Username
- ✅ Имя и фамилия (если есть)
- ✅ User ID
- ✅ Дата регистрации
- ✅ Зеленая галочка "Authentication Status"

---

## 🎉 Проверка SSO (Single Sign-On)

### Без повторного логина открой:

1. **Marketplace**
   ```
   http://localhost:4205/profile
   ```
   ✅ Ты уже залогинен!

2. **Social Network**
   ```
   http://localhost:4204/profile
   ```
   ✅ Ты уже залогинен!

3. **Cryptocurrency**
   ```
   http://localhost:4203/profile
   ```
   ✅ Ты уже залогинен!

**Везде одинаковые данные!** 🎊

---

## 🐛 Troubleshooting

### Ошибка: "redirect_uri_mismatch"
**Решение:** Проверь что все URIs добавлены правильно (без опечаток)

### Ошибка: "401 Unauthorized" на /profile
**Решение:** Сначала авторизуйся через Login

### Ошибка: "Connection refused"
**Решение:** Проверь что auth-service запущен:
```bash
curl http://localhost:8001/api/accounts/google/
```

### Ошибка: Данные не отображаются
**Решение:** 
1. Открой консоль браузера (F12)
2. Посмотри на ошибки
3. Проверь что cookies включены

---

## 📊 Скриншот Google Console

Должно выглядеть так:

```
OAuth 2.0 Client ID
───────────────────────────────────────────────

Client ID: YOUR_GOOGLE_CLIENT_ID...
Client Secret: GOCSPX-...

Authorized JavaScript origins
  • http://localhost:5173
  • http://localhost:4201
  • http://localhost:4202
  • ... (всего 8)

Authorized redirect URIs
  • http://localhost:8001/api/accounts/google/callback/
  • http://localhost:5173/?login=success
  • http://localhost:4201/?login=success
  • ... (всего 8)

[SAVE]  [CANCEL]
```

---

## ✅ Checklist

- [ ] Открыл Google Console
- [ ] Нашел Client ID
- [ ] Добавил 8 Redirect URIs
- [ ] Добавил 8 JavaScript Origins
- [ ] Нажал SAVE
- [ ] Подождал 1-2 минуты
- [ ] Открыл localhost:4201
- [ ] Нажал Login
- [ ] Вошел через Google
- [ ] Увидел профиль на /profile
- [ ] Проверил другие фронтенды (SSO работает!)

---

## 🎉 Готово!

Теперь у тебя:
- ✅ Работающий Google OAuth
- ✅ Единый профиль на всех фронтендах
- ✅ SSO (один логин для всех)
- ✅ Данные синхронизированы

**Время настройки:** 5 минут  
**Результат:** PRICELESS! 💎

---

**Создано:** October 5, 2025  
**Статус:** ✅ ГОТОВО К ИСПОЛЬЗОВАНИЮ

