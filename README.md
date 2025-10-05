# 🚀 Tyrian Trade - Nx Monorepo

> Unified monorepo for Tyrian Trade platform with 7 frontends, 19 backends, and shared libraries.

**Status:** ✅ POC Complete (Portfolios app migrated)  
**Nx Version:** 21.6.3  
**Created:** 2025-10-05

---

## 📁 Project Structure

```
tyrian-monorepo/
├── libs/shared/          # Shared libraries for all apps
│   ├── ui/               # React components (Header, Footer)
│   ├── api/              # API clients (auth, config)
│   ├── types/            # TypeScript types
│   └── feature-flags/    # Feature flags system
│
├── portfolios/           # ✅ Portfolios app (Vite + React)
│   ├── src/
│   ├── public/
│   └── vite.config.ts
│
├── package.json          # Root dependencies
├── nx.json               # Nx configuration
└── tsconfig.base.json    # Base TypeScript config
```

---

## 🏃 Quick Start

### Prerequisites
- Node.js 18+ (currently using v23.11.0)
- npm 10+

### Install Dependencies
```bash
cd tyrian-monorepo
npm install
```

### Run Portfolios App
```bash
# Development server
nx serve portfolios

# Open http://localhost:5173
```

### Build Portfolios App
```bash
nx build portfolios

# Output: dist/portfolios/
```

---

## 📚 Available Commands

### Run any app:
```bash
nx serve <app-name>
nx build <app-name>
nx test <app-name>
nx lint <app-name>
```

### Nx graph visualization:
```bash
nx graph
```

### Show project info:
```bash
nx show project <app-name>
```

### Build only affected projects:
```bash
nx affected:build
```

---

## 🔗 Shared Libraries

Import shared code in any app:

```typescript
// UI Components
import { Header, Footer, cn } from '@tyrian/shared/ui';

// API Functions
import { login, logout, getProfile } from '@tyrian/shared/api';

// TypeScript Types
import { User, Product } from '@tyrian/shared/types';

// Feature Flags
import { getProducts, isProductEnabled } from '@tyrian/shared/feature-flags';
```

---

## 📦 Applications

### ✅ Migrated:
- **portfolios** - Portfolio management (Vite + React) - Port 5173

### 🔜 To be migrated:
- **marketplace** - Educational materials marketplace (Next.js)
- **social-network** - Trading social network (Next.js)
- **stocks** - Stock market data (Next.js)
- **cryptocurrency** - Cryptocurrency market data (Next.js)
- **live-streaming** - Live trading streams (Next.js)
- **ai-assistant** - AI trading assistant (Next.js)

---

## 🎯 Migration Status

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 0** | POC (Portfolios) | ✅ Complete |
| **Phase 1** | Migrate 6 Next.js frontends | 🔜 Pending |
| **Phase 2** | Migrate Auth Server (Django) | 🔜 Pending |
| **Phase 3** | Migrate 18 microservices | 🔜 Pending |
| **Phase 4** | CI/CD Setup | 🔜 Pending |

See [POC_COMPLETE.md](./POC_COMPLETE.md) for detailed POC results.

---

## 🔧 Tech Stack

### Frontend:
- React 18.3.1
- TypeScript 5.9.2
- Vite 7.0.0
- TailwindCSS 3.4.17
- React Router 6.30.1
- React Query 5.84.2

### Build Tools:
- Nx 21.6.3
- Rollup 4.14.0
- SWC 1.5.7

### UI Libraries:
- Radix UI (complete set)
- Recharts 2.12.7
- Three.js 0.176.0
- Lucide React 0.539.0

---

## 📖 Documentation

- [POC_COMPLETE.md](./POC_COMPLETE.md) - Proof of Concept results
- [Nx Documentation](https://nx.dev)
- [Original NX_MIGRATION_PLAN.md](../NX_MIGRATION_PLAN.md)

---

## 🎓 Learn More

### Nx Commands:
```bash
# Generate new app
nx g @nx/react:app my-app --bundler=vite

# Generate new library
nx g @nx/react:lib my-lib --directory=libs/shared

# Generate component
nx g @nx/react:component my-component --project=my-app
```

### Useful Links:
- [Nx Docs](https://nx.dev)
- [Nx Console VSCode Extension](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)
- [Nx Cloud](https://nx.app)

---

## 🤝 Contributing

This is a migration project. Follow the migration plan in `NX_MIGRATION_PLAN.md`.

---

## 📝 License

MIT

---

**Created:** 2025-10-05  
**Maintainer:** Tyrian Trade Team  
**Nx Version:** 21.6.3
