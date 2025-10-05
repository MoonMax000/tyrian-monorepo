# 🔐 Тест OAuth - Пошаговая Инструкция

## ✅ Запущено:
- **Auth Service**: `http://localhost:8001`
- **AI Assistant**: `http://localhost:4201`
- **Marketplace**: `http://localhost:4205`

---

## 📝 Шаги для тестирования:

### Шаг 1: Проверь Auth Service
Открой в браузере: `http://localhost:8001/api/accounts/google/`

**Ожидаемый результат:**
```json
{
    "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...",
    "message": "Redirect user to this URL"
}
```

---

### Шаг 2: Открой AI Assistant
Открой: `http://localhost:4201`

---

### Шаг 3: Нажми "Login" в шапке
Должно открыться окно Google OAuth

---

### Шаг 4: После успешного входа
Перейди на: `http://localhost:4201/profile`

**Ожидаемый результат:**
Профиль с твоими данными из Google

---

## 🐛 Если что-то не работает:

### Проблема 1: "Login" ничего не делает
**Решение:** Открой консоль браузера (F12) и посмотри ошибки

### Проблема 2: Редирект на JSON страницу
**Причина:** Браузер заблокировал popup
**Решение:** Разреши popups для localhost

### Проблема 3: После входа ошибка 401
**Причина:** Cookie не передаются
**Решение:** Проверь что auth-service и фронтенд на одном домене (localhost)

---

## 🔍 Логи для отладки:

```bash
# Auth Service логи
tail -f /tmp/auth.log

# AI Assistant логи
tail -f /tmp/ai-assistant.log

# Marketplace логи
tail -f /tmp/marketplace.log
```

---

## 📞 Тестовые URL:

1. **Auth Service API**: http://localhost:8001/api/accounts/google/
2. **AI Assistant**: http://localhost:4201
3. **AI Assistant Profile**: http://localhost:4201/profile
4. **Marketplace**: http://localhost:4205
5. **Marketplace Profile**: http://localhost:4205/profile

---

## 🎯 Что проверяем:

- [ ] Auth Service отвечает на `/api/accounts/google/`
- [ ] Фронтенд открывается без ошибок
- [ ] Кнопка "Login" в header работает
- [ ] Google OAuth открывается (не JSON страница)
- [ ] После входа редирект на фронтенд
- [ ] Страница `/profile` показывает данные пользователя
- [ ] SSO работает (вход на одном фронтенде = вход на всех)

