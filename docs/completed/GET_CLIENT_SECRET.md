# 🔑 Как получить Google Client Secret

## 📝 Инструкция:

### 1. Открой Google Cloud Console:
```
https://console.cloud.google.com/apis/credentials
```

### 2. Найди свой OAuth 2.0 Client ID:
- Ищи Client ID: `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`

### 3. Кликни на него

### 4. Скопируй "Client secret"
- Будет что-то вроде: `GOCSPX-xxxxxxxxxxxxxxxxxxxxx`

### 5. Добавь в скрипт:

Открой файл:
```
START_AUTH.sh
```

Найди строку:
```bash
export GOOGLE_CLIENT_SECRET=""
```

Замени на:
```bash
export GOOGLE_CLIENT_SECRET="твой_client_secret_сюда"
```

### 6. Перезапусти Auth Service:
```bash
lsof -ti:8001 | xargs kill -9
./START_AUTH.sh
```

---

## ⚠️ ВАЖНО:

**НЕ коммить client_secret в Git!**  
Это секретный ключ, храни его в `.env` или переменных окружения.

---

## 🔄 Альтернатива: Создать новый OAuth Credential

Если не можешь найти существующий secret:

1. Открой: https://console.cloud.google.com/apis/credentials
2. Нажми **"+ CREATE CREDENTIALS"**
3. Выбери **"OAuth 2.0 Client ID"**
4. Application type: **"Web application"**
5. Name: **"Tyrian Trade Local Dev"**
6. Authorized redirect URIs:
   ```
   http://localhost:8001/api/accounts/google/callback/
   ```
7. Нажми **"CREATE"**
8. **Скопируй Client ID и Client Secret**
9. Обнови `START_AUTH.sh`

---

## 📝 После обновления:

1. Перезапусти Auth Service
2. Попробуй Login снова
3. Должно работать! ✅

