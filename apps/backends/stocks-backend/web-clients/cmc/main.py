from fastapi import FastAPI

from coin_market_cap_api import cmc_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="API",
    version="2.0.0",
    root_path="/coin-market-cap"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    )

app.include_router(cmc_router, prefix="/cmc", tags=["pages"])
