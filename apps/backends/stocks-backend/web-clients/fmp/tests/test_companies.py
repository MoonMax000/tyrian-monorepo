import pytest


@pytest.mark.asyncio
async def test_companies(async_client):
    """
    Тесты для роутеров companies.
    """
    symbol = "AAPL"
    params = {
        "limit": 1,
        "period": "quarter",
    }

    # company_info
    response = await async_client.get(f"/companies/{symbol}")
    assert response.status_code == 200

    # company_key_metrics
    response = await async_client.get(
        f"/companies/{symbol}/key-metrics", params=params
    )
    assert response.status_code == 200
