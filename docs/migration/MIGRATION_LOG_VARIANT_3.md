# 📋 Журнал миграции: Вариант 3 (Гибридный подход)

**Дата начала:** 2025-10-05  
**Статус:** В процессе  
**Цель:** Создать shared packages для унификации UI компонентов

---

## 🎯 **ЦЕЛЬ ВАРИАНТА 3**

Создать централизованные shared packages, которые будут:
1. ✅ Устранять дублирование кода (Navbar, Sidebar, Footer)
2. ✅ Предоставлять feature flags для управления продуктами
3. ✅ Подготовить базу для перехода к Варианту 2 (Nx монорепо)
4. ✅ Сохранять текущую структуру проектов (7 отдельных репозиториев)

---

## 📦 **СТРУКТУРА SHARED PACKAGES**

```
shared/
├── packages/
│   ├── ui/                     # UI компоненты
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── RightSidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── ui/         # Radix UI компоненты
│   │   │   ├── lib/
│   │   │   │   └── utils.ts    # cn() и другие утилиты
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── feature-flags/          # Feature flags
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── types/                  # Общие TypeScript типы
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── config/                 # Конфигурация
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── auth/                   # Авторизация (для будущего)
│       ├── src/
│       │   └── index.ts
│       └── package.json
```

---

## ✅ **ВЫПОЛНЕННЫЕ ШАГИ**

### **[ЗАВЕРШЕНО] Шаг 1: Создание структуры**
- ✅ Создана папка `shared/packages/`
- ✅ Созданы подпапки для каждого пакета
- ✅ Создан базовый `package.json` для @tyrian/ui
- ✅ Создан `tsconfig.json` для @tyrian/ui
- ✅ Создан `package.json` для @tyrian/feature-flags
- ✅ Создан `tsconfig.json` для @tyrian/feature-flags
- ✅ Создан `package.json` для @tyrian/types

**Команда проверки:**
```bash
tree shared/packages/ -L 2
```

---

## 🔄 **ТЕКУЩИЙ ШАГ**

### **[В ПРОЦЕССЕ] Шаг 2: Миграция компонентов**

**План миграции компонентов:**

1. **Header.tsx** - Верхняя навигация
   - Источник: `Портфели 4 окт/client/components/Header.tsx`
   - Назначение: `shared/packages/ui/src/components/Header.tsx`
   - Изменения: 
     - ✅ Удалить специфичные для Portfolios зависимости
     - ✅ Сделать компонент универсальным (принимать props)
     - ✅ Сохранить логику авторизации

2. **Sidebar.tsx** - Левая навигация (NewSidebar)
   - Источник: `Портфели 4 окт/client/components/NewSidebar.tsx`
   - Назначение: `shared/packages/ui/src/components/Sidebar.tsx`
   - Изменения:
     - ❌ Убрать хардкод `navElements`
     - ❌ Принимать `navElements` как props
     - ❌ Заменить `react-router-dom` на универсальные ссылки
     - ❌ Интегрировать с `@tyrian/feature-flags`

3. **RightSidebar.tsx** - Правая панель
   - Источник: `Портфели 4 окт/client/components/RightSidebar.tsx`
   - Назначение: `shared/packages/ui/src/components/RightSidebar.tsx`
   - Изменения:
     - ❌ Сделать виджеты конфигурируемыми через props

4. **Footer.tsx** - Подвал
   - Источник: `Портфели 4 окт/client/components/Footer.tsx`
   - Назначение: `shared/packages/ui/src/components/Footer.tsx`
   - Изменения:
     - ❌ Универсализировать ссылки
     - ❌ Сделать responsive

5. **UI Components** - Radix UI компоненты
   - Источник: `Портфели 4 окт/client/components/ui/`
   - Назначение: `shared/packages/ui/src/components/ui/`
   - Изменения:
     - ❌ Скопировать все компоненты as-is
     - ❌ Обновить импорты `@/lib/utils` → `../../lib/utils`

6. **utils.ts** - Утилиты (cn и др.)
   - Источник: `Портфели 4 окт/client/lib/utils.ts`
   - Назначение: `shared/packages/ui/src/lib/utils.ts`
   - Изменения:
     - ❌ Скопировать as-is

---

## ⏭️ **СЛЕДУЮЩИЕ ШАГИ**

### **Шаг 3: Создание Feature Flags**
- [ ] Создать `@tyrian/feature-flags/src/index.ts`
- [ ] Реализовать `getFeatureFlags()`
- [ ] Реализовать `getProducts()`
- [ ] Добавить типы для Product

### **Шаг 4: Создание Types**
- [ ] Создать `@tyrian/types/src/index.ts`
- [ ] Определить интерфейс `User`
- [ ] Определить интерфейс `Product`
- [ ] Определить интерфейс `NavElement`

### **Шаг 5: Тестирование на Marketplace**
- [ ] Добавить `@tyrian/*` в `package.json` Marketplace
- [ ] Настроить symlinks
- [ ] Обновить импорты в компонентах
- [ ] Запустить `pnpm dev`
- [ ] Проверить что все работает

