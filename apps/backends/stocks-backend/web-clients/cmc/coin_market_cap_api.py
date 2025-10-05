import asyncio
from datetime import datetime, timedelta, timezone
from pprint import pprint
from typing import Annotated, Union, Any, Optional, List

# import ccxt
import requests
from fastapi import APIRouter, Depends, Query, UploadFile, Request, HTTPException

from models import QueryParams, QueryParamsTrending, FearAndGreedHistoricalQueryParams, GlobalMetricsLatestQueryParams, \
    GlobalMetricsHistoricalQueryParams, QueryParamsTrendingLatest, CryptocurrencyInfo, get_query_params, \
    get_cryptocurrency_info, get_query_params_new, get_query_params_trending_latest, \
    get_fear_and_greed_historical_query_params, get_global_metrics_historical_query_params, \
    get_global_metrics_latest_query_params, QuotesHistoricalQueryParams, get_quotes_historical_query_params, \
    ListingsLatestQueryParams, CategoriesQueryParams, CategoryInfoQueryParams, ListingsHistoricalQueryParams, \
    get_listings_latest_query_params, get_categories_query_params, get_category_info_query_params, \
    get_listings_historical_query_params, QuotesLatestInfoQueryParams, get_quotes_latest_info_query_params, \
    LongShortRatioBinanceQueryParams, get_long_short_ratio_binance_query_params, BinanceLongShortRatio, LongShortRatio, \
    QuotesHistoricalInfoQueryParams, get_quotes_historical_info_query_params, CategoriesResponse, \
    MostVisitedQueryParams, get_query_params_most_visited, get_ohlcv, OHLCVQueryParams, LiquidationsQueryParamsBitfinex, \
    get_liquidations, CategorySpecialQueryParams, get_category_special_query_params, QueryParamsTVLRanking, get_query_params_tvl_ranking
from services import CMCService, batched

cmc_router = APIRouter()

@cmc_router.get("/listings/new", response_model=None, status_code=200)
async def get_new_coins(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[QueryParams, Depends(get_query_params_new)],
):
    return await cmc_service.get_new_coins(payload)


@cmc_router.get("/trending/gainers-losers", response_model=None, status_code=200)
async def get_trending_losers(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[QueryParamsTrending, Depends(get_query_params)],
):
    return await cmc_service.get_gainers_losers(payload)


@cmc_router.get("/trending/latest", response_model=None, status_code=200)
async def get_latest(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[QueryParamsTrendingLatest, Depends(get_query_params_trending_latest)],
):
    return await cmc_service.get_latest(payload)


@cmc_router.get("/fear-and-greed/latest", response_model=None, status_code=200)
async def get_fear_greed_latest(
    cmc_service: Annotated[CMCService, Depends()],
):
    return await cmc_service.get_fear_and_greed_latest(payload=None)

@cmc_router.get("/fear-and-greed/historical", response_model=None, status_code=200)
async def get_fear_greed_historical(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[FearAndGreedHistoricalQueryParams, Depends(get_fear_and_greed_historical_query_params)],
):
    return await cmc_service.get_fear_and_greed_historical(payload)

@cmc_router.get("/global-metrics/quotes-latest", response_model=None, status_code=200)
async def get_quotes_latest(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[GlobalMetricsLatestQueryParams, Depends(get_global_metrics_latest_query_params)],
):
    return await cmc_service.get_quotes_latest(payload)

@cmc_router.get("/global-metrics/quotes-historical", response_model=None, status_code=200)
async def get_quotes_historical(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[GlobalMetricsHistoricalQueryParams, Depends(get_global_metrics_historical_query_params)],
):
    return await cmc_service.get_quotes_historical(payload)

@cmc_router.get("/info/", response_model=None, status_code=200)
async def get_cryptocurrency_info(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[CryptocurrencyInfo, Depends(get_cryptocurrency_info)],
):
    return await cmc_service.get_cryptocurrency_info(payload)


@cmc_router.get("/quotes/historical-diagrams", response_model=None, status_code=200)
async def get_info(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[QuotesHistoricalQueryParams, Depends(get_quotes_historical_query_params)],
):
    return await cmc_service.get_diagrams(payload)

@cmc_router.get("/listings/latest", response_model=None, status_code=200)
async def get_cryptocurrency_latest(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[ListingsLatestQueryParams, Depends(get_listings_latest_query_params)],
    with_historical_data: Optional[bool] = False,
    interval: str = '2h',
    batch_size: int = 50,
    weeks_shift_period: int = 1,
):
    coins = await cmc_service.get_listings_latest(payload)
    if with_historical_data:
        time_end = datetime.now(tz=timezone.utc)
        time_start = time_end - timedelta(weeks=weeks_shift_period)
        tasks = [
            cmc_service.get_quotes_historical_info_for_week(
                QuotesHistoricalInfoQueryParams(
                    id=','.join(str(coin['id']) for coin in coin_ids_batch),
                    interval=interval,
                    time_start=str(time_start),
                    time_end=str(time_end),
                )
            )
            for coin_ids_batch in batched(coins, n=batch_size)
        ]

        historical_data_by_id = {
            obj['id']: obj
            for data_dict in await asyncio.gather(*tasks)
            for obj in data_dict.values()
        }

        for coin in coins:
            coin['historical_data'] = historical_data_by_id.get(coin['id'], {}).get('quotes')
    return coins


@cmc_router.get("/categories", response_model=List[CategoriesResponse], status_code=200)
async def get_categories(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[CategoriesQueryParams, Depends(get_categories_query_params)],
):
    return await cmc_service.get_categories(payload)

@cmc_router.get("/categories/category", response_model=None, status_code=200)
async def get_category_info(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[CategoryInfoQueryParams, Depends(get_category_info_query_params)],
):
    return await cmc_service.get_category_info(payload)

