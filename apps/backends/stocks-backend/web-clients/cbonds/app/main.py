from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.market_leaders import router as market_leaders_router
from app.routes.etf import router as etf_router


app = FastAPI(title="My Web-clients Sbonds", version="0.1.0", root_path="/cbonds-data")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(market_leaders_router)
app.include_router(etf_router)
