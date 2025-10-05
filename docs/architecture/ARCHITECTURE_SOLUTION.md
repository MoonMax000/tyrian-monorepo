# 🏗️ АРХИТЕКТУРНОЕ РЕШЕНИЕ ДЛЯ TYRIAN TRADE

## 📋 ВАШИ ТРЕБОВАНИЯ

1. ✅ Подтягивать изменения от разработчиков
2. ✅ Вносить свои изменения
3. ✅ Легко настраивать авторизацию
4. ✅ Ngrok домен + поддомены ($20/месяц)
5. ✅ Включать/отключать продукты
6. ✅ Верстка не ломалась
7. ✅ Незаметный переход между продуктами
8. ✅ Единая авторизация (SSO)

---

## 🎯 РЕКОМЕНДУЕМОЕ РЕШЕНИЕ

### **Git Strategy: Fork + Upstream Remote**

```bash
# Ваш подход к каждому репозиторию:
1. Fork репозитория разработчиков на GitHub
2. Clone вашего fork
3. Добавить upstream remote для pull изменений
4. Работать в отдельной ветке 'production'
```

**Преимущества:**
- ✅ Легко pull изменения от разработчиков
- ✅ Ваши изменения в отдельной ветке
- ✅ Полный контроль над кодом
- ✅ Cherry-pick нужных изменений

---

## 🌐 NGINX + NGROK: Единый домен с поддоменами

### **Ngrok Reserved Domain ($20/месяц):**

```
tyrian-trade.ngrok.app (ваш основной домен)
```

### **Nginx Reverse Proxy Configuration:**

```nginx
# /etc/nginx/nginx.conf

# Auth Server
server {
    listen 80;
    server_name auth.tyrian-trade.ngrok.app;
    
    location / {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Marketplace
server {
    listen 80;
    server_name marketplace.tyrian-trade.ngrok.app;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Social Network
server {
    listen 80;
    server_name social.tyrian-trade.ngrok.app;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Stocks
server {
    listen 80;
    server_name stocks.tyrian-trade.ngrok.app;
    
    location / {
        proxy_pass http://localhost:3003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Crypto
server {
    listen 80;
    server_name crypto.tyrian-trade.ngrok.app;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Live Streaming
server {
    listen 80;
    server_name stream.tyrian-trade.ngrok.app;
    
    location / {
        proxy_pass http://localhost:3004;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# AI Assistant
server {
    listen 80;
    server_name ai.tyrian-trade.ngrok.app;
    
    location / {
        proxy_pass http://localhost:3006;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Portfolios
server {
    listen 80;
    server_name portfolios.tyrian-trade.ngrok.app;
    
    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### **Ngrok Configuration:**

```yaml
# ~/.ngrok2/ngrok.yml
version: "2"
authtoken: YOUR_NGROK_TOKEN

tunnels:
  tyrian-auth:
    proto: http
    addr: 8080  # Nginx port
    hostname: auth.tyrian-trade.ngrok.app
  
  tyrian-marketplace:
    proto: http
    addr: 8080
    hostname: marketplace.tyrian-trade.ngrok.app
  
  tyrian-social:
    proto: http
    addr: 8080
    hostname: social.tyrian-trade.ngrok.app
  
  tyrian-stocks:
    proto: http
    addr: 8080
    hostname: stocks.tyrian-trade.ngrok.app
  
  tyrian-crypto:
    proto: http
    addr: 8080
    hostname: crypto.tyrian-trade.ngrok.app
  
  tyrian-stream:
    proto: http
    addr: 8080
    hostname: stream.tyrian-trade.ngrok.app
  
  tyrian-ai:
    proto: http
    addr: 8080
    hostname: ai.tyrian-trade.ngrok.app
  
  tyrian-portfolios:
    proto: http
    addr: 8080
    hostname: portfolios.tyrian-trade.ngrok.app
