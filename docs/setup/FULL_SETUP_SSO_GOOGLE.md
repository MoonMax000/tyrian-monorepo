# 🚀 Полная Настройка: SSO + Google OAuth + Доступ из Интернета

**Цель:** Настроить полноценную авторизацию с Google OAuth, SSO между всеми сервисами и доступ из интернета через ngrok.

---

## 📋 ЧТО МЫ ПОЛУЧИМ В ИТОГЕ:

✅ **Единый вход (SSO)** - авторизуйтесь один раз, работает на всех сервисах  
✅ **Google OAuth** - "Войти через Google"  
✅ **Локальные домены** - axa.local, social.axa.local и т.д.  
✅ **Доступ из интернета** - друг может протестировать через ngrok  
✅ **Cookie работают** между всеми сервисами  

---

## 🎯 Часть 1: Настройка Локальных Доменов (SSO)

### Шаг 1.1: Добавить домены в /etc/hosts

**Выполните в терминале:**

```bash
sudo bash -c 'cat >> /etc/hosts << EOF
# AXA Platform Local
127.0.0.1 axa.local
127.0.0.1 social.axa.local
127.0.0.1 stocks.axa.local
127.0.0.1 crypto.axa.local
127.0.0.1 ai.axa.local
EOF'
```

**Пароль:** Ваш пароль от Mac

**Проверка:**
```bash
ping axa.local
# Должно показать 127.0.0.1
```

### Шаг 1.2: Перезапустить Nginx

```bash
brew services restart nginx
```

**Проверка:**
```bash
curl -I http://axa.local:8090
# Должен вернуть 200 или 304
```

### Шаг 1.3: Обновить ProductsSidebar во всех фронтендах

Нужно изменить URL в Sidebar на новые домены с портами:

**Файлы для изменения:**
- `AXA-marketplace-main/src/components/ProductsSidebar/ProductsSidebar.tsx`
- `AXA-socialweb-frontend-main/src/components/ProductsSidebar/ProductsSidebar.tsx`
- `AXA-stocks-frontend-main/src/components/ProductsSidebar/ProductsSidebar.tsx`
- `AXA-coinmarketcap-main/src/components/ProductsSidebar/ProductsSidebar.tsx`
- `AXA-Turian-AI-profiles-main/src/components/ProductsSidebar/ProductsSidebar.tsx`

**Изменить URL на:**
```typescript
const products: Product[] = [
  {
    id: 'marketplace',
    name: 'Marketplace',
    url: 'http://axa.local:8090',  // было localhost:3005
    icon: '🏪',
    description: 'Торговая площадка',
    available: true,
  },
  {
    id: 'social',
    name: 'Social Network',
    url: 'http://social.axa.local:8091',  // было localhost:3001
    icon: '👥',
    description: 'Социальная сеть',
    available: true,
  },
  {
    id: 'stocks',
    name: 'Trader Diary',
    url: 'http://stocks.axa.local:8092',  // было localhost:3002
    icon: '📈',
    description: 'Дневник трейдера',
    available: true,
  },
  {
    id: 'crypto',
    name: 'CoinMarketCap',
    url: 'http://crypto.axa.local:8093',  // было localhost:3003
    icon: '💰',
    description: 'Крипто-платформа',
    available: true,
  },
  {
    id: 'ai',
    name: 'AI Assistant',
    url: 'http://ai.axa.local:8094',  // было localhost:3006
    icon: '🤖',
    description: 'AI помощник',
    available: true,
  },
  // ... остальные
];
```

### Шаг 1.4: Создать .env файлы для всех фронтендов

**Social Network:**
```bash
cat > AXA-socialweb-frontend-main/.env << 'EOF'
NEXT_PUBLIC_BACKEND_AUTH_API=http://axa.local:8090/api/accounts
NEXT_PUBLIC_AUTH_URL=http://axa.local:8090
EOF
```

