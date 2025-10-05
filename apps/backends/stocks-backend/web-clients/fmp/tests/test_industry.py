import pytest


@pytest.mark.asyncio
async def test_industry(async_client):
    """
    Тесты для роутеров industry.
    """
    params = {
        "start": "2023-10-10",
        "exchange": "NASDAQ",
    }

    # industry_info
    response = await async_client.get(f"/industry/", params=params)
    assert response.status_code == 200
