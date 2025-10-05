import httpx

from project.settings import FORMATTER_HOST, FORMATTER_PORT, FORMATTER_PREFIX


def parse_block_data(block_slug: str, country: str, params: dict) -> dict:
    url = f"http://{FORMATTER_HOST}:{FORMATTER_PORT}{FORMATTER_PREFIX}/get-block/{block_slug}/{country}/"
    response = httpx.get(url, params=params)
    data = response.json()
    return data
