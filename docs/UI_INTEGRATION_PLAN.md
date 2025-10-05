# 🎨 План интеграции UI из nav_sitbar_razmetka

**Источник:** https://github.com/MoonMax000/nav_sitbar_razmetka  
**Цель:** Интегрировать левое меню, верхний navbar и страницы в Tyrian Trade Monorepo

---

## 🎯 Что нужно взять

### ✅ Берем:
1. **Левое меню (Navbar)** - полностью 1 в 1
2. **Верхний Header** - полностью 1 в 1
3. **Страницы** (Dashboard, Profile, и т.д.)
4. **UI компоненты** (shadcn/ui style)

### ❌ НЕ берем:
- Правое меню (RightMenu) - оставляем как есть

---

## 📂 Куда класть компоненты

### Вариант 1: Shared Library (РЕКОМЕНДУЕТСЯ)

Поскольку у нас **монорепо с SSO** и **единый профиль для всех приложений**, лучше всего:

```
libs/shared/ui/src/lib/components/
├── layout/
│   ├── NewNavbar.tsx          # Левое меню из nav_sitbar_razmetka
│   ├── NewHeader.tsx          # Верхний header
│   └── ClientLayout.tsx       # Основной лейаут
│
├── dashboard/                 # Dashboard компоненты
│   ├── StatCard.tsx
│   ├── AreaChartCard.tsx
│   ├── ActivityFeed.tsx
│   └── RecentTable.tsx
│
├── profile/                   # Profile компоненты (ЕДИНЫЙ ПРОФИЛЬ!)
│   ├── UserHeader.tsx
│   ├── UserTabs.tsx
│   ├── ProfileOverview.tsx
│   ├── ProfileSettings.tsx
│   └── ProfileSecurity.tsx
│
└── ui/                        # Базовые UI компоненты (shadcn/ui style)
    ├── button.tsx
    ├── card.tsx
    ├── tabs.tsx
    ├── avatar.tsx
    └── ...
```

### Вариант 2: Отдельное Profile приложение (альтернатива)

Если профиль очень большой, можно создать отдельное микро-приложение:

```
apps/frontends/user-profile/   # Отдельное приложение для профиля
├── src/
│   ├── app/
│   │   ├── page.tsx           # /profile
│   │   ├── settings/page.tsx  # /profile/settings
│   │   └── security/page.tsx  # /profile/security
│   └── components/
│       └── ...
```

**НО:** Вариант 1 лучше, потому что:
- ✅ Проще поддерживать
- ✅ Меньше дублирования кода
- ✅ Профиль доступен на всех приложениях через `@tyrian/ui`

---

## 🔄 Адаптация под Next.js

### Проблемы при переносе:

| Vite + React Router        | Next.js (App Router)        | Решение                    |
|---------------------------|----------------------------|---------------------------|
| `<Link to="/profile">`    | `<Link href="/profile">`   | Заменить импорт из `next/link` |
| `useNavigate()`           | `useRouter()` + `router.push()` | Использовать `next/navigation` |
| `<BrowserRouter>`         | Не нужен                   | Next.js роутинг встроен |
| Client-side only          | Нужно `'use client'`       | Добавить директиву |
| CSS Modules / TailwindCSS | TailwindCSS                | Без изменений ✅ |

---

## 📦 Необходимые зависимости

### Radix UI компоненты (для shadcn/ui):

Добавить в `tyrian-monorepo/package.json`:

```json
{
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-popover": "^1.1.4",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.2",
    "recharts": "^2.15.0",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

---

## 🚀 Пошаговая инструкция

### Шаг 1: Клонировать исходный репозиторий

```bash
cd /tmp
git clone https://github.com/MoonMax000/nav_sitbar_razmetka.git
cd nav_sitbar_razmetka
```

### Шаг 2: Скопировать UI компоненты в shared library

```bash
# Переходим в монорепо
cd "/Users/devidanderson/Downloads/Резерв ГитХаб/3 октября axa времянка 2/tyrian-monorepo"

# Создаем папки
mkdir -p libs/shared/ui/src/lib/components/layout
mkdir -p libs/shared/ui/src/lib/components/dashboard
mkdir -p libs/shared/ui/src/lib/components/profile
mkdir -p libs/shared/ui/src/lib/components/ui

# Копируем компоненты (из /tmp/nav_sitbar_razmetka)
```

#### Список файлов для копирования:

**Layout компоненты:**
```bash
cp /tmp/nav_sitbar_razmetka/client/components/ui/Navbar/NewNavBar.tsx \
   libs/shared/ui/src/lib/components/layout/

cp /tmp/nav_sitbar_razmetka/client/components/ui/Navbar/constants.tsx \
   libs/shared/ui/src/lib/components/layout/navbar-constants.tsx

cp /tmp/nav_sitbar_razmetka/client/components/ui/Navbar/icons.tsx \
   libs/shared/ui/src/lib/components/layout/navbar-icons.tsx

