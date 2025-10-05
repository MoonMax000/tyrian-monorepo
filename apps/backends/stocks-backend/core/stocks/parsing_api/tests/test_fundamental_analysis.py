import pytest
from rest_framework import status


@pytest.mark.django_db
class TestFundamentalAnalysisView:
    url = "/api/stocks/parsed/fundamental-analysis/{country}/{ticker}/"

    def test_get_fundamental_analysis_success(self, api_client, valid_country, valid_ticker, mock_formatter_response):
        mock_data = {
            "peRatio": {"company": 15.5, "industry": 20.1},
            "pbRatio": {"company": 3.2, "industry": 2.8},
            "enterpriseValueOverEBITDA": {"company": 12.3, "industry": 11.5},
            "netDebtToEBITDA": {"company": 1.2, "industry": 1.5},
            "roe": {"company": 25.5, "industry": 22.1},
            "yearPrice": {"min": 120.5, "max": 180.3, "current": 150.2}
        }
        
        def custom_mock_response(*args, **kwargs):
            if kwargs.get('params', {}).get('ticker') == 'AAPL':
                return mock_data
            return {}
        
        mock_formatter_response(custom_mock_response)
        
        response = api_client.get(
            self.url.format(country=valid_country, ticker=valid_ticker)
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert "peRatio" in response.data
        assert "company" in response.data["peRatio"]

    def test_get_fundamental_analysis_invalid_country(self, api_client, invalid_country, valid_ticker):
        response = api_client.get(
            self.url.format(country=invalid_country, ticker=valid_ticker)
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_fundamental_analysis_invalid_ticker(self, api_client, valid_country, invalid_ticker):
        response = api_client.get(
            self.url.format(country=valid_country, ticker=invalid_ticker)
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST 