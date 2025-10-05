import asyncio
import time
from datetime import datetime, timezone
from functools import wraps
from http.client import responses
from itertools import islice
from typing import Annotated, Optional, Any

import httpx
from fastapi import Depends
from httpx import RequestError
from starlette.requests import Request

from config import settings
from exceptions import NotFoundException, ClientException
from models import QueryParams, QueryParamsTrending, FearAndGreedHistoricalQueryParams, GlobalMetricsLatestQueryParams, \
    GlobalMetricsHistoricalQueryParams, QueryParamsTrendingLatest, CryptocurrencyInfo, QuotesHistoricalQueryParams, \
    ListingsLatestQueryParams, CategoriesQueryParams, CategoryInfoQueryParams, ListingsHistoricalQueryParams, \
    QuotesLatestInfoQueryParams, BinanceLongShortRatio, LongShortRatio, LongShortRatioBybitQueryParams, \
    QuotesHistoricalInfoQueryParams, CategoriesResponse, MostVisitedQueryParams, Category, OHLCVQueryParams, \
    LiquidationsQueryParamsBitfinex, BitfinexLiquidations, CategorySpecialQueryParams, QueryParamsTVLRanking

import requests

from repository import RedisClient, async_cache_decorator


def batched(iterable, n, *, strict=False):
    # batched('ABCDEFG', 3) → ABC DEF G
    if n < 1:
        raise ValueError('n must be at least one')
    iterator = iter(iterable)
    while batch := tuple(islice(iterator, n)):
        if strict and len(batch) != n:
            raise ValueError('batched(): incomplete batch')
        yield batch


def decorator(func):
    @wraps(func)
    async def wrapper(self, payload):
        try:
            time_sleep = 0.2
            for _ in range(5):
                response = await func(self, payload)
                if response.status_code == 200:
                    result = response.json()
                    data = result['data']
                    print("Данные получены из API и сохранены в кеш")
                    return data
                await asyncio.sleep(time_sleep)
                time_sleep *= 2
            else:
                raise NotFoundException(f'Connection error {response.status_code}')
        except RequestError as e:
            print(e)
            raise ClientException from e

    return wrapper


