from app.settings import settings
from .CBONDS import SBONDSApiClient


cbonds_api_client = SBONDSApiClient(
    base_url=settings.CBONDS_API_URL, login=settings.LOGIN, password=settings.PASSWORD
)
