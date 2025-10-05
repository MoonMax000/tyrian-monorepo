# 🌐 АДРЕСА ВСЕХ СЕРВИСОВ

## 🏠 ГЛАВНЫЙ АДРЕС (РЕКОМЕНДУЕТСЯ):

```
http://localhost:3005
```
**↑ Marketplace с единой навигацией - открывайте этот!**

---

## 📍 ВСЕ СЕРВИСЫ ПО ОТДЕЛЬНОСТИ:

### 1. 🏪 Marketplace (Главная + навигация)
```
http://localhost:3005
```
**Страницы:**
- http://localhost:3005/ - главная
- http://localhost:3005/signals-tab - сигналы и индикаторы
- http://localhost:3005/strategies-tab - стратегии
- http://localhost:3005/robots-tab - роботы и алгоритмы
- http://localhost:3005/consultants-tab - консультанты
- http://localhost:3005/traders-tab - трейдеры
- http://localhost:3005/analystys-tab - аналитики
- http://localhost:3005/scripts-tab - скрипты
- http://localhost:3005/courses-tab - курсы
- http://localhost:3005/popular-tab - популярное
- http://localhost:3005/favorites-tab - избранное

---

### 2. 📊 Stock Market (Фондовый рынок)
```
http://localhost:3002
```
**Страницы:**
- http://localhost:3002/ - главная
- http://localhost:3002/portfolios - портфели
- http://localhost:3002/screener - скринер акций
- http://localhost:3002/calendar - календарь дивидендов
- http://localhost:3002/markets - рынки
- http://localhost:3002/research - исследования

---

### 3. 💰 Cryptocurrency (Криптовалюта)
```
http://localhost:3003
```
**Страницы:**
- http://localhost:3003/ - главная
- http://localhost:3003/markets - рынки криптовалют
- http://localhost:3003/watchlist - список наблюдения
- http://localhost:3003/portfolio - портфель
- http://localhost:3003/fear-greed - индекс страха и жадности
- http://localhost:3003/alt-season - индекс альт-сезона
- http://localhost:3003/btc-dominance - доминация BTC

---

### 4. 👥 Social Network (Социальная сеть)
```
http://localhost:3001
```
**Страницы:**
- http://localhost:3001/ - лента новостей
- http://localhost:3001/profile - профиль
- http://localhost:3001/messages - сообщения
- http://localhost:3001/notifications - уведомления
- http://localhost:3001/friends - друзья
- http://localhost:3001/groups - группы

---

### 5. 🤖 AI Profiles (AI Ассистент)
```
http://localhost:3006
```
**Страницы:**
- http://localhost:3006/profile - профиль
- http://localhost:3006/dashboard - панель управления
- http://localhost:3006/settings - настройки
- http://localhost:3006/security - безопасность
- http://localhost:3006/notifications - уведомления
- http://localhost:3006/kyc - KYC верификация
- http://localhost:3006/billing - биллинг
- http://localhost:3006/referrals - рефералы
- http://localhost:3006/api - API настройки

---

## 🔧 БЭКЕНД СЕРВИСЫ:

### Auth Server (Авторизация)
```
http://localhost:8001
```

### Database (PostgreSQL)
```
localhost:5432
```

### Redis
```
localhost:6379
```

---

## 🌍 ДОСТУП ЧЕРЕЗ NGINX (если настроен):

```
http://localhost:8090
```

---

## 🌐 ПУБЛИЧНЫЙ ДОСТУП ЧЕРЕЗ NGROK (если запущен):

```
https://tyriantrade.ngrok.pro
```

---

## 📝 ПРОВЕРКА СТАТУСА:

Чтобы проверить все сервисы одной командой:

```bash
for port in 3005:Marketplace 3001:Social 3002:Stocks 3003:Crypto 3006:AI; do
  name=${port#*:}
  port=${port%:*}
  echo "$name: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:$port)"
done
```

---

## ⚡ БЫСТРЫЙ СТАРТ:

1. Запустить все сервисы:
```bash
./restart-services.sh
```

2. Открыть в браузере:
```
http://localhost:3005
```

3. Использовать навигацию слева для переключения между сервисами!

---

**🎉 Готово! Все адреса перед вами!**

