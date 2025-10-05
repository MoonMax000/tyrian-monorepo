from collections import defaultdict
from logger import logger


async def sort_crypto_data(data: list, limit: int | None = None, params: dict = None, *kwargs) -> list:
    """
    Сортирует данные по крипте при выборе категории all по MarketCap
    """
    logger.debug(f"Sorting crypto params: {params}")
    def get_market_cap(x: dict) -> float:
        """Возвращает marketCap из словаря для сортировки"""
        value = x.get("quote", {}).get("USD", {}).get("market_cap", 0.0) 
        return value or 0.0

    def get_percent_change_1h(x: dict) -> float:
        """Возвращает percent_change_1h из словаря для сортировки"""
        return x.get("quote", {}).get("USD", {}).get("percent_change_1h", 0.0)

    def get_percent_change_24h(x: dict) -> float:
        """Возвращает percent_change_24h из словаря для сортировки"""
        return x.get("quote", {}).get("USD", {}).get("percent_change_24h", 0.0)

    def get_percent_change_7d(x: dict) -> float:
        """Возвращает percent_change_7d из словаря для сортировки"""
        return x.get("quote", {}).get("USD", {}).get("percent_change_7d", 0.0)

    def get_volume_24h(x: dict) -> float:
        """Возвращает volume_24h из словаря для сортировки"""
        return x.get("quote", {}).get("USD", {}).get("volume_24h", 0.0)

    def get_price(x: dict) -> float:
        """Возвращает price из словаря для сортировки"""
        price = x.get("quote", {}).get("USD", {}).get("price", 0.0)
        return price or 0.0

    def get_name(x: dict) -> float:
        """Возвращает name из словаря для сортировки"""
        return x.get("name", "")

    if params:
        sort_by = params.get("sort_by", "market_cap")
        sort_direction = params.get("sort_direction", "desc")
    else:
        sort_by = "market_cap"
        sort_direction = "desc"

    reverse = sort_direction == "desc"

    match sort_by:
        case "market_cap":
            sort_func = get_market_cap
        case "percent_change_1h":
            sort_func = get_percent_change_1h
        case "percent_change_24h":
            sort_func = get_percent_change_24h
        case "percent_change_7d":
            sort_func = get_percent_change_7d 
        case "volume_24h":
            sort_func = get_volume_24h
        case "name":
            sort_func = get_name
        case "price":
            sort_func = get_price
        case _:
            sort_func = get_market_cap
    
    logger.debug(f"Sorting crypto by {sort_func.__name__} with reverse = {reverse}")
    sorted_data = sorted(data, key=sort_func, reverse=reverse)
    
    if limit is not None:
        return sorted_data[:limit]
    
    return sorted_data
