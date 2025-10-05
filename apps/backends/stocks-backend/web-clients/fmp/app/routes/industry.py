from fastapi import APIRouter, Depends
from app.api_client import fmp_api_client
from app.models.industry import Industry


router = APIRouter(prefix="/industry", tags=["industry"])


@router.get("/")
async def industry_info(industry: Industry = Depends()):
    return await fmp_api_client.get_industry_info(
        params={"date": str(industry.start), "exchange": industry.exchange}
    )
