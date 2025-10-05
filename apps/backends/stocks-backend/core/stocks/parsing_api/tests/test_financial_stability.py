import pytest
from rest_framework import status


@pytest.mark.django_db
class TestFinancialStabilityView:
    url = "/api/stocks/parsed/financial-stability/{country}/{ticker}/"

    def test_get_financial_stability_success(self, api_client, valid_country, valid_ticker, mock_formatter_response):
        mock_data = {
            "financial_analysis": {
                "totalNonCurrentLiabilities": 50000.0,
                "totalCurrentLiabilities": 30000.0,
                "totalNonCurrentAssets": 70000.0,
                "totalCurrentAssets": 40000.0,
            },
            "depbts_and_coverage": [
                {
                    "date": "2024-01-01",
                    "totalAssets": 110000.0,
                    "totalLiabilities": 80000.0,
                    "cashAndCashEquivalents": 20000.0,
                    "reportedCurrency": "USD"
                }
            ]
        }
        
        mock_formatter_response(mock_data)
        
        response = api_client.get(
            self.url.format(country=valid_country, ticker=valid_ticker)
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert "totalNonCurrentLiabilities" in response.data["financial_analysis"]
        assert "depbts_and_coverage" in response.data

    def test_get_financial_stability_invalid_country(self, api_client, invalid_country, valid_ticker):
        response = api_client.get(
            self.url.format(country=invalid_country, ticker=valid_ticker)
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_financial_stability_invalid_ticker(self, api_client, valid_country, invalid_ticker):
        response = api_client.get(
            self.url.format(country=valid_country, ticker=invalid_ticker)
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST 