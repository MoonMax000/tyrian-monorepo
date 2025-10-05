from collections import defaultdict


async def convert_market_leaders_growth_data(data: list, limit: int | None = None, *kwargs) -> list:
    """
    Конвертирует данные о лидерах по росту из формата источника в формат для фронтенда.
    """
    if len(data) == 0:
        data = [defaultdict(float)]
    res = []
    for item in data:
        symbol = item.get("symbol", "").upper()
        res.append({
            "symbol": symbol,
            "name": item.get("name", ""),
            "price": item.get("price", 0.0),
            "changesPercentage": item.get("changesPercentage", 0.0),
            "icon": f"/media/company_icons/{symbol}.png",
        })
    if limit:
        res = res[:limit]
    return res


async def convert_market_leaders_growth_full_data(data: list, limit: int | None = None, *kwargs) -> list:
    """
    Конвертирует данные о лидерах по росту из формата источника в формат для фронтенда.
    """
    for item in data:
        symbol = item.get("symbol", "").upper()
        if type(item) == dict:
            item["icon"] = f"/media/company_icons/{symbol}.png"
        else:
            continue
    # Не применяем лимит здесь - это будет делать сортировка
    return data


async def convert_market_losers_data(data: list, limit: int | None = None, *kwargs) -> list:
    """
    Конвертирует данные о лидерах по падению из формата источника в формат для фронтенда.
    """
    if len(data) == 0:
        data = [defaultdict(float)]    
    res = []
    for item in data:
        symbol = item.get("symbol", "").upper()
        res.append({
            "symbol": symbol,
            "name": item.get("name", ""),
            "price": item.get("price", 0.0),
            "changesPercentage": item.get("changesPercentage", 0.0),
            "icon": f"/media/company_icons/{symbol}.png",
        })
    if limit:
        res = res[:limit]
    return res


async def convert_market_leaders_volume_data(data: list, limit: int | None = None, *kwargs) -> list:
    """
    Конвертирует данные о лидерах по объему из формата источника в формат для фронтенда.
    """
    if len(data) == 0:
        data = [defaultdict(float)]
    res = []
    for item in data:
        symbol = item.get("symbol", "").upper()
        res.append({
            "symbol": symbol,
            "name": item.get("name", ""),
            "volume": item.get("volume", 0.0),
            "changesPercentage": item.get("changesPercentage", 0.0),
            "icon": f"/media/company_icons/{symbol}.png",
        })
    if limit:
        res = res[:limit]
    return res


async def convert_market_leaders_volatile_data(data: list, limit: int | None = None, *kwargs) -> list:
    """
    Конвертирует данные о лидерах по волатильности из формата источника в формат для фронтенда.
    """
    res = []
    for item in data:
        symbol = item.get("symbol", "").upper()
        if not item.get("isActivelyTrading", False):
            continue
        res.append({
            "symbol": symbol,
            "name": item.get("companyName", ""),
            "price": item.get("price", 0.0),
            "beta": item.get("beta", 0.0),
            "icon": f"/media/company_icons/{symbol}.png",
        })
    # Сортируем по beta, исключая None значения
    res = sorted(res, key=lambda x: x["beta"] if x["beta"] is not None else 0.0, reverse=True)
    if limit:
        res = res[:limit]
    return res
