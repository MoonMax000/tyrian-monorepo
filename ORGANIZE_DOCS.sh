#!/bin/bash

# Скрипт для организации документации Tyrian Trade
# Переносит файлы из корня в структурированные папки

ROOT_DIR="/Users/devidanderson/Downloads/Резерв ГитХаб/3 октября axa времянка 2"
MONOREPO_DIR="$ROOT_DIR/tyrian-monorepo"

echo "════════════════════════════════════════"
echo "📂 ОРГАНИЗАЦИЯ ДОКУМЕНТАЦИИ"
echo "════════════════════════════════════════"
echo ""

# Создаем структуру папок
mkdir -p "$MONOREPO_DIR/docs/migration"
mkdir -p "$MONOREPO_DIR/docs/setup"
mkdir -p "$MONOREPO_DIR/docs/troubleshooting"
mkdir -p "$MONOREPO_DIR/docs/architecture"
mkdir -p "$MONOREPO_DIR/docs/completed"
mkdir -p "$MONOREPO_DIR/docs/archive"

echo "✅ Папки созданы"
echo ""

# MIGRATION - Документы по миграции в Nx
echo "📦 Копирую документы миграции..."
cp "$ROOT_DIR/NX_MIGRATION_PLAN.md" "$MONOREPO_DIR/docs/migration/" 2>/dev/null
cp "$ROOT_DIR/NX_MIGRATION_SUMMARY.md" "$MONOREPO_DIR/docs/migration/" 2>/dev/null
cp "$ROOT_DIR/MIGRATION_LOG_VARIANT_3.md" "$MONOREPO_DIR/docs/migration/" 2>/dev/null
cp "$ROOT_DIR/MIGRATION_STATUS.md" "$MONOREPO_DIR/docs/migration/" 2>/dev/null
cp "$ROOT_DIR/AI_ASSISTANT_MIGRATED.md" "$MONOREPO_DIR/docs/migration/" 2>/dev/null
cp "$ROOT_DIR/LIVE_STREAMING_MIGRATED.md" "$MONOREPO_DIR/docs/migration/" 2>/dev/null
cp "$ROOT_DIR/PROGRESS_PHASE_1.md" "$MONOREPO_DIR/docs/migration/" 2>/dev/null

# SETUP - Инструкции по настройке
echo "⚙️  Копирую документы настройки..."
cp "$ROOT_DIR/PLATFORM_SETUP.md" "$MONOREPO_DIR/docs/setup/" 2>/dev/null
cp "$ROOT_DIR/QUICK_START.md" "$MONOREPO_DIR/docs/setup/" 2>/dev/null
cp "$ROOT_DIR/SETUP_COMPLETE.md" "$MONOREPO_DIR/docs/setup/" 2>/dev/null
cp "$ROOT_DIR/SETUP_TYRIANTRADE_NGROK.md" "$MONOREPO_DIR/docs/setup/" 2>/dev/null
cp "$ROOT_DIR/FULL_SETUP_SSO_GOOGLE.md" "$MONOREPO_DIR/docs/setup/" 2>/dev/null
cp "$ROOT_DIR/GOOGLE_OAUTH_SETUP.md" "$MONOREPO_DIR/docs/setup/" 2>/dev/null
cp "$ROOT_DIR/GOOGLE_OAUTH_COMPLETE.md" "$MONOREPO_DIR/docs/setup/" 2>/dev/null
cp "$ROOT_DIR/NGROK_SETUP.md" "$MONOREPO_DIR/docs/setup/" 2>/dev/null
cp "$ROOT_DIR/NGROK_SETUP_INSTRUCTIONS.md" "$MONOREPO_DIR/docs/setup/" 2>/dev/null
cp "$ROOT_DIR/NGROK_PRO_SETUP.md" "$MONOREPO_DIR/docs/setup/" 2>/dev/null

