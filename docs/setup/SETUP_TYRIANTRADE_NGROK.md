# 🚀 Настройка tyriantrade.ngrok.pro для AXA Platform

## ✅ У вас есть:
- ✅ Pro подписка ngrok ($20/мес)
- ✅ Зарезервированный домен: `tyriantrade.ngrok.pro`
- ✅ 5 фронтендов работают локально
- ✅ Nginx настроен на порту 8090

## 🎯 План Действий

### Шаг 1: Запустите ngrok с Правильным Портом

**Важно:** У вас Nginx на порту 8090, а не 80!

```bash
# НЕ ТАК:
# ngrok http --url=tyriantrade.ngrok.pro 80  ❌

# ТАК:
ngrok http --url=tyriantrade.ngrok.pro 8090  ✅
```

**Запустите команду:**
```bash
ngrok http --url=tyriantrade.ngrok.pro 8090
```

**Что это даст:**
- https://tyriantrade.ngrok.pro → проксирует на http://localhost:8090
- Nginx на 8090 → распределяет по фронтендам
- Всё работает под одним доменом!

### Шаг 2: Обновите Django Auth Server

Добавьте новый домен в `.env`:

```bash
cd AXA-auth-server-main
```

Откройте `.env` и обновите:

```env
CSRF_TRUSTED_ORIGINS=http://localhost:8000,http://localhost:8001,http://localhost:8090,http://127.0.0.1:8000,http://127.0.0.1:8001,https://tyriantrade.ngrok.pro

ALLOWED_HOSTS=localhost,127.0.0.1,*,tyriantrade.ngrok.pro
```

**Перезапустите Django:**
```bash
docker compose restart auth-core
```

### Шаг 3: Обновите Frontend .env (Опционально)

Если нужна авторизация через интернет, обновите переменные:

**Social Network:**
```bash
# В AXA-socialweb-frontend-main/.env
NEXT_PUBLIC_AUTH_URL=https://tyriantrade.ngrok.pro
NEXT_PUBLIC_AUTH_API=https://tyriantrade.ngrok.pro/api/accounts/
```

**Stocks:**
```bash
# В AXA-stocks-frontend-main/.env
NEXT_PUBLIC_AUTH_URL=https://tyriantrade.ngrok.pro
NEXT_PUBLIC_AUTH_API=https://tyriantrade.ngrok.pro/api/accounts/
```

**CoinMarketCap:**
```bash
# В AXA-coinmarketcap-main/.env
NEXT_PUBLIC_AUTH_URL=https://tyriantrade.ngrok.pro
NEXT_PUBLIC_AUTH_API=https://tyriantrade.ngrok.pro/api/accounts/
```

**AI Profiles:**
```bash
# В AXA-Turian-AI-profiles-main/.env
NEXT_PUBLIC_AUTH_URL=https://tyriantrade.ngrok.pro
NEXT_PUBLIC_AUTH_API=https://tyriantrade.ngrok.pro/api/accounts/
```

**Перезапустите фронтенды после изменения .env**

### Шаг 4: Проверьте Работу

```bash
# Локально:
curl http://localhost:8090
# Должен вернуть 200 OK

# Через интернет (попросите друга или откройте на телефоне):
https://tyriantrade.ngrok.pro
```

## 🗺️ Структура URL

С вашей настройкой:

| Путь | Что открывается |
|------|-----------------|
| https://tyriantrade.ngrok.pro | Marketplace (главная) |
| https://tyriantrade.ngrok.pro/social | Social Network |
| https://tyriantrade.ngrok.pro/stocks | Stocks (Trader Diary) |
| https://tyriantrade.ngrok.pro/crypto | CoinMarketCap |
| https://tyriantrade.ngrok.pro/ai | AI Profiles |
| https://tyriantrade.ngrok.pro/api/accounts/ | Auth Server API |
| https://tyriantrade.ngrok.pro/admin/ | Django Admin |

## 🎨 Преимущества Pro Подписки

### Что теперь доступно:

1. **✅ Постоянный URL** - tyriantrade.ngrok.pro не меняется
2. **✅ Нет "Visit Site"** - друзья сразу попадают на сайт
3. **✅ 3 туннеля одновременно** - можно запустить отдельные для разных сервисов
4. **✅ Лучшая производительность** - приоритет в очереди
5. **✅ Статистика** - http://localhost:4040 (ngrok dashboard)

### Дополнительные Возможности:

#### Вариант А: Один Туннель через Nginx (Текущий - Рекомендуется) 👍
```bash
ngrok http --url=tyriantrade.ngrok.pro 8090
```

**Плюсы:**
- Один URL для всего
- Проще управлять
- Работает SSO/авторизация
- Меньше настроек