**Stocks Frontend:**
```bash
cat > AXA-stocks-frontend-main/.env << 'EOF'
NEXT_PUBLIC_AUTH_SERVICE_URL=http://axa.local:8090
NEXT_PUBLIC_AUTH_API=http://axa.local:8090/api/accounts
EOF
```

**CoinMarketCap:**
```bash
cat > AXA-coinmarketcap-main/.env << 'EOF'
NEXT_PUBLIC_AUTH_SERVICE_URL=http://axa.local:8090
NEXT_PUBLIC_AUTH_API=http://axa.local:8090/api/accounts
EOF
```

**AI Profiles:**
```bash
cat > AXA-Turian-AI-profiles-main/.env << 'EOF'
NEXT_PUBLIC_AUTH_API_URL=http://axa.local:8090/api/accounts
NEXT_PUBLIC_AUTH_SERVICE_URL=http://axa.local:8090
EOF
```

**Marketplace (обновить существующий):**
```bash
cat > AXA-marketplace-main/.env << 'EOF'
NEXT_PUBLIC_AUTH_URL=http://axa.local:8090
NEXT_PUBLIC_AUTH_API=http://axa.local:8090/api/accounts
EOF
```

### Шаг 1.5: Обновить настройки Django для новых доменов

**Файл:** `AXA-auth-server-main/.env`

**Добавить/изменить:**
```env
ALLOWED_HOSTS=localhost,127.0.0.1,axa.local,social.axa.local,stocks.axa.local,crypto.axa.local,ai.axa.local

CSRF_TRUSTED_ORIGINS=http://axa.local:8090,http://social.axa.local:8091,http://stocks.axa.local:8092,http://crypto.axa.local:8093,http://ai.axa.local:8094

CORS_ALLOWED_ORIGINS=http://axa.local:8090,http://social.axa.local:8091,http://stocks.axa.local:8092,http://crypto.axa.local:8093,http://ai.axa.local:8094

# Для Cookie между доменами
SESSION_COOKIE_DOMAIN=.axa.local
CSRF_COOKIE_DOMAIN=.axa.local
SESSION_COOKIE_SAMESITE=Lax
CSRF_COOKIE_SAMESITE=Lax
```

### Шаг 1.6: Перезапустить Auth Server

```bash
cd AXA-auth-server-main
docker compose restart auth-core
```

### Шаг 1.7: Перезапустить все фронтенды

```bash
# Остановить все
pkill -f "next dev"

# Запустить заново
cd AXA-marketplace-main && PORT=3005 npm run dev > /tmp/marketplace.log 2>&1 &
cd AXA-socialweb-frontend-main && PORT=3001 npm run dev > /tmp/social.log 2>&1 &
cd AXA-stocks-frontend-main && PORT=3002 npm run dev > /tmp/stocks.log 2>&1 &
cd AXA-coinmarketcap-main && PORT=3003 npm run dev > /tmp/coinmarketcap.log 2>&1 &
cd AXA-Turian-AI-profiles-main && PORT=3006 npm run dev > /tmp/ai.log 2>&1 &
```

### Шаг 1.8: Протестировать SSO

1. Откройте `http://axa.local:8090`
2. Зарегистрируйтесь/войдите
3. Откройте `http://social.axa.local:8091`
4. **Вы должны быть уже авторизованы!** ✅

---

## 🔐 Часть 2: Настройка Google OAuth

### Шаг 2.1: Создать Google OAuth Приложение

1. Перейдите: https://console.cloud.google.com/
2. Создайте новый проект или выберите существующий
3. Перейдите в **APIs & Services** → **Credentials**
4. Нажмите **Create Credentials** → **OAuth client ID**
5. **Application type:** Web application
6. **Name:** AXA Platform Local
7. **Authorized JavaScript origins:**
   ```
   http://axa.local:8090
   http://social.axa.local:8091
   http://stocks.axa.local:8092
   http://crypto.axa.local:8093
   http://ai.axa.local:8094
   ```
