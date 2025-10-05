import pytest
from rest_framework import status


@pytest.mark.django_db
class TestHoldersTableView:
    url = "/api/stocks/parsed/holders-table/{country}/{ticker}/"

    def test_get_holders_table_success(self, api_client, valid_country, valid_ticker, mock_formatter_response):
        mock_data = [
            {
                "date": "2024-01-01",
                "holder": "BlackRock Inc.",
                "shares": 1000000,
                "sharesPercent": 5.5,
                "change": 50000,
                "holderType": "Institutional"
            }
        ]
        
        mock_formatter_response(mock_data)
        
        response = api_client.get(
            self.url.format(country=valid_country, ticker=valid_ticker)
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) > 0
        assert "holder" in response.data[0]
        assert "holderType" in response.data[0]

    def test_get_holders_table_invalid_country(self, api_client, invalid_country, valid_ticker):
        response = api_client.get(
            self.url.format(country=invalid_country, ticker=valid_ticker)
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_holders_table_invalid_ticker(self, api_client, valid_country, invalid_ticker):
        response = api_client.get(
            self.url.format(country=valid_country, ticker=invalid_ticker)
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST 