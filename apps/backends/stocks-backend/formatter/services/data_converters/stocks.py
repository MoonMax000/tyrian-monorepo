from collections import defaultdict
from logger import logger


async def convert_quotation_chart_data(data: list, limit: int | None = None, *kwargs) -> list:
    """
    Конвертирует данные для графика котировок из формата источника в формат для фронтенда.
    """
    if len(data) == 0:
        data = [{}]
    res = []
    for item in data:
        res.append({
            "date": item.get("date", "0000-00-00"),
            "revenue": item.get("revenue", 0.0),
            "ebitda": item.get("ebitda", 0.0),
            "netIncome": item.get("netIncome", 0.0),
            "netIncomeRatio": item.get("netIncomeRatio", 0.0),
        })
    if limit:
        res = res[:limit]
    return res


async def convert_fundamental_analysis_data(data: list, limit: int | None = None, *kwargs) -> dict:
    """
    Конвертирует данные для фундаментального анализа из формата источника в формат для фронтенда.
    """
    # Key metrics, см. поле peRatio
    # Key metrics, см. поле pbRatio или ptbRatio (они одинаковы)
    # Key metrics, см. поле enterpriseValueOverEBITDA
    # Key metrics, см. поле netDebtToEBITDA
    # Key metrics, см. поле roe
    if len(data) == 0:
        data = [defaultdict(float)]

    data = data[0]
    res = {
        "peRatio": {
            "company": data.get("peRatio", 0.0),
            "industry": 0
        },
        "pbRatio": {
            "company": data.get("pbRatio", 0.0),
            "industry": 0
        },
        "enterpriseValueOverEBITDA": {
            "company": data.get("enterpriseValueOverEBITDA", 0.0),
            "industry": 0
        },
        "netDebtToEBITDA": {
            "company": data.get("netDebtToEBITDA", 0.0),
            "industry": 0
        },
        "roe": {
            "company": data.get("roe", 0.0),
            "industry": 0
        },
        "year_price": {
            "min": 0,
            "max": 0,
            "current": 0,
        }
    }
    return res


async def convert_revenue_net_profit_data(data: list, limit: int | None = None, *kwargs) -> list:
    """
    Конвертирует данные для выручки и чистой прибыли из формата источника в формат для фронтенда.

    Выручка (Revenue): 1,918,300,000 USD
    Это общий доход компании от продажи товаров или услуг.

    Прибыль (Net Income): 61,200,000 USD
    Это чистая прибыль компании после вычета всех расходов, включая налоги.

    Доход (Gross Profit): 842,300,000 USD
    Это разница между выручкой и себестоимостью проданных товаров (Cost of Revenue)
    """
    if len(data) == 0:
        data = [{}]
    res = []
    for item in data:
        res.append({
            "date": item.get("date", "0000-00-00"),
            "revenue": item.get("revenue", 0.0),
            "reportedCurrency": item.get("reportedCurrency", "RUB"),
            "netIncome": item.get("netIncome", 0.0),
        })
    res = sorted(res, key=lambda x: x["date"] if x["date"] is not None else "0000-00-00", reverse=True)
    if limit:
        res = res[:limit]
    return res


async def convert_revenue_history_data(data: list, limit: int | None = None, *kwargs) -> list:
    """
    Конвертирует данные для истории выручки из формата источника в формат для фронтенда.
    """
    if len(data) == 0:
        data = [{}]
    res = []
    for item in data:
        res.append({
            "date": item.get("date", "0000-00-00"),
            "revenue": item.get("revenue", 0.0),
            "reportedCurrency": item.get("reportedCurrency", "RUB"),
            "grossProfit": item.get("grossProfit", 0.0),
            "netIncome": item.get("netIncome", 0.0),
        })
    res = sorted(res, key=lambda x: x["date"] if x["date"] is not None else "0000-00-00", reverse=True)
    if limit:
        res = res[:limit]
    return res