8. **Authorized redirect URIs:**
   ```
   http://axa.local:8090/api/accounts/google/callback
   ```
9. Нажмите **Create**
10. **Скопируйте:**
    - Client ID
    - Client Secret

### Шаг 2.2: Установить django-allauth (если не установлен)

```bash
cd AXA-auth-server-main/auth-core
pip install django-allauth
```

Или добавьте в `requirements.txt`:
```
django-allauth==0.57.0
```

### Шаг 2.3: Обновить settings.py

**Файл:** `AXA-auth-server-main/auth-core/core/settings.py`

**Добавить в INSTALLED_APPS:**
```python
INSTALLED_APPS = [
    # ... существующие
    'django.contrib.sites',  # Обязательно!
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
]

# Site ID для django-allauth
SITE_ID = 1

# Настройки allauth
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        },
        'APP': {
            'client_id': os.getenv('GOOGLE_CLIENT_ID', ''),
            'secret': os.getenv('GOOGLE_CLIENT_SECRET', ''),
            'key': ''
        }
    }
}

# Redirect после логина
LOGIN_REDIRECT_URL = '/'
ACCOUNT_LOGOUT_REDIRECT_URL = '/'
```

### Шаг 2.4: Добавить Google credentials в .env

**Файл:** `AXA-auth-server-main/.env`

```env
GOOGLE_CLIENT_ID=ваш-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=ваш-секрет
```

### Шаг 2.5: Обновить urls.py

**Файл:** `AXA-auth-server-main/auth-core/core/urls.py`

```python
from django.urls import path, include

urlpatterns = [
    # ... существующие
    path('api/accounts/', include('accounts.urls')),
    path('api/accounts/google/', include('allauth.urls')),  # Добавить эту строку
]
```

### Шаг 2.6: Применить миграции

```bash
cd AXA-auth-server-main
docker compose exec auth-core python manage.py migrate
```

### Шаг 2.7: Добавить Google Provider в Django Admin

1. Откройте `http://localhost:8000/admin/`
2. Войдите как superuser
3. Перейдите в **Sites** → измените `example.com` на `axa.local:8090`
4. Перейдите в **Social applications** → Add social application
5. **Provider:** Google
6. **Name:** Google OAuth
7. **Client id:** Ваш Client ID
8. **Secret key:** Ваш Client Secret
9. **Sites:** Выберите `axa.local:8090`
10. Сохраните

### Шаг 2.8: Добавить кнопку "Войти через Google" во фронтенды

**Пример для Marketplace:**

```typescript
// AXA-marketplace-main/src/components/LoginModal.tsx
<button
  onClick={() => {
    window.location.href = 'http://axa.local:8090/api/accounts/google/login/';
  }}
  className="google-login-button"
>
  <GoogleIcon /> Войти через Google
</button>
```

---

## 🌐 Часть 3: Доступ из Интернета (ngrok)

### Шаг 3.1: Настроить ngrok для нескольких портов

**Вариант A: Один туннель для главного сервиса**

```bash
ngrok http 8090 --host-header=rewrite
```

Друг сможет открыть Marketplace через ngrok URL.

**Вариант B: Несколько туннелей (требует ngrok Pro)**

```bash
# Marketplace
ngrok http 8090 --subdomain axa-marketplace

# Social Network
ngrok http 8091 --subdomain axa-social

# Stocks
ngrok http 8092 --subdomain axa-stocks
```

### Шаг 3.2: Обновить Google OAuth для ngrok

В Google Console добавьте ngrok URL в:
- **Authorized JavaScript origins:**
  ```
  https://ваш-url.ngrok-free.app
  ```
- **Authorized redirect URIs:**
  ```
  https://ваш-url.ngrok-free.app/api/accounts/google/callback
  ```

