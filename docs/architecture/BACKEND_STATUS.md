# 🔧 СТАТУС БЭКЕНДА ПЛАТФОРМЫ

## ✅ РАБОТАЮЩИЕ СЕРВИСЫ:

### 1. **Auth Server (Django)** - http://localhost:8001
- **Статус:** ✅ Работает
- **Порт:** 8001
- **API Docs:** http://localhost:8001/api/docs/
- **Endpoints:**
  - `POST /api/accounts/register/` - Регистрация
  - `POST /api/accounts/login/` - Вход
  - `POST /api/accounts/logout/` - Выход
  - `GET /api/accounts/profile/` - Профиль
  - `POST /api/accounts/google/` - Google OAuth

### 2. **Infrastructure (Social Network)**

#### PostgreSQL
- **Порт:** 5432
- **Database:** socialweb
- **User:** postgres
- **Status:** ✅ Healthy

#### Redis
- **Порт:** 6379
- **Status:** ✅ Healthy

#### RabbitMQ
- **Порт:** 5672 (AMQP), 15672 (Management)
- **Management UI:** http://localhost:15672
- **User/Pass:** guest/guest
- **Status:** ✅ Healthy

#### ElasticSearch
- **Порт:** 9200
- **Status:** ✅ Healthy
- **Health:** http://localhost:9200/_cluster/health

### 3. **Auth Database**
- **PostgreSQL:** localhost:5432 (отдельная БД для Auth)
- **Redis:** localhost:6380

---

## ⚠️ ТРЕБУЮТ НАСТРОЙКИ:

### Social Network Микросервисы
Требуют GitHub токен для доступа к приватным репозиториям:
- `AXA-socialweb-auth`
- `AXA-socialweb-posts`
- `AXA-socialweb-profiles`
- `AXA-socialweb-likes`
- `AXA-socialweb-favorites`

**Решение:** Либо получить токен, либо использовать готовые образы Docker.

---

## 📝 СЛЕДУЮЩИЕ ШАГИ:

1. ✅ Auth Server работает
2. ⏳ Настроить фронтенды на Auth Server
3. ⏳ Запустить базовые микросервисы Social Network
4. ⏳ Настроить API ключи для Stocks/Crypto

---

## 🔗 ПОЛЕЗНЫЕ ССЫЛКИ:

- **Auth API Docs:** http://localhost:8001/api/docs/
- **RabbitMQ Management:** http://localhost:15672
- **ElasticSearch:** http://localhost:9200