async def convert_depbts_assets_data(data: list, limit: int | None = None, *kwargs) -> list:
    """
    Конвертирует данные для долгов и активов из формата источника в формат для фронтенда.

    Активы (Assets):
    Оборотные активы (Total Current Assets): 152,987,000,000 USD
    Включают:

    Денежные средства и их эквиваленты (Cash and Cash Equivalents): 29,943,000,000 USD

    Краткосрочные инвестиции (Short-Term Investments): 35,228,000,000 USD

    Дебиторская задолженность (Net Receivables): 66,243,000,000 USD

    Запасы (Inventory): 7,286,000,000 USD

    Прочие оборотные активы (Other Current Assets): 14,287,000,000 USD

    Внеоборотные активы (Total Non-Current Assets): 211,993,000,000 USD
    Включают:

    Основные средства (Property, Plant, and Equipment Net): 45,680,000,000 USD

    Долгосрочные инвестиции (Long-Term Investments): 91,479,000,000 USD

    Налоговые активы (Tax Assets): 19,499,000,000 USD

    Прочие внеоборотные активы (Other Non-Current Assets): 55,335,000,000 USD

    Итого активы (Total Assets): 364,980,000,000 USD

    Обязательства (Liabilities):
    Краткосрочные обязательства (Total Current Liabilities): 176,392,000,000 USD
    Включают:

    Кредиторская задолженность (Account Payables): 68,960,000,000 USD

    Краткосрочный долг (Short-Term Debt): 22,511,000,000 USD

    Налоговые обязательства (Tax Payables): 26,601,000,000 USD

    Отложенные доходы (Deferred Revenue): 8,249,000,000 USD

    Прочие краткосрочные обязательства (Other Current Liabilities): 50,071,000,000 USD

    Долгосрочные обязательства (Total Non-Current Liabilities): 131,638,000,000 USD
    Включают:

    Долгосрочный долг (Long-Term Debt): 96,548,000,000 USD

    Прочие долгосрочные обязательства (Other Non-Current Liabilities): 35,090,000,000 USD

    Итого обязательства (Total Liabilities): 308,030,000,000 USD

    Задолженности (Debt):
    Общий долг (Total Debt): 106,629,000,000 USD
    Включает краткосрочный и долгосрочный долг.

    Чистый долг (Net Debt): 76,686,000,000 USD
    Рассчитывается как общий долг за вычетом денежных средств и их эквивалентов.
    """
    if len(data) == 0:
        data = [{}]
    res = []
    for item in data:
        res.append({
            "date": item.get("date", "0000-00-00"),
            "totalAssets": item.get("totalAssets", 0.0),
            "totalLiabilities": item.get("totalLiabilities", 0.0),
            "totalDebt": item.get("totalDebt", 0.0),
            "netDebt": item.get("netDebt", 0.0),
            "reportedCurrency": item.get("reportedCurrency", "RUB"),
        })
    res = sorted(res, key=lambda x: x["date"] if x["date"] is not None else "0000-00-00", reverse=True)
    if limit:
        res = res[:limit]
    return res


async def convert_cash_flow_data(data: list, limit: int | None = None, *kwargs) -> list:
    """
    Конвертирует данные для денежного потока из формата источника в формат для фронтенда.
    """
    if len(data) == 0:
        data = [{}]
    res = []
    for item in data:
        res.append({
            "date": item.get("date", "0000-00-00"),
            "netCashProvidedByOperatingActivities": item.get("netCashProvidedByOperatingActivities", 0.0),
            "netCashUsedForInvestingActivites": item.get("netCashUsedForInvestingActivites", 0.0),
            "netCashUsedProvidedByFinancingActivities": item.get("netCashUsedProvidedByFinancingActivities", 0.0),
            "reportedCurrency": item.get("reportedCurrency", "RUB"),
        })
    res = sorted(res, key=lambda x: x["date"] if x["date"] is not None else "0000-00-00", reverse=True)
    if limit:
        res = res[:limit]
    return res


async def convert_trade_volumes_data(data: list, limit: int | None = None, *kwargs) -> list:
    """
    Конвертирует данные для объемов торгов из формата источника в формат для фронтенда.
    """
    if len(data) == 0:
        data = [{}]
    res = []
    for item in data[0]:
        res.append({
            "date": item.get("date", "0000-00-00"),
            "volume": item.get("volume", 0.0),
            "reportedCurrency": item.get("reportedCurrency", "RUB"),
        })
    res = sorted(res, key=lambda x: x["date"] if x["date"] is not None else "0000-00-00", reverse=True)
    if limit:
        res = res[:limit]
    return res


