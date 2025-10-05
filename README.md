# 🚀 Tyrian Trade Monorepo

Unified platform for trading, social networking, AI assistance, and live streaming - all in one Nx monorepo.

---

## ✨ What's Inside

### Frontend Applications (6 Next.js + 1 Vite):
- **AI Assistant** (:4201) - AI-powered trading assistant
- **Live Streaming** (:4202) - Live streaming platform
- **Cryptocurrency** (:4203) - Crypto trading platform
- **Social Network** (:4204) - Social media for traders
- **Marketplace** (:4205) - Trading marketplace
- **Stocks** (:4206) - Stock trading platform
- **Portfolios** (:5173) - Portfolio management (Vite + React)

### Backend Services (15 Go + 2 Django):
- **auth-service** (Django) - Centralized authentication with Google OAuth
- **auth-sync-service** (Go) - Auth synchronization
- 6x **socialweb-*-service** (Go + FastAPI) - Social network microservices
- 6x **stream-*-service** (Go) - Streaming microservices
- **stocks-backend** (Django) - Stocks API

### Shared Libraries:
- `@tyrian/ui` - Shared React components (Header, Footer, UserProfile, etc.)
- `@tyrian/api` - API clients and utilities
- `@tyrian/types` - TypeScript type definitions
- `@tyrian/feature-flags` - Feature flag management

---

## 🎯 Quick Start

### Prerequisites:
```bash
node >= 18
npm >= 9
python >= 3.10
go >= 1.20
```

### 1. Install Dependencies:
```bash
cd tyrian-monorepo
npm install
```

### 2. Start Frontend Apps:
```bash
# Single app
npx nx serve marketplace --port 4205

# All apps (in separate terminals)
npx nx serve ai-assistant --port 4201
npx nx serve live-streaming --port 4202
npx nx serve cryptocurrency --port 4203
npx nx serve social-network --port 4204
npx nx serve marketplace --port 4205
npx nx serve stocks --port 4206
npm run dev:portfolios  # Vite app on :5173
```

### 3. Start Auth Service:
```bash
cd ../AXA-auth-server-main/auth-core
source venv/bin/activate
export GOOGLE_CLIENT_ID="your-id"
export GOOGLE_CLIENT_SECRET="your-secret"
export DEBUG="True"
export CORS_ALLOW_ALL_ORIGINS="True"
python manage.py runserver 8001
```

Or use the provided script:
```bash
./START_AUTH.sh
```

---

## 📚 Documentation

**➡️ [Full Documentation](docs/README.md)**

### Quick Links:
- **[Quick Start Guide](docs/setup/QUICK_START.md)** - Get started in 5 minutes
- **[OAuth Debug Guide](docs/OAUTH_DEBUG_GUIDE.md)** - ⭐ Must-read for auth issues
- **[Architecture](docs/architecture/ARCHITECTURE.md)** - System architecture
- **[Troubleshooting](docs/troubleshooting/)** - Common issues and solutions
- **[Migration Guide](docs/migration/NX_MIGRATION_PLAN.md)** - Nx migration documentation

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Apps (Next.js/Vite)            │
│  AI│Streaming│Crypto│Social│Marketplace│Stocks│Portfolios  │
│  :4201 :4202  :4203  :4204    :4205    :4206    :5173     │
└─────────────┬───────────────────────────────────────────────┘
              │
              │ HTTP/REST
              │
┌─────────────▼───────────────────────────────────────────────┐
│                    Auth Service (Django)                     │
│              :8001 - Google OAuth SSO                        │
└─────────────┬───────────────────────────────────────────────┘
              │
              │ Sync
              │
┌─────────────▼───────────────────────────────────────────────┐
│               Backend Microservices (Go/Django)              │
│  Social: posts│profiles│likes│subscriptions│favorites│notify│
│  Stream: auth│chat│media│notify│recommend│streamer          │
│  Stocks: backend (Django)                                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Available Commands

### Development:
```bash
npx nx serve <app-name>      # Start development server
npx nx build <app-name>      # Production build
npx nx test <app-name>       # Run tests
npx nx lint <app-name>       # Lint code
```

### Monorepo:
```bash
npx nx graph                 # Visualize dependency graph
npx nx affected:test        # Test affected projects
npx nx affected:build       # Build affected projects
npx nx reset                # Clear Nx cache
```

### Utilities:
```bash
npx nx list                  # List installed plugins
npx nx migrate latest       # Migrate to latest Nx version
```

---

## 🧪 Testing

```bash
# Unit tests
npx nx test shared-ui

# All tests
npx nx run-many --target=test --all

# Affected tests only
npx nx affected:test
```

---

## 🐳 Docker

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up -d
```

---

## 🚢 Deployment

### GitHub Actions CI/CD:
Automated workflows for:
- ✅ Build and test on every push
- ✅ Deploy to staging on merge to `develop`
- ✅ Deploy to production on merge to `main`

See: [`.github/workflows/`](.github/workflows/)

---

## 🔒 Environment Variables

### Auth Service (Required):
```bash
DEBUG=True
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8001/api/accounts/google/callback/
MARKETPLACE_URL=http://localhost:4205
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOW_CREDENTIALS=True
```

### Frontend Apps (Optional):
```bash
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8001
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## 🎓 Key Learnings

### What Worked:
✅ Nx monorepo for unified development  
✅ Shared component library (`@tyrian/ui`)  
✅ Centralized authentication with Django  
✅ Docker Compose for local development  
✅ Database sessions for development (no Redis needed)  

### What to Watch Out For:
⚠️ Django Signals can block HTTP responses (use Celery EAGER mode for dev)  
⚠️ Always use `manage.py runserver`, not `uvicorn` (CORS middleware)  
⚠️ Clear `.next` cache when experiencing build issues  
⚠️ Use `/api/accounts/me/` endpoint, not `/profile/`  

---

## 📊 Project Status

### ✅ Completed:
- [x] Nx monorepo migration (6 frontends + 15 backends)
- [x] Shared libraries setup
- [x] Google OAuth SSO integration
- [x] User profile component
- [x] Docker Compose configuration
- [x] CI/CD with GitHub Actions
- [x] Jest testing infrastructure

### 🚧 In Progress:
- [ ] E2E testing with Playwright
- [ ] Kubernetes deployment
- [ ] Monitoring and logging (Prometheus + Grafana)

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test: `npx nx affected:test`
3. Commit: `git commit -m "feat: add feature"`
4. Push: `git push origin feature/my-feature`
5. Create a Pull Request

---

## 📝 License

Proprietary - All rights reserved

---

## 🆘 Support

- 📖 [Documentation](docs/README.md)
- 🐛 [Issues](https://github.com/tyrian-trade/monorepo/issues)
- 💬 Internal Slack: `#tyrian-trade-dev`

---

**Built with ❤️ using Nx, Next.js, Django, and Go**

**Last Updated:** October 5, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
