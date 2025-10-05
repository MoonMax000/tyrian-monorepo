#!/bin/bash

# Script to add GitHub Actions workflows manually
# Since token doesn't have workflow scope, we'll provide instructions

echo "════════════════════════════════════════════════════════════"
echo "🚀 GitHub Actions Workflows Setup"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Файлы workflows готовы в:"
echo "  📁 .github/workflows/ci.yml"
echo "  📁 .github/workflows/cd.yml"
echo ""
echo "⚠️  Для добавления на GitHub выберите один из способов:"
echo ""
echo "════════════════════════════════════════════════════════════"
echo "СПОСОБ 1: Через GitHub UI (Рекомендуется - 5 минут)"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "1. Откройте: https://github.com/MoonMax000/tyrian-monorepo"
echo "2. Перейдите в Actions → New workflow"
echo "3. Выберите 'set up a workflow yourself'"
echo "4. Скопируйте содержимое из .github/workflows/ci.yml"
echo "5. Commit → Повторите для cd.yml"
echo ""
echo "════════════════════════════════════════════════════════════"
echo "СПОСОБ 2: Git commit (если есть токен с workflow scope)"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "git add .github/workflows/"
echo "git commit -m 'ci: add GitHub Actions workflows'"
echo "git push origin main"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Пропустить настройку? (workflows не критичны для локальной разработки)"
echo "Нажмите Enter для продолжения..."
read

