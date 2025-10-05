# 🚀 Настройка ngrok с Платной Подпиской

## 🎉 Что Дает Платная Подписка

### ✨ Новые Возможности:

1. **Несколько туннелей одновременно** (3+ в зависимости от плана)
2. **Зарезервированные домены** - постоянный URL (не меняется при перезапуске)
3. **Убрано предупреждение "Visit Site"** - чище для пользователей
4. **Более стабильная работа** - приоритет в очереди
5. **Кастомные домены** - можно использовать свой домен
6. **IP Whitelist** - безопасность
7. **Больше пропускной способности**

## 📋 План Действий для Улучшения

### Вариант 1: Один Туннель через Nginx (Рекомендуется) 👍

**Плюсы:**
- ✅ Один URL для всего
- ✅ Проще управлять
- ✅ Работает на любом плане
- ✅ SSO и авторизация проще

**Как запустить:**
```bash
# 1. Убедитесь что Nginx работает на порту 8090
curl http://localhost:8090

# 2. Запустите ngrok
ngrok http 8090

# 3. Обновите Django .env с новым URL
```

**Результат:**
- Все фронтенды доступны по одному URL
- https://YOUR-URL.ngrok-free.app → Marketplace
- https://YOUR-URL.ngrok-free.app/social → Social Network
- https://YOUR-URL.ngrok-free.app/stocks → Stocks
- И т.д.

### Вариант 2: Зарезервированный Домен (Если есть в плане)

**Плюсы:**
- ✅ URL не меняется при перезапуске
- ✅ Можно добавить в закладки
- ✅ Проще для друзей

**Как настроить:**

1. **Зайдите на ngrok.com:**
   - https://dashboard.ngrok.com/cloud-edge/domains
   
2. **Создайте Reserved Domain:**
   - Нажмите "New Domain"
   - Выберите регион (лучше ближайший)
   - Получите домен типа `your-name-1234.ngrok-free.app`

3. **Запустите с доменом:**
```bash
ngrok http 8090 --domain=your-name-1234.ngrok-free.app
```

4. **Теперь этот URL постоянный!**

### Вариант 3: Несколько Туннелей (Для Pro+)

**Если нужны отдельные URL для каждого сервиса:**

1. **Создайте файл конфигурации:**
```bash
# Используйте уже созданный ngrok-config.yml
cp ngrok-config.yml ~/Library/Application\ Support/ngrok/ngrok.yml
```

2. **Запустите все туннели:**
```bash
ngrok start --all
```

3. **Получите 6 отдельных URL:**
   - Nginx: https://abc123.ngrok-free.app
   - Marketplace: https://xyz789.ngrok-free.app
   - Social: https://def456.ngrok-free.app
   - И т.д.

## 🔧 Исправление Проблем с Отображением

### Проблема: Черный Экран / Не Загружается

**Причины (не связано с ngrok):**

1. **CSS/JS не загружаются**
   ```bash
   # Проверьте в браузере (F12 → Console)
   # Если видите ошибки 404 - это проблема путей
   ```

2. **Next.js нужен basePath для subpath routing**
   - Если используете /social, /stocks и т.д.
   - Нужно добавить `basePath` в next.config.js каждого проекта

3. **CORS ошибки**
   - Обновите Django CORS_ALLOWED_ORIGINS
   - Добавьте ngrok URL

**Решение:**

```bash
# Вариант А: Используйте один туннель через Nginx (работает как есть)
ngrok http 8090

# Вариант Б: Отдельные туннели на каждый порт (без Nginx)
ngrok http 3005  # Marketplace на отдельном URL
```

### Обновление Django для ngrok

После получения нового URL обновите:

```bash
# В AXA-auth-server-main/.env
CSRF_TRUSTED_ORIGINS=http://localhost:8000,http://localhost:8001,http://localhost:8090,https://YOUR-NEW-NGROK-URL.ngrok-free.app
ALLOWED_HOSTS=localhost,127.0.0.1,YOUR-NEW-NGROK-URL.ngrok-free.app
```

Затем перезапустите Django:
```bash
cd AXA-auth-server-main
docker compose restart auth-core
```

## 🚀 Быстрый Старт (Рекомендуемый)

### Шаг 1: Запустите Все Локально

```bash
# Убедитесь что все работает локально
lsof -ti:3001,3002,3003,3005,3006
# Должно показать 5 процессов

# Проверьте каждый:
curl -I http://localhost:3005  # 200 OK
curl -I http://localhost:3001  # 200 или 307
curl -I http://localhost:3002  # 200 OK
curl -I http://localhost:3003  # 200 или 307
curl -I http://localhost:3006  # 200 или 307
```

### Шаг 2: Запустите Nginx (если еще не работает)

```bash
# Проверьте
curl http://localhost:8090

# Если не работает - запустите
brew services start nginx
```

### Шаг 3: Запустите ngrok

```bash
# Простой вариант (новый URL каждый раз)
ngrok http 8090

# ИЛИ с зарезервированным доменом
ngrok http 8090 --domain=your-reserved-domain.ngrok-free.app
```

### Шаг 4: Обновите Django

```bash
# Скопируйте URL из ngrok
# Например: https://abc123xyz.ngrok-free.app

# Обновите .env
cd AXA-auth-server-main
# Добавьте новый URL в CSRF_TRUSTED_ORIGINS и ALLOWED_HOSTS

# Перезапустите
docker compose restart
```

### Шаг 5: Поделитесь Ссылкой!

Отправьте другу:
```
https://your-ngrok-url.ngrok-free.app
```

Он увидит вашу платформу с навигацией между всеми проектами!

## 💡 Советы

### Для Стабильной Работы:

1. **Используйте зарезервированный домен** - не нужно постоянно обновлять Django
2. **Один туннель через Nginx** - проще управлять
3. **Держите ngrok запущенным** - не закрывайте терминал
4. **Проверяйте логи** - ngrok показывает все запросы в реальном времени

### Для Отладки:

```bash
# Смотрите логи ngrok
# Интерфейс доступен на http://localhost:4040

# Проверяйте каждый слой:
curl http://localhost:3005           # Frontend работает?
curl http://localhost:8090            # Nginx работает?
curl https://YOUR-URL.ngrok-free.app  # ngrok работает?
```

## 📞 Следующие Шаги

1. Скажите какой у вас план ngrok (Personal, Pro, Business?)
2. Давайте запустим с зарезервированным доменом
3. Настроим всё для максимальной стабильности
4. Решим проблему с отображением страниц

---

**Готовы настроить? Скажите какой у вас план и запустим! 🚀**