async def convert_financial_stability_data(data: list, limit: int | None = None, *kwargs) -> dict:
    """
    Конвертирует данные для финансовой стабильности из формата источника в формат для фронтенда.
    """
    if not data:
        return {
            "depbts_and_coverage": [],
            "financial_analysis": {
                "totalNonCurrentLiabilities": 0.0,
                "totalCurrentLiabilities": 0.0,
                "totalNonCurrentAssets": 0.0,
                "totalCurrentAssets": 0.0
            }
        }

    # Берем первый элемент для financial_analysis
    latest = data[0] if data else {}
    
    res = {
        "financial_analysis": {
            "totalNonCurrentLiabilities": latest.get("totalNonCurrentLiabilities", 0.0),
            "totalCurrentLiabilities": latest.get("totalCurrentLiabilities", 0.0),
            "totalNonCurrentAssets": latest.get("totalNonCurrentAssets", 0.0),
            "totalCurrentAssets": latest.get("totalCurrentAssets", 0.0),
        },
        "depbts_and_coverage": []
    }

    # Формируем историю для графика
    for item in data:
        res["depbts_and_coverage"].append({
            "date": item.get("date", ""),
            "totalAssets": item.get("totalAssets", 0.0),
            "totalLiabilities": item.get("totalLiabilities", 0.0),
            "cashAndCashEquivalents": item.get("cashAndCashEquivalents", 0.0),
            "reportedCurrency": item.get("reportedCurrency", "USD")
        })

    if limit:
        res["depbts_and_coverage"] = res["depbts_and_coverage"][:limit]

    return res


async def convert_holders_structure_data(data: list, limit: int | None = None, *kwargs) -> list:
    """
    Конвертирует данные для структуры акционеров из формата источника в формат для фронтенда.
    """
    if len(data) == 0:
        data = [{}] 
    res = []
    total_shares = 0
    # Работаем с наиболее свежими данными (последний отчет)
    # Для этого берем дату из самой первой записи, т.е. данные от источника
    # отсортированы в обратном хронологическом порядке и в порядке убывания
    # количества акций у акционера
    date = data[0].get("date", "0000-00-00")
    for item in data:
        if item.get("date", "0000-00-00") != date:
            continue
        total_shares += item.get("shares", 0)
        res.append({
            "date": item.get("date", "0000-00-00"),
            "holder": item.get("holder", "SOMEBODY"),
            "shares": item.get("shares", 0),
            "change": item.get("change", 0),
        })
    res = sorted(res, key=lambda x: x["shares"] if x["shares"] is not None else 0, reverse=True)
    if limit:
        res = res[:limit]
    for item in res:
        item["sharesPercent"] = item.get("shares", 0.0) / total_shares * 100 if total_shares else 0.0
    return res


async def convert_stock_info_data(data: list, limit: int | None = None, *kwargs) -> dict:
    """
    Конвертирует данные для информации об акции из формата источника в формат для фронтенда.
    """
    if len(data) == 0:
        data = [{}]
    data = data[0]
    res = {
        "icon": f"/media/company_icons/{data.get('symbol', '')}.png",
        "price": data.get("price", 0.0),
        "changesPercentage": data.get("changesPercentage", 0.0),
        "symbol": data.get("symbol", "SOME_SYMBOL"),
        "name": data.get("name", "SOME_NAME"),
        "exchange": data.get("exchange", "SOME_EXCHANGE"),
        "previousClose": data.get("previousClose", 0.0),
    }

    return res