# TROUBLESHOOTING - Решение проблем
echo "🔧 Копирую документы по troubleshooting..."
cp "$ROOT_DIR/LOGIN_FIX.md" "$MONOREPO_DIR/docs/troubleshooting/" 2>/dev/null
cp "$ROOT_DIR/SSO_FIX.md" "$MONOREPO_DIR/docs/troubleshooting/" 2>/dev/null
cp "$ROOT_DIR/URL_FIX.md" "$MONOREPO_DIR/docs/troubleshooting/" 2>/dev/null
cp "$ROOT_DIR/HYDRATION_FIX.md" "$MONOREPO_DIR/docs/troubleshooting/" 2>/dev/null
cp "$ROOT_DIR/CACHE_FIX_INSTRUCTIONS.md" "$MONOREPO_DIR/docs/troubleshooting/" 2>/dev/null
cp "$ROOT_DIR/FIXES_SUMMARY.md" "$MONOREPO_DIR/docs/troubleshooting/" 2>/dev/null
cp "$ROOT_DIR/FIXES_ROUND_2.md" "$MONOREPO_DIR/docs/troubleshooting/" 2>/dev/null
cp "$ROOT_DIR/FIXES_ROUND_3.md" "$MONOREPO_DIR/docs/troubleshooting/" 2>/dev/null
cp "$ROOT_DIR/ALL_FIXES_FINAL.md" "$MONOREPO_DIR/docs/troubleshooting/" 2>/dev/null
cp "$ROOT_DIR/QUICK_TROUBLESHOOTING.md" "$MONOREPO_DIR/docs/troubleshooting/" 2>/dev/null

# ARCHITECTURE - Архитектурные решения
echo "🏗️  Копирую архитектурные документы..."
cp "$ROOT_DIR/ARCHITECTURE.md" "$MONOREPO_DIR/docs/architecture/" 2>/dev/null
cp "$ROOT_DIR/ARCHITECTURE_OPTIONS.md" "$MONOREPO_DIR/docs/architecture/" 2>/dev/null
cp "$ROOT_DIR/ARCHITECTURE_SOLUTION.md" "$MONOREPO_DIR/docs/architecture/" 2>/dev/null
cp "$ROOT_DIR/BACKEND_FRONTEND_MAP.md" "$MONOREPO_DIR/docs/architecture/" 2>/dev/null
cp "$ROOT_DIR/BACKEND_INTEGRATION_PLAN.md" "$MONOREPO_DIR/docs/architecture/" 2>/dev/null
cp "$ROOT_DIR/BACKEND_STATUS.md" "$MONOREPO_DIR/docs/architecture/" 2>/dev/null
cp "$ROOT_DIR/SERVICES.md" "$MONOREPO_DIR/docs/architecture/" 2>/dev/null
cp "$ROOT_DIR/PORTS.md" "$MONOREPO_DIR/docs/architecture/" 2>/dev/null
cp "$ROOT_DIR/ADDRESSES.md" "$MONOREPO_DIR/docs/architecture/" 2>/dev/null

# COMPLETED - Завершенные задачи
echo "✅ Копирую документы завершенных задач..."
cp "$ROOT_DIR/FINAL_FIXES_COMPLETE.md" "$MONOREPO_DIR/docs/completed/" 2>/dev/null
cp "$ROOT_DIR/FINAL_NAVBAR_WITH_PAGES.md" "$MONOREPO_DIR/docs/completed/" 2>/dev/null
cp "$ROOT_DIR/FINAL_RECOMMENDATION.md" "$MONOREPO_DIR/docs/completed/" 2>/dev/null
cp "$ROOT_DIR/GOOGLE_BUTTON_WORKING.md" "$MONOREPO_DIR/docs/completed/" 2>/dev/null
cp "$ROOT_DIR/HEADER_UPDATE_COMPLETE.md" "$MONOREPO_DIR/docs/completed/" 2>/dev/null
cp "$ROOT_DIR/NAVBAR_SUCCESS.md" "$MONOREPO_DIR/docs/completed/" 2>/dev/null
cp "$ROOT_DIR/PATH_BASED_ROUTING_COMPLETE.md" "$MONOREPO_DIR/docs/completed/" 2>/dev/null
cp "$ROOT_DIR/SSO_SETUP_COMPLETE.md" "$MONOREPO_DIR/docs/completed/" 2>/dev/null
cp "$ROOT_DIR/VARIANT_3_COMPLETED.md" "$MONOREPO_DIR/docs/completed/" 2>/dev/null

# ARCHIVE - Старые документы (для истории)
echo "📦 Копирую архивные документы..."
cp "$ROOT_DIR/COMPONENT_COPY_GUIDE.md" "$MONOREPO_DIR/docs/archive/" 2>/dev/null
cp "$ROOT_DIR/COMPONENT_REPLACEMENT_PLAN.md" "$MONOREPO_DIR/docs/archive/" 2>/dev/null
cp "$ROOT_DIR/DYNAMIC_IMPORT_SOLUTION.md" "$MONOREPO_DIR/docs/archive/" 2>/dev/null
cp "$ROOT_DIR/CENTRALIZED_NAVIGATION_SOLUTION.md" "$MONOREPO_DIR/docs/archive/" 2>/dev/null
cp "$ROOT_DIR/BEAUTIFUL_NAVBAR.md" "$MONOREPO_DIR/docs/archive/" 2>/dev/null
cp "$ROOT_DIR/HOW_TO_COMPLETE_VARIANT_3.md" "$MONOREPO_DIR/docs/archive/" 2>/dev/null
cp "$ROOT_DIR/STYLE_CUSTOMIZATION_GUIDE.md" "$MONOREPO_DIR/docs/archive/" 2>/dev/null
cp "$ROOT_DIR/STYLE_FIXES_APPLIED.md" "$MONOREPO_DIR/docs/archive/" 2>/dev/null
cp "$ROOT_DIR/VISUAL_COMPARISON.md" "$MONOREPO_DIR/docs/archive/" 2>/dev/null

# Важные документы в корне
echo "📄 Копирую основные документы..."
cp "$ROOT_DIR/CHEATSHEET.md" "$MONOREPO_DIR/docs/" 2>/dev/null
cp "$ROOT_DIR/CHECKLIST.md" "$MONOREPO_DIR/docs/" 2>/dev/null
cp "$ROOT_DIR/INDEX.md" "$MONOREPO_DIR/docs/" 2>/dev/null
cp "$ROOT_DIR/LESSONS_LEARNED.md" "$MONOREPO_DIR/docs/" 2>/dev/null
cp "$ROOT_DIR/SUMMARY.md" "$MONOREPO_DIR/docs/" 2>/dev/null
cp "$ROOT_DIR/AUTH_ANALYSIS.md" "$MONOREPO_DIR/docs/" 2>/dev/null
cp "$ROOT_DIR/AUTH_ROUTES_FIX.md" "$MONOREPO_DIR/docs/" 2>/dev/null

# Русские документы
cp "$ROOT_DIR/"*.txt "$MONOREPO_DIR/docs/archive/" 2>/dev/null
cp "$ROOT_DIR/ВАРИАНТ_3_ГОТОВ.md" "$MONOREPO_DIR/docs/archive/" 2>/dev/null
cp "$ROOT_DIR/ВАРИАНТ_3_ЗАВЕРШЕН.md" "$MONOREPO_DIR/docs/archive/" 2>/dev/null
cp "$ROOT_DIR/НАЧАЛО_ДЛЯ_НОВОГО_ЧАТА.md" "$MONOREPO_DIR/docs/archive/" 2>/dev/null
cp "$ROOT_DIR/ПЕРЕЗАПУСК_ОБЯЗАТЕЛЕН.md" "$MONOREPO_DIR/docs/archive/" 2>/dev/null

echo ""
echo "✅ Документация организована!"
echo ""
echo "📂 Структура:"
echo "   docs/"
echo "   ├── migration/          # Документы по миграции Nx"
echo "   ├── setup/              # Инструкции по настройке"
echo "   ├── troubleshooting/    # Решение проблем"
echo "   ├── architecture/       # Архитектурные решения"
echo "   ├── completed/          # Завершенные задачи"
echo "   ├── archive/            # Старые документы"
echo "   └── OAUTH_DEBUG_GUIDE.md # Главный гайд по OAuth"
echo ""

