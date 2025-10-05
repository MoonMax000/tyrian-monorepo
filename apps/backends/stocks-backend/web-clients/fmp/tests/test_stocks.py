import pytest


@pytest.mark.asyncio
async def test_stocks(async_client):
    """
    Тесты для роутеров stocks.
    """
    symbol = "AAPL"
    params = {
        "limit": 1,
        "period": "quarter",
    }

    # stocks_info
    response = await async_client.get(f"/stocks/{symbol}")
    assert response.status_code == 200

    # financial_statements
    response = await async_client.get(
        f"/stocks/financial_statements/{symbol}", params=params
    )
    assert response.status_code == 200

    # balance_sheet_states
    response = await async_client.get(
        f"/stocks/balance_sheet_states/{symbol}", params=params
    )
    assert response.status_code == 200

    # cashflow_growth
    response = await async_client.get(
        f"/stocks/cashflow_growth/{symbol}", params=params
    )
    assert response.status_code == 200

    # high_low_price
    response = await async_client.get(f"/stocks/high_low_price/{symbol}")
    assert response.status_code == 200

    # dividends
    response = await async_client.get(f"/stocks/dividends/{symbol}")
    assert response.status_code == 200