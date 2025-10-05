import pytest
from rest_framework import status


@pytest.mark.django_db
class TestStockInfoView:
    url = "/api/stocks/parsed/stock-info/{country}/{ticker}/"

    def test_get_stock_info_success(self, api_client, valid_country, valid_ticker, mock_formatter_response):
        mock_data = {
            "icon": "/media/company_icons/AAPL.svg",
            "price": 150.0,
            "changesPercentage": 2.5,
            "symbol": "AAPL",
            "name": "Apple Inc",
            "exchange": "NASDAQ"
        }
        
        def custom_mock_response(*args, **kwargs):
            return mock_data
            
        mock_formatter_response(custom_mock_response)
        
        response = api_client.get(
            self.url.format(country=valid_country, ticker=valid_ticker)
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert "symbol" in response.data
        assert response.data["symbol"] == "AAPL"

    def test_get_stock_info_invalid_country(self, api_client, invalid_country, valid_ticker):
        response = api_client.get(
            self.url.format(country=invalid_country, ticker=valid_ticker)
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_stock_info_invalid_ticker(self, api_client, valid_country, invalid_ticker):
        response = api_client.get(
            self.url.format(country=valid_country, ticker=invalid_ticker)
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST 