# 🌐 Готово! Запуск через ngrok (Режим 2)

**Статус:** ✅ Все настроено и работает!

---

## 📊 Текущий Статус:

✅ **Все фронтенды запущены:**
- Marketplace (3005) → 200 OK
- Social Network (3001) → 307
- Stocks (3002) → 200 OK  
- CoinMarketCap (3003) → 307
- AI Profiles (3006) → 307

✅ **Nginx прокси работает:**
- http://localhost:8090 → 200 OK

✅ **Auth Server работает:**
- Docker контейнеры запущены
- API доступен на localhost:8001

✅ **.env файлы созданы** для всех фронтендов

---

## 🚀 Шаг 1: Запустите ngrok

**В отдельном окне терминала выполните:**

```bash
ngrok http 8090
```

**Вы получите:**
```
ngrok                                                           

Session Status                online                                            
Account                       devidandersoncrypto@gmail.com (Plan: Free)        
Version                       3.30.0                                            
Region                        Asia Pacific (ap)                                 
Web Interface                 http://127.0.0.1:4040                             
Forwarding                    https://abc123def456.ngrok-free.app -> http://localhost:8090
                                                                                
Connections                   ttl     opn     rt1     rt5     p50     p90       
                              0       0       0.00    0.00    0.00    0.00      
```

**ВАЖНО:** Скопируйте ваш ngrok URL! Например:
```
https://abc123def456.ngrok-free.app
```

---

## 🔐 Шаг 2: Обновите Django для ngrok

### 2.1 Обновите .env файл Auth Server

**Файл:** `AXA-auth-server-main/.env`

**Добавьте ваш ngrok URL в две строки:**

```bash
# Было:
CSRF_TRUSTED_ORIGINS=http://localhost:8000,http://localhost:8001,http://localhost:8090,http://127.0.0.1:8000,http://127.0.0.1:8001

# Стало (добавьте ваш ngrok URL):
CSRF_TRUSTED_ORIGINS=http://localhost:8000,http://localhost:8001,http://localhost:8090,http://127.0.0.1:8000,http://127.0.0.1:8001,https://abc123def456.ngrok-free.app
```

```bash
# Было:
ALLOWED_HOSTS=localhost,127.0.0.1,*

# Стало (добавьте ваш поддомен):
ALLOWED_HOSTS=localhost,127.0.0.1,*,abc123def456.ngrok-free.app
```

**Замените `abc123def456` на ваш реальный поддомен!**

### 2.2 Перезапустите Auth Server

```bash
cd AXA-auth-server-main
docker compose restart auth-core
```

---

## ✅ Шаг 3: Протестируйте!

### Локально (на вашем компе):

Откройте: **http://localhost:8090**

- ✅ Должен открыться Marketplace со Sidebar
- ✅ Можете регистрироваться/входить

### Из интернета (отправьте другу):

Откройте: **https://ваш-url.ngrok-free.app**

**При первом открытии:**
1. ngrok покажет предупреждение **"Visit Site"** 
2. Нажмите кнопку **"Visit Site"**
3. Откроется ваш Marketplace! ✅

**Друг увидит:**
- ✅ Полноценный Marketplace со Sidebar
- ✅ Может регистрироваться/входить
- ✅ Видит дизайн и интерфейс
- ⚠️ Кнопки переключения между продуктами пока ведут на localhost (друг их не откроет)

---

## 🎯 Google OAuth (Опционально)

### Шаг 4.1: Создайте Google OAuth App

1. Перейдите: https://console.cloud.google.com/
2. **APIs & Services** → **Credentials**
3. **Create Credentials** → **OAuth client ID**
4. **Application type:** Web application
5. **Name:** AXA Platform ngrok

6. **Authorized JavaScript origins:**
```
https://ваш-url.ngrok-free.app
http://localhost:8090
```

7. **Authorized redirect URIs:**
```
https://ваш-url.ngrok-free.app/api/accounts/google/callback/
http://localhost:8090/api/accounts/google/callback/
```

