import pytest
from rest_framework import status
from django.urls import reverse


@pytest.mark.django_db
def test_get_stock_current_info(preauth_user_client, stock):
    url = reverse("stock-current-info", args=[stock.ticker])
    response = preauth_user_client.get(url)

    assert response.status_code == status.HTTP_200_OK

    assert response.data["ticker"] == stock.ticker

    assert response.data["trading_regime"] is not None
    assert response.data["full_name"] is not None
    assert response.data["reg_number"] is not None
    assert response.data["issue_size"] is not None
    assert response.data["currency_id"] is not None
    assert response.data["settlement_date"] is not None
    assert response.data["prev_date"] is not None
    assert response.data["instrument_id"] is not None
    assert response.data["short_name"] is not None

    assert response.data["last_price"] is not None
    assert response.data["low_price"] is not None
    assert response.data["high_price"] is not None
    assert response.data["last_change"] is not None
    assert response.data["last_change_percents"] is not None

    assert response.data["trades_number"] is not None
    assert response.data["today_volume"] is not None
    assert response.data["capitalization"] is not None
    assert response.data["board_id"] is not None
    assert response.data["value_today"] is not None
    assert response.data["isin"] is not None