@cmc_router.get("/listings/historical", response_model=None, status_code=200)
async def get_cryptocurrency_historical(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[ListingsHistoricalQueryParams, Depends(get_listings_historical_query_params)],
):
    return await cmc_service.get_listings_historical(payload)


@cmc_router.get("/quotes/latest", response_model=None, status_code=200)
async def get_quotes_latest_info(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[QuotesLatestInfoQueryParams, Depends(get_quotes_latest_info_query_params)],
):
    return await cmc_service.get_quotes_latest_info(payload)


@cmc_router.get("/exchanges/long_short_ratio/{exchange}", response_model=List[LongShortRatio], status_code=200)
async def get_long_short_ratio(
    exchange: str,
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[LongShortRatioBinanceQueryParams, Depends(get_long_short_ratio_binance_query_params)],
):
    return await cmc_service.get_long_short_ratio(payload, exchange)


@cmc_router.get("/quotes/historical", response_model=None, status_code=200)
async def get_quotes_historical_info(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[QuotesHistoricalInfoQueryParams, Depends(get_quotes_historical_info_query_params)],
):
    return await cmc_service.get_quotes_historical_info(payload)


@cmc_router.get("/get-categories-number", response_model=None, status_code=200)
async def get_categories_number_info(
    cmc_service: Annotated[CMCService, Depends()],
):
    return await cmc_service.get_all_categories()

@cmc_router.get("/categories/category/most-visited", response_model=None, status_code=200)
async def get_category_most_visited_info(
    cmc_service: Annotated[CMCService, Depends()],
    category_id: str,
    payload: Annotated[MostVisitedQueryParams, Depends(get_query_params_most_visited)],

):
    return await cmc_service.get_most_visited_by_category(category_id, payload)


@cmc_router.get("/ohlcv/historical", response_model=None, status_code=200)
async def get_quotes_historical_info(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[OHLCVQueryParams, Depends(get_ohlcv)],
):
    return await cmc_service.get_ohlcv_data(payload)


@cmc_router.get("/liquidations/bitfinex", response_model=None, status_code=200)
async def get_liquidations_bitfinex(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[LiquidationsQueryParamsBitfinex, Depends(get_liquidations)],
):
    return await cmc_service.get_liquidations(exchange="bitfinex", payload=payload)


@cmc_router.get("/liquidations/gateio", response_model=None, status_code=200)
async def get_liquidations_gateio(
    cmc_service: Annotated[CMCService, Depends()],
    settle: str,
    contract: str | None = None,
    limit: int | None = None,
    start: str | None = None,
    end: str | None = None
):
    import ccxt
    client = ccxt.bitmex({})
    client.fetch_liquidations()
    payload = {
        "settle": settle,
        "contract": contract,
        "from": start,
        "to": end,
        "limit": limit,
    }
    return await cmc_service.get_liquidations(exchange="gateio", payload=payload)

# @cmc_router.get("/liquidations/bitmex", response_model=None, status_code=200)
# async def get_liquidations_bitmex(
#     cmc_service: Annotated[CMCService, Depends()],
#     symbol: str,
#     filter: str,
#     limit: int | None = None,
#     start: str | None = None,
#     end: str | None = None
# ):
#     import ccxt
#     client = ccxt.okx({})
#     print(client.fetch_liquidations(symbol="ETH/USDT"))
#     print(client.publicGetLiquidation())
#     # return await cmc_service.get_liquidations(exchange="bitmex", payload=payload)

@cmc_router.get("/liquidations/okx", response_model=None, status_code=200)
async def get_liquidations_okx(
    cmc_service: Annotated[CMCService, Depends()],
    inst_id: str,
    period: str | None = None,
    start: str | None = None,
    end: str | None = None,
    limit: int | None = None
):
    payload = {
        "instId": inst_id,
        "period": period,
        "begin": start,
        "end": end,
        "limit": limit
    }

    return await cmc_service.get_liquidations(exchange="okx", payload={key: value for key, value in payload.items() if value is not None})

@cmc_router.get("/liquidations/binance", response_model=None, status_code=200)
async def get_liquidations_binance(
    cmc_service: Annotated[CMCService, Depends()],
    symbol: str,
    period: str,
    start: str | None = None,
    end: str | None = None,
    limit: int | None = None
):
    payload = {
        "symbol": symbol,
        "period": period,
        "startTime": start,
        "endTime": end,
        "limit": limit
    }

    return await cmc_service.get_liquidations(exchange="binance", payload={key: value for key, value in payload.items() if value is not None})


@cmc_router.get("/liquidations/bybit", response_model=None, status_code=200)
async def get_liquidations_bybit(
    cmc_service: Annotated[CMCService, Depends()],
    symbol: str,
    category: str,
    base_coin: str | None = None,
    option_type: str | None = None,
    limit: int | None = None
):
    payload = {
        "symbol": symbol,
        "category": category,
        "base_coin": base_coin,
        "option_type": option_type,
        "limit": limit
    }

    return await cmc_service.get_liquidations(exchange="bybit", payload={key: value for key, value in payload.items() if value is not None})


@cmc_router.get("/categories/category-special", response_model=None, status_code=200)
async def get_category_info(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[CategorySpecialQueryParams, Depends(get_category_special_query_params)],
):
    res = await cmc_service.get_special_category(payload)
    if res:
        res = res.get("coins")
    return res


@cmc_router.get("/trending/tvl_ranking", response_model=None, status_code=200)
async def get_tvl_ranking(
    cmc_service: Annotated[CMCService, Depends()],
    payload: Annotated[QueryParamsTVLRanking, Depends(get_query_params_tvl_ranking)],
):
    return await cmc_service.get_tvl_ranking(payload)
