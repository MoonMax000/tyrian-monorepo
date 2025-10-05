from logger import logger
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta


async def convert_terrapin_bonds_data(data: Dict[str, Any], limit: Optional[int] = None, params: Dict[str, Any] = None, *kwargs) -> List[Dict[str, Any]]:
    """
    Конвертирует данные облигаций из формата Terrapin в формат для фронтенда.
    Обрабатывает объединенные данные из Bond search, Reference Data и Latest pricing.
    
    Args:
        data: Словарь с объединенными данными облигаций
        limit: Максимальное количество записей
        params: Параметры фильтрации и сортировки
        
    Returns:
        Список конвертированных облигаций
    """
    if not isinstance(data, dict):
        logger.warning(f"Expected dict, got {type(data)}")
        return []
    
    # Извлекаем данные из разных источников
    bonds_data = data.get("bonds_data", [])
    reference_data = data.get("reference_data", [])
    pricing_data = data.get("pricing_data", [])
    
    if not bonds_data:
        logger.warning("No bonds data found")
        return []
    
    # Создаем словари для быстрого поиска
    reference_dict = {item.get("isin"): item for item in reference_data}
    pricing_dict = {item.get("isin"): item for item in pricing_data}
    
    converted_data = []
    
    for bond in bonds_data:
        try:
            isin = bond.get("isin")
            if not isin:
                continue
                
            # Объединяем данные из всех источников
            combined_bond = bond.copy()
            
            # Добавляем данные из Reference Data
            if isin in reference_dict:
                combined_bond.update(reference_dict[isin])
            
            # Добавляем данные из Latest pricing
            if isin in pricing_dict:
                combined_bond.update(pricing_dict[isin])
            
            converted_bond = _convert_single_bond(combined_bond)
            converted_data.append(converted_bond)
            
        except Exception as e:
            logger.error(f"Error converting bond {bond.get('isin', 'unknown')}: {str(e)}")
            continue
    
    logger.info(f"Converted {len(converted_data)} bonds from Terrapin format")
    
    if limit:
        converted_data = converted_data[:limit]
    
    return converted_data


def _convert_single_bond(bond: Dict[str, Any]) -> Dict[str, Any]:
    """
    Конвертирует одну облигацию из формата Terrapin в CBONDS-совместимый формат.
    """
    # Определяем тип эмитента на основе issuer_type
    issuer_type = bond.get("issuer_type", "").lower()
    is_corporate = issuer_type == "corporate"
    
    # Определяем тип купона на основе interest_type
    interest_type = bond.get("interest_type", "").lower()
    is_floating_rate = "variable" in interest_type or "floating" in interest_type
    is_zero_coupon = "zero" in interest_type or "discount" in interest_type
    
    # Определяем тип погашения
    maturity_type = bond.get("maturity_type", "").lower()
    is_callable = bond.get("is_callable", False)
    is_puttable = bond.get("is_puttable", False)
    
    # Базовые поля
    converted = {
        "id": bond.get("isin", ""),
        "isin": bond.get("isin", ""),
        "ticker": bond.get("ticker", ""),
        "name": bond.get("name", ""),
        "emitent_name_eng": bond.get("issuer_name", ""),
        "emitent_type_name_eng": "corporate" if is_corporate else "government",
        "emitent_type_id": 1 if is_corporate else 0,
        "issuer_type": bond.get("issuer_type", ""),
        "emitent_country_name_eng": bond.get("country", ""),
        "maturity_date": bond.get("maturity_date", ""),
        "coupon_rate": bond.get("coupon", 0.0),
        "coupon_frequency": bond.get("coupon_frequency", 1),
        "interest_type": bond.get("interest_type", ""),
        "floating_rate": "1" if is_floating_rate else "0",
        "coupon_type_id": "1" if is_zero_coupon else "0",
        "cupon_eng": f"{bond.get('coupon', 0)}%" if not is_zero_coupon else "0%",
        "ytm": bond.get("yield_to_maturity"),
        "price": bond.get("price"),
        "currency": bond.get("currency", ""),
        "issue_date": bond.get("issue_date", ""),
        "amount_issued": bond.get("issued_amount", 0),
        "rating": bond.get("issue_rating_group", bond.get("issuer_rating_group", "")),
        "composite_issue_rating": bond.get("composite_issue_rating", ""),
        "composite_issuer_rating": bond.get("composite_issuer_rating", ""),
        "sector": bond.get("sector", ""),
        "industry_group": bond.get("industry_group", ""),
        "rank": bond.get("rank", ""),
        "is_callable": is_callable,
        "is_puttable": is_puttable,
        "is_green": bond.get("is_green", False),
        "is_inflation_linked": bond.get("is_inflation_linked", False),
        "is_outstanding": bond.get("is_outstanding", True),
        "minimum_denomination": bond.get("minimum_denomination", 0),
        "integral_multiple": bond.get("integral_multiple", 0),
        "lei": bond.get("lei", ""),
        "figi": bond.get("figi", ""),
        "cfi_code": bond.get("cfi_code", ""),
        "first_coupon_date": bond.get("first_coupon_date", ""),
        "interest_accrual_date": bond.get("interest_accrual_date", ""),
        "interest_accrual_convention": bond.get("interest_accrual_convention", ""),
        "registration_type": bond.get("registration_type", ""),
        "is_144a": bond.get("is_144a", False),
        "is_regs": bond.get("is_regs", False),
        "is_covered": bond.get("is_covered", False),
        "handle": bond.get("handle", ""),
        "lei_direct_parent": bond.get("lei_direct_parent", ""),
        "lei_ultimate_parent": bond.get("lei_ultimate_parent", ""),
        # Данные о ценах (если есть)
        "duration": bond.get("duration"),
        "modified_duration": bond.get("modified_duration"),
        "convexity": bond.get("convexity"),
        "volume": bond.get("estimated_volume"),
        "pricing_date": bond.get("date"),
    }
    
    return converted


