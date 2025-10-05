import pytest


@pytest.mark.asyncio
async def test_leaders(async_client):
    """
    Тесты для роутеров market_leaders.
    """
    symbol = "AAPL"

    # leaders_volume
    response = await async_client.get("/api/v1/market_leaders/leaders_volume")
    assert response.status_code == 200

    # growth_leaders
    response = await async_client.get("/api/v1/market_leaders/growth_leaders")
    assert response.status_code == 200

    # decline_leaders
    response = await async_client.get("/api/v1/market_leaders/decline_leaders")
    assert response.status_code == 200

    # leaders_volatility
    response = await async_client.get(
        "/api/v1/market_leaders/leaders_volatility"
    )
    assert response.status_code == 200

    # trading_volumes
    response = await async_client.get(
        f"/api/v1/market_leaders/trading_volumes/{symbol}"
    )
    assert response.status_code == 200
