from fastapi import APIRouter, HTTPException
from starlette.status import HTTP_404_NOT_FOUND

from app.api_client import terrapin_api_client
from app.models.bonds import BondFilter, BondPricingFilter




router = APIRouter(prefix="/bonds", tags=["bonds"])


@router.post("/")
async def get_bonds(payload: BondFilter):
    offset = (payload.page - 1) * payload.limit
    payload = payload.model_dump(exclude_none=True)
    payload.pop("page", None)
    payload["offset"] = offset
    
    print(f"🔍 [BONDS] Searching bonds with payload: {payload}")
    search_bonds_response = await terrapin_api_client.bond_search(payload=payload)
    data = search_bonds_response.get("data", None)
    if not data:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Bond search failed for page {payload.page}"
        )
    isins = [bond["isin"] for bond in data]
    quoted_number = 100  # Для стартового тарифа макс 100 номеров в запросе, иначе 402
    quoted_isins = isins[:quoted_number]
    bond_reference_response = await terrapin_api_client.bond_reference(payload={"isins": quoted_isins})

    return bond_reference_response

@router.post("/latest_prices")
async def get_bonds_latest_price(payload: BondPricingFilter):
    bond_pricing_latest_response = await terrapin_api_client.bond_pricing_latest(payload=payload.model_dump(exclude_none=True))
    print(f"🔍 [BONDS] Latest prices response: {bond_pricing_latest_response}")
    return bond_pricing_latest_response