async def convert_holders_table_data(data: list, limit: int | None = None, *kwargs) -> list:
    """
    Конвертирует данные для таблицы акционеров из формата источника в формат для фронтенда.
    """
    if len(data) == 0:
        data = [{}] 
    res = []
    total_shares = 0
    # Работаем с наиболее свежими данными (последний отчет)
    # Для этого берем дату из самой первой записи, т.е. данные от источника
    # отсортированы в обратном хронологическом порядке и в порядке убывания
    # количества акций у акционера
    date = data[0].get("date", "0000-00-00")
    for item in data:
        if item.get("date", "0000-00-00") != date:
            continue
        if item.get("shares", 0) == 0:
            continue
        total_shares += item.get("shares", 0)
        res.append({
            "date": item.get("date", "0000-00-00"),
            "holder": item.get("holder", "SOMEBODY"),
            "shares": item.get("shares", 0),
            "change": item.get("change", 0),
            "holderType": item.get("holderType", "Institutional"),
        })
    res = sorted(res, key=lambda x: x["shares"] if x["shares"] is not None else 0, reverse=True)
    if limit:
        res = res[:limit]
    for item in res:
        item["sharesPercent"] = item.get("shares", 0.0) / total_shares * 100 if total_shares else 0.0
    return res


async def convert_roe_data(data: list, limit: int | None = None, *kwargs) -> list:
    """
    Конвертирует данные для ROE из формата источника в формат для фронтенда.
    """
    if len(data) == 0:
        data = [{}]
    res = []
    for item in data:
        res.append({
            "date": item.get("date", "0000-00-00"),
            "roe": item.get("roe", 0.0),
        })
    res = sorted(res, key=lambda x: x["date"] if x["date"] is not None else "0000-00-00", reverse=True)
    if limit:
        res = res[:limit]
    return res

async def convert_dividends_data(data: list, limit: int | None = None, *kwargs) -> list:
    """
    Конвертирует данные для Дивидендов из формата источника в формат для фронтенда.
    """
    if len(data) == 0:
        data = [{}]
    res = []
    for item in data:
        res.append({
            "date": item.get("date", "0000-00-00"),
            "dividends": item.get("dividend", 0.0),
            "paymentDate": item.get("paymentDate", "0000-00-00"),
            "declarationDate": item.get("declarationDate", "0000-00-00"),
        })
    res = sorted(res, key=lambda x: x["date"] if x["date"] is not None else "0000-00-00", reverse=True)
    if limit:
        res = res[:limit]
    return res


async def sort_market_leaders_data(data: list, limit: int | None = None, params: dict = None, *kwargs) -> list:
    """
    Сортирует данные market leaders по различным полям.
    """
    logger.debug(f"Sorting market leaders params: {params}")
    
    def get_change_percent_1h(x: dict) -> float:
        """Возвращает change_percent_1h из словаря для сортировки"""
        value = x.get("change_percent_1h", 0.0)
        return value if value is not None else 0.0
    
    def get_change_percent_24h(x: dict) -> float:
        """Возвращает change_percent_24h из словаря для сортировки"""
        value = x.get("change_percent_24h", 0.0)
        return value if value is not None else 0.0
    
    def get_change_percent_7d(x: dict) -> float:
        """Возвращает change_percent_7d из словаря для сортировки"""
        value = x.get("change_percent_7d", 0.0)
        return value if value is not None else 0.0
    
    def get_volume_24h(x: dict) -> float:
        """Возвращает volume_24h из словаря для сортировки"""
        value = x.get("volume_24h", 0.0)
        return value if value is not None else 0.0
    
    def get_market_cap(x: dict) -> float:
        """Возвращает market_cap из словаря для сортировки"""
        value = x.get("market_cap", 0.0)
        return value if value is not None else 0.0
    
    def get_name(x: dict) -> str:
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
        case "change_percent_1h":
            sort_func = get_change_percent_1h
        case "change_percent_24h":
            sort_func = get_change_percent_24h
        case "change_percent_7d":
            sort_func = get_change_percent_7d
        case "volume_24h":
            sort_func = get_volume_24h
        case "market_cap":
            sort_func = get_market_cap
        case "name":
            sort_func = get_name
        case _:
            sort_func = get_market_cap
    
    logger.debug(f"Sorting market leaders by {sort_func.__name__} with reverse = {reverse}")
    sorted_data = sorted(data, key=sort_func, reverse=reverse)
    
    if limit is not None:
        return sorted_data[:limit]
    
    return sorted_data


