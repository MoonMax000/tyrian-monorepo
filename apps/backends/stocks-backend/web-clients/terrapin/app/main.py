from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request

from app.routes.bonds import router as stocks_router
from app.settings import lifespan
from app.settings import request_counter


app = FastAPI(title="My FastAPI Project", version="0.1.0", lifespan=lifespan)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stocks_router)



@app.middleware("http")
async def record_router_requests(request: Request, call_next):
    """
    middleware для записи информации о запуске роутера.
    """
    response = await call_next(request)
    route = request.url.path
    if route.startswith("/"):
        route = route.lstrip("/")

    # запись в Redis
    await request_counter.record_request(route)

    return response
