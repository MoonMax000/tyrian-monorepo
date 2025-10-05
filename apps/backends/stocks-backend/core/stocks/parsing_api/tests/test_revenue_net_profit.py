import pytest
from rest_framework import status


@pytest.mark.django_db
class TestRevenueNetProfitView:
    url = "/api/stocks/parsed/revenue-net-profit/{country}/{ticker}/"

    def test_get_revenue_net_profit_success(self, api_client, valid_country, valid_ticker, mock_formatter_response):
        mock_data = [
            {
                "date": "2024-01-01",
                "revenue": 100.0,
                "netIncome": 20.0,
                "reportedCurrency": "USD"
            }
        ]
        
        def custom_mock_response(*args, **kwargs):
            return mock_data
            
        mock_formatter_response(custom_mock_response)
        
        response = api_client.get(
            self.url.format(country=valid_country, ticker=valid_ticker)
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) > 0
        assert "revenue" in response.data[0]

    def test_get_revenue_net_profit_invalid_country(self, api_client, invalid_country, valid_ticker):
        response = api_client.get(
            self.url.format(country=invalid_country, ticker=valid_ticker)
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_revenue_net_profit_invalid_ticker(self, api_client, valid_country, invalid_ticker):
        response = api_client.get(
            self.url.format(country=valid_country, ticker=invalid_ticker)
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST 