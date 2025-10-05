import pytest


@pytest.mark.asyncio
async def test_quote_chart(async_client):
    """
    Тесты для роутеров quote_chart.
    """
    symbol = "AAPL"
    params = {
        "start": "2024-10-10",
        "finish": "2024-10-11",
    }

    # quote_chart
    response = await async_client.get(f"/quote_chart/{symbol}", params=params)
    assert response.status_code == 200