class CMCClient:
    _HEADERS = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': settings.API_KEY,
    }
    _HEADERS_SECOND = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': "9e78bfc8-0ee6-45ae-9330-690bd6605e53",
    }
    _LATEST_URL: str = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/trending/latest"
    _CRYPTOCURRENCY_INFO: str = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/info"
    _NEW_COINS_URL: str = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/new"
    _QUOTES_LATEST_URL: str = "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest"
    _GAINERS_LOSERS_URL: str = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/trending/gainers-losers"
    _FEAR_GREED_HISTORICAL_URL: str = "https://pro-api.coinmarketcap.com/v3/fear-and-greed/historical"
    _FEAR_GREED_LATEST_URL: str = "https://pro-api.coinmarketcap.com/v3/fear-and-greed/latest"
    _QUOTES_HISTORICAL_URL: str = "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/historical"
    _LATEST_LISTINGS_URL: str = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
    _CATEGORIES: str = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/categories"
    _CATEGORY_INFO: str = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/category"
    _HISTORICAL_LISTINGS_URL: str = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/historical"
    _QUOTES_INFO_LATEST_URL: str = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest"
    _QUOTES_INFO_HISTORICAL_URL: str = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/historical"
    _MOST_VISITED: str = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/trending/most-visited"
    _OHLCV_HISTORICAL_URL: str = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/ohlcv/historical"
    _COMMUNITY_TRENDING_TOKENS_URL: str = "https://pro-api.coinmarketcap.com/v1/community/trending/token"

    @async_cache_decorator(
        prefix='cryptocurrency_info',
        ttl=24 * 60 * 60,  # 24 часа
    )
    @decorator
    async def get_cryptocurrency_info(
        self,
        payload: Optional[CryptocurrencyInfo],
    ) -> dict[str, Any]:
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._CRYPTOCURRENCY_INFO, params=params, headers=self._HEADERS)

    @async_cache_decorator(
        prefix='categories',
        ttl=24 * 60 * 60,  # ??
    )
    @decorator
    async def get_categories(self, payload: Optional[CategoriesQueryParams],):
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._CATEGORIES, params=params, headers=self._HEADERS)

    @async_cache_decorator(
        prefix='category',
        ttl=24 * 60 * 60,  # ??
    )
    @decorator
    async def get_category_info(self, payload: CategoryInfoQueryParams):
        category = Category(
            id=payload.id,
            limit=payload.limit,
            start=payload.start,
            convert=payload.convert,
            convert_id=payload.convert_id,
        )
        if payload.account_id == 1:
            params = category.model_dump(exclude_none=True)
            async with httpx.AsyncClient() as client:
                return await client.get(self._CATEGORY_INFO, params=params, headers=self._HEADERS)
        else:
            params = category.model_dump(exclude_none=True)
            async with httpx.AsyncClient() as client:
                return await client.get(self._CATEGORY_INFO, params=params, headers=self._HEADERS_SECOND)


    @async_cache_decorator(
        prefix='most_visited_ccy',
        ttl=10 * 60,  # ??
    )
    @decorator
    async def get_most_visited_ccy(self, payload: MostVisitedQueryParams):
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._MOST_VISITED, params=params, headers=self._HEADERS)
    @async_cache_decorator(
        prefix='quotes_latest',
        ttl=10 * 60,  # 10 минут
    )
    @decorator
    async def get_quotes_latest(
        self,
        payload: Optional[GlobalMetricsLatestQueryParams],
    ) -> dict[str, Any]:
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._QUOTES_LATEST_URL, params=params, headers=self._HEADERS)

    @async_cache_decorator(
        prefix='latest',
        ttl=10 * 60,
    )
    @decorator
    async def get_latest(
        self,
        payload: QueryParamsTrendingLatest,
    ) -> list[dict[str, Any]]:
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._LATEST_URL, params=params, headers=self._HEADERS)

    @async_cache_decorator(
        prefix='listings_latest',
        ttl=60,
    )
    @decorator
    async def get_listings_latest(self, payload: Optional[ListingsLatestQueryParams],):
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._LATEST_LISTINGS_URL, params=params, headers=self._HEADERS)

    @async_cache_decorator(
        prefix='quotes_info_latest',
        ttl=60,
    )
    @decorator
    async def get_quotes_latest_info(self, payload: Optional[QuotesLatestInfoQueryParams], ):
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._QUOTES_INFO_LATEST_URL, params=params, headers=self._HEADERS)


    @async_cache_decorator(
        prefix='quotes_info_historical',
        ttl=5 * 60,
    )
    @decorator
    async def get_quotes_historical_info(self, payload: Optional[QuotesHistoricalInfoQueryParams], ):
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._QUOTES_INFO_HISTORICAL_URL, params=params, headers=self._HEADERS)


    @async_cache_decorator(
        prefix='quotes_info_historical_for_week',
        ttl=2 * 60 * 60,
    )
    @decorator
    async def get_quotes_historical_info_for_week(self, payload: Optional[QuotesHistoricalInfoQueryParams], ):
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._QUOTES_INFO_HISTORICAL_URL, params=params, headers=self._HEADERS)




    @async_cache_decorator(
        prefix='listings_historical',
        ttl=10 * 60,
    )
    @decorator
    async def get_listings_historical(self, payload: ListingsHistoricalQueryParams):
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._HISTORICAL_LISTINGS_URL, params=params, headers=self._HEADERS)

    @async_cache_decorator(
        prefix='new_coins',
        ttl=10 * 60,
    )
    @decorator
    async def get_new_coins(self, payload: QueryParams) -> list[dict[str, Any]]:
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._NEW_COINS_URL, params=params, headers=self._HEADERS)

    @async_cache_decorator(
        prefix='gainers_losers',
        ttl=10 * 60,
    )
    @decorator
    async def get_gainers_losers(self, payload: QueryParamsTrending) -> list[dict[str, Any]]:
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._GAINERS_LOSERS_URL, params=params, headers=self._HEADERS)

    @async_cache_decorator(
        prefix='fear_greed_historical',
        ttl=10 * 60,
    )
    @decorator
    async def get_fear_greed_historical(self, payload: FearAndGreedHistoricalQueryParams) -> list[dict[str, Any]]:
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._FEAR_GREED_HISTORICAL_URL, params=params, headers=self._HEADERS)

    @async_cache_decorator(
        prefix='fear_greed_latest',
        ttl=15 * 60,
    )
    @decorator
    async def get_fear_greed_latest(self, payload: None) -> list[dict[str, Any]]:
        async with httpx.AsyncClient() as client:
            return await client.get(self._FEAR_GREED_LATEST_URL, params={}, headers=self._HEADERS)

    @async_cache_decorator(
        prefix='quotes_historical',
        ttl=10 * 60,
    )
    @decorator
    async def get_quotes_historical(self, payload: GlobalMetricsHistoricalQueryParams) -> list[dict[str, Any]]:
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._QUOTES_HISTORICAL_URL, params=params, headers=self._HEADERS)

    @async_cache_decorator(
        prefix='ohlcv',
        ttl=10 * 60,
    )
    @decorator
    async def get_ohlcv(self, payload: OHLCVQueryParams):
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._OHLCV_HISTORICAL_URL, params=params, headers=self._HEADERS)

    @async_cache_decorator(
        prefix='quotes_diagrams',
        ttl=10 * 60,
    )
    @decorator
    async def get_diagrams(self, payload: QuotesHistoricalQueryParams):
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(url='https://api.coinmarketcap.com/data-api/v4/global-metrics/quotes/historical', params=params)

    @async_cache_decorator(
        prefix='tvl_ranking',
        ttl=60,
    )
    @decorator
    async def get_tvl_ranking(self, payload: QueryParamsTVLRanking) -> list[dict[str, Any]]:
        params = payload.model_dump(exclude_none=True)
        async with httpx.AsyncClient() as client:
            return await client.get(self._COMMUNITY_TRENDING_TOKENS_URL, params=params, headers=self._HEADERS)



