from fastapi import APIRouter
from app.api_client import fmp_api_client


router = APIRouter(prefix="/holder", tags=["holder"])


@router.get("/institut/{symbol}")
async def institut_info(symbol: str):
    res = await fmp_api_client.get_institut_info(stock_symbol=symbol)
    return res
