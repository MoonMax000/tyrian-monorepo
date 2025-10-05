# 🔄 План замены старых компонентов на shared

**Дата:** 2025-10-05  
**Задача:** Заменить все старые Header/Footer компоненты на `@tyrian/ui`

---

## 📊 **НАЙДЕНО КОМПОНЕНТОВ:**

### **Header компоненты (~15 файлов):**
```
1. AXA-marketplace-main/src/components/Header/
2. AXA-socialweb-frontend-main/src/components/HeaderNew.tsx
3. AXA-stocks-frontend-main/src/components/HeaderNew.tsx
4. AXA-coinmarketcap-main/src/components/HeaderNew.tsx
5. stream-frontend-service-main/src/components/Header/
6. AXA-Turian-AI-profiles-main/src/components/(ui/Header, DashBoardHeader, UserHeader)
7. Портфели 4 окт/client/components/Header.tsx
```

### **Footer компоненты (~8 файлов):**
```
1. AXA-marketplace-main/src/components/Layout/Footer.tsx
2. AXA-socialweb-frontend-main/src/components/Footer.tsx
3. AXA-stocks-frontend-main/src/components/Layout/Footer.tsx
4. AXA-coinmarketcap-main/src/components/Layout/Footer.tsx
5. stream-frontend-service-main/src/components/Footer/
6. AXA-Turian-AI-profiles-main/src/components/ui/Footer/
7. Портфели 4 окт/client/components/Footer.tsx
```

---

## 🎯 **СТРАТЕГИЯ ЗАМЕНЫ:**

### **Подход A: Постепенная замена (РЕКОМЕНДУЮ)**

**Преимущества:**
- ✅ Безопасно - можем тестировать каждый проект отдельно
- ✅ Можем откатиться если что-то сломается
- ✅ Легче найти и исправить ошибки

**План:**
1. **Marketplace** (самый простой) → 30 минут
2. **Social Network** → 1 час
3. **Stocks** → 1 час
4. **Cryptocurrency** → 1 час
5. **Live Streaming** → 1 час
6. **AI Assistant** → 1.5 часа (есть несколько Header)
7. **Portfolios** → 30 минут

**ИТОГО:** ~7 часов работы

---

### **Подход B: Массовая замена**

**Преимущества:**
- ✅ Быстрее - всё сразу
- ✅ Меньше коммитов

**Недостатки:**
- ❌ Рискованно - если что-то сломается, сломается везде
- ❌ Сложнее дебажить

**Не рекомендую для первой замены!**

---

## 📝 **ДЕТАЛЬНЫЙ ПЛАН ПО ПРОЕКТАМ:**

### **1. MARKETPLACE (30 минут)**

**Текущее состояние:**
- `src/components/Header/index.tsx` - старый Header
- `src/components/Layout/Footer.tsx` - старый Footer
- Используются в `ClientLayout.tsx`

**Что делать:**
1. ✅ Открыть `src/app/ClientLayout.tsx`
2. ✅ Заменить:
   ```typescript
   // Было:
   import Header from '@/components/Header';
   import Footer from '@/components/Layout/Footer';
   
   // Стало:
   import { Header, Footer } from '@tyrian/ui';
   ```
3. ✅ Убрать `onMenuClick` prop (если shared Header его не поддерживает)
4. ✅ Протестировать: `npm run dev`
5. ✅ Удалить старые файлы:
   - `rm -rf src/components/Header`
   - `rm src/components/Layout/Footer.tsx`

**Проверка:**
- [ ] Header рендерится
- [ ] Footer рендерится  
- [ ] Навигация работает
- [ ] Авторизация работает

---

### **2. SOCIAL NETWORK (1 час)**

**Текущее состояние:**
- `src/components/HeaderNew.tsx` - новый Header
- `src/components/Footer.tsx` - Footer

**Что делать:**
1. ✅ Найти где используется HeaderNew:
   ```bash
   grep -r "HeaderNew" src/
   ```
2. ✅ Заменить импорты везде
3. ✅ Обновить использование
4. ✅ Удалить старые файлы
5. ✅ Протестировать

---

### **3. STOCKS (1 час)**

**Текущее состояние:**
- `src/components/HeaderNew.tsx`
- `src/components/Layout/Header.tsx` (старый)
- `src/components/Layout/NewHeader.tsx`
- `src/components/Layout/Footer.tsx`

**Что делать:**
1. ✅ Определить какой Header используется сейчас
2. ✅ Заменить на `@tyrian/ui`
3. ✅ Удалить ВСЕ старые Header файлы
4. ✅ Протестировать

---

### **4. CRYPTOCURRENCY (1 час)**

**Текущее состояние:**
- `src/components/HeaderNew.tsx`
- `src/components/Layout/Header.tsx`
- `src/components/Layout/Footer.tsx`

**Что делать:**
1. ✅ Заменить импорты
2. ✅ Удалить старые файлы
3. ✅ Протестировать

---

### **5. LIVE STREAMING (1 час)**

**Текущее состояние:**
- `src/components/Header/Header.tsx`
- `src/components/Footer/Footer.tsx`
- `src/components/HeaderNew/` (если есть)

**Что делать:**
1. ✅ Найти использование
2. ✅ Заменить импорты
3. ✅ Удалить старые папки целиком
4. ✅ Протестировать

---

### **6. AI ASSISTANT (1.5 часа) - СЛОЖНЫЙ**

**Текущее состояние:**
- `src/components/ui/Header/Header.tsx`
- `src/components/DashBoardHeader/DashBoardHeader.tsx` (специальный!)
- `src/components/UserHeader/UserHeader.tsx` (специальный!)
- `src/components/ui/Footer/Footer.tsx`
- `src/components/HeaderNew/` (если есть)

**Что делать:**
1. ⚠️  **ВНИМАНИЕ:** DashBoardHeader и UserHeader - это специализированные Header!
2. ✅ Заменить только **общий** Header на `@tyrian/ui`
3. ✅ Оставить DashBoardHeader и UserHeader (они для внутренних страниц)
4. ✅ Заменить Footer
5. ✅ Протестировать ВСЕ страницы (Dashboard, Profile, и т.д.)

---

### **7. PORTFOLIOS (30 минут)**

**Текущее состояние:**
- `client/components/Header.tsx` - **ЭТО ИСТОЧНИК SHARED HEADER!**
- `client/components/Footer.tsx`

**Что делать:**
1. ⚠️  **ВНИМАНИЕ:** Это Vite проект (не Next.js)!
2. ✅ Заменить локальные компоненты на `@tyrian/ui`
3. ✅ Обновить импорты (проверить совместимость с Vite)
4. ✅ Протестировать

---

## 🔧 **АВТОМАТИЗАЦИЯ (СКРИПТЫ):**

### **Скрипт 1: Поиск использования старых компонентов**

```bash
#!/bin/bash
# find-old-components.sh

echo "🔍 Ищу использование старых Header..."
grep -r "import.*Header.*from.*'@/components" . --include="*.tsx" --include="*.ts" | grep -v node_modules

echo "🔍 Ищу использование старых Footer..."
grep -r "import.*Footer.*from.*'@/components" . --include="*.tsx" --include="*.ts" | grep -v node_modules
```

### **Скрипт 2: Массовая замена импортов**

```bash
#!/bin/bash
# replace-imports.sh

PROJECT=$1

echo "🔄 Заменяю импорты в $PROJECT..."

# Замена Header
find "$PROJECT/src" -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i.bak \
  "s|import Header from '@/components/Header'|import { Header } from '@tyrian/ui'|g" {} \;

find "$PROJECT/src" -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i.bak \
  "s|import HeaderNew from '@/components/HeaderNew'|import { Header } from '@tyrian/ui'|g" {} \;

# Замена Footer
find "$PROJECT/src" -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i.bak \
  "s|import Footer from '@/components/Layout/Footer'|import { Footer } from '@tyrian/ui'|g" {} \;

find "$PROJECT/src" -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i.bak \
  "s|import Footer from '@/components/Footer'|import { Footer } from '@tyrian/ui'|g" {} \;

# Удаление бэкапов
find "$PROJECT/src" -name "*.bak" -delete

echo "✅ Импорты заменены!"
```

---

## 🧪 **ЧЕКЛИСТ ТЕСТИРОВАНИЯ (ДЛЯ КАЖДОГО ПРОЕКТА):**

После замены в каждом проекте проверить:

- [ ] ✅ Проект запускается без ошибок (`npm run dev`)
- [ ] ✅ Header виден на всех страницах
- [ ] ✅ Footer виден на всех страницах
- [ ] ✅ Навигация работает
- [ ] ✅ Авторизация работает (Login/Logout кнопки)
- [ ] ✅ Мобильная версия работает
- [ ] ✅ Нет TypeScript ошибок (`npm run typecheck`)
- [ ] ✅ Нет lint ошибок

---

## 📊 **ОТСЛЕЖИВАНИЕ ПРОГРЕССА:**

| Проект | Header | Footer | Тестирование | Статус |
|--------|--------|--------|--------------|--------|
| Marketplace | ☐ | ☐ | ☐ | Не начато |
| Social Network | ☐ | ☐ | ☐ | Не начато |
| Stocks | ☐ | ☐ | ☐ | Не начато |
| Cryptocurrency | ☐ | ☐ | ☐ | Не начато |
| Live Streaming | ☐ | ☐ | ☐ | Не начато |
| AI Assistant | ☐ | ☐ | ☐ | Не начато |
| Portfolios | ☐ | ☐ | ☐ | Не начато |

---

## 🚨 **ВОЗМОЖНЫЕ ПРОБЛЕМЫ:**

### **Проблема 1: Разные пропсы**

**Причина:** Старые компоненты могут принимать пропсы, которых нет в shared.

**Решение:**
1. Проверить интерфейс shared компонента
2. Добавить недостающие пропсы в shared
3. Или убрать лишние пропсы из использования

### **Проблема 2: Разные стили**

**Причина:** Shared компонент может выглядеть иначе.

**Решение:**
1. Обновить стили в shared компоненте
2. Или добавить className prop для кастомизации

### **Проблема 3: Специализированные Header**

**Причина:** AI Assistant имеет DashBoardHeader, UserHeader.

**Решение:**
- НЕ заменять специализированные Header!
- Заменить только общий Header

### **Проблема 4: Vite vs Next.js**

**Причина:** Portfolios использует Vite, остальные - Next.js.

**Решение:**
- Проверить что shared компонент работает в обоих
- Использовать `window.location.href` вместо Next.js Router

---

## 💡 **РЕКОМЕНДАЦИИ:**

1. **Начните с Marketplace** - самый простой проект
2. **Делайте по одному проекту** - легче дебажить
3. **Коммитьте после каждого проекта** - можно откатиться
4. **Тестируйте ВСЕ функции** - особенно авторизацию
5. **Создавайте бэкапы** - `git branch backup-before-replacement`

---

## 🎯 **ФИНАЛЬНАЯ ПРОВЕРКА (ПОСЛЕ ВСЕХ ЗАМЕН):**

- [ ] Все 7 проектов запускаются
- [ ] Header/Footer везде одинаковые
- [ ] Изменение в shared → изменение везде
- [ ] SSO работает
- [ ] Нет дублирования кода
- [ ] Документация обновлена

---

**Готов начать? Скажите "Начинаем с Marketplace"!** 🚀

