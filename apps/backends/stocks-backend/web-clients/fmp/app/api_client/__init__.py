from app.settings import settings
from .FMP import FMPApiClient

fmp_api_client = FMPApiClient(
    base_url=settings.FMP_API_URL, params_api_key=settings.FMP_API_KEY
)
