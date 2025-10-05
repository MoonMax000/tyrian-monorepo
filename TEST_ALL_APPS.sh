#!/bin/bash

# Tyrian Monorepo - Test All Applications
# This script tests each application by building it

echo "🧪 TESTING ALL TYRIAN APPLICATIONS"
echo "=================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
PASSED=0
FAILED=0
TOTAL=6

# Function to test an app
test_app() {
    local app_name=$1
    echo -e "${YELLOW}Testing: $app_name${NC}"
    
    if npx nx build $app_name > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $app_name - PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ $app_name - FAILED${NC}"
        ((FAILED++))
    fi
    echo ""
}

# Test all frontend apps
echo "📦 FRONTEND APPLICATIONS"
echo "------------------------"
test_app "portfolios"
test_app "ai-assistant"
test_app "live-streaming"
test_app "cryptocurrency"
test_app "social-network"
test_app "marketplace"
test_app "stocks"

# Summary
echo "=================================="
echo "📊 TEST SUMMARY"
echo "=================================="
echo -e "Total Applications: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! 🎉${NC}"
    exit 0
else
    echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
    exit 1
fi

