from fastapi import APIRouter, Depends
from app.api_client import fmp_api_client
from app.models.interval import Interval


router = APIRouter(prefix="/quote_chart", tags=["quote chart"])


@router.get("/{stock}")
async def quote_chart_info(stock, interval: Interval = Depends()):
    return await fmp_api_client.get_quote_chart_info(
        stock, params={"from": str(interval.start), "to": str(interval.finish)}
    )