cp /tmp/nav_sitbar_razmetka/client/components/ui/Header/Header.tsx \
   libs/shared/ui/src/lib/components/layout/NewHeader.tsx
```

**Dashboard компоненты:**
```bash
cp /tmp/nav_sitbar_razmetka/client/components/dashboard/StatCard.tsx \
   libs/shared/ui/src/lib/components/dashboard/

cp /tmp/nav_sitbar_razmetka/client/components/dashboard/AreaChartCard.tsx \
   libs/shared/ui/src/lib/components/dashboard/

cp /tmp/nav_sitbar_razmetka/client/components/dashboard/ActivityFeed.tsx \
   libs/shared/ui/src/lib/components/dashboard/

cp /tmp/nav_sitbar_razmetka/client/components/dashboard/RecentTable.tsx \
   libs/shared/ui/src/lib/components/dashboard/
```

**Profile компоненты:**
```bash
cp /tmp/nav_sitbar_razmetka/client/components/UserHeader/UserHeader.tsx \
   libs/shared/ui/src/lib/components/profile/

cp /tmp/nav_sitbar_razmetka/client/components/UserTabs/index.tsx \
   libs/shared/ui/src/lib/components/profile/UserTabs.tsx
```

**Базовые UI компоненты (shadcn/ui):**
```bash
# Копируем все файлы из client/components/ui/
cp /tmp/nav_sitbar_razmetka/client/components/ui/*.tsx \
   libs/shared/ui/src/lib/components/ui/
```

### Шаг 3: Адаптировать компоненты под Next.js

#### 3.1. Добавить `'use client'` директиву

Все компоненты, которые используют:
- `useState`, `useEffect`, `useContext`
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`window`, `document`)

Должны иметь `'use client'` в начале файла:

```typescript
'use client';

import React from 'react';
// ... остальные импорты
```

#### 3.2. Заменить React Router на Next.js

**Было (React Router):**
```typescript
import { Link, useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/profile');
```

**Стало (Next.js):**
```typescript
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/profile');
```

#### 3.3. Обновить импорты алиасов

**Было:**
```typescript
import { Button } from '@/components/ui/button';
```

**Стало:**
```typescript
import { Button } from '@tyrian/ui';
```

### Шаг 4: Обновить `libs/shared/ui/src/index.ts`

Экспортировать новые компоненты:

```typescript
// Layout
export * from './lib/components/layout/NewNavbar';
export * from './lib/components/layout/NewHeader';
export * from './lib/components/layout/ClientLayout';

// Dashboard
export * from './lib/components/dashboard/StatCard';
export * from './lib/components/dashboard/AreaChartCard';
export * from './lib/components/dashboard/ActivityFeed';
export * from './lib/components/dashboard/RecentTable';

// Profile
export * from './lib/components/profile/UserHeader';
export * from './lib/components/profile/UserTabs';

// UI Components (shadcn/ui)
export * from './lib/components/ui/button';
export * from './lib/components/ui/card';
export * from './lib/components/ui/tabs';
export * from './lib/components/ui/avatar';
// ... остальные компоненты
```

### Шаг 5: Настроить TailwindCSS

#### 5.1. Обновить `libs/shared/ui/tailwind.config.js`

Добавить цвета из nav_sitbar_razmetka:

```javascript
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0B0E11',
        primary: '#A06AFF',
        webGray: '#B0B0B0',
        green: '#2EBD85',
        red: '#FF6B6B',
        blue: '#4A90E2',
        // ... остальные цвета
      },
      fontFamily: {
        sans: ['Nunito Sans', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

#### 5.2. Добавить шрифт Nunito Sans

В `libs/shared/ui/src/index.css` (или global.css):

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 11 14 17; /* #0B0E11 */
    --primary: 160 106 255; /* #A06AFF */
    --radius: 0.5rem;
  }
  
  body {
    @apply bg-background text-white font-sans;
  }
}
```

### Шаг 6: Создать страницы профиля

#### Вариант A: В каждом Next.js приложении (РЕКОМЕНДУЕТСЯ)

Каждое приложение импортирует компоненты из `@tyrian/ui`:

**marketplace/src/app/profile/page.tsx:**
```typescript
import { UserHeader, UserTabs } from '@tyrian/ui';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <UserHeader />
      <UserTabs />
    </div>
  );
}
```

**Повторить для всех приложений:**
- `ai-assistant/src/app/profile/page.tsx`
- `live-streaming/src/app/profile/page.tsx`
- `cryptocurrency/src/app/profile/page.tsx`
- `social-network/src/app/profile/page.tsx`
- `stocks/src/app/profile/page.tsx`

#### Вариант B: Создать Dashboard страницу

**marketplace/src/app/dashboard/page.tsx:**
```typescript
import { 
  StatCard, 
  AreaChartCard, 
  ActivityFeed, 
  RecentTable 
} from '@tyrian/ui';

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Revenue" value="$12,345" change="+12.5%" />
        <StatCard title="Users" value="1,234" change="+5.2%" />
        {/* ... */}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <AreaChartCard />
        <ActivityFeed />
      </div>
      
      <RecentTable />
    </div>
  );
}
```

### Шаг 7: Обновить Layout

#### Заменить текущий Header на новый NewHeader

**marketplace/src/app/layout.tsx:**
```typescript
import { NewHeader, NewNavbar } from '@tyrian/ui';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen bg-background">
          <NewNavbar />
          
          <div className="flex-1 flex flex-col">
            <NewHeader />
            
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
```

### Шаг 8: Установить зависимости

```bash
cd tyrian-monorepo
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-tabs recharts tailwindcss-animate
```

### Шаг 9: Тестирование

```bash
# Запускаем Marketplace
npx nx serve marketplace --port 4205