async def sort_bonds_data(data: list, limit: int | None = None, params: dict = None, *kwargs) -> list:
    """
    Сортирует данные облигаций по различным полям.
    """
    logger.debug(f"Sorting bonds params: {params}")
    
    def get_ytm(x: dict) -> float:
        """Возвращает ytm из словаря для сортировки"""
        value = x.get("ytm", 0.0)
        return value if value is not None else 0.0
    
    def get_name(x: dict) -> str:
        """Возвращает emitent_name_eng из словаря для сортировки"""
        return x.get("emitent_name_eng", "")
    
    # TODO: Добавить другие поля для сортировки в будущем
    # def get_maturity_date(x: dict) -> str:
    #     """Возвращает maturity_date из словаря для сортировки"""
    #     return x.get("maturity_date", "")
    
    # def get_coupon_rate(x: dict) -> float:
    #     """Возвращает coupon_rate из словаря для сортировки"""
    #     value = x.get("coupon_rate", 0.0)
    #     return value if value is not None else 0.0

    if params:
        sort_by = params.get("sort_by", "ytm")
        sort_direction = params.get("sort_direction", "desc")
    else:
        sort_by = "ytm"
        sort_direction = "desc"

    reverse = sort_direction == "desc"

    match sort_by:
        case "ytm":
            sort_func = get_ytm
        case "name":
            sort_func = get_name
        # TODO: Добавить другие случаи сортировки
        # case "maturity_date":
        #     sort_func = get_maturity_date
        # case "coupon_rate":
        #     sort_func = get_coupon_rate
        case _:
            sort_func = get_ytm
    
    logger.debug(f"Sorting bonds by {sort_func.__name__} with reverse = {reverse}")
    sorted_data = sorted(data, key=sort_func, reverse=reverse)
    
    if limit is not None:
        return sorted_data[:limit]
    
    return sorted_data


async def filter_corporate_bonds_data(data: list, limit: int | None = None, params: dict = None, *kwargs) -> list:
    """
    Фильтрует данные облигаций в зависимости от переданного параметра kind.
    """
    data = data.get("items", [])
    if not params or "kind" not in params or not params["kind"]:
        # Если параметр kind не передан, возвращаем все данные
        if limit:
            return data[:limit]
        return data
    
    kind = params["kind"]
    from datetime import datetime, timedelta
    
    # Получаем текущую дату для расчетов
    current_date = datetime.now()
    four_years_later = current_date + timedelta(days=4*365)
    
    # Функции-предикаты для каждого типа фильтрации
    def is_long_term(item):
        maturity_date_str = item.get("maturity_date")
        if not maturity_date_str:
            return False
        try:
            maturity_date = datetime.strptime(maturity_date_str, "%Y-%m-%d")
            return maturity_date > four_years_later
        except ValueError:
            return False
    
    def is_short_term(item):
        maturity_date_str = item.get("maturity_date")
        if not maturity_date_str:
            return False
        try:
            maturity_date = datetime.strptime(maturity_date_str, "%Y-%m-%d")
            return maturity_date <= four_years_later
        except ValueError:
            return False
    
    def is_fixed_rate(item):
        return item.get("floating_rate") == "0"
    
    def is_floating_rate(item):
        return not is_fixed_rate(item)
    
    def is_zero_coupon(item):
        coupon_type_id = item.get("coupon_type_id")
        cupon_eng = item.get("cupon_eng")
        return coupon_type_id == "1" or cupon_eng == "0%"
    
    def is_corporate(item):
        emitent_type_name_eng = item.get("emitent_type_name_eng")
        emitent_type_id = item.get("emitent_type_id", 0)
        return "corporate" in emitent_type_name_eng or emitent_type_id == 1
    
    logger.info(f"📊 Total bonds before corporate filter: {len(data)}")

    # Словарь соответствия параметра kind и функции-предиката
    filter_functions = {
        "long-term": is_long_term,
        "short-term": is_short_term,
        "fixed rate": is_fixed_rate,
        "floating rate": is_floating_rate,
        "zero coupon": is_zero_coupon,
        "All Bonds": lambda item: True,
    }
    
    # Получаем функцию фильтрации
    filter_func = filter_functions.get(kind)
    if not filter_func:
        return data[:limit] if limit else data
    
    # Выбираем корпоративные облигации

    corporate_bonds = list(filter(is_corporate, data))
    logger.info(f"🏢 Corporate bonds after type filter: {len(corporate_bonds)}")
    # Применяем фильтр
    filtered_data = list(filter(filter_func, corporate_bonds))
    
    # Применяем лимит если указан
    if limit:
        filtered_data = filtered_data[:limit]
    
    return filtered_data


