#!/bin/bash

# 🚀 Start All Tyrian Trade Services
# This script starts infrastructure, backends, and frontends

set -e

echo "════════════════════════════════════════════════════════════"
echo "🚀 STARTING TYRIAN TRADE PLATFORM"
echo "════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Start Infrastructure
echo "📦 Step 1: Starting Infrastructure..."
echo "────────────────────────────────────────────────────────────"
docker-compose -f docker-compose.dev.yml up -d
echo ""
echo "${GREEN}✅ Infrastructure started${NC}"
echo "   • PostgreSQL: localhost:5432"
echo "   • Redis: localhost:6379"
echo "   • RabbitMQ: localhost:5672 (Management: localhost:15672)"
echo "   • Elasticsearch: localhost:9200"
echo "   • MinIO: localhost:9000 (Console: localhost:9001)"
echo "   • Adminer: localhost:8080"
echo "   • Redis Commander: localhost:8081"
echo ""

# Step 2: Wait for services to be healthy
echo "⏳ Waiting for services to be ready (30 seconds)..."
sleep 30
echo "${GREEN}✅ Services ready${NC}"
echo ""

# Step 3: Start Frontends
echo "🎨 Step 2: Starting Frontends..."
echo "────────────────────────────────────────────────────────────"

echo "Starting Portfolios (Vite)..."
npx nx serve portfolios > logs/portfolios.log 2>&1 &
PORTFOLIOS_PID=$!
echo "  PID: $PORTFOLIOS_PID"

echo "Starting AI Assistant..."
npx nx serve ai-assistant --port 4201 > logs/ai-assistant.log 2>&1 &
AI_ASSISTANT_PID=$!
echo "  PID: $AI_ASSISTANT_PID"

echo "Starting Live Streaming..."
npx nx serve live-streaming --port 4202 > logs/live-streaming.log 2>&1 &
LIVE_STREAMING_PID=$!
echo "  PID: $LIVE_STREAMING_PID"

echo "Starting Cryptocurrency..."
npx nx serve cryptocurrency --port 4203 > logs/cryptocurrency.log 2>&1 &
CRYPTOCURRENCY_PID=$!
echo "  PID: $CRYPTOCURRENCY_PID"

echo "Starting Social Network..."
npx nx serve social-network --port 4204 > logs/social-network.log 2>&1 &
SOCIAL_NETWORK_PID=$!
echo "  PID: $SOCIAL_NETWORK_PID"

echo "Starting Marketplace..."
npx nx serve marketplace --port 4205 > logs/marketplace.log 2>&1 &
MARKETPLACE_PID=$!
echo "  PID: $MARKETPLACE_PID"

echo "Starting Stocks..."
npx nx serve stocks --port 4206 > logs/stocks.log 2>&1 &
STOCKS_PID=$!
echo "  PID: $STOCKS_PID"

echo ""
echo "${GREEN}✅ All frontends starting...${NC}"
echo ""

# Step 4: Save PIDs
echo "💾 Saving PIDs..."
cat > logs/services.pid << EOF
PORTFOLIOS_PID=$PORTFOLIOS_PID
AI_ASSISTANT_PID=$AI_ASSISTANT_PID
LIVE_STREAMING_PID=$LIVE_STREAMING_PID
CRYPTOCURRENCY_PID=$CRYPTOCURRENCY_PID
SOCIAL_NETWORK_PID=$SOCIAL_NETWORK_PID
MARKETPLACE_PID=$MARKETPLACE_PID
STOCKS_PID=$STOCKS_PID
EOF

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ ALL SERVICES STARTED!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🌐 Frontend URLs (wait 30-60 seconds for first build):"
echo "────────────────────────────────────────────────────────────"
echo "  📊 Portfolios:       http://localhost:5173"
echo "  🤖 AI Assistant:     http://localhost:4201"
echo "  🎥 Live Streaming:   http://localhost:4202"
echo "  💰 Cryptocurrency:   http://localhost:4203"
echo "  👥 Social Network:   http://localhost:4204"
echo "  🛒 Marketplace:      http://localhost:4205"
echo "  📈 Stocks:           http://localhost:4206"
echo ""
echo "🔧 Infrastructure UIs:"
echo "────────────────────────────────────────────────────────────"
echo "  🗄️  PostgreSQL (Adminer):  http://localhost:8080"
echo "  📦 Redis Commander:        http://localhost:8081"
echo "  🐰 RabbitMQ Management:    http://localhost:15672"
echo "  🗂️  MinIO Console:         http://localhost:9001"
echo ""
echo "📊 Status:"
echo "────────────────────────────────────────────────────────────"
docker-compose -f docker-compose.dev.yml ps
echo ""
echo "📝 Logs:"
echo "────────────────────────────────────────────────────────────"
echo "  View logs: tail -f logs/<service>.log"
echo "  All PIDs: cat logs/services.pid"
echo ""
echo "🛑 To stop all services:"
echo "────────────────────────────────────────────────────────────"
echo "  ./STOP_ALL_SERVICES.sh"
echo ""
echo "════════════════════════════════════════════════════════════"
echo "${GREEN}🎉 READY TO GO!${NC}"
echo "════════════════════════════════════════════════════════════"