async def filter_terrapin_corporate_bonds(data: Dict[str, Any], limit: Optional[int] = None, params: Dict[str, Any] = None, *kwargs) -> List[Dict[str, Any]]:
    """
    Фильтрует корпоративные облигации из данных Terrapin.
    Обрабатывает объединенные данные из Bond search, Reference Data и Latest pricing.
    """
    if not isinstance(data, dict):
        logger.warning(f"Expected dict, got {type(data)}")
        return []
    
    # Извлекаем данные из разных источников
    bonds_data = data.get("bonds_data", [])
    reference_data = data.get("reference_data", [])
    pricing_data = data.get("pricing_data", [])
    
    if not bonds_data:
        logger.warning("No bonds data found")
        return []
    
    # Создаем словари для быстрого поиска
    reference_dict = {item.get("isin"): item for item in reference_data}
    pricing_dict = {item.get("isin"): item for item in pricing_data}
    
    # Объединяем данные из всех источников
    combined_data = []
    for bond in bonds_data:
        isin = bond.get("isin")
        if not isin:
            continue
            
        combined_bond = bond.copy()
        
        # Добавляем данные из Reference Data
        if isin in reference_dict:
            combined_bond.update(reference_dict[isin])
        
        # Добавляем данные из Latest pricing
        if isin in pricing_dict:
            combined_bond.update(pricing_dict[isin])
        
        combined_data.append(combined_bond)
    
    if not params or "kind" not in params or not params["kind"]:
        # Если параметр kind не передан, возвращаем все данные
        if limit:
            return combined_data[:limit]
        return combined_data
    
    kind = params["kind"]
    current_date = datetime.now()
    four_years_later = current_date + timedelta(days=4*365)
    
    # Функции-предикаты для фильтрации
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
        interest_type = item.get("interest_type", "").lower()
        return "variable" not in interest_type and "floating" not in interest_type
    
    def is_floating_rate(item):
        interest_type = item.get("interest_type", "").lower()
        return "variable" in interest_type or "floating" in interest_type
    
    def is_zero_coupon(item):
        interest_type = item.get("interest_type", "").lower()
        return "zero" in interest_type or "discount" in interest_type
    
    def is_corporate(item):
        issuer_type = item.get("issuer_type", "").lower()
        return issuer_type == "corporate"
    
    logger.info(f"📊 Total bonds before corporate filter: {len(combined_data)}")
    
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
        return combined_data[:limit] if limit else combined_data
    
    # Выбираем корпоративные облигации
    corporate_bonds = list(filter(is_corporate, combined_data))
    logger.info(f"🏢 Corporate bonds after type filter: {len(corporate_bonds)}")
    
    # Применяем фильтр
    filtered_data = list(filter(filter_func, corporate_bonds))
    
    # Применяем лимит если указан
    if limit:
        filtered_data = filtered_data[:limit]
    
    return filtered_data


