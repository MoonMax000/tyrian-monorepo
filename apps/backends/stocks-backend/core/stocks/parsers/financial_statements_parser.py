import httpx

from project.settings import FORMATTER_HOST, FORMATTER_PORT


def parse_financial_statements(country: str, ticker: str) -> dict:
    url = f"http://{FORMATTER_HOST}:{FORMATTER_PORT}/get-block/financial-statements/{country}/"
    params = {"ticker": ticker}
    response = httpx.get(url, params=params)
    data = response.json()
    return data
