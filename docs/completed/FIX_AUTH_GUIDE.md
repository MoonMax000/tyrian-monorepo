# 🔐 Исправление Google OAuth Авторизации

## 🔍 Проблема

При нажатии на кнопку "Login with Google" возникает ошибка, потому что:

1. **Auth-service не запущен** - сейчас работает только инфраструктура
2. **Google OAuth настроен на localhost:8001** - но фронтенды на других портах
3. **CORS не настроен** - фронтенды не могут делать запросы к auth-service

---

## ✅ Решение - 3 шага

### Шаг 1: Запустить Auth-Service (Django)

#### Вариант А: Из оригинальной папки
```bash
cd "/Users/devidanderson/Downloads/Резерв ГитХаб/3 октября axa времянка 2/AXA-auth-server-main/auth-core"

# Установить зависимости (если нужно)
pip install -r requirements.txt

# Применить миграции
python manage.py migrate

# Запустить сервер
python manage.py runserver 8001
```

#### Вариант Б: Из monorepo (будущее)
```bash
cd "/Users/devidanderson/Downloads/Резерв ГитХаб/3 октября axa времянка 2/tyrian-monorepo"

# Запустить через Nx
npx nx serve auth-service
```

---

### Шаг 2: Обновить настройки Google OAuth

Файл: `AXA-auth-server-main/auth-core/.env`

```env
# Google OAuth
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-ваш-секретный-ключ
GOOGLE_REDIRECT_URI=http://localhost:8001/api/accounts/google/callback/

# Frontend URLs (куда редиректить после успешного логина)
PORTFOLIOS_URL=http://localhost:5173
AI_ASSISTANT_URL=http://localhost:4201
LIVE_STREAMING_URL=http://localhost:4202
CRYPTOCURRENCY_URL=http://localhost:4203
SOCIAL_NETWORK_URL=http://localhost:4204
MARKETPLACE_URL=http://localhost:4205
STOCKS_URL=http://localhost:4206

# CORS - разрешить запросы от всех фронтендов
CORS_ALLOWED_ORIGINS=http://localhost:4201,http://localhost:4202,http://localhost:4203,http://localhost:4204,http://localhost:4205,http://localhost:4206,http://localhost:5173
```

---

### Шаг 3: Обновить Google Console

Нужно добавить все frontend URLs в Google OAuth settings:

1. Откройте: https://console.cloud.google.com/apis/credentials
2. Найдите ваш OAuth 2.0 Client ID: `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`
3. Добавьте **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   http://localhost:4201
   http://localhost:4202
   http://localhost:4203
   http://localhost:4204
   http://localhost:4205
   http://localhost:4206
   ```
4. Добавьте **Authorized redirect URIs**:
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

---

## 🔄 Альтернативное решение: Использовать Google OAuth напрямую из фронтенда

### Преимущества:
- ✅ Не нужен backend для инициации OAuth
- ✅ Быстрее и проще
- ✅ Работает сразу со всех фронтендов

### Как это работает:

#### 1. Установить библиотеку (уже установлено)
```bash
npm install @react-oauth/google
```

#### 2. Обновить код фронтенда

**ai-assistant/src/app/layout.tsx** (пример):
```tsx
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
```

**components/LoginButton.tsx**:
```tsx
import { GoogleLogin } from '@react-oauth/google';

export function LoginButton() {
  const handleSuccess = async (credentialResponse) => {
    // Отправить токен на backend для валидации
    const response = await fetch('http://localhost:8001/api/accounts/google/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credential: credentialResponse.credential
      })
    });
    
    const data = await response.json();
    console.log('Logged in:', data);
    // Сохранить токен, обновить UI
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log('Login Failed')}
    />
  );
}
```

---

## 📝 Текущий статус

### ✅ Что работает:
- Инфраструктура (PostgreSQL, Redis, RabbitMQ)
- Все 6 фронтендов запущены
- Google OAuth API endpoint доступен

### ❌ Что НЕ работает:
- Auth-service не запущен (нет Docker image в monorepo)
- Google OAuth redirect не настроен для всех портов
- CORS может блокировать запросы

---

## 🚀 Быстрое решение (5 минут)

### Шаг 1: Запустить auth-service
```bash
cd "/Users/devidanderson/Downloads/Резерв ГитХаб/3 октября axa времянка 2/AXA-auth-server-main"

# Запустить через Docker Compose
docker-compose up -d auth-core
```

### Шаг 2: Проверить что работает
```bash
curl http://localhost:8001/api/accounts/google/

# Должен вернуть:
{
  "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "message": "Redirect user to this URL"
}
```

### Шаг 3: Обновить фронтенд
В любом фронтенде (например AI Assistant):
```tsx
// В компоненте Login
const handleGoogleLogin = async () => {
  // Получить auth URL
  const response = await fetch('http://localhost:8001/api/accounts/google/');
  const data = await response.json();
  
  // Редирект на Google
  window.location.href = data.auth_url;
};
```

---

## 🎯 Долгосрочное решение

### 1. Мигрировать auth-service в monorepo
```bash
# Создать Dockerfile для auth-service
# Добавить в docker-compose.yml
# Настроить Nx targets
```

### 2. Использовать единую авторизацию
```bash
# Все фронтенды используют shared/api для auth
# Один auth-service на всех
# JWT tokens для авторизации
```

### 3. Production deployment
```bash
# Настроить домены: authservice.tyriantrade.com
# SSL сертификаты
# Production Google OAuth credentials
```

---

## 📚 Полезные ссылки

- **Google OAuth Docs**: https://developers.google.com/identity/protocols/oauth2
- **React OAuth Google**: https://github.com/MomenSherif/react-oauth
- **Django Social Auth**: https://python-social-auth.readthedocs.io/

---

## 🆘 Troubleshooting

### Ошибка: "redirect_uri_mismatch"
**Решение**: Добавить URL в Google Console → Authorized redirect URIs

### Ошибка: "CORS policy"
**Решение**: Добавить фронтенд URL в `CORS_ALLOWED_ORIGINS` в .env

### Ошибка: "Connection refused to localhost:8001"
**Решение**: Запустить auth-service

---

**Хочешь чтобы я автоматически исправил авторизацию?** 
Скажи какой подход предпочитаешь:
1. Запустить существующий auth-service
2. Использовать OAuth напрямую из фронтенда
3. Оба варианта

