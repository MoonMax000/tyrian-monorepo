# 🚀 NGROK НАСТРОЙКА - ИНСТРУКЦИИ

## ❓ МНЕ НУЖНО ОТ ВАС:

### 1. **Ngrok Authtoken**

Зайдите на: https://dashboard.ngrok.com/get-started/your-authtoken

Скопируйте ваш authtoken и дайте мне его.

---

### 2. **Ngrok Reserved Domain (Опционально)**

У вас есть два варианта:

#### **Вариант A: У ВАС УЖЕ ЕСТЬ Reserved Domain**
- Зайдите на: https://dashboard.ngrok.com/domains
- Скопируйте ваш domain (например: `your-domain.ngrok.io`)
- Дайте мне его

#### **Вариант B: У ВАС НЕТ Reserved Domain**
- Я помогу создать его через команду `ngrok`
- Или вы можете создать на сайте: https://dashboard.ngrok.com/domains

---

### 3. **Тип подписки**

Какая у вас подписка?
- Free ($0) - 1 tunnel, без reserved domain
- **Personal ($20/мес)** - 3 reserved domains
- Pro ($40/мес) - 10 reserved domains

---

## 💡 РЕКОМЕНДАЦИЯ ДЛЯ $20/МЕС:

Для вашего случая (8 продуктов) с подпиской $20/мес, мы будем использовать:

### **ЕДИНЫЙ Reserved Domain + Nginx Reverse Proxy**

```
1 Reserved Domain: your-domain.ngrok.io
          ↓
    Nginx на порту 8080
          ↓
├── auth.your-domain.ngrok.io    → localhost:8001
├── marketplace.your-domain.ngrok.io → localhost:3000
├── social.your-domain.ngrok.io  → localhost:3001
├── stocks.your-domain.ngrok.io  → localhost:3003
├── crypto.your-domain.ngrok.io  → localhost:3002
├── stream.your-domain.ngrok.io  → localhost:3004
├── ai.your-domain.ngrok.io      → localhost:3006
└── portfolios.your-domain.ngrok.io → localhost:5173
```

**Преимущества:**
- ✅ Только 1 reserved domain нужен
- ✅ Работает на любом плане
- ✅ Легко масштабировать

---

## 🔧 ЧТО Я СДЕЛАЮ ДАЛЬШЕ:

1. Настрою Ngrok с вашим authtoken
2. Создам/использую reserved domain
3. Настрою Nginx reverse proxy
4. Настрою все продукты для работы с поддоменами
5. Настрою SSO для единого домена

---

## ⏱️ ЗАЙМЕТ: ~30 МИНУТ

---

**НАПИШИТЕ МНЕ:**

1. Ваш Ngrok authtoken (из https://dashboard.ngrok.com/get-started/your-authtoken)
2. Ваш reserved domain (если есть) или "нет" (я помогу создать)
3. Тип подписки (Free/Personal/Pro)