async def filter_terrapin_government_bonds(data: Dict[str, Any], limit: Optional[int] = None, params: Dict[str, Any] = None, *kwargs) -> List[Dict[str, Any]]:
    """
    Фильтрует государственные облигации из данных Terrapin.
    Обрабатывает объединенные данные из Bond search, Reference Data и Latest pricing.
    """
    if not isinstance(data, dict):
        logger.warning(f"Expected dict, got {type(data)}")
        return []
    
    # Извлекаем данные из разных источников
    bonds_data = data.get("bonds_data", [])
    reference_data = data.get("reference_data", [])
    pricing_data = data.get("pricing_data", [])
    
    if not bonds_data:
        logger.warning("No bonds data found")
        return []
    
    # Создаем словари для быстрого поиска
    reference_dict = {item.get("isin"): item for item in reference_data}
    pricing_dict = {item.get("isin"): item for item in pricing_data}
    
    # Объединяем данные из всех источников
    combined_data = []
    for bond in bonds_data:
        isin = bond.get("isin")
        if not isin:
            continue
            
        combined_bond = bond.copy()
        
        # Добавляем данные из Reference Data
        if isin in reference_dict:
            combined_bond.update(reference_dict[isin])
        
        # Добавляем данные из Latest pricing
        if isin in pricing_dict:
            combined_bond.update(pricing_dict[isin])
        
        combined_data.append(combined_bond)
    
    if not params or "kind" not in params or not params["kind"]:
        # Если параметр kind не передан, возвращаем все данные
        if limit:
            return combined_data[:limit]
        return combined_data
    
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
        
        item_country = item.get("country", "").lower()
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
        return combined_data[:limit] if limit else combined_data
    
    # Выбираем государственные облигации
    def is_government(item):
        issuer_type = item.get("issuer_type", "").lower()
        return issuer_type != "corporate"
    
    government_bonds = list(filter(is_government, combined_data))
    
    # Применяем фильтр
    filtered_data = list(filter(filter_func, government_bonds))
    
    # Применяем лимит если указан
    if limit:
        filtered_data = filtered_data[:limit]
    
    return filtered_data


async def sort_terrapin_bonds_data(data: List[Dict[str, Any]], limit: Optional[int] = None, params: Dict[str, Any] = None, *kwargs) -> List[Dict[str, Any]]:
    """
    Сортирует данные облигаций Terrapin по различным полям.
    """
    logger.debug(f"Sorting Terrapin bonds params: {params}")
    
    def get_ytm(x: Dict[str, Any]) -> float:
        """Возвращает ytm из словаря для сортировки"""
        value = x.get("ytm", 0.0)
        return value if value is not None else 0.0
    
    def get_name(x: Dict[str, Any]) -> str:
        """Возвращает emitent_name_eng из словаря для сортировки"""
        return x.get("emitent_name_eng", "")
    
    def get_price(x: Dict[str, Any]) -> float:
        """Возвращает price из словаря для сортировки"""
        value = x.get("price", 0.0)
        return value if value is not None else 0.0
    
    def get_coupon_rate(x: Dict[str, Any]) -> float:
        """Возвращает coupon_rate из словаря для сортировки"""
        value = x.get("coupon_rate", 0.0)
        return value if value is not None else 0.0
    
    def get_maturity_date(x: Dict[str, Any]) -> str:
        """Возвращает maturity_date из словаря для сортировки"""
        return x.get("maturity_date", "")

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
        case "price":
            sort_func = get_price
        case "coupon_rate":
            sort_func = get_coupon_rate
        case "maturity_date":
            sort_func = get_maturity_date
        case _:
            sort_func = get_ytm
    
    logger.debug(f"Sorting Terrapin bonds by {sort_func.__name__} with reverse = {reverse}")
    sorted_data = sorted(data, key=sort_func, reverse=reverse)
    
    if limit is not None:
        return sorted_data[:limit]
    
    return sorted_data
