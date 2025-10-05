from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.router import router
from api.healthcheck import router as healthcheck_router


app = FastAPI(
    title="Formatter Service",
    description="Formatter Service",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(router, prefix="/api/v1")
app.include_router(healthcheck_router)
