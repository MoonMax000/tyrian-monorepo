from fastapi import APIRouter
from app.api_client import fmp_api_client


router = APIRouter(prefix="/api/v1/market_leaders", tags=["market_leaders"])


@router.get("/leaders_volume")
async def leaders_volume_info():
    res = await fmp_api_client.get_leaders_volume()
    return res


@router.get("/growth_leaders")
async def growth_leaders_info():
    res = await fmp_api_client.get_growth_leaders_info()
    return res


@router.get("/decline_leaders")
async def decline_leaders_info():
    res = await fmp_api_client.get_decline_leaders_info()
    return res


@router.get("/trading_volumes/{symbol}")
async def trading_volumes_info(symbol: str):
    res = await fmp_api_client.get_trading_volumes_info(stock_symbol=symbol)
    return res


@router.get("/leaders_volatility")
async def leaders_volatility_info():
    res = await fmp_api_client.get_leaders_volatility()
    return res
