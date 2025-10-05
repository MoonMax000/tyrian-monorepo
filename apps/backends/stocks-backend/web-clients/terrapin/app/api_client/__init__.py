from app.settings import settings
from .terrapin import TerrapinApiClient

terrapin_api_client = TerrapinApiClient(
    base_url=settings.TERRAPIN_API_URL, bearer_api_key=settings.TERRAPIN_API_KEY
)