class CMCService:

    def __init__(self, redis_client: Annotated[RedisClient, Depends()], cmc_client: Annotated[CMCClient, Depends()]):
        self.redis_connection = redis_client
        self._cmc_client = cmc_client
        self.account_index = 0

    async def get_new_coins(
        self,
        payload: Optional[QueryParams] = None,
    ):
        coins = await self._cmc_client.get_new_coins(payload)
        logo_info_by_coin_id = await self._get_logo_info_by_coin_id(coins, limit=payload.limit)
        res = []
        for coin in coins:
            coin['logo'] = logo_info_by_coin_id.get(str(coin['id']), {}).get('logo', 'Not Found')
            res.append(coin)
        return res

    async def get_latest(
        self,
        payload: Optional[QueryParamsTrendingLatest] = None,
    ):
        coins = await self._cmc_client.get_latest(payload)
        logo_info_by_coin_id = await self._get_logo_info_by_coin_id(coins, limit=payload.limit)
        res = []
        for coin in coins:
            coin['logo'] = logo_info_by_coin_id.get(str(coin['id']), {}).get('logo', 'Not Found')
            res.append(coin)
        return res

    async def _get_logo_info_by_coin_id(self, coins: dict[str, Any] | list, limit: int) -> dict[str, dict[str, Any]]:
        slug_sets =[
            ','.join([coin['slug'] for coin in coins[left: left + 200]])
            for left in range(0, limit, 200)
        ]
        tasks = []
        for slug_set in slug_sets:
            tasks.append(self._cmc_client.get_cryptocurrency_info(CryptocurrencyInfo(slug=slug_set)))
        logo_info_by_coin_id_dict_set = await asyncio.gather(*tasks)
        logo_info_by_coin_id = {}
        for logo_info_by_coin_id_dict in logo_info_by_coin_id_dict_set:
            logo_info_by_coin_id.update(logo_info_by_coin_id_dict)
        return logo_info_by_coin_id

    async def get_gainers_losers(
        self,
        payload: Optional[QueryParamsTrending] = None,
    ):
        coins = await self._cmc_client.get_gainers_losers(payload)
        logo_info_by_coin_id = await self._get_logo_info_by_coin_id(coins, limit=payload.limit)
        res = []
        for coin in coins:
            coin['logo'] = logo_info_by_coin_id.get(str(coin['id']), {}).get('logo', 'Not Found')
            res.append(coin)
        return res

    async def get_fear_and_greed_historical(
        self,
        payload: Optional[FearAndGreedHistoricalQueryParams] = None,
    ):
        return await self._cmc_client.get_fear_greed_historical(payload)

    async def get_fear_and_greed_latest(
        self,
        payload: None = None
    ):
        return await self._cmc_client.get_fear_greed_latest(payload)
    async def get_quotes_historical(
        self,
        payload: Optional[GlobalMetricsHistoricalQueryParams] = None,
    ):
        return await self._cmc_client.get_quotes_historical(payload)

    async def get_quotes_latest(
        self,
        payload: Optional[GlobalMetricsLatestQueryParams] = None,
    ):
        return await self._cmc_client.get_quotes_latest(payload)

    async def get_cryptocurrency_info(self, payload: Optional[CryptocurrencyInfo]) -> dict[str, Any]:
        return await self._cmc_client.get_cryptocurrency_info(payload)

    async def get_diagrams(self, payload: QuotesHistoricalQueryParams):
        return await self._cmc_client.get_diagrams(payload)


    async def get_listings_latest(self, payload: ListingsLatestQueryParams): # Все криптовалюты (вывод списка монет) для самых волатильных sort=percent_change_24h, лидеры по объему sort=volume_24h
        coins = await self._cmc_client.get_listings_latest(payload)
        logo_info_by_coin_id = await self._get_logo_info_by_coin_id(coins, limit=payload.limit)
        res = []
        for coin in coins:
            coin['logo'] = logo_info_by_coin_id.get(str(coin['id']), {}).get('logo', 'Not Found')
            res.append(coin)
        return res

    async def get_categories(self, payload: CategoriesQueryParams):
        categories = await self._cmc_client.get_categories(payload)
        limit = payload.limit
        id_sets = [
            [category['id'] for category in categories[left: left + 10]]
            for left in range(0, limit, 10)
        ]
        category_info_by_id_dict_set = []
        first_request_done = False
        for id_set in id_sets:
            tasks = []
            for id_ in id_set:
                tasks = []
                for _ in range(2):  # Попытки с 2 разными аккаунтами
                    try:
                        result = await self._cmc_client.get_category_info(
                            CategoryInfoQueryParams(id=id_, limit=1000, account_id=self.account_index)
                        )
                        if result:
                            category_info_by_id_dict_set.append(result)
                            break
                    except Exception as e:
                        print(f"Error with account {self.account_index}: {e}")
                    self.account_index = (self.account_index + 1) % 2
                    print(f"Switching to account {self.account_index}")

            if tasks:
                results = await asyncio.gather(*tasks)
                category_info_by_id_dict_set.extend(results)
        category_info_by_id = {}
        category_info_percent = []
        for category_info_by_id_dict in category_info_by_id_dict_set:
            coins = category_info_by_id_dict['coins']
            max_percent_change_24 = -10000000
            coin_max_percent_change_24 = ''
            coin_symbol = ''
            id_ = ''
            for coin in coins:
                if float(coin['quote']['USD']['percent_change_24h']) > max_percent_change_24:
                    max_percent_change_24 = float(coin['quote']['USD']['percent_change_24h'])
                    coin_max_percent_change_24 = coin['name']
                    coin_symbol = coin['symbol']
                    id_ = coin['id']

            category_info_percent.append({
                'category_id': category_info_by_id_dict['id'],
                'max_percent_change_24': max_percent_change_24,
                'coin': coin_max_percent_change_24,
                'symbol': coin_symbol,
                'id': id_,
            })
        categories_obj = []

        slug_sets = [
            ','.join([str(coin['id']) for coin in category_info_percent[left: left + 10]])
            for left in range(0, limit, 10)
        ]
        tasks = []
        for slug_set in slug_sets:
            tasks.append(self._cmc_client.get_cryptocurrency_info(CryptocurrencyInfo(id=slug_set)))
        logo_info_by_coin_id_dict_set = await asyncio.gather(*tasks)
        logo_info_by_coin_id = {}
        for logo_info_by_coin_id_dict in logo_info_by_coin_id_dict_set:
            logo_info_by_coin_id.update(logo_info_by_coin_id_dict)
        for coin in category_info_percent:
            logo_list = logo_info_by_coin_id.get(str(coin['id']), {})
            if logo_list:
                coin['logo'] = logo_list.get('logo', 'Not Found')
            else:
                coin['logo'] = 'Not Found'
        for category in categories:
            for info_percent in category_info_percent:
                if category['id'] == info_percent['category_id']:
                    total_supply = await self._cmc_client.get_quotes_latest(GlobalMetricsLatestQueryParams())
                    total_market_cap = list(total_supply["quote"].values())[0]["total_market_cap"]
                    categories_obj.append(CategoriesResponse(
                        coin=info_percent['coin'],
                        id=category['id'],
                        avg_price_change= category['avg_price_change'],
                        name=category['name'],
                        title=category['title'],
                        description=category['description'],
                        market_cap=float(category['market_cap']),
                        market_cap_change=category['market_cap_change'],
                        volume=float(category['volume']),
                        volume_change=category['volume_change'],
                        last_updated=category['last_updated'],
                        max_percent_change_24=info_percent['max_percent_change_24'],
                        slug=info_percent['symbol'],
                        logo=info_percent['logo'],
                        dominance=(float(category['market_cap'])) / float(total_market_cap)
                    ))
                    break
        return categories_obj

    async def get_special_category(self, payload: CategorySpecialQueryParams):
        _ID_MAPPING = {
            "nfts": "60291fa0db1be76c46298e83",
            "rehypo": "663dd07040575e0870396c23",
            "binance_alpha": "6762acaeb5d1b043d3342f44",
            "memes": "6051a82566fc1b42617d6dc6",
            "sol": "60521ff1df5d3f36b84fbb61",
            "bnb": "60308028d2088f200c58a005",
            "internet_capital_markets": "6823f463f4035758156a501c",
            "ai": "6051a81a66fc1b42617d6db7",
            "ai_agents": "67250af2622a021a2592cba5",
            "rwa": "6400b58c1701313dc2e853a9",
            "gaming": "6051a82166fc1b42617d6dc1",
            "depin": "65f23191e6c934565751ce16",
            "defai": "677d0fc06bd44718911d7781",
        }

        params = CategoryInfoQueryParams(
            id=_ID_MAPPING[payload.category_special_type.value],
            start=payload.start,
            limit=payload.limit,
            convert=payload.convert,
            convert_id=payload.convert_id,
        )
        return await self.get_category_info(params)



    async def get_category_info(self, payload: CategoryInfoQueryParams):
        category = await self._cmc_client.get_category_info(payload)
        coins = category['coins']
        logo_info_by_coin_id = await self._get_logo_info_by_coin_id(coins, limit=payload.limit)
        res = []
        for coin in coins:
            coin['logo'] = logo_info_by_coin_id.get(str(coin['id']), {}).get('logo', 'Not Found')
            res.append(coin)

        category['coins'] = res
        return category

    async def get_listings_historical(self, payload: ListingsHistoricalQueryParams):
        return await self._cmc_client.get_listings_historical(payload)

    async def get_quotes_latest_info(self, payload: QuotesLatestInfoQueryParams):
        coins = await self._cmc_client.get_quotes_latest_info(payload)

        limit = len(coins)

        slug_sets = [
            ','.join([coin['slug'] for coin in list(coins.values())[left: left + 200]])
            for left in range(0, limit, 200)
        ]
        tasks = []
        for slug_set in slug_sets:
            tasks.append(self._cmc_client.get_cryptocurrency_info(CryptocurrencyInfo(slug=slug_set)))
        logo_info_by_coin_id_dict_set = await asyncio.gather(*tasks)
        logo_info_by_coin_id = {}
        for logo_info_by_coin_id_dict in logo_info_by_coin_id_dict_set:
            logo_info_by_coin_id.update(logo_info_by_coin_id_dict)
        res = []
        for coin in list(coins.values()):
            coin['logo'] = logo_info_by_coin_id.get(str(coin['id']), {}).get('logo', 'Not Found')
            try:
                quote = list(coin["quote"].values())[0]
                coin["volume_market_cap"] = float(quote["volume_24h"] or 0) / float(quote["market_cap"] or 1)
                if quote["price"] and coin["max_supply"]:
                    coin["fdv"] = float(coin["max_supply"]) * float(quote["price"])
                elif quote["price"] and quote["market_cap"]:
                    coin["fdv"] = float(quote["market_cap"])
                else:
                    coin["fdv"] = 0
            except Exception:
                coin["volume_market_cap"] = 0
            res.append(coin)
        return res
    async def get_long_short_ratio(self, payload, exchange: str):
        match exchange:
            case "binance":
                url = "https://fapi.binance.com/futures/data/globalLongShortAccountRatio"
                response = await ExchangeClient().get_long_short_ratio(url=url, payload=payload)
                try:
                    return [LongShortRatio(
                            symbol=elem["symbol"],
                            longShortRatio=elem["longShortRatio"],
                            longAccount=elem["longAccount"],
                            shortAccount=elem["shortAccount"],
                            timestamp=elem["timestamp"],
                        ) for elem in response]
                except Exception:
                    return {"error": f"{response}"}
            case "bybit":
                url = "https://api.bybit.com/v5/market/account-ratio"
                params = LongShortRatioBybitQueryParams(
                    category="linear",
                    symbol=payload.symbol,
                    period=payload.period + 'in' if payload.period[-1] == "m" else payload.period,
                    startTime=payload.startTime,
                    endTime=payload.endTime,
                    cursor=None
                )
                response = await ExchangeClient().get_long_short_ratio(url=url, payload=params)
                try:
                    res = response["result"]["list"]
                    result = []
                    for elem in res:
                        result.append(
                            LongShortRatio(
                                symbol=str(elem["symbol"]),
                                longShortRatio=str(float(elem["buyRatio"] or 0) / float(elem["sellRatio"] or 1)),
                                longAccount=str(elem["buyRatio"]),
                                shortAccount=str(elem["sellRatio"]),
                                timestamp=elem["timestamp"],
                            )
                        )
                    return result
                except Exception:
                    return {"error": f"{response}"}
            case _:
                return {"error": "Биржа не подключена..."}

    async def get_quotes_historical_info(self, payload: QuotesHistoricalInfoQueryParams):
        return await self._cmc_client.get_quotes_historical_info(payload)

    async def get_quotes_historical_info_for_week(self, payload: QuotesHistoricalInfoQueryParams):
        return await self._cmc_client.get_quotes_historical_info_for_week(payload)

    def get_cbr_data(self):
        url = "https://www.cbr-xml-daily.ru/daily_json.js"
        response = requests.get(url=url).json()
        value = response["Valute"]["USD"]["Value"]
        return float(value or 0)

    @async_cache_decorator(
        prefix='categories_number',
        ttl=24 * 60 * 60,  # ??
    )
    async def get_all_categories(self, payload=None):
        categories = await self._cmc_client.get_categories(CategoriesQueryParams(start=1, limit=5000))
        try:
            return len(categories)
        except Exception:
            return 1


    async def get_most_visited_by_category(self, category_id, payload: MostVisitedQueryParams):
        category = await self._cmc_client.get_category_info(CategoryInfoQueryParams(id=category_id, start=1, limit=1000, convert=payload.convert, convert_id=payload.convert_id, account_id=1))
        most_visited_ccy = await self._cmc_client.get_most_visited_ccy(payload)
        coins_category = category['coins']
        order_map = {coin['id']: index for index, coin in enumerate(most_visited_ccy)}
        sorted_coins = sorted(coins_category, key=lambda coin: order_map.get(coin['id'], float('inf')))
        return sorted_coins


    async def get_ohlcv_data(self, payload: OHLCVQueryParams):
        ohlcv_data = await self._cmc_client.get_ohlcv(payload)
        return ohlcv_data

    async def get_liquidations(self, exchange: str, payload):
        response = await ExchangeClient().get_liquidations(exchange=exchange, payload=payload)
        res = []
        match exchange:
            case "bitfinex":
                for elem in response:
                    for i in elem:
                        res.append(
                            BitfinexLiquidations(
                                pos_id=int(i[1]),
                                mts=int(i[2]) if i[2] else None,
                                symbol=i[4],
                                amount=float(i[5]) if i[5] else None,
                                base_price=float(i[6]) if i[6] else None,
                                is_match="initial liquidation trigger" if int(i[8]) == 0 else "market execution",
                                is_market_sold="direct sell into the market" if int(i[9]) else "position acquired by the system",
                                price_acquired=float(i[11]) if i[11] else None
                            )
                        )
                return res
            case "gateio":
                return response
            case "okx":
                res = []
                for elem in response["data"]:
                    res.append(
                        {
                            "timestamp": elem[0],
                            "sellVol": elem[1],
                            "buyVol": elem[2]
                        }
                    )
                return res
            case "binance":
                return response
            case "bybit":
                return response['result']['list']
        return response

    async def get_tvl_ranking(self, payload: QueryParamsTVLRanking):
        return await self._cmc_client.get_tvl_ranking(payload)


