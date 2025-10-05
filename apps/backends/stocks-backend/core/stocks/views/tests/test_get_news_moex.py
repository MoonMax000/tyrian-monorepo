import pytest
from rest_framework import status
from django.urls import reverse


@pytest.mark.django_db
def test_get_news(preauth_user_client, stock):
    url = reverse("news")
    response = preauth_user_client.get(url)

    assert response.status_code == status.HTTP_200_OK
    first_index = response.data[0]
    assert first_index["title"] is not None
    assert first_index["published_at"] is not None
    assert first_index["modified_at"] is not None