# Проверяем:
# - Левое меню отображается ✅
# - Верхний header работает ✅
# - Dashboard рендерится ✅
# - Profile страница работает ✅
```

---

## 🎯 Где хранить страницы профиля (ВАЖНО!)

### РЕКОМЕНДАЦИЯ: Shared Components + Local Pages

**Компоненты профиля** → `libs/shared/ui/src/lib/components/profile/`
**Страницы профиля** → Каждое приложение создает свой `/profile` route

**Почему так:**
1. ✅ **SSO работает** - профиль единый для всех
2. ✅ **Переиспользование кода** - компоненты в shared library
3. ✅ **Гибкость** - каждое приложение может кастомизировать layout
4. ✅ **SEO** - каждое приложение контролирует свои мета-теги

**Структура:**
```
libs/shared/ui/src/lib/components/profile/
├── UserHeader.tsx          # Шапка профиля
├── UserTabs.tsx            # Табы (Overview, Settings, Security)
├── ProfileOverview.tsx     # Вкладка "Overview"
├── ProfileSettings.tsx     # Вкладка "Settings"
└── ProfileSecurity.tsx     # Вкладка "Security"

marketplace/src/app/profile/
└── page.tsx                # Импортирует компоненты из @tyrian/ui

ai-assistant/src/app/profile/
└── page.tsx                # Тоже импортирует из @tyrian/ui

# И так далее для всех приложений...
```

**Пример `marketplace/src/app/profile/page.tsx`:**
```typescript
'use client';

import { 
  UserHeader, 
  UserTabs, 
  ProfileOverview, 
  ProfileSettings, 
  ProfileSecurity 
} from '@tyrian/ui';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <UserHeader />
      <UserTabs>
        <ProfileOverview />
        <ProfileSettings />
        <ProfileSecurity />
      </UserTabs>
    </div>
  );
}
```

---

## ⚠️ Важные замечания

### 1. Server Components vs Client Components

Next.js по умолчанию использует Server Components. Но большинство компонентов из nav_sitbar_razmetka требуют `'use client'`:

```typescript
'use client';

import React, { useState } from 'react';
// Компонент с интерактивностью
```

### 2. Динамические импорты для тяжелых компонентов

Если компонент большой (например, с Recharts):

```typescript
import dynamic from 'next/dynamic';

const AreaChartCard = dynamic(
  () => import('@tyrian/ui').then(mod => mod.AreaChartCard),
  { ssr: false }
);
```

### 3. Обработка изображений

**Было (Vite):**
```typescript
<img src="/icons/logo.svg" />
```

**Стало (Next.js):**
```typescript
import Image from 'next/image';

<Image src="/icons/logo.svg" width={32} height={32} alt="Logo" />
```

### 4. CSS Variables

Убедись что CSS переменные определены в global.css каждого приложения:

```css
:root {
  --background: 11 14 17;
  --primary: 160 106 255;
  --radius: 0.5rem;
}
```

---

## 📊 Чек-лист интеграции

- [ ] Склонировать nav_sitbar_razmetka
- [ ] Создать папки в `libs/shared/ui/src/lib/components/`
- [ ] Скопировать компоненты (layout, dashboard, profile, ui)
- [ ] Добавить `'use client'` ко всем интерактивным компонентам
- [ ] Заменить React Router на Next.js navigation
- [ ] Обновить импорты с `@/` на `@tyrian/ui`
- [ ] Экспортировать компоненты в `libs/shared/ui/src/index.ts`
- [ ] Настроить TailwindCSS в shared library
- [ ] Установить Radix UI зависимости
- [ ] Создать `/profile` pages в каждом приложении
- [ ] Создать `/dashboard` pages (опционально)
- [ ] Обновить Layout в приложениях (NewHeader + NewNavbar)
- [ ] Протестировать на одном приложении (Marketplace)
- [ ] Распространить на остальные приложения
- [ ] Обновить документацию

---

## 🚀 Следующие шаги

1. Сначала интегрируй в **одно приложение** (например, Marketplace)
2. Протестируй все компоненты
3. Исправь баги и адаптации
4. Затем распространи на остальные приложения

---

**Дата создания:** 5 октября 2025  
**Статус:** План готов к исполнению  
**Приоритет:** Высокий