async def filter_goverment_bonds_data(data: list, limit: int | None = None, params: dict = None, *kwargs) -> list:
    """
    Фильтрует данные правительственных облигаций по регионам и странам.
    """
    data = data.get("items", [])
    if not params or "kind" not in params or not params["kind"]:
        # Если параметр kind не передан, возвращаем все данные
        if limit:
            return data[:limit]
        return data
    
    kind = params["kind"]
    
    # Импортируем словарь стран (отложенный импорт для избежания циклических зависимостей)
    try:
        from shared.countries import COUNTRIES_BY_REGION
    except ImportError:
        # Fallback если импорт не удался
        COUNTRIES_BY_REGION = {}

    # Функции-заглушки для 10Y фильтров
    def is_all_10y(item):
        # TODO: Реализовать логику для 10-летних облигаций
        return True
    
    def is_major_10y(item):
        # TODO: Реализовать логику для крупных 10-летних эмитентов
        return True
    
    # Функция фильтрации по стране/региону
    def filter_by_country_or_region(item, target_kind):
        if target_kind not in COUNTRIES_BY_REGION:
            return False
        
        item_country = item.get("emitent_country_name_eng", "").lower()
        allowed_countries = COUNTRIES_BY_REGION[target_kind]
        
        return any(country in item_country for country in allowed_countries)
    
    # Словарь соответствия параметра kind и функции-предиката
    filter_functions = {
        "All Bonds": lambda item: True,  # Все облигации
        "All 10Y": is_all_10y,  # Заглушка
        "Major 10Y": is_major_10y,  # Заглушка
        "Americas": lambda item: filter_by_country_or_region(item, "Americas"),
        "Europe": lambda item: filter_by_country_or_region(item, "Europe"),
        "Asia": lambda item: filter_by_country_or_region(item, "Asia"),
        "Pacific": lambda item: filter_by_country_or_region(item, "Pacific"),
        "Middle East": lambda item: filter_by_country_or_region(item, "Middle East"),
        "Africa": lambda item: filter_by_country_or_region(item, "Africa"),
        "USA": lambda item: filter_by_country_or_region(item, "USA"),
        "United Kingdom": lambda item: filter_by_country_or_region(item, "United Kingdom"),
        "European Union": lambda item: filter_by_country_or_region(item, "European Union"),
        "Germany": lambda item: filter_by_country_or_region(item, "Germany"),
        "France": lambda item: filter_by_country_or_region(item, "France"),
        "Mainland China": lambda item: filter_by_country_or_region(item, "Mainland China"),
        "India": lambda item: filter_by_country_or_region(item, "India"),
        "Japan": lambda item: filter_by_country_or_region(item, "Japan"),
    }
    
    # Получаем функцию фильтрации
    filter_func = filter_functions.get(kind)
    if not filter_func:
        return data[:limit] if limit else data
    
    # Выбираем правительственные облигации
    def is_goverment(item):
        emitent_type_name_eng = item.get("emitent_type_name_eng", "")
        emitent_type_id = item.get("emitent_type_id", 0)
        return "corporate" not in emitent_type_name_eng.lower() and emitent_type_id != 1
    
    goverment_bonds = list(filter(is_goverment, data))
    
    # Применяем фильтр
    filtered_data = list(filter(filter_func, goverment_bonds))
    
    # Применяем лимит если указан
    if limit:
        filtered_data = filtered_data[:limit]
    
    return filtered_data