class ExchangeClient:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=10)  # Устанавливаем таймаут в 10 секунд

    async def get_long_short_ratio(self, url, payload):
        params = payload.model_dump(exclude_none=True)
        try:
            response = await self.client.get(url=url, params=params)
            response.raise_for_status()  # Проверяем, нет ли ошибки HTTP
            return response.json()  # Возвращаем JSON-ответ
        except httpx.HTTPStatusError as e:
            return {"error": f"HTTP Error: {e.response.status_code}, {e.response.text}"}
        except httpx.RequestError as e:
            return {"error": f"Request Error: {str(e)}"}

    async def get_liquidations(self, exchange, payload):
        params = payload
        url = ""
        if exchange == "bitfinex":
            params = payload.model_dump(exclude_none=True)
            url = "https://api-pub.bitfinex.com/v2/liquidations/hist"
        elif exchange == "okx":
            url = "https://www.okx.com/api/v5/rubik/stat/taker-volume-contract"
        elif exchange == "gateio":
            url = "https://api.gateio.ws/api/v4/futures/usdt/liq_orders"
        elif exchange == "binance":
            url = "https://fapi.binance.com/futures/data/takerlongshortRatio"
        elif exchange == "bybit":
            url = 'https://api.bybit.com/v5/market/recent-trade'
        print(url)

        try:
            response = await self.client.get(url=url, params=params)
            response.raise_for_status()  # Проверяем, нет ли ошибки HTTP
            return response.json()  # Возвращаем JSON-ответ
        except httpx.HTTPStatusError as e:
            return {"error": f"HTTP Error: {e.response.status_code}, {e.response.text}"}
        except httpx.RequestError as e:
            return {"error": f"Request Error: {str(e)}"}




    async def close(self):
        await self.client.aclose()  # Закрываем клиент при завершении работы
