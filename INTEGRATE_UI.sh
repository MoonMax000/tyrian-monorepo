#!/bin/bash

# Скрипт для интеграции UI компонентов из nav_sitbar_razmetka
# в Tyrian Trade Monorepo

set -e

MONOREPO_DIR="/Users/devidanderson/Downloads/Резерв ГитХаб/3 октября axa времянка 2/tyrian-monorepo"
SOURCE_REPO="https://github.com/MoonMax000/nav_sitbar_razmetka.git"
TEMP_DIR="/tmp/nav_sitbar_razmetka"

echo "════════════════════════════════════════════════════════════════"
echo "🎨 ИНТЕГРАЦИЯ UI ИЗ nav_sitbar_razmetka"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Шаг 1: Клонировать исходный репозиторий
echo "📦 Шаг 1: Клонирование nav_sitbar_razmetka..."
if [ -d "$TEMP_DIR" ]; then
  echo "   Репозиторий уже существует, удаляю старую версию..."
  rm -rf "$TEMP_DIR"
fi

git clone "$SOURCE_REPO" "$TEMP_DIR"
echo "   ✅ Клонирование завершено"
echo ""

# Шаг 2: Создать структуру папок
echo "📁 Шаг 2: Создание структуры папок в shared library..."
cd "$MONOREPO_DIR"

mkdir -p libs/shared/ui/src/lib/components/layout
mkdir -p libs/shared/ui/src/lib/components/dashboard
mkdir -p libs/shared/ui/src/lib/components/profile
mkdir -p libs/shared/ui/src/lib/components/ui

echo "   ✅ Папки созданы"
echo ""

# Шаг 3: Копировать Layout компоненты
echo "🎨 Шаг 3: Копирование Layout компонентов..."

if [ -f "$TEMP_DIR/client/components/ui/Navbar/NewNavBar.tsx" ]; then
  cp "$TEMP_DIR/client/components/ui/Navbar/NewNavBar.tsx" \
     "libs/shared/ui/src/lib/components/layout/"
  echo "   ✅ NewNavBar.tsx скопирован"
fi

if [ -f "$TEMP_DIR/client/components/ui/Navbar/constants.tsx" ]; then
  cp "$TEMP_DIR/client/components/ui/Navbar/constants.tsx" \
     "libs/shared/ui/src/lib/components/layout/navbar-constants.tsx"
  echo "   ✅ navbar-constants.tsx скопирован"
fi

if [ -f "$TEMP_DIR/client/components/ui/Navbar/icons.tsx" ]; then
  cp "$TEMP_DIR/client/components/ui/Navbar/icons.tsx" \
     "libs/shared/ui/src/lib/components/layout/navbar-icons.tsx"
  echo "   ✅ navbar-icons.tsx скопирован"
fi

if [ -f "$TEMP_DIR/client/components/ui/Header/Header.tsx" ]; then
  cp "$TEMP_DIR/client/components/ui/Header/Header.tsx" \
     "libs/shared/ui/src/lib/components/layout/NewHeader.tsx"
  echo "   ✅ NewHeader.tsx скопирован"
fi

if [ -f "$TEMP_DIR/client/components/ClientLayout/ClientLayout.tsx" ]; then
  cp "$TEMP_DIR/client/components/ClientLayout/ClientLayout.tsx" \
     "libs/shared/ui/src/lib/components/layout/"
  echo "   ✅ ClientLayout.tsx скопирован"
fi

echo ""

# Шаг 4: Копировать Dashboard компоненты
echo "📊 Шаг 4: Копирование Dashboard компонентов..."

for file in StatCard AreaChartCard ActivityFeed RecentTable; do
  if [ -f "$TEMP_DIR/client/components/dashboard/${file}.tsx" ]; then
    cp "$TEMP_DIR/client/components/dashboard/${file}.tsx" \
       "libs/shared/ui/src/lib/components/dashboard/"
    echo "   ✅ ${file}.tsx скопирован"
  fi
done

echo ""

# Шаг 5: Копировать Profile компоненты
echo "👤 Шаг 5: Копирование Profile компонентов..."

if [ -f "$TEMP_DIR/client/components/UserHeader/UserHeader.tsx" ]; then
  cp "$TEMP_DIR/client/components/UserHeader/UserHeader.tsx" \
     "libs/shared/ui/src/lib/components/profile/"
  echo "   ✅ UserHeader.tsx скопирован"
fi

if [ -f "$TEMP_DIR/client/components/UserTabs/index.tsx" ]; then
  cp "$TEMP_DIR/client/components/UserTabs/index.tsx" \
     "libs/shared/ui/src/lib/components/profile/UserTabs.tsx"
  echo "   ✅ UserTabs.tsx скопирован"
fi

echo ""

# Шаг 6: Копировать UI компоненты (shadcn/ui style)
echo "🎨 Шаг 6: Копирование UI компонентов (shadcn/ui)..."

cd "$TEMP_DIR/client/components/ui"
for file in *.tsx; do
  if [ -f "$file" ] && [ "$file" != "Header.tsx" ] && [ "$file" != "RightMenu.tsx" ]; then
    cp "$file" "$MONOREPO_DIR/libs/shared/ui/src/lib/components/ui/"
    echo "   ✅ $file скопирован"
  fi
done

cd "$MONOREPO_DIR"
echo ""

# Шаг 7: Копировать стили
echo "🎨 Шаг 7: Копирование стилей..."

if [ -f "$TEMP_DIR/client/global.css" ]; then
  # Создаем бэкап текущего файла
  if [ -f "libs/shared/ui/src/index.css" ]; then
    cp "libs/shared/ui/src/index.css" "libs/shared/ui/src/index.css.backup"
    echo "   📦 Создан бэкап index.css"
  fi
  
  # Копируем новый файл
  cp "$TEMP_DIR/client/global.css" "libs/shared/ui/src/global.css"
  echo "   ✅ global.css скопирован"
  echo "   ⚠️  Проверь и объедини стили в index.css"
fi

echo ""

# Шаг 8: Сводка
echo "════════════════════════════════════════════════════════════════"
echo "✅ КОПИРОВАНИЕ ЗАВЕРШЕНО!"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📂 Скопированные компоненты:"
echo "   • Layout:    $(ls -1 libs/shared/ui/src/lib/components/layout/ 2>/dev/null | wc -l) файлов"
echo "   • Dashboard: $(ls -1 libs/shared/ui/src/lib/components/dashboard/ 2>/dev/null | wc -l) файлов"
echo "   • Profile:   $(ls -1 libs/shared/ui/src/lib/components/profile/ 2>/dev/null | wc -l) файлов"
echo "   • UI:        $(ls -1 libs/shared/ui/src/lib/components/ui/ 2>/dev/null | wc -l) файлов"
echo ""
echo "⚠️  СЛЕДУЮЩИЕ ШАГИ:"
echo ""
echo "1. 📝 Добавить 'use client' директиву к интерактивным компонентам"
echo "2. 🔄 Заменить React Router на Next.js navigation"
echo "3. 📦 Обновить импорты с '@/' на '@tyrian/ui'"
echo "4. 📤 Экспортировать компоненты в libs/shared/ui/src/index.ts"
echo "5. 🎨 Настроить TailwindCSS"
echo "6. 📦 Установить зависимости:"
echo "   npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog \\"
echo "   @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-dropdown-menu \\"
echo "   @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-separator \\"
echo "   @radix-ui/react-tabs recharts tailwindcss-animate"
echo ""
echo "📖 Полную инструкцию смотри в docs/UI_INTEGRATION_PLAN.md"
echo ""
echo "🗑️  Временная папка: $TEMP_DIR"
echo "   Можешь удалить после проверки: rm -rf $TEMP_DIR"
echo ""
echo "════════════════════════════════════════════════════════════════"