#### Вариант Б: Несколько Туннелей (Если нужно)

Можете создать дополнительные домены для каждого сервиса:
- `marketplace.tyriantrade.ngrok.pro`
- `social.tyriantrade.ngrok.pro`
- `stocks.tyriantrade.ngrok.pro`

Но для вашего случая **Вариант А лучше**!

## 🔧 Решение Проблемы с Черным Экраном

**Важно:** Проблема с черным экраном НЕ связана с ngrok!

### Диагностика:

1. **Проверьте локально:**
```bash
curl http://localhost:3005
# Если работает локально, значит проблема в браузере/кэше
```

2. **Очистите кэш браузера:**
- Cmd+Shift+R (Mac) или Ctrl+Shift+R (Windows)
- Жесткая перезагрузка

3. **Проверьте Console:**
- F12 → Console
- Есть ли красные ошибки?

4. **Проверьте Network:**
- F12 → Network
- Все ли файлы загрузились (200 OK)?

### Частые Причины:

1. **JavaScript компилируется** - подождите 10-15 секунд
2. **Старый кэш** - очистите кэш браузера
3. **CSS не загружается** - проверьте Network в DevTools
4. **Ошибка в коде** - проверьте Console

## 🚀 Полная Последовательность Запуска

### Терминал 1: Фронтенды (уже запущены)
```bash
# Проверьте что работают:
lsof -ti:3001,3002,3003,3005,3006
# Должно показать 5+ процессов
```

### Терминал 2: Nginx (если не запущен)
```bash
brew services start nginx
# ИЛИ
sudo nginx
```

### Терминал 3: Django Auth (если не запущен)
```bash
cd AXA-auth-server-main
docker compose up -d
```

### Терминал 4: ngrok 🆕
```bash
ngrok http --url=tyriantrade.ngrok.pro 8090
```

**Оставьте этот терминал открытым!**

## 📊 Мониторинг

### ngrok Dashboard:
Откройте в браузере: http://localhost:4040

Здесь видно:
- Все HTTP запросы в реальном времени
- Статус туннеля
- Ошибки (если есть)

### Проверка Каждого Слоя:

```bash
# 1. Фронтенды работают?
curl http://localhost:3005  # 200 OK

# 2. Nginx работает?
curl http://localhost:8090  # 200 OK

# 3. ngrok работает?
curl https://tyriantrade.ngrok.pro  # 200 OK
```

## 🎁 Бонус: Настройка Google OAuth (потом)

С постоянным доменом теперь можно настроить Google OAuth!

**Authorized redirect URIs:**
```
https://tyriantrade.ngrok.pro/accounts/google/login/callback/
```

Добавьте в Google Cloud Console → OAuth 2.0 Client IDs

## 💡 Советы

### Для Стабильной Работы:

1. **Держите ngrok запущенным** - не закрывайте терминал
2. **Добавьте в автозагрузку** (опционально):
   ```bash
   # Создайте скрипт
   echo 'ngrok http --url=tyriantrade.ngrok.pro 8090' > ~/start-ngrok.sh
   chmod +x ~/start-ngrok.sh
   ```

3. **Мониторьте через Dashboard** - http://localhost:4040

### Для Друзей:

**Отправьте им:**
```
https://tyriantrade.ngrok.pro
```

**Что они увидят:**
- Красивый навбар слева
- Все проекты в меню PRODUCTS
- Могут переключаться между проектами
- Видят все подстраницы

## 🐛 Если Что-то Не Работает

### Проверьте по порядку:

```bash
# 1. Все ли фронтенды запущены?
lsof -ti:3001,3002,3003,3005,3006

# 2. Nginx работает?
curl http://localhost:8090

# 3. ngrok запущен?
curl https://tyriantrade.ngrok.pro

# 4. Django работает?
curl http://localhost:8001/api/accounts/me/
```

### Посмотрите логи:

```bash
# Фронтенд логи:
tail -f /tmp/marketplace-v2.log
tail -f /tmp/social-v2.log
tail -f /tmp/stocks-v2.log

# Django логи:
cd AXA-auth-server-main
docker compose logs -f auth-core

# ngrok логи:
# Смотрите в терминале где запущен ngrok
# ИЛИ в http://localhost:4040
```

---

## ✅ Финальный Чеклист

- [ ] Все фронтенды запущены (5 процессов)
- [ ] Nginx работает на 8090
- [ ] Django работает
- [ ] ngrok запущен с доменом tyriantrade.ngrok.pro
- [ ] Django .env обновлен
- [ ] Локально работает http://localhost:8090
- [ ] Через интернет работает https://tyriantrade.ngrok.pro
- [ ] Друг может открыть ссылку

**Готово! Ваша платформа доступна через интернет! 🎉**
