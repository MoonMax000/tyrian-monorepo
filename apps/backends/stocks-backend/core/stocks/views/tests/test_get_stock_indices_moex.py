import pytest
from rest_framework import status
from django.urls import reverse


@pytest.mark.django_db
def test_get_stock_indices(preauth_user_client, stock):
    url = reverse("stock-indices", args=[stock.ticker])
    response = preauth_user_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    first_index = response.data[0]
    assert first_index["code"] is not None
    assert first_index["shortname"] is not None
    assert first_index["from_date"] is not None
    assert first_index["till_date"] is not None
    assert first_index["current_value"] is not None
    assert first_index["last_change_percents"] is not None
    assert first_index["last_change"] is not None
