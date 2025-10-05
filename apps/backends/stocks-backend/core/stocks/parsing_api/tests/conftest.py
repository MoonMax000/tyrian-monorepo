import pytest
from rest_framework.test import APIClient
from datetime import datetime, timedelta


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def valid_country():
    return "us"


@pytest.fixture
def invalid_country():
    return "fr"


@pytest.fixture
def valid_ticker():
    return "AAPL"


@pytest.fixture
def invalid_ticker():
    return "123"


@pytest.fixture
def valid_dates():
    today = datetime.now()
    return {
        "start": (today - timedelta(days=30)).strftime("%Y-%m-%d"),
        "end": today.strftime("%Y-%m-%d")
    }


@pytest.fixture
def mock_formatter_response(monkeypatch):
    def _mock_response(data, should_raise=False):
        def mock_get(*args, **kwargs):
            class MockResponse:
                def json(self):
                    return data
                
                def raise_for_status(self):
                    if should_raise:
                        raise Exception("Formatter error")
            return MockResponse()

        monkeypatch.setattr('httpx.get', mock_get)
        return mock_get

    return _mock_response 