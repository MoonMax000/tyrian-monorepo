#!/bin/bash

# Скрипт для запуска Auth Service с правильными настройками

echo "🚀 Запуск Auth Service..."

cd "/Users/devidanderson/Downloads/Резерв ГитХаб/3 октября axa времянка 2/AXA-auth-server-main/auth-core"

# Устанавливаем переменные окружения
export MARKETPLACE_URL="http://localhost:4205"
export GOOGLE_CLIENT_ID="659860871739-c94m1fik99740ee694mf5oeihffodbk8.apps.googleusercontent.com"
export GOOGLE_REDIRECT_URI="http://localhost:8001/api/accounts/google/callback/"
export DEBUG="True"

# Запускаем сервер
echo "✅ Auth Service запускается на http://localhost:8001"
echo "📝 После OAuth редирект на: $MARKETPLACE_URL"
echo ""

python3 manage.py runserver 8001

