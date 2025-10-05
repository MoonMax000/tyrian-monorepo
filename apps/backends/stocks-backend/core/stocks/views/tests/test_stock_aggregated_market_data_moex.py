import pytest
from rest_framework import status
from django.urls import reverse


@pytest.mark.django_db
def test_get_stock_aggregated_market_data(preauth_user_client, stock):
    url = reverse("stock-aggregated-market-data", args=[stock.ticker])
    response = preauth_user_client.get(url, {"date": "2025-01-14"})

    assert response.status_code == status.HTTP_200_OK
    assert response.data["data"] is not None
    assert isinstance(response.data["data"], list)

    assert response.data["total_volume"] is not None
    assert response.data["total_trades"] is not None
    assert response.data["total_amount"] is not None
    assert response.data["total_volume_without_repo"] is not None
    assert response.data["total_trades_without_repo"] is not None
    assert response.data["total_amount_without_repo"] is not None

    first_item = response.data["data"][0]
    assert first_item["market_title"] is not None
    assert first_item["trade_date"] is not None
    assert first_item["trades_number"] is not None
    assert first_item["value"] is not None
    assert first_item["volume"] is not None
    assert first_item["updated_at"] is not None
