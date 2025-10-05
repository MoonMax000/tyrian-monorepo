from collections import defaultdict

from .get_block_data import BlockDataGetter
from .get_fundamental_analysis import FundamentalAnalysisGetter
from .get_quotation_chart import QuotationChartGetter
from .get_market_leaders_volume import MarketLeadersVolumeGetter
from .get_market_leaders_growth_full import MarketLeadersGrowthFullGetter
from .get_market_leaders_gainers import MarketLeadersGainersGetter
from .get_market_leaders_volatile import MarketLeadersVolatileGetter
from .get_holders_table import HoldersTableGetter
from .get_terrapin_bonds import TerrapinCorporateBondsGetter, TerrapinGovernmentBondsGetter


BASE_HANDLER = BlockDataGetter


# возвращать BASE_HANDLER для любых неуказанных ключей
def get_default_dict():
    return defaultdict(lambda: BASE_HANDLER)


handlers = defaultdict(get_default_dict)


# Отдельный обработчик для блока Финансовый анализ
handlers["fundamental-analysis"] = {
    "us": FundamentalAnalysisGetter,
}

# Отдельный обработчик для блока График котировок
handlers["quotation-chart"] = {
    "us": QuotationChartGetter,
}

# Отдельный обработчик для блока Лидеры по объему
handlers["market-leaders-volume"] = {
    "us": MarketLeadersVolumeGetter,
}

# Отдельный обработчик для блока Лидеры по объему
handlers["market-leaders-growth-full"] = {
    "us": MarketLeadersGrowthFullGetter,
}

# Отдельный обработчик для блока Gainers (наибольший рост)
handlers["market-leaders-type"] = {
    "us": MarketLeadersGainersGetter,
}

# Отдельный обработчик для блока Лидеры по волатильности
handlers["market-leaders-volatile"] = {
    "us": MarketLeadersVolatileGetter,
}

# Отдельный обработчик для блока Таблица акционеров
handlers["holders-table"] = {
    "us": HoldersTableGetter,
}

# Отдельный обработчик для блоков облигаций с YTM данными
handlers["emissions-corporate"] = {
    "general": TerrapinCorporateBondsGetter,
}

handlers["emissions-goverment"] = {
    "general": TerrapinGovernmentBondsGetter,
}

# Отдельный обработчик для блоков ETF
def get_etf_handler():
    from .get_etf import ETFGetter
    return ETFGetter

handlers["etf"] = {
    "general": get_etf_handler,
}