8. Нажмите **Create**
9. **Скопируйте:**
   - Client ID
   - Client Secret

### Шаг 4.2: Настройте Django (Если нужен Google OAuth)

**Это расширенная настройка, для базового тестирования не обязательна!**

Подробная инструкция в файле: `FULL_SETUP_SSO_GOOGLE.md` (раздел "Часть 2")

---

## 📱 Ссылки для Тестирования:

### Для вас (локально):
```
http://localhost:8090       - Marketplace
http://localhost:8090/admin - Django Admin
```

### Для друга (из интернета):
```
https://ваш-url.ngrok-free.app   - Marketplace
```

**Отправьте эту ссылку другу!** Он сможет:
- ✅ Увидеть ваш сайт
- ✅ Зарегистрироваться
- ✅ Протестировать интерфейс
- ✅ Увидеть Sidebar с навигацией

---

## ⚠️ Ограничения Бесплатного ngrok:

1. **Один порт** - только Marketplace доступен из интернета
   - Social, Stocks, Crypto, AI - работают только локально

2. **Предупреждение "Visit Site"** 
   - Будет показываться при первом открытии
   - Чтобы убрать - нужен ngrok Pro ($8/месяц)

3. **Временный URL**
   - При перезапуске ngrok URL меняется
   - Для фиксированного URL - нужен ngrok Pro

4. **SSO между сервисами** 
   - Не работает через ngrok бесплатно
   - Для полного SSO - нужен деплой на VPS или ngrok Pro

---

## 🔄 Как Остановить/Перезапустить

### Остановить все:

```bash
# Остановить ngrok (в терминале где он запущен)
Ctrl+C

# Остановить фронтенды
pkill -f "next dev"

# Остановить Auth Server
cd AXA-auth-server-main
docker compose stop
```

### Запустить заново:

```bash
# 1. Запустить Auth Server
cd AXA-auth-server-main
docker compose start

# 2. Запустить фронтенды (используйте фоновый запуск)
cd AXA-marketplace-main && PORT=3005 npm run dev &
cd AXA-socialweb-frontend-main && PORT=3001 npm run dev &
cd AXA-stocks-frontend-main && PORT=3002 npm run dev &
cd AXA-coinmarketcap-main && PORT=3003 npm run dev &
cd AXA-Turian-AI-profiles-main && PORT=3006 npm run dev &

# 3. Подождать 20 секунд

# 4. Запустить ngrok
ngrok http 8090
```

---

## 🐛 Troubleshooting

### Проблема: ngrok показывает 502

**Решение:** Проверьте что все работает локально:
```bash
curl http://localhost:8090
# Должен вернуть 200
```

### Проблема: Auth Server не работает

**Решение:**
```bash
cd AXA-auth-server-main
docker compose ps
# Все контейнеры должны быть "Up"

# Если нет - перезапустите
docker compose restart
```

### Проблема: Фронтенд не запускается

**Решение:** Проверьте логи:
```bash
tail -50 /tmp/marketplace.log
tail -50 /tmp/social.log
```

### Проблема: "Cannot GET /api/accounts/"

**Решение:** Проверьте что Auth Server видит правильные URL:
```bash
cd AXA-auth-server-main
cat .env | grep CSRF_TRUSTED_ORIGINS
# Должен содержать ваш ngrok URL
```

---

## 📚 Дополнительная Документация:

- `FULL_SETUP_SSO_GOOGLE.md` - Полная настройка SSO + Google OAuth
- `AUTH_ANALYSIS.md` - Анализ системы авторизации
- `PLATFORM_SETUP.md` - Общая документация по платформе

---

## 🎉 Готово!

**Текущий URL для тестирования:**

Вы можете протестировать локально: **http://localhost:8090**

После запуска ngrok, ваша ссылка будет: **https://ваш-url.ngrok-free.app**

**Отправьте эту ссылку другу для тестирования!** 🚀


