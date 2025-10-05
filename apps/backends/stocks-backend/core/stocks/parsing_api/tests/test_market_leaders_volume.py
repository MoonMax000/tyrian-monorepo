import pytest
from rest_framework import status


@pytest.mark.django_db
class TestMarketLeadersVolumeView:
    url = "/api/stocks/parsed/market-leaders-volume/{country}/"

    def test_get_leaders_volume_success(self, api_client, valid_country, mock_formatter_response):
        mock_data = [
            {
                "icon": "/media/company_icons/AAPL.png",
                "symbol": "AAPL",
                "name": "Apple Inc",
                "price": 150.0,
                "changesPercentage": 2.5,
                "volume": 1000000
            }
        ]
        
        mock_formatter_response(mock_data)  # Просто передаем данные, без custom_mock_response
        
        response = api_client.get(self.url.format(country=valid_country))
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) > 0  # Проверяем что данные есть
        assert "symbol" in response.data[0]  # Проверяем структуру

    def test_get_leaders_volume_invalid_country(self, api_client, invalid_country):
        response = api_client.get(self.url.format(country=invalid_country))
        assert response.status_code == status.HTTP_400_BAD_REQUEST 