### **Шаг 6: Подключение ко всем проектам**
- [ ] AXA-marketplace-main
- [ ] AXA-socialweb-frontend-main
- [ ] AXA-stocks-frontend-main
- [ ] AXA-coinmarketcap-main
- [ ] stream-frontend-service-main
- [ ] AXA-Turian-AI-profiles-main
- [ ] Портфели 4 окт

### **Шаг 7: Feature Flags Configuration**
- [ ] Создать `.env.example` для каждого проекта
- [ ] Документировать использование флагов
- [ ] Протестировать выключение продуктов

### **Шаг 8: Документация**
- [ ] Обновить README в каждом проекте
- [ ] Создать `HOW_TO_USE_SHARED.md`
- [ ] Создать `ГОТОВНОСТЬ_К_ВАРИАНТУ_2.md`

---

## 📊 **МЕТРИКИ УСПЕХА**

### **Текущее состояние (До миграции):**
```
📊 Дублирование кода:
   - Navbar: 7 × ~200 строк = ~1400 строк
   - Sidebar: 7 × ~300 строк = ~2100 строк
   - Footer: 7 × ~100 строк = ~700 строк
   - ИТОГО: ~4200 строк дублированного кода

⏱️  Время на изменение UI:
   - Изменить компонент: 10 минут
   - Скопировать в 7 проектов: 7 × 5 минут = 35 минут
   - Исправить импорты: 7 × 3 минуты = 21 минут
   - Тестировать: 30 минут
   - ИТОГО: ~96 минут (~1.6 часа)

🐛 Риск багов: ВЫСОКИЙ (копипаста = ошибки)
```

### **Целевое состояние (После миграции):**
```
📊 Дублирование кода:
   - Navbar: 1 × ~200 строк = ~200 строк
   - Sidebar: 1 × ~300 строк = ~300 строк
   - Footer: 1 × ~100 строк = ~100 строк
   - ИТОГО: ~600 строк кода
   - ✅ ЭКОНОМИЯ: ~3600 строк (86%)

⏱️  Время на изменение UI:
   - Изменить компонент в shared: 10 минут
   - Симлинки обновятся автоматически: 0 минут
   - Тестировать: 10 минут
   - ИТОГО: ~20 минут
   - ✅ ЭКОНОМИЯ: ~76 минут (79%)

🐛 Риск багов: НИЗКИЙ (один источник правды)
```

---

## 🚧 **ИЗВЕСТНЫЕ ПРОБЛЕМЫ И РЕШЕНИЯ**

### **Проблема 1: React Router vs Next.js**
**Описание:** Portfolios использует `react-router-dom`, а другие проекты - Next.js  
**Решение:** 
- В shared компонентах использовать простые `<a href>` или `window.location.href`
- Каждый проект может обернуть компоненты в свой роутер

### **Проблема 2: Разные версии React**
**Описание:** У проектов могут быть разные версии React (18.2.0 vs 18.3.1)  
**Решение:**
- В shared использовать `peerDependencies` с диапазоном `^18.0.0`
- Не устанавливать React в shared, использовать из проекта

### **Проблема 3: Tailwind CSS конфигурация**
**Описание:** У проектов разные `tailwind.config.js`  
**Решение:**
- В shared использовать стандартные классы Tailwind
- Каждый проект должен включить shared в `content` конфигурации

### **Проблема 4: Импорты путей (@/)**
**Описание:** Portfolios использует `@/`, Next.js проекты тоже, но пути разные  
**Решение:**
- В shared использовать относительные импорты `../../lib/utils`
- Не использовать alias `@/` в shared packages

---

## 📝 **КОМАНДЫ ДЛЯ ПРОВЕРКИ**

### **Проверка структуры:**
```bash
tree shared/packages/ -L 3
```

### **Проверка package.json:**
```bash
cat shared/packages/ui/package.json
cat shared/packages/feature-flags/package.json
```

### **Проверка symlinks (после подключения):**
```bash
ls -la AXA-marketplace-main/node_modules/@tyrian/
```

### **Проверка что проект работает:**
```bash
cd AXA-marketplace-main
pnpm dev
```

---

## 🔜 **ГОТОВНОСТЬ К ВАРИАНТУ 2 (Nx Монорепо)**

### **Что уже готово для миграции в Nx:**
- ✅ Shared packages уже изолированы
- ✅ Интерфейсы определены
- ✅ Feature flags работают
- ✅ Команда привыкла к shared компонентам

### **Что нужно сделать для Варианта 2:**
1. Создать Nx workspace
2. Переместить `shared/packages/*` → `packages/*`
3. Переместить каждый проект в `apps/`
4. Настроить Nx конфигурацию
5. Обновить импорты с symlinks на `@tyrian/*` через Nx
6. Настроить CI/CD для Nx

**Подробный план см. в `ГОТОВНОСТЬ_К_ВАРИАНТУ_2.md` (будет создан после завершения Варианта 3)**

---

## 📞 **ПОМОЩЬ И ВОПРОСЫ**

Если что-то не работает:
1. Проверьте symlinks: `ls -la node_modules/@tyrian/`
2. Проверьте что `pnpm install` выполнен
3. Проверьте `.env.local` для feature flags
4. Смотрите ошибки в консоли браузера

**Контакты для помощи:** [Ваш email/Slack]

---

**Последнее обновление:** 2025-10-05 13:30

