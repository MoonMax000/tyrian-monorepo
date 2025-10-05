import json
import pandas as pd
import requests
import logging
import xml.etree.ElementTree as ET

from datetime import datetime, timedelta

from django.core.cache import cache


logger = logging.getLogger(__name__)


CACHE_TIMEOUT = 60 * 60 * 4  # 4 часа


def call_moex(url: str, response_type: str = "json"):
    """Кэширующая функция для вызова API Московской биржи"""
    if response_type not in ["json", "text"]:
        raise ValueError(f"Invalid response type: {response_type}")

    cache_key = f"moex_call_{url}"
    cached_data = cache.get(cache_key)

    if cached_data is not None:
        logger.info("Returning cached data for %s", cache_key)
        return json.loads(cached_data)

    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to get data from {url}")

    if response_type == "json":
        data = response.json()
    else:
        data = response.text

    logger.info(f"Returning data from request to {url}")
    cache.set(cache_key, json.dumps(data), timeout=CACHE_TIMEOUT)
    return data


class MoexApi:
    """
    Класс для работы с API Московской биржи.
    """

    def __init__(self):
        self.api_url = "https://iss.moex.com/iss"

    def get_stocks(self) -> list[dict]:
        """
        Получение списка всех акций, которые торгуются на Московской бирже.
        """
        path = "/engines/stock/markets/shares/boards/TQBR/securities.json"
        url = self.api_url + path

        logger.info(f"Getting stocks from {url}")
        response = requests.get(url)
        if response.status_code != 200:
            logger.error(f"Failed to get stocks from {url}")
            return []
        data = response.json()

        # Извлечение данных
        securities = data["securities"]["data"]
        columns = data["securities"]["columns"]
        logger.info(f"Got {len(securities)} stocks")

        df = pd.DataFrame(securities, columns=columns)

        stocks = df[["SECNAME", "SECID"]].to_dict(orient="records")

        return stocks

    def get_stock_current_info(self, ticker: str = "") -> dict:
        """
        Получение текущей информации о акции, вкл. последнюю цену.ф
        """
        if not ticker:
            return None
        path = (
            f"/engines/stock/markets/shares/boards/TQBR/securities/{ticker.upper()}.xml"
        )
        url = self.api_url + path
        logger.info(f"Getting stock current info from {url}")
        response = requests.get(url)
        if response.status_code != 200:
            logger.error(f"Failed to get stock current info from {url}")
            return None

        data = response.text
        root = ET.fromstring(data)

        stock_data = {}
        for row in root.findall(".//data[@id='securities']/rows/row"):
            stock_data["trading_regime"] = row.get("BOARDNAME")
            stock_data["full_name"] = row.get("SECNAME")
            stock_data["reg_number"] = row.get("REGNUMBER")
            stock_data["issue_size"] = row.get("ISSUESIZE")
            stock_data["currency_id"] = row.get("CURRENCYID")
            stock_data["settlement_date"] = row.get("SETTLEDATE")
            stock_data["instrument_id"] = row.get("INSTRID")

            # TODO: добавить поле для даты начала торгов (требуется другой запрос, в этом запросе нет)
            # stock_data["prev_date"] = row.get("PREVDATE")
            stock_data["prev_date"] = "2007-07-20"

            stock_data["isin"] = row.get("ISIN")
            stock_data["short_name"] = row.get("SHORTNAME")

        for row in root.findall(".//data[@id='marketdata']/rows/row"):
            stock_data["last_price"] = row.get("LAST", 0)
            stock_data["low_price"] = row.get("LOW", 0)
            stock_data["high_price"] = row.get("HIGH", 0)
            stock_data["last_change"] = row.get("LASTCHANGE", 0)
            stock_data["last_change_percents"] = row.get("LASTCHANGEPRCNT", 0)

            stock_data["trades_number"] = row.get("NUMTRADES", 0)
            stock_data["today_volume"] = row.get("VOLTODAY", 0)
            stock_data["capitalization"] = row.get("ISSUECAPITALIZATION", 0)
            stock_data["board_id"] = row.get("BOARDID", 0)
            stock_data["value_today"] = row.get("VALTODAY_RUR", 0)

        stock_data["ticker"] = ticker

        for key, value in stock_data.items():
            if value is None or value == "":
                stock_data[key] = 0

        return stock_data

    def get_stock_prices_history(
        self, ticker: str = "", start_date: str = "", end_date: str = ""
    ):
        """
        Получение истории цены акции за определенный период.
        """
        if not ticker:
            return None
        now = datetime.now()
        date_format = "%Y-%m-%d"
        if not start_date:
            start_date = (now - timedelta(days=30)).strftime(date_format)
        if not end_date:
            end_date = now.strftime(date_format)
        path = f"/history/engines/stock/markets/shares/boards/TQBR/securities/{ticker.upper()}/candles.xml?from={start_date}&till={end_date}"

        url = self.api_url + path
        logger.info(f"Getting stock prices history from {url}")
        # response = requests.get(url)
        # if response.status_code != 200:
        #     logger.error(f"Failed to get stock prices history from {url}")
        #     return None

        # data = response.text
        try:
            data = call_moex(url, "text")
        except ValueError as e:
            logger.error(f"Wrong response type for {url}: {e}")
            return None
        except Exception as e:
            logger.error(f"Failed to get stock prices history from {url}: {e}")
            return None

        root = ET.fromstring(data)

        stock_data = []
        for row in root.findall(".//data[@id='history']/rows/row"):
            stock_info = {
                "num_trades": row.get("NUMTRADES"),
                "value": row.get("VALUE"),
                "open_price": row.get("OPEN"),
                "low_price": row.get("LOW"),
                "high_price": row.get("HIGH"),
                "close_price": row.get("CLOSE"),
                "volume": row.get("VOLUME"),
                "date": row.get("TRADEDATE"),
            }
            stock_data.append(stock_info)

        return stock_data

    def get_stock_indices(self, ticker: str = ""):
        """
        Список индексов в которые входит бумага прямо сейчас.
        """
        if not ticker:
            return None
        path = f"/securities/{ticker.upper()}/indices.json?only_actual=1"
        url = self.api_url + path
        logger.info(f"Getting stock indices from {url}")
        response = requests.get(url)
        if response.status_code != 200:
            logger.error(f"Failed to get stock indices from {url}")
            return None

        data = response.json()

        # Извлечение данных
        indices = data["indices"]["data"]
        columns = data["indices"]["columns"]
        logger.info(f"Got {len(indices)} indices")

        df = pd.DataFrame(indices, columns=columns)
        df.rename(
            columns={
                "SECID": "code",
                "SHORTNAME": "shortname",
                "FROM": "from_date",
                "TILL": "till_date",
                "CURRENTVALUE": "current_value",
                "LASTCHANGEPRC": "last_change_percents",
                "LASTCHANGE": "last_change",
            },
            inplace=True,
        )

        indices_data = df[
            [
                "code",
                "shortname",
                "from_date",
                "till_date",
                "current_value",
                "last_change_percents",
                "last_change",
            ]
        ].to_dict(orient="records")

        return indices_data

    def get_stock_indices_aggregated_for_date(self, ticker: str = "", date: str = ""):
        """
        Агрегированные итоги торгов за дату по рынкам.
        """
        if not ticker:
            return None
        path = f"/securities/{ticker.upper()}/aggregates.json?date={date}"
        url = self.api_url + path
        logger.info(f"Getting stock aggregated data from {url}")
        response = requests.get(url)
        if response.status_code != 200:
            logger.error(f"Failed to get stock aggregated data from {url}")
            return None

        data = response.json()

        aggregates = data["aggregates"]["data"]
        columns = data["aggregates"]["columns"]
        logger.info(f"Got {len(aggregates)} indices")

        df = pd.DataFrame(aggregates, columns=columns)
        df.rename(
            columns={
                "tradedate": "trade_date",
                "numtrades": "trades_number",
            },
            inplace=True,
        )
        valid_markets = ["shares", "ndm", "repo"]
        df = df[df["market_name"].isin(valid_markets)]

        indices_data = df[
            [
                "market_name",
                "market_title",
                "trade_date",
                "trades_number",
                "value",
                "volume",
                "updated_at",
            ]
        ].to_dict(orient="records")

        return indices_data

    def get_news(self):
        """
        Новости.
        """
        path = "/sitenews.json"
        url = self.api_url + path
        logger.info(f"Getting news from {url}")
        response = requests.get(url)
        if response.status_code != 200:
            logger.error(f"Failed to get news from {url}")
            return None

        data = response.json()

        news = data["sitenews"]["data"]
        columns = data["sitenews"]["columns"]
        logger.info(f"Got {len(news)} news")

        df = pd.DataFrame(news, columns=columns)

        news_data = df[["title", "published_at", "modified_at"]].to_dict(
            orient="records"
        )

        return news_data
