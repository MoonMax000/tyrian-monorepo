import pytest
from rest_framework import status


@pytest.mark.skip(reason="Financial statements endpoint not implemented yet")
@pytest.mark.django_db
class TestFinancialStatementsView:
    url = "/api/stocks/parsed/financial-statements/{country}/{ticker}/"

    def test_get_financial_statements_success(self, api_client, valid_country, valid_ticker, mock_formatter_response):
        mock_data = {
            "incomeStatement": [],
            "balanceSheet": [],
            "cashFlow": []
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
        assert "incomeStatement" in response.data

    def test_get_financial_statements_invalid_country(self, api_client, invalid_country, valid_ticker):
        response = api_client.get(
            self.url.format(country=invalid_country, ticker=valid_ticker)
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_financial_statements_invalid_ticker(self, api_client, valid_country, invalid_ticker):
        response = api_client.get(
            self.url.format(country=valid_country, ticker=invalid_ticker)
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST 