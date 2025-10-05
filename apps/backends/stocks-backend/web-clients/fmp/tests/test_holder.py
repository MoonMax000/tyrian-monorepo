import pytest


@pytest.mark.asyncio
async def test_holder(async_client):
    """
    Тесты для роутеров holder.
    """
    symbol = "AAPL"

    # holder_info
    response = await async_client.get(f"/holder/institut/{symbol}")
    assert response.status_code == 200
