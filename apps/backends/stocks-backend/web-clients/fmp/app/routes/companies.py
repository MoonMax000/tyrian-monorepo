from fastapi import APIRouter, Depends
from app.api_client import fmp_api_client
from app.models.params import Params


router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("/{symbol}")
async def company_info(symbol: str):
    return await fmp_api_client.get_company_info(stock_symbol=symbol)


@router.get("/{symbol}/key-metrics")
async def company_key_metrics(symbol: str, params: Params = Depends()):
    return await fmp_api_client.get_company_key_metrics(
        stock_symbol=symbol, params=params.model_dump(exclude_none=True)
    )
