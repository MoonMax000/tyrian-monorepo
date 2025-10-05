import pytest
from rest_framework import status
from django.urls import reverse


@pytest.mark.django_db
def test_get_stocks_list(preauth_user_client, stock):
    url = reverse("stock-list")
    response = preauth_user_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    first_stock = response.data[0]
    assert first_stock["name"] is not None
    assert first_stock["ticker"] is not None