```

**⚠️ ВАЖНО:** Ngrok $20/месяц план поддерживает **3 reserved domains**. Для 8 поддоменов нужен план **$40/месяц** или использовать альтернативу.

---

## 🔐 ЕДИНАЯ АВТОРИЗАЦИЯ (SSO)

### **Cookie Domain Configuration:**

```python
# AXA-auth-server-main/auth-core/core/settings.py

SESSION_COOKIE_DOMAIN = '.tyrian-trade.ngrok.app'
CSRF_COOKIE_DOMAIN = '.tyrian-trade.ngrok.app'
SESSION_COOKIE_SECURE = True  # Для HTTPS
SESSION_COOKIE_SAMESITE = 'Lax'

CORS_ALLOWED_ORIGINS = [
    'https://auth.tyrian-trade.ngrok.app',
    'https://marketplace.tyrian-trade.ngrok.app',
    'https://social.tyrian-trade.ngrok.app',
    'https://stocks.tyrian-trade.ngrok.app',
    'https://crypto.tyrian-trade.ngrok.app',
    'https://stream.tyrian-trade.ngrok.app',
    'https://ai.tyrian-trade.ngrok.app',
    'https://portfolios.tyrian-trade.ngrok.app',
]

CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS
```

### **Frontend Environment Variables:**

```bash
# Marketplace .env
NEXT_PUBLIC_AUTH_URL=https://auth.tyrian-trade.ngrok.app
NEXT_PUBLIC_MARKETPLACE_URL=https://marketplace.tyrian-trade.ngrok.app
NEXT_PUBLIC_SOCIAL_URL=https://social.tyrian-trade.ngrok.app
NEXT_PUBLIC_STOCKS_URL=https://stocks.tyrian-trade.ngrok.app
# ... и т.д.
```

---

## 🎛️ ДИНАМИЧЕСКОЕ УПРАВЛЕНИЕ ПРОДУКТАМИ

### **Products Configuration (JSON):**

```typescript
// shared/navigation.config.ts

export interface Product {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  icon: string;
  order: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 'marketplace',
    name: 'Marketplace',
    url: 'https://marketplace.tyrian-trade.ngrok.app',
    enabled: true,
    icon: 'Store',
    order: 1,
  },
  {
    id: 'social',
    name: 'Social Network',
    url: 'https://social.tyrian-trade.ngrok.app',
    enabled: true,
    icon: 'Users',
    order: 2,
  },
  {
    id: 'stocks',
    name: 'Stocks',
    url: 'https://stocks.tyrian-trade.ngrok.app',
    enabled: true,
    icon: 'TrendingUp',
    order: 3,
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    url: 'https://crypto.tyrian-trade.ngrok.app',
    enabled: false,  // ❌ ОТКЛЮЧЕН - не показывается в меню
    icon: 'Bitcoin',
    order: 4,
  },
  // ... остальные продукты
];

// Фильтр для активных продуктов
export const getEnabledProducts = () => 
  PRODUCTS.filter(p => p.enabled).sort((a, b) => a.order - b.order);
```

### **NewSidebar with Dynamic Products:**

```typescript
// components/Layout/NewSidebar.tsx

import { getEnabledProducts } from '@/config/navigation.config';

const NewSidebar = () => {
  const products = getEnabledProducts(); // Только включенные

  return (
    <nav>
      {products.map(product => (
        <a key={product.id} href={product.url}>
          {product.icon} {product.name}
        </a>
      ))}
    </nav>
  );
};
```

**Преимущества:**
- ✅ Изменил `enabled: false` → продукт скрыт везде
- ✅ Верстка не ломается
- ✅ Легко добавлять новые продукты
- ✅ Контроль порядка отображения

---

## 📦 NPM ПАКЕТ ДЛЯ НАВИГАЦИИ (Рекомендуется)

### **Создание пакета:**

```bash
# 1. Создать приватный npm пакет
mkdir tyrian-navigation
cd tyrian-navigation
npm init -y

