import pytest
from rest_framework import status


@pytest.mark.django_db
class TestQuotationChartView:
    url = "/api/stocks/parsed/quotation-chart/{country}/{ticker}/"

    def test_get_quotation_chart_invalid_country(self, api_client, invalid_country, 
                                               valid_ticker, valid_dates):
        response = api_client.get(
            self.url.format(country=invalid_country, ticker=valid_ticker),
            data=valid_dates
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_quotation_chart_invalid_ticker(self, api_client, valid_country, 
                                              invalid_ticker, valid_dates):
        response = api_client.get(
            self.url.format(country=valid_country, ticker=invalid_ticker),
            data=valid_dates
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST 