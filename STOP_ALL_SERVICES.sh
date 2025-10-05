#!/bin/bash

# 🛑 Stop All Tyrian Trade Services

echo "════════════════════════════════════════════════════════════"
echo "🛑 STOPPING TYRIAN TRADE PLATFORM"
echo "════════════════════════════════════════════════════════════"
echo ""

# Kill frontend processes
if [ -f logs/services.pid ]; then
    echo "📱 Stopping frontends..."
    source logs/services.pid
    
    kill $PORTFOLIOS_PID 2>/dev/null && echo "  ✅ Portfolios stopped" || echo "  ⚠️  Portfolios not running"
    kill $AI_ASSISTANT_PID 2>/dev/null && echo "  ✅ AI Assistant stopped" || echo "  ⚠️  AI Assistant not running"
    kill $LIVE_STREAMING_PID 2>/dev/null && echo "  ✅ Live Streaming stopped" || echo "  ⚠️  Live Streaming not running"
    kill $CRYPTOCURRENCY_PID 2>/dev/null && echo "  ✅ Cryptocurrency stopped" || echo "  ⚠️  Cryptocurrency not running"
    kill $SOCIAL_NETWORK_PID 2>/dev/null && echo "  ✅ Social Network stopped" || echo "  ⚠️  Social Network not running"
    kill $MARKETPLACE_PID 2>/dev/null && echo "  ✅ Marketplace stopped" || echo "  ⚠️  Marketplace not running"
    kill $STOCKS_PID 2>/dev/null && echo "  ✅ Stocks stopped" || echo "  ⚠️  Stocks not running"
    
    rm logs/services.pid
fi

# Kill any remaining nx serve processes
echo ""
echo "🔍 Cleaning up remaining processes..."
pkill -f "nx serve" 2>/dev/null || echo "  ℹ️  No nx processes found"

# Stop Docker infrastructure
echo ""
echo "🐳 Stopping infrastructure..."
docker-compose -f docker-compose.dev.yml down

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ ALL SERVICES STOPPED!"
echo "════════════════════════════════════════════════════════════"