# 2. Структура:
tyrian-navigation/
├── package.json
├── src/
│   ├── config/
│   │   └── navigation.config.ts
│   ├── components/
│   │   ├── NewSidebar.tsx
│   │   ├── HeaderNew.tsx
│   │   └── RightSidebar.tsx
│   └── index.ts
```

### **Публикация (GitHub Packages):**

```json
// package.json
{
  "name": "@tyrian/navigation",
  "version": "1.0.0",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

### **Использование во всех проектах:**

```bash
npm install @tyrian/navigation
```

```typescript
// В любом проекте:
import { NewSidebar, HeaderNew, RightSidebar } from '@tyrian/navigation';
```

**Преимущества:**
- ✅ Изменения в одном месте → `npm update` → все проекты обновлены
- ✅ Версионирование (можно откатиться)
- ✅ Независимая разработка навигации

---

## 🔄 GIT WORKFLOW: Подтягивание изменений

### **Настройка каждого проекта:**

```bash
# 1. Fork репозитория на GitHub
# 2. Clone вашего fork:
git clone https://github.com/YOUR_USERNAME/AXA-marketplace-main.git

# 3. Добавить upstream remote (репозиторий разработчиков):
cd AXA-marketplace-main
git remote add upstream https://github.com/DEVELOPERS/AXA-marketplace-main.git

# 4. Создать production ветку:
git checkout -b production
git push origin production

# 5. Установить production как default ветку для deploy
```

### **Подтягивание изменений от разработчиков:**

```bash
# 1. Fetch изменения от разработчиков:
git fetch upstream

# 2. Посмотреть что изменилось:
git log upstream/main..HEAD

# 3. Merge изменений в production:
git checkout production
git merge upstream/main

# 4. Решить конфликты (если есть)
# 5. Push в ваш fork:
git push origin production
```

### **Cherry-pick конкретных изменений:**

```bash
# Если нужны только определенные коммиты:
git cherry-pick <commit-hash>
```

---

## 🚀 АЛЬТЕРНАТИВА NGROK: Cloudflare Tunnel (БЕСПЛАТНО!)

### **Почему Cloudflare Tunnel лучше:**

- ✅ **БЕСПЛАТНО** (неограниченные поддомены)
- ✅ Ваш собственный домен
- ✅ Автоматический SSL
- ✅ DDoS защита
- ✅ CDN
- ✅ Не отключается

### **Настройка:**

```bash
# 1. Установить cloudflared:
brew install cloudflared  # macOS
# или wget для Linux

# 2. Логин:
cloudflared tunnel login

# 3. Создать tunnel:
cloudflared tunnel create tyrian-trade

# 4. Настроить DNS:
cloudflared tunnel route dns tyrian-trade tyrian-trade.com
cloudflared tunnel route dns tyrian-trade *.tyrian-trade.com

# 5. Конфигурация:
# ~/.cloudflared/config.yml
tunnel: YOUR_TUNNEL_ID
credentials-file: /path/to/credentials.json

ingress:
  - hostname: auth.tyrian-trade.com
    service: http://localhost:8001
  - hostname: marketplace.tyrian-trade.com
    service: http://localhost:3000
  - hostname: social.tyrian-trade.com
    service: http://localhost:3001
  - hostname: stocks.tyrian-trade.com
    service: http://localhost:3003
  - hostname: crypto.tyrian-trade.com
    service: http://localhost:3002
  - hostname: stream.tyrian-trade.com
    service: http://localhost:3004
  - hostname: ai.tyrian-trade.com
    service: http://localhost:3006
  - hostname: portfolios.tyrian-trade.com
    service: http://localhost:5173
  - service: http_status:404

# 6. Запуск:
cloudflared tunnel run tyrian-trade
```

**Преимущества:**
- 💰 **Бесплатно** vs $40/месяц Ngrok
- 🌐 Ваш собственный домен
- 🔒 Автоматический SSL
- 🚀 CDN + DDoS защита
- ⏱️ Не отключается через 8 часов

---

## 📊 СРАВНЕНИЕ РЕШЕНИЙ

| Функция | Ngrok ($40/мес) | Cloudflare Tunnel (FREE) | Nginx + VPS ($5/мес) |
|---------|----------------|-------------------------|---------------------|
| Стоимость | $40/мес | **$0** | $5/мес |
| Поддомены | ✅ Ограничено | ✅ Неограниченно | ✅ Неограниченно |
| SSL | ✅ Автоматический | ✅ Автоматический | ❌ Нужно настроить |
| DDoS защита | ❌ | ✅ | ❌ |
| CDN | ❌ | ✅ | ❌ |
| Для разработки | ✅ Идеально | ✅ Отлично | ⚠️ Production |
| Для production | ⚠️ Дорого | ✅ Идеально | ✅ Хорошо |

---

## 🎯 ИТОГОВАЯ РЕКОМЕНДАЦИЯ

### **ДЛЯ РАЗРАБОТКИ (СЕЙЧАС):**

```
1. Git Strategy: Fork + Upstream Remote
   → Легко подтягивать изменения
   
2. Navigation: NPM пакет @tyrian/navigation
   → Легко обновлять UI везде
   
3. Infrastructure: Cloudflare Tunnel
   → БЕСПЛАТНО, неограниченные поддомены
   
4. SSO: Cookie domain .tyrian-trade.com
   → Единая авторизация
   
5. Dynamic Products: navigation.config.ts
   → Включать/отключать продукты
```

### **ДЛЯ PRODUCTION (ЧЕРЕЗ 1-2 МЕСЯЦА):**

```
1. VPS (DigitalOcean/Hetzner): $20-40/мес
2. Docker Swarm или Kubernetes
3. Nginx Ingress Controller
4. CI/CD (GitHub Actions)
5. Monitoring (Grafana/Prometheus)
```

---

## 🛠️ ПЛАН ВНЕДРЕНИЯ (2 ЧАСА)

### **Шаг 1: Git Setup (20 минут)**

```bash
# Для каждого проекта:
git remote add upstream https://github.com/ORIGINAL/repo.git
git fetch upstream
git checkout -b production
```

### **Шаг 2: Cloudflare Tunnel (30 минут)**

```bash
# Установка и настройка
cloudflared tunnel login
cloudflared tunnel create tyrian-trade
# Настроить config.yml (см. выше)
```

### **Шаг 3: Navigation Config (30 минут)**

```bash
# Создать shared/navigation.config.ts
# Обновить все NewSidebar компоненты
```

### **Шаг 4: SSO Configuration (30 минут)**

```python
# Обновить settings.py с правильным domain
SESSION_COOKIE_DOMAIN = '.tyrian-trade.com'
```

### **Шаг 5: Testing (10 минут)**

```bash
# Проверить все продукты
# Проверить SSO
# Проверить навигацию
```

---

## ❓ ВОПРОСЫ ДЛЯ УТОЧНЕНИЯ

1. **У вас есть свой домен?** (например, tyrian-trade.com)
   - Да → Cloudflare Tunnel
   - Нет → Ngrok temporary, потом купить домен

2. **Как часто разработчики обновляют код?**
   - Часто → Monorepo может быть сложнее
   - Редко → Fork + Upstream идеально

3. **Планируете production deployment?**
   - Да → Cloudflare Tunnel → VPS
   - Нет → Ngrok достаточно

---

## 🎬 НАЧАТЬ ПРЯМО СЕЙЧАС?

Я могу:

1. ✅ Настроить Git remotes для всех проектов
2. ✅ Создать navigation.config.ts с динамическим управлением продуктами
3. ✅ Настроить Cloudflare Tunnel (если есть домен)
4. ✅ Обновить SSO конфигурацию
5. ✅ Создать скрипт для автоматического sync

**Что выбираете?** 🚀