### Шаг 3.3: Обновить Django settings для ngrok

**Файл:** `AXA-auth-server-main/.env`

```env
# Добавить ngrok URL
ALLOWED_HOSTS=localhost,127.0.0.1,axa.local,...,ваш-url.ngrok-free.app
CSRF_TRUSTED_ORIGINS=http://axa.local:8090,...,https://ваш-url.ngrok-free.app
```

---

## ✅ Проверка Работы

### Тест SSO:

1. Откройте `http://axa.local:8090`
2. Зарегистрируйтесь: email + password
3. Авторизуйтесь
4. Откройте `http://social.axa.local:8091`
5. **Должны быть авторизованы автоматически** ✅

### Тест Google OAuth:

1. Откройте `http://axa.local:8090`
2. Нажмите "Войти через Google"
3. Выберите Google аккаунт
4. Должна пройти авторизация ✅
5. Откройте `http://stocks.axa.local:8092`
6. **Должны быть авторизованы** ✅

### Тест ngrok:

1. Запустите `ngrok http 8090`
2. Скопируйте URL (например, `https://abc123.ngrok-free.app`)
3. Отправьте другу
4. Друг открывает → видит Marketplace ✅

---

## 🔧 Troubleshooting

### Проблема: Cookie не работают между доменами

**Решение:** Проверьте в Django settings:
```python
SESSION_COOKIE_DOMAIN = '.axa.local'
CSRF_COOKIE_DOMAIN = '.axa.local'
SESSION_COOKIE_SAMESITE = 'Lax'
```

### Проблема: Google OAuth redirect error

**Решение:** Проверьте что redirect URI в Google Console точно совпадает с URL:
```
http://axa.local:8090/api/accounts/google/callback
```

### Проблема: ngrok показывает 502

**Решение:** Убедитесь что все сервисы запущены:
```bash
# Проверка
curl http://axa.local:8090
curl http://localhost:3005
```

### Проблема: "axa.local" не открывается

**Решение:** Проверьте `/etc/hosts`:
```bash
cat /etc/hosts | grep axa.local
# Должно показать: 127.0.0.1 axa.local
```

Если нет - добавьте снова:
```bash
sudo bash -c 'echo "127.0.0.1 axa.local" >> /etc/hosts'
```

---

## 📊 Итоговая Архитектура

```
┌──────────────────────────────────────────────┐
│         Интернет (через ngrok)               │
│    https://abc123.ngrok-free.app             │
└────────────────┬─────────────────────────────┘
                 │
                 ↓
┌──────────────────────────────────────────────┐
│            Nginx (8090-8094)                 │
│  axa.local:8090      → Marketplace (3005)    │
│  social.axa.local:8091 → Social (3001)       │
│  stocks.axa.local:8092 → Stocks (3002)       │
│  crypto.axa.local:8093 → Crypto (3003)       │
│  ai.axa.local:8094    → AI (3006)            │
└────────────────┬─────────────────────────────┘
                 │
                 ↓ /api/accounts/
┌──────────────────────────────────────────────┐
│      Auth Server (Django) :8001              │
│  • Session Management (Redis)                │
│  • Google OAuth                              │
│  • User Profiles                             │
└────────────────┬─────────────────────────────┘
                 │
                 ↓ Cookie: sessionid
         ┌───────┴────────┐
         │  auth-global-redis  │
         │  Shared Sessions    │
         └─────────────────────┘
```

**Cookie `sessionid` шарится между всеми `*.axa.local` доменами!**

---

## 🎯 Что Дальше?

После локального тестирования:

1. ✅ Переезд на production домен (например, `app.tyriantrade.com`)
2. ✅ Настройка HTTPS (Let's Encrypt)
3. ✅ Настройка Kubernetes/Docker Swarm
4. ✅ CI/CD для автодеплоя

---

**Готовы начать? Скажите "давай начнем" и я выполню все команды по порядку!** 🚀


