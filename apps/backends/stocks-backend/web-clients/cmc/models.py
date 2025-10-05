import os
from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import Query
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel
from typing_extensions import Self
from enums import SpecialCategoryTypeORM


class BaseAPI(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

class CryptocurrencyInfo(BaseAPI):
    id: Optional[str] = None
    slug: Optional[str] = None
    symbol: Optional[str] = None
    address: Optional[str] = None
    skip_invalid: bool = False
    aux: Optional[str] = "urls,logo,description,tags,platform,date_added,notice"

def get_cryptocurrency_info(
    id: Optional[str] = Query(None, description="ID криптовалюты на CoinMarketCap, например, '1, 2'"),
    slug: Optional[str] = Query(None, description="Slug криптовалюты, например, 'bitcoin'. Можно использовать вместо id"),
    symbol: Optional[str] = Query(None, description="Символ криптовалюты, например, 'BTC'. Можно использовать вместо id"),
    address: Optional[str] = Query(None, description="Адрес криптовалюты, например, '0xc40af1e4fecfa05ce6bab79dcd8b373d2e436c4e'. Можно использовать вместо id"),
    skip_invalid: bool = Query(False, description="Пропустить недействительные записи"),
    aux: Optional[str] = Query("urls,logo,description,tags,platform,date_added,notice", description="Дополнительные данные для запроса, по умолчанию включены: 'urls,logo,description,tags,platform,date_added,notice'")
):
    return CryptocurrencyInfo(
        id=id,
        slug=slug,
        symbol=symbol,
        address=address,
        skip_invalid=skip_invalid,
        aux=aux
    )

class QueryParams(BaseAPI):
    start: Optional[int] = 1
    limit: Optional[int] = 100
    convert: Optional[str] = None
    convert_id: Optional[str] = None
    sort_dir: Optional[str] = None

def get_query_params_new(
    start: int = Query(1, ge=1, description=">=1. Смещение начала постраничного списка возвращаемых элементов"),
    limit: int = Query(100, ge=1, le=5000, description="[1...5000]. Количество возвращаемых элементов"),
    convert: Optional[str] = Query(None, description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    convert_id: Optional[str] = Query(None, description="Расчет рыночных котировок по идентификатору CoinMarketCap вместо символа. Нельзя использовать если уже используется convert"),
    sort_dir: Optional[str] = Query(None, description="направление сортировки. Доступно: asc, desc")
):
    return QueryParams(
        start=start,
        limit=limit,
        convert=convert,
        convert_id=convert_id,
        sort_dir=sort_dir
    )

class QueryParamsTrending(BaseAPI):
    start: Optional[int] = 1  # Default value is 1
    limit: Optional[int] = 100  # Default value is 100
    time_period: Optional[str] = "24h"  # Default value is "24h"
    convert: Optional[str] = None
    convert_id: Optional[str] = None
    sort: Optional[str] = "percent_change_24h"  # Default value is "percent_change_24h"
    sort_dir: Optional[str] = None

# Функция для обработки query параметров с использованием Depends
def get_query_params(
    start: int = Query(1, ge=1, description=">=1. Смещение начала постраничного списка возвращаемых элементов"),
    limit: int = Query(100, ge=1, le=1000, description="[1...1000]. Количество возвращаемых элементов"),
    time_period: str = Query("24h", description="Регулирует общий временной интервал для наиболее больших gainers и losers. Доступные значения: 1h, 24h, 30d, 7d"),
    convert: Optional[str] = Query(None, description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    convert_id: Optional[str] = Query(None, description="Расчет рыночных котировок по идентификатору CoinMarketCap вместо символа. Нельзя использовать если уже используется convert"),
    sort: str = Query("percent_change_24h", description="Поле, по которому сортируется список. Доступно: percent_change_24h"),
    sort_dir: Optional[str] = Query(None, description="направление сортировки. Доступно: asc, desc")
):
    return QueryParamsTrending(
        start=start,
        limit=limit,
        time_period=time_period,
        convert=convert,
        convert_id=convert_id,
        sort=sort,
        sort_dir=sort_dir
    )

class QueryParamsTrendingLatest(BaseAPI):
    start: Optional[int] = 1
    limit: Optional[int] = 100
    time_period: Optional[str] = "24h"
    convert: Optional[str] = None
    convert_id: Optional[str] = None

def get_query_params_trending_latest(
    start: int = Query(1, ge=1, description=">=1. Смещение начала постраничного списка возвращаемых элементов"),
    limit: int = Query(100, ge=1, le=1000, description="[1...1000]. Количество возвращаемых элементов"),
    time_period: str = Query("24h", description="Регулирует общее окно времени для последних трендовых монет. Доступные значения: 24h, 30d, 7d"),
    convert: Optional[str] = Query(None, description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    convert_id: Optional[str] = Query(None, description="Расчет рыночных котировок по идентификатору CoinMarketCap вместо символа. Нельзя использовать если уже используется convert")
):
    return QueryParamsTrendingLatest(
        start=start,
        limit=limit,
        time_period=time_period,
        convert=convert,
        convert_id=convert_id
    )


class FearAndGreedHistoricalQueryParams(BaseAPI):
    start: Optional[int] = 1
    limit: Optional[int] = 50

def get_fear_and_greed_historical_query_params(
    start: int = Query(1, ge=1, description=">=1. Смещение начала постраничного списка возвращаемых элементов"),
    limit: int = Query(50, ge=1, le=500, description="[1...500]. Количество возвращаемых элементов")
):
    return FearAndGreedHistoricalQueryParams(
        start=start,
        limit=limit
    )

class GlobalMetricsHistoricalQueryParams(BaseAPI):
    time_start: Optional[str] = None
    time_end: Optional[str] = None
    count: Optional[int] = 10
    interval: Optional[str] = "1d"
    convert: Optional[str] = None
    convert_id: Optional[str] = None
    aux: Optional[str] = "btc_dominance,eth_dominance,active_cryptocurrencies,active_exchanges,active_market_pairs,total_volume_24h,total_volume_24h_reported,altcoin_market_cap,altcoin_volume_24h,altcoin_volume_24h_reported"


def get_global_metrics_historical_query_params(
    time_start: Optional[str] = Query(None, description="Временная метка для которой нужно возвращать котировки. Необязательный параметр. Без указания вернет котировки, рассчитанные в обратном направлении от time_end"),
    time_end: Optional[str] = Query(None, description="Временная метка для которой нужно прекратить возвращать котировки. Необязательный параметр. Если не указывать, то используется текущее время"),
    count: Optional[int] = Query(10, ge=1, le=10000, description="Число интервальных периодов, за которые возвращаются результаты. Необязательно, но требуется если нет time_end и time_start. Лимит запросов - 10000"),
    interval: Optional[str] = Query("1d", description="Интервал времени, за который возвращаются точки данных. Доступные значения: yearly, monthly, weekly, daily, hourly, 5m, 10m, 15m, 30m, 45m, 1h, 2h, 3h, 4h, 6h, 12h, 24h, 1d, 2d, 3d, 7d, 14d, 15d, 30d, 60d, 90d, 365d"),
    convert: Optional[str] = Query(None, description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    convert_id: Optional[str] = Query(None, description="Расчет рыночных котировок по идентификатору CoinMarketCap вместо символа. Нельзя использовать если уже используется convert"),
    aux: Optional[str] = Query(
        "btc_dominance,eth_dominance,active_cryptocurrencies,active_exchanges,active_market_pairs,total_volume_24h,total_volume_24h_reported,altcoin_market_cap,altcoin_volume_24h,altcoin_volume_24h_reported",
        description="Дополнительные данные для запроса, по умолчанию включены: 'btc_dominance,eth_dominance,active_cryptocurrencies,active_exchanges,active_market_pairs,total_volume_24h,total_volume_24h_reported,altcoin_market_cap,altcoin_volume_24h,altcoin_volume_24h_reported'"
    )
):
    return GlobalMetricsHistoricalQueryParams(
        time_start=time_start,
        time_end=time_end,
        count=count,
        interval=interval,
        convert=convert,
        convert_id=convert_id,
        aux=aux
    )
class GlobalMetricsLatestQueryParams(BaseAPI):
    convert: Optional[str] = None
    convert_id: Optional[str] = None

def get_global_metrics_latest_query_params(
    convert: Optional[str] = Query(None, description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    convert_id: Optional[str] = Query(None, description="Расчет рыночных котировок по идентификатору CoinMarketCap вместо символа. Нельзя использовать если уже используется convert")
):
    return GlobalMetricsLatestQueryParams(
        convert=convert,
        convert_id=convert_id
    )

class QuotesHistoricalQueryParams(BaseAPI):
    range: str = '30d'
    module: str = 'marketcap'
    convertId: Optional[str] = None

def get_quotes_historical_query_params(
    range: str = Query('30d', description="30d, 1y или all"),
    module: str = Query('marketcap', description='?'),
    convert_id: Optional[str] = Query(None, alias="convertId", description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
):
    return QuotesHistoricalQueryParams(
        range=range,
        module=module,
        convertId=convert_id
    )

class ListingsLatestQueryParams(BaseAPI):
    start: Optional[int] = 1
    limit: Optional[int] = 100
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    market_cap_min: Optional[float] = None
    market_cap_max: Optional[float] = None
    volume_24h_min: Optional[float] = None
    volume_24h_max: Optional[float] = None
    circulating_supply_min: Optional[float] = None
    circulating_supply_max: Optional[float] = None
    percent_change_24h_min: Optional[float] = None
    percent_change_24h_max: Optional[float] = None
    self_reported_circulating_supply_min: Optional[float] = None
    self_reported_circulating_supply_max: Optional[float] = None
    self_reported_market_cap_min: Optional[float] = None
    self_reported_market_cap_max: Optional[float] = None
    unlocked_market_cap_min: Optional[float] = None
    unlocked_market_cap_max: Optional[float] = None
    unlocked_circulating_supply_min: Optional[float] = None
    unlocked_circulating_supply_max: Optional[float] = None
    convert: Optional[str] = None
    convert_id: Optional[str] = None
    sort: str = "market_cap"
    sort_dir: Optional[str] = None
    cryptocurrency_type: str = "all"
    tag: str = "all"
    aux: str = "num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply"

def get_listings_latest_query_params(
    start: Optional[int] = Query(1, ge=1, description=">=1. Смещение начала постраничного списка возвращаемых элементов"),
    limit: Optional[int] = Query(100, ge=1, le=5000, description="[1...5000]. Количество возвращаемых элементов"),
    price_min: Optional[float] = Query(None, ge=0, le=100000000000000000, description="При необходимости порог минимальной цены в USD для фильтрации результатов"),
    price_max: Optional[float] = Query(None, ge=0, le=100000000000000000, description="При необходимости порог максимальной цены в USD для фильтрации результатов"),
    market_cap_min: Optional[float] = Query(None,  ge=0, le=100000000000000000, description="При необходимости порог минимальной рыночной капитализации для фильтрации результатов"),
    market_cap_max: Optional[float] = Query(None,  ge=0, le=100000000000000000, description="При необходимости порог максимальной рыночной капитализации для фильтрации результатов"),
    volume_24h_min: Optional[float] = Query(None,  ge=0, le=100000000000000000, description="При необходимости порог минимального объема за 24 часа в USD для фильтрации результатов"),
    volume_24h_max: Optional[float] = Query(None,  ge=0, le=100000000000000000, description="При необходимости порог максимального объема за 24 часа в USD для фильтрации результатов"),
    circulating_supply_min: Optional[float] = Query(None,  ge=0, le=100000000000000000, description="При необходимости порог минимального оборотного запаса для фильтрации результатов"),
    circulating_supply_max: Optional[float] = Query(None,  ge=0, le=100000000000000000, description="При необходимости порог максимального оборотного запаса цены для фильтрации результатов"),
    percent_change_24h_min: Optional[float] = Query(None,  ge=-100, description="При необходимости порог минимального процентного значения за 24 часа для фильтрации результатов"),
    percent_change_24h_max: Optional[float] = Query(None,  ge=-100, description="При необходимости порог максимального процентного значения за 24 часа для фильтрации результатов"),
    self_reported_circulating_supply_min: Optional[float] = Query(None,  ge=0, le=100000000000000000,
                                                    description="При необходимости порог минимального оборотного запаса сообщаемый вами для фильтрации результатов"),
    self_reported_circulating_supply_max: Optional[float] = Query(None,  ge=0, le=100000000000000000,
                                                    description="При необходимости порог максимального оборотного запаса сообщаемый вами для фильтрации результатов"),
    self_reported_market_cap_min: Optional[float] = Query(None,  ge=0, le=100000000000000000,
                                                    description="При необходимости порог минимальной рыночной капитализации сообщаемый вами для фильтрации результатов"),
    self_reported_market_cap_max: Optional[float] = Query(None,  ge=0, le=100000000000000000,
                                                    description="При необходимости порог максимальной рыночной капитализации сообщаемый вами для фильтрации результатов"),
    unlocked_market_cap_min: Optional[float] = Query(None,  ge=0, le=100000000000000000,
                                                    description="При необходимости порог минимальной разблокированной рыночной капитализации для фильтрации результатов"),
    unlocked_market_cap_max: Optional[float] = Query(None,  ge=0, le=100000000000000000,
                                                    description="При необходимости порог максимальной разблокированной рыночной капитализации для фильтрации результатов"),
    unlocked_circulating_supply_min: Optional[float] = Query(None,  ge=0, le=100000000000000000,
                                                     description="При необходимости порог минимального разблокированного рыночного оборотного запаса для фильтрации результатов"),
    unlocked_circulating_supply_max: Optional[float] = Query(None,  ge=0, le=100000000000000000,
                                                     description="При необходимости порог максимального разблокированного рыночного оборотного запаса для фильтрации результатов"),
    convert: Optional[str] = Query(None, description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    convert_id: Optional[str] = Query(None, alias="convertId", description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    sort: str = Query(default="market_cap", description=' "name" "symbol" "date_added" "market_cap" "market_cap_strict" "price" "circulating_supply" "total_supply" "max_supply" "num_market_pairs" "volume_24h" "percent_change_1h" "percent_change_24h" "percent_change_7d" "market_cap_by_total_supply_strict" "volume_7d" "volume_30d"'),
    sort_dir: Optional[str] = Query(None, description="направление сортировки. Доступно: asc, desc"),
    cryptocurrency_type: str = Query(default="all", description='"all" "coins" "tokens"'),
    tag: str = Query(default="all", description='"all" "defi" "filesharing"'),
    aux: str = Query(default="num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply"),

):
    return ListingsLatestQueryParams(
        start=start,
        limit=limit,
        price_min=price_min,
        price_max=price_max,
        market_cap_min=market_cap_min,
        market_cap_max=market_cap_max,
        volume_24h_min=volume_24h_min,
        volume_24h_max=volume_24h_max,
        circulating_supply_min=circulating_supply_min,
        circulating_supply_max=circulating_supply_max,
        percent_change_24h_min=percent_change_24h_min,
        percent_change_24h_max=percent_change_24h_max,
        self_reported_circulating_supply_min=self_reported_circulating_supply_min,
        self_reported_circulating_supply_max=self_reported_circulating_supply_max,
        self_reported_market_cap_min=self_reported_market_cap_min,
        self_reported_market_cap_max=self_reported_market_cap_max,
        unlocked_market_cap_min=unlocked_market_cap_min,
        unlocked_market_cap_max=unlocked_market_cap_max,
        unlocked_circulating_supply_min=unlocked_circulating_supply_min,
        unlocked_circulating_supply_max=unlocked_circulating_supply_max,
        convert=convert,
        convert_id= convert_id,
        sort=sort,
        sort_dir=sort_dir,
        cryptocurrency_type=cryptocurrency_type,
        tag=tag,
        aux=aux,
    )

class CategoriesQueryParams(BaseAPI):
    start: Optional[int] = 1
    limit: Optional[int] = 100
    id: Optional[str] = None
    slug: Optional[str] = None
    symbol: Optional[str] = None

def get_categories_query_params(
    start: Optional[int] = Query(1, ge=1, description=">=1. Смещение начала постраничного списка возвращаемых элементов"),
    limit: Optional[int] = Query(100, ge=1, le=5000, description="[1...5000]. Количество возвращаемых элементов"),
    id: Optional[str] = Query(None,  description="Один или несколько идентификаторов для сортировки криптовалюты '1,2'"),
    slug: Optional[str] = Query(None,  description="Альтернативная фильтрация по криптовалюте, например, 'bitcoin,ethereum'"),
    symbol: Optional[str] = Query(None,  description="Альтернативная фильтрация по одному или нескольким символам криптовалюты, например, 'BTC,ETH'"),

):
    return CategoriesQueryParams(
        start=start,
        limit=limit,
        id=id,
        slug=slug,
        symbol=symbol,
    )

class CategorySpecialQueryParams(BaseAPI):
    category_special_type: SpecialCategoryTypeORM
    start: Optional[int] = 1
    limit: Optional[int] = 100
    convert: Optional[str] = None
    convert_id: Optional[str] = None

def get_category_special_query_params(
    category_special_type: SpecialCategoryTypeORM = Query(description="Обязательный. Название категории"),
    start: Optional[int] = Query(1, ge=1, description=">=1. Смещение начала постраничного списка возвращаемых элементов"),
    limit: Optional[int] = Query(100, ge=1, le=1000, description="[1...1000]. Количество возвращаемых элементов"),
    convert: Optional[str] = Query(None, description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    convert_id: Optional[str] = Query(None, alias="convertId", description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно")
):
    return CategorySpecialQueryParams(
        category_special_type=category_special_type,
        start=start,
        limit=limit,
        convert=convert,
        convert_id=convert_id
    )


class CategoryInfoQueryParams(BaseAPI):
    id: str
    start: Optional[int] = 1
    limit: Optional[int] = 100
    convert: Optional[str] = None
    convert_id: Optional[str] = None
    account_id: int = 1
def get_category_info_query_params(
    id: str = Query(description="Обязательный. ID категории"),
    start: Optional[int] = Query(1, ge=1, description=">=1. Смещение начала постраничного списка возвращаемых элементов"),
    limit: Optional[int] = Query(100, ge=1, le=1000, description="[1...1000]. Количество возвращаемых элементов"),
    convert: Optional[str] = Query(None, description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    convert_id: Optional[str] = Query(None, alias="convertId", description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    account_id: int = Query(default=1)
):
    return CategoryInfoQueryParams(
        id=id,
        start=start,
        limit=limit,
        convert=convert,
        convert_id=convert_id,
        account_id=account_id
    )

class Category(BaseAPI):
    id: str
    start: Optional[int] = 1
    limit: Optional[int] = 100
    convert: Optional[str] = None
    convert_id: Optional[str] = None

class ListingsHistoricalQueryParams(BaseAPI):
    date: str
    start: Optional[int] = 1
    limit: Optional[int] = 100
    convert: Optional[str] = None
    convert_id: Optional[str] = None
    sort: str = "cmc_rank"
    sort_dir: Optional[str] = None
    cryptocurrency_type: str = "all"
    aux: str = "platform,tags,date_added,circulating_supply,total_supply,max_supply,cmc_rank,num_market_pairs"

def get_listings_historical_query_params(
    date: str = Query(description="Обязательная дата для ссылки на день создания моментального снимка. Unix, ISO 8601"),
    start: Optional[int] = Query(1, ge=1, description=">=1. Смещение начала постраничного списка возвращаемых элементов"),
    limit: Optional[int] = Query(100, ge=1, le=5000, description="[1...5000]. Количество возвращаемых элементов"),
    convert: Optional[str] = Query(None, description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    convert_id: Optional[str] = Query(None, alias="convertId", description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    sort: str = Query(default="cmc_rank", description='"cmc_rank" "name" "symbol" "market_cap" "price" "circulating_supply" "total_supply" "max_supply" "num_market_pairs" "volume_24h" "percent_change_1h" "percent_change_24h" "percent_change_7d"'),
    sort_dir: Optional[str] = Query(None, description="направление сортировки. Доступно: asc, desc"),
    cryptocurrency_type: str = Query(default="all", description='"all" "coins" "tokens"'),
    aux: str = Query(default="platform,tags,date_added,circulating_supply,total_supply,max_supply,cmc_rank,num_market_pairs"),
):
    return ListingsHistoricalQueryParams(
        date=date,
        start=start,
        limit=limit,
        convert=convert,
        convert_id=convert_id,
        sort=sort,
        sort_dir=sort_dir,
        cryptocurrency_type=cryptocurrency_type,
        aux=aux,
    )

class LongShortRatio(BaseAPI):
    symbol: str
    longShortRatio: str
    longAccount: str
    shortAccount: str
    timestamp: datetime

class BinanceLongShortRatio(BaseAPI):
    data: list[LongShortRatio] = []

class LongShortRatioBinanceQueryParams(BaseAPI):
    symbol: str
    period: str = "5m"
    limit: Optional[int] = 30
    startTime: Optional[str] = None
    endTime: Optional[str] = None

def get_long_short_ratio_binance_query_params(
    symbol: str = Query(description="coin pair, for example, BTCUSDT"),
    period: str = Query(default="5m", description='binance: "5m","15m","30m","1h","2h","4h","6h","12h","1d"; bybit: 5min, 15min, 30min, 1h, 4h, 1d'),
    limit: Optional[int] = Query(default=30, le=500),
    start_time: Optional[str] = Query(default=None),
    end_time: Optional[str] = Query(default=None),
):
    return LongShortRatioBinanceQueryParams(
        symbol=symbol,
        period=period,
        limit=limit,
        startTime=start_time,
        endTime=end_time
    )

class QuotesLatestInfoQueryParams(BaseAPI):
    id: Optional[str] = None
    slug: Optional[str] = None
    symbol: Optional[str] = None
    convert: Optional[str] = None
    convert_id: Optional[str] = None
    aux: str = "num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,is_active,is_fiat"
    skip_invalid: bool = True
def get_quotes_latest_info_query_params(
    id: Optional[str] = Query(None, description="Один или несколько идентификаторов для сортировки криптовалюты '1,2'"),
    slug: Optional[str] = Query(None,
                                description="Альтернативная фильтрация по криптовалюте, например, 'bitcoin,ethereum'"),
    symbol: Optional[str] = Query(None,
                                  description="Альтернативная фильтрация по одному или нескольким символам криптовалюты, например, 'BTC,ETH'"),
    convert: Optional[str] = Query(None, description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    convert_id: Optional[str] = Query(None, alias="convertId", description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    aux: str = Query(default="num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,is_active,is_fiat"),
    skip_invalid: bool = Query(default=True)
):
    return QuotesLatestInfoQueryParams(
        id=id,
        slug=slug,
        symbol=symbol,
        convert=convert,
        convert_id=convert_id,
        aux=aux,
        skip_invalid=skip_invalid,
    )

class QuotesHistoricalInfoQueryParams(BaseAPI):
    id: Optional[str] = None
    symbol: Optional[str] = None
    time_start: Optional[str] = None
    time_end: Optional[str] = None
    count: int = 10
    interval: Optional[str] = "5m"
    convert: Optional[str] = None
    convert_id: Optional[str] = None
    aux: str = "price,volume,market_cap,circulating_supply,total_supply,quote_timestamp,is_active,is_fiat"
    skip_invalid: bool = True

def get_quotes_historical_info_query_params(
    id: Optional[str] = Query(None, description="Один или несколько идентификаторов для сортировки криптовалюты '1,2'"),
    symbol: Optional[str] = Query(None,
                                  description="Альтернативная фильтрация по одному или нескольким символам криптовалюты, например, 'BTC,ETH'"),
    time_start: Optional[str] = Query(None, description="Временная метка начала возвращения котировки. Если не указано, то вернет котировки в обратном порядке от time_end"),
    time_end: Optional[str] = Query(None,
                                      description="Временная метка конца возвращения котировки. По умолчанию это текущее время"),
    count: int = Query(default=10, ge=1, le=10000, description="Число интервальных периодов, за которые возвращаются результаты. Нужен если не указан time_start и time_end"),
    interval: Optional[str] = Query("5m", description='"yearly" "monthly" "weekly" "daily" "hourly" "5m" "10m" "15m" "30m" "45m" "1h" "2h" "3h" "4h" "6h" "12h" "24h" "1d" "2d" "3d" "7d" "14d" "15d" "30d" "60d" "90d" "365d"'),
    convert: Optional[str] = Query(None, description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    convert_id: Optional[str] = Query(None, alias="convertId", description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    aux: str = Query(default="price,volume,market_cap,circulating_supply,total_supply,quote_timestamp,is_active,is_fiat"),
    skip_invalid: bool = Query(default=True)
):
    return QuotesHistoricalInfoQueryParams(
        id=id,
        symbol=symbol,
        time_start=time_start,
        time_end=time_end,
        count=count,
        interval=interval,
        convert=convert,
        convert_id=convert_id,
        aux=aux,
        skip_invalid=skip_invalid,
    )


class LongShortRatioBybitQueryParams(BaseAPI):
    category: str
    symbol: str
    period: str = "5m"
    limit: Optional[int] = 30
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    cursor: Optional[str] = None

class CategoriesResponse(BaseAPI):
    id: str
    name: str
    title: str
    description: str
    avg_price_change: float
    market_cap: float
    market_cap_change: float
    volume: float
    volume_change: float
    last_updated: str
    coin: str
    max_percent_change_24: float
    logo: str
    slug: str
    dominance: float

class MostVisitedQueryParams(BaseAPI):
    start: Optional[int] = 1
    limit: Optional[int] = 100
    time_period: str = "24h"
    convert: Optional[str] = None
    convert_id: Optional[str] = None

def get_query_params_most_visited(
    start: int = Query(1, ge=1, description=">=1. Смещение начала постраничного списка возвращаемых элементов"),
    limit: int = Query(100, ge=1, le=1000, description="[1...1000]. Количество возвращаемых элементов"),
    time_period: str = Query("24h",
                             description="Регулирует общее окно времени для последних трендовых монет. Доступные значения: 24h, 30d, 7d"),
    convert: Optional[str] = Query(None,
                                   description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    convert_id: Optional[str] = Query(None,
                                      description="Расчет рыночных котировок по идентификатору CoinMarketCap вместо символа. Нельзя использовать если уже используется convert")
):
    return MostVisitedQueryParams(
        start=start,
        limit=limit,
        time_period=time_period,
        convert=convert,
        convert_id=convert_id
    )

class OHLCVQueryParams(BaseAPI):
    id: str | None = None
    slug: str | None = None
    symbol: str | None = None
    time_period: str = "daily"
    time_start: str | None = None
    time_end: str | None = None
    count: int = 10
    interval: str = "daily"
    convert: str | None = None
    convert_id: str | None = None
    skip_invalid: bool = True

def get_ohlcv(
    id: Optional[str] = Query(None, description="Один или несколько идентификаторов для сортировки криптовалюты '1,2'"),
    slug: Optional[str] = Query(None,
                                description="Альтернативная фильтрация по криптовалюте, например, 'bitcoin,ethereum'"),
    symbol: Optional[str] = Query(None,
                                  description="Альтернативная фильтрация по одному или нескольким символам криптовалюты, например, 'BTC,ETH'"),
    time_period: Optional[str] = Query("daily", description="daily/hourly"),
    time_start: Optional[str] = Query(None),
    time_end: Optional[str] = Query(None),
    count: Optional[int] = Query(10),
    interval: Optional[str] = Query("daily", description='"hourly" "daily" "weekly" "monthly" "yearly" "1h" "2h" "3h" "4h" "6h" "12h" "1d" "2d" "3d" "7d" "14d" "15d" "30d" "60d" "90d" "365d"'),
    convert: Optional[str] = Query(None,
                                   description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    convert_id: Optional[str] = Query(None, alias="convertId",
                                      description="Можно рассчитать рыночные котировки до 120 валют одновременно. Список символов криптовалюты или фиатных валют. Список представлен здесь https://coinmarketcap.com/api/documentation/v1/#section/Standards-and-Conventions. Доп. вариант конвертации расходует кредит дополнительно"),
    skip_invalid: bool = Query(default=True)
):
    return OHLCVQueryParams(
        id=id,
        slug=slug,
        symbol=symbol,
        time_period=time_period,
        time_start=time_start,
        time_end=time_end,
        count=count,
        interval=interval,
        convert=convert,
        convert_id=convert_id,
        skip_invalid=skip_invalid,
    )

class LiquidationsQueryParamsBitfinex(BaseAPI):
    sort: int | None = None
    start: int | None = None
    end: int | None = None
    limit: int | None = None

def get_liquidations(
    sort: Optional[str] = Query(None),
    start: Optional[int] = Query(None),
    end: Optional[int] = Query(None),
    limit: Optional[int] = Query(None),
):
    return LiquidationsQueryParamsBitfinex(
        sort=-1 if sort == "desc" else +1,
        start=start,
        end=end,
        limit=limit,
    )

class BitfinexLiquidations(BaseAPI):
    pos_id: int | None = None
    mts: int | None = None
    symbol: str | None = None
    amount: float | None = None
    base_price: float | None = None
    is_match: str | None = None
    is_market_sold: str | None = None
    price_acquired: float | None = None


class QueryParamsTVLRanking(BaseAPI):
    limit: Optional[int] = 5

def get_query_params_tvl_ranking(
    limit: int = Query(5, ge=1, le=1000, description="[1...1000]. Количество возвращаемых элементов"),
):
    return QueryParamsTVLRanking(
        limit=limit,
    )
