# Backend Services

This directory contains all backend microservices for the Tyrian Trade platform.

## Services (8 Total)

### Auth Services (2)

#### 1. **auth-service** (Django/Python)
Main authentication service handling OAuth2, JWT, user management.

**Tech Stack:**
- Django 4.x + DRF
- PostgreSQL
- Redis
- RabbitMQ
- Celery

**Commands:**
```bash
# Serve
npx nx serve auth-service

# Migrate database
npx nx migrate auth-service

# Run tests
npx nx test auth-service

# Build Docker image
npx nx docker-build auth-service
```

**Environment Variables:**
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/auth_db
REDIS_URL=redis://localhost:6379/0
RABBITMQ_URL=amqp://guest:guest@localhost:5672/
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

#### 2. **auth-sync-service** (Go)
Synchronizes auth data across services using RabbitMQ.

**Tech Stack:**
- Go 1.21+
- PostgreSQL
- RabbitMQ
- Swagger/OpenAPI

**Commands:**
```bash
# Serve
npx nx serve auth-sync-service

# Build
npx nx build auth-sync-service

# Run tests
npx nx test auth-sync-service
```

**Environment Variables:**
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=auth_sync_db
RABBITMQ_URL=amqp://guest:guest@localhost:5672/
```

---

## Development Setup

### Prerequisites
- Python 3.11+
- Go 1.21+
- PostgreSQL 15+
- Redis 7+
- RabbitMQ 3.12+

### Quick Start

1. **Setup Python virtual environment:**
```bash
cd apps/backends/auth-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Setup Go dependencies:**
```bash
cd apps/backends/auth-sync-service
go mod download
```

3. **Start infrastructure:**
```bash
# Using Docker Compose (recommended)
docker-compose up -d postgres redis rabbitmq
```

4. **Run migrations:**
```bash
npx nx migrate auth-service
```

5. **Start services:**
```bash
# Terminal 1
npx nx serve auth-service

# Terminal 2
npx nx serve auth-sync-service
```

---

## API Documentation

### auth-service
- Swagger UI: http://localhost:8001/api/docs/
- ReDoc: http://localhost:8001/api/redoc/
- OpenAPI Schema: http://localhost:8001/api/schema/

### auth-sync-service
- Swagger UI: http://localhost:8002/swagger/
- Health Check: http://localhost:8002/health

---

## Testing

```bash
# Test auth-service
npx nx test auth-service

# Test auth-sync-service
npx nx test auth-sync-service

# Test all backends
npx nx run-many --target=test --projects=auth-service,auth-sync-service
```

---

## Docker Deployment

```bash
# Build all backend images
npx nx run-many --target=docker-build --all

# Or individual services
npx nx docker-build auth-service
npx nx docker-build auth-sync-service
```

---

### Social Network Services (6)

#### 1. **socialweb-posts-service** (Go)
Posts and content management service.

**Tech Stack:** Go + PostgreSQL + Elasticsearch + RabbitMQ + S3

**Commands:**
```bash
npx nx serve socialweb-posts-service
npx nx build socialweb-posts-service
npx nx test socialweb-posts-service
```

#### 2. **socialweb-profiles-service** (Go)
User profiles and profile data management.

**Tech Stack:** Go + PostgreSQL + RabbitMQ

**Commands:**
```bash
npx nx serve socialweb-profiles-service
```

#### 3. **socialweb-likes-service** (Go)
Likes and reactions system.

**Tech Stack:** Go + PostgreSQL + RabbitMQ

**Commands:**
```bash
npx nx serve socialweb-likes-service
```

#### 4. **socialweb-subscriptions-service** (Go)
User subscriptions and following system.

**Tech Stack:** Go + PostgreSQL + RabbitMQ

**Commands:**
```bash
npx nx serve socialweb-subscriptions-service
```

#### 5. **socialweb-favorites-service** (Go)
Favorites and bookmarks management.

**Tech Stack:** Go + PostgreSQL + RabbitMQ

**Commands:**
```bash
npx nx serve socialweb-favorites-service
```

#### 6. **socialweb-notifications-service** (FastAPI/Python)
Real-time notifications service.

**Tech Stack:** FastAPI + PostgreSQL + RabbitMQ + WebSocket

**Commands:**
```bash
npx nx serve socialweb-notifications-service
```

---

## Future Services (To be migrated)

### Social Network Services (Remaining)
- comments-service (Django)

### Marketplace Services
- marketplace-backend (Django)

### Streaming Services
- stream-auth-service (Node.js)
- stream-chat-service (Node.js)
- stream-media-service (Node.js)
- stream-notify-service (Node.js)
- stream-payment-service (Node.js)

### Trading Services
- stocks-backend (Django)
- trading-terminal-backend (Go)

---

## Architecture Notes

### Service Communication
- **REST APIs** - Primary communication between frontend and backend
- **RabbitMQ** - Event-driven communication between microservices
- **Redis** - Caching and session storage
- **PostgreSQL** - Primary data store

### Authentication Flow
1. Frontend → auth-service: Login request
2. auth-service → Database: Validate credentials
3. auth-service → Redis: Store session
4. auth-service → RabbitMQ: Publish user event
5. auth-sync-service → RabbitMQ: Consume event
6. auth-sync-service → Other services: Sync user data

---

## Contributing

When adding new backend services:
1. Create directory in `apps/backends/`
2. Add `project.json` with appropriate targets
3. Update this README
4. Add service to docker-compose.yml
5. Document API endpoints

---

**Last Updated:** October 5, 2025

