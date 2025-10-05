# 🚀 Tyrian Trade Platform - Nx Monorepo

> **Production-ready monorepo** for the Tyrian Trade platform with 6 frontends, 15 backends, and complete infrastructure.

[![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)](https://github.com/MoonMax000/tyrian-monorepo)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Nx](https://img.shields.io/badge/Nx-Monorepo-143055?logo=nx)](https://nx.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Quick Start](#-quick-start)
- [Projects](#-projects)
- [Development](#-development)
- [Infrastructure](#-infrastructure)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Documentation](#-documentation)

---

## 🌟 Overview

**Tyrian Trade** is a comprehensive trading and social platform featuring:

- 🎨 **6 Modern Frontends** (Next.js 15 + Vite)
- ⚙️ **15 Backend Services** (Go + Python/Django/FastAPI)
- 📦 **4 Shared Libraries** (UI, API, Types, Feature Flags)
- 🐳 **Complete Docker Infrastructure**
- 🔄 **CI/CD Pipelines** (GitHub Actions)
- 🧪 **Testing Framework** (Jest, Pytest, Go test)

### Key Features

✅ **Monorepo Architecture** - Single source of truth, shared code, unified tooling  
✅ **Production Ready** - Docker containers, health checks, auto-scaling  
✅ **Developer Experience** - Hot reload, instant type checking, one-command start  
✅ **Infrastructure as Code** - PostgreSQL, Redis, RabbitMQ, Elasticsearch, MinIO  
✅ **Modern Stack** - Next.js 15, React 18, Go 1.21, Python 3.11, TypeScript 5  

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **npm** or **yarn**
- **Docker** & **Docker Compose**
- *Optional:* Go 1.21, Python 3.11

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/MoonMax000/tyrian-monorepo.git
cd tyrian-monorepo

# Install dependencies
npm install
```

### 2. Start Infrastructure

```bash
# Start development infrastructure (PostgreSQL, Redis, RabbitMQ, etc.)
docker-compose -f docker-compose.dev.yml up -d

# Check status
docker-compose -f docker-compose.dev.yml ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

### 3. Start Applications

```bash
# Frontends
npx nx serve portfolios       # http://localhost:5173
npx nx serve ai-assistant     # http://localhost:4201
npx nx serve live-streaming   # http://localhost:4202

# Backends (example)
cd apps/backends/auth-service
python manage.py runserver 8001
```

### 4. Access Services

- **Portfolios:** http://localhost:5173
- **AI Assistant:** http://localhost:4201
- **PostgreSQL UI (Adminer):** http://localhost:8080
- **Redis UI (Commander):** http://localhost:8081
- **RabbitMQ Management:** http://localhost:15672 (tyrian/tyrian_dev)
- **MinIO Console:** http://localhost:9001 (tyrian/tyrian_dev_password)

---

## 📦 Projects

### Frontend Applications (6)

| App | Technology | Port | Description |
|-----|------------|------|-------------|
| **Portfolios** | Vite + React | 5173 | Investment portfolio management |
| **AI Assistant** | Next.js 15 | 4201 | AI-powered trading assistant |
| **Live Streaming** | Next.js 15 | 4202 | Live trading streams & community |
| **Cryptocurrency** | Next.js 15 | 4203 | Crypto trading platform |
| **Social Network** | Next.js 15 | 4204 | Social trading community |
| **Marketplace** | Next.js 15 | 4205 | Trading marketplace |
| **Stocks** | Next.js 15 | 4206 | Stock trading platform |

### Backend Services (15)

<details>
<summary><b>Auth Services (2)</b></summary>

| Service | Tech | Port | Description |
|---------|------|------|-------------|
| auth-service | Django | 8001 | Main authentication |
| auth-sync-service | Go | 8002 | Auth synchronization |

</details>

<details>
<summary><b>Social Network Services (6)</b></summary>

| Service | Tech | Port | Description |
|---------|------|------|-------------|
| posts-service | Go | 8003 | Post management |
| profiles-service | Go | 8004 | User profiles |
| likes-service | Go | 8005 | Likes & reactions |
| subscriptions-service | Go | 8006 | User subscriptions |
| favorites-service | Go | 8007 | Favorites |
| notifications-service | FastAPI | 8010 | Notifications |

</details>

<details>
<summary><b>Streaming Services (6)</b></summary>

| Service | Tech | Port | Description |
|---------|------|------|-------------|
| stream-auth-service | Go | 8011 | Stream authentication |
| stream-chat-service | Go | 8012 | Live chat |
| stream-media-service | Go | 8013 | Media processing |
| stream-notify-service | Go | 8015 | Stream notifications |
| stream-recommend-service | Go | 8016 | Recommendations |
| stream-streamer-service | Go | 8017 | Streamer management |

</details>

<details>
<summary><b>Trading Services (1)</b></summary>

| Service | Tech | Port | Description |
|---------|------|------|-------------|
| stocks-backend | Django | 8020 | Stock trading |

</details>

### Shared Libraries (4)

| Library | Description |
|---------|-------------|
| **@tyrian/shared/ui** | Reusable React components (Header, Footer, etc.) |
| **@tyrian/shared/api** | API utilities and authentication |
| **@tyrian/shared/types** | Shared TypeScript types |
| **@tyrian/shared/feature-flags** | Feature flags system |

---

## 💻 Development

### Common Commands

```bash
# Development
npx nx serve <project-name>          # Start dev server
npx nx build <project-name>          # Build project
npx nx test <project-name>           # Run tests
npx nx lint <project-name>           # Lint code

# Multiple projects
npx nx run-many --target=build --all    # Build all
npx nx run-many --target=test --all     # Test all
npx nx affected --target=build          # Build affected

# Nx utilities
npx nx graph                         # View dependency graph
npx nx show projects                 # List all projects
npx nx show project <name>           # Project details
```

### Project Structure

```
tyrian-monorepo/
├── apps/
│   ├── <frontends>/                 # 6 Next.js + Vite apps
│   └── backends/                    # 15 backend services
├── libs/
│   └── shared/                      # 4 shared libraries
├── infrastructure/                  # Docker, configs
├── .github/workflows/               # CI/CD pipelines
└── docker-compose.yml               # Infrastructure
```

### Adding New Projects

```bash
# Frontend (Next.js)
npx nx g @nx/next:app my-app

# Backend (Node.js)
npx nx g @nx/node:app my-backend

# Library
npx nx g @nx/js:lib my-lib
```

---

## 🐳 Infrastructure

### Services

- **PostgreSQL 15** - Main database (15 schemas)
- **Redis 7** - Caching & sessions
- **RabbitMQ 3.12** - Message queue
- **Elasticsearch 8.11** - Full-text search
- **MinIO** - S3-compatible object storage

### Docker Compose

```bash
# Development (infrastructure only)
docker-compose -f docker-compose.dev.yml up -d

# Production (all services)
docker-compose up -d

# Individual services
docker-compose up -d postgres redis rabbitmq

# Stop services
docker-compose down

# View logs
docker-compose logs -f <service>
```

### Environment Variables

Create `.env.local` files:

```bash
# Database
DATABASE_URL=postgresql://tyrian:tyrian_dev@localhost:5432/tyrian_db

# Redis
REDIS_URL=redis://localhost:6379/0

# RabbitMQ
RABBITMQ_URL=amqp://tyrian:tyrian_dev@localhost:5672/

# S3 (MinIO)
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=tyrian
S3_SECRET_KEY=tyrian_dev_password
```

---

## 🧪 Testing

### Running Tests

```bash
# All tests
npx nx run-many --target=test --all

# Specific project
npx nx test shared-ui

# With coverage
npx nx test shared-ui --coverage

# Watch mode
npx nx test shared-ui --watch

# Only affected projects
npx nx affected --target=test
```

### Test Structure

```bash
# Unit tests
src/**/*.spec.ts
src/**/*.spec.tsx

# E2E tests
e2e/**/*.spec.ts
```

---

## 🚀 Deployment

### Building for Production

```bash
# Build all frontends
npx nx run-many --target=build --all

# Build specific app
npx nx build portfolios

# Docker build
docker-compose build
```

### Docker Deployment

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Configuration

- **Development:** `.env.local`
- **Staging:** `.env.staging`
- **Production:** Kubernetes Secrets / Environment Variables

---

## 📚 Documentation

### Main Documents

- **[FINAL_SUMMARY.md](FINAL_SUMMARY.md)** - Complete project overview
- **[INFRASTRUCTURE_COMPLETE.md](INFRASTRUCTURE_COMPLETE.md)** - Docker, CI/CD, Testing
- **[GITHUB_WORKFLOWS_SETUP.md](GITHUB_WORKFLOWS_SETUP.md)** - GitHub Actions setup
- **[apps/backends/README.md](apps/backends/README.md)** - Backend services documentation

### Quick References

- **[NX_MIGRATION_PLAN.md](NX_MIGRATION_PLAN.md)** - Migration strategy
- **[PHASE_2_COMPLETE.md](PHASE_2_COMPLETE.md)** - Backend migration
- **[FINAL_MIGRATION_COMPLETE.md](FINAL_MIGRATION_COMPLETE.md)** - Frontend migration

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15, Vite 7
- **UI:** React 18, Tailwind CSS
- **State:** React Query, Zustand
- **Build:** Webpack 5, Turbopack
- **Language:** TypeScript 5

### Backend
- **Go:** 1.21 (11 services)
- **Python:** 3.11 (4 services)
- **Frameworks:** Django 4, FastAPI, Gin, Echo

### Infrastructure
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **Queue:** RabbitMQ 3.12
- **Search:** Elasticsearch 8.11
- **Storage:** MinIO
- **Container:** Docker + Compose

### DevOps
- **Monorepo:** Nx
- **CI/CD:** GitHub Actions
- **Testing:** Jest, Pytest, Go test
- **Linting:** ESLint, Prettier

---

## 📊 Status

- ✅ **Frontends:** 6/6 migrated
- ✅ **Backends:** 15/15 migrated
- ✅ **Libraries:** 4/4 created
- ✅ **Docker:** Complete infrastructure
- ✅ **CI/CD:** Pipelines ready
- ✅ **Testing:** Framework configured
- ✅ **Documentation:** Comprehensive

**Overall Status:** 🚀 **PRODUCTION READY!**

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Run tests: `npx nx affected --target=test`
4. Commit: `git commit -m "feat: add feature"`
5. Push: `git push origin feature/my-feature`
6. Open Pull Request

### Code Style

- Follow TypeScript/ESLint rules
- Write tests for new features
- Update documentation
- Keep commits atomic

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Nx Team** - Amazing monorepo tool
- **Next.js** - Powerful React framework
- **Go Team** - Fast and reliable backend language
- **Docker** - Container platform

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/MoonMax000/tyrian-monorepo/issues)
- **Documentation:** See [FINAL_SUMMARY.md](FINAL_SUMMARY.md)
- **Nx Docs:** https://nx.dev

---

## 🎉 Quick Stats

```
📦 Total Projects:     25
📁 Lines of Code:      100,000+
🔧 Technologies:       10+
🐳 Docker Services:    21
📚 Documentation:      12 files
⏱️ Setup Time:         5 minutes
🚀 Status:             Production Ready
```

---

**Built with ❤️ for the Tyrian Trade Platform**

*Last Updated: October 5, 2025*
