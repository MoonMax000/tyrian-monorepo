from asyncio.log import logger
from app.api_client.base import BaseAsyncApiClient


class FMPApiClient(BaseAsyncApiClient):
    async def get_stock_info(self, stock_symbol: str):
        """
        Информация об акции.

        Args:
            stock_symbol (str): tiker

        Returns:
            Информация об акции, открытие, закрытие, p/e, eps...
        """
        endpoint = "api/v3/quote/" + stock_symbol
        return await self.get(endpoint=endpoint)

    async def get_company_info(self, stock_symbol: str):
        """
        Информация о компании.

        Args:
            stock_symbol (str): tiker

        Returns:
            Информация о компании, описание. Показатели
        """
        endpoint = "api/v4/company-outlook/"
        params = {"symbol": stock_symbol}
        return await self.get(endpoint=endpoint, params=params)

    async def get_company_key_metrics(
        self, stock_symbol: str, params: dict = None
    ):
        """
        Отчетность компании.

        Args:
            stock_symbol (str): tiker
            params (dict, optional): Количество отчетов.

        Returns:
            Информация о финансовой стабильности.
        """
        endpoint = "api/v3/key-metrics/" + stock_symbol
        return await self.get(endpoint=endpoint, params=params)

    async def get_leaders_volume(self):
        """
        Лидеры по обьему, без значения обема. (значение берется из другого эндпоинта)

        Returns:
            Лидеры по обьему.
        """
        endpoint = "api/v3/stock_market/actives"
        return await self.get(endpoint=endpoint)

    async def get_growth_leaders_info(self) -> dict:
        """
        Лидеры по росту

        Returns:
            Массив с лидерами по росту % котировок.
        """
        endpoint = "api/v3/stock_market/gainers"
        return await self.get(endpoint=endpoint)

    async def get_decline_leaders_info(self):
        """
        Лидеры по падению

        Returns:
            Массив с лидерами по падению % котировок.
        """
        endpoint = "api/v3/stock_market/losers"
        return await self.get(endpoint=endpoint)

    async def get_trading_volumes_info(self, stock_symbol: str):
        """
        Торговый обьем

        Args:
            stock_symbol (str): tiker

        Returns:
            "volume" - торговый обьем за прошлый день [0].
        """
        endpoint = "stable/historical-price-eod/full?symbol=" + stock_symbol
        result = await self.get(endpoint=endpoint)
        return result[0]

    async def get_quote_chart_info(self, stock: str, params: dict):
        """
        График котировок

        Args:
            stock (str): tiker
            start (str): 2022-08-10
            end (str): 2022-09-10

        Returns:
            _type_: dict{"symbol": str, "historical": [{}, {}]
        """
        endpoint = "api/v3/historical-price-full/" + stock
        return await self.get(endpoint=endpoint, params=params)

    async def get_financial_statements_info(
        self, stock_symbol: str, params: dict = None
    ):
        """
        Выручка и чистая прибыль
        История доходов и выручки

        Args:
            stock_symbol (str): tiker
            params (dict, optional): Limit - количество отчетов. Period - annual, quarter (отчет год или квартал).

        Returns:
            "netIncome" - чистая прибыль
            "grossProfit" - выручка
        """
        endpoint = "api/v3/income-statement/" + stock_symbol
        return await self.get(endpoint=endpoint, params=params)

    async def get_balance_sheet_states_info(
        self, stock_symbol: str, params: dict = None
    ):
        """
        Долги и активы

        Args:
            stock_symbol (str): tiker
            params (dict, optional): Limit - количество отчетов. Period - annual, quarter (отчет год или квартал).

        Returns:
            "totalAssets" - общие активы
            "totalLiabilities" - общие долги
        """
        endpoint = "api/v3/balance-sheet-statement/" + stock_symbol
        return await self.get(endpoint=endpoint, params=params)

    async def get_сashflow_growth_info(
        self, stock_symbol: str, params: dict = None
    ):
        """
        Рост денежного потока

        Args:
            stock_symbol (str): tiker
            params (dict, optional): Limit - количество отчетов. Period - annual, quarter (отчет год или квартал).

        Returns:
            _type_: [{}, {}]
        """
        endpoint = "api/v3/cash-flow-statement-growth/" + stock_symbol
        return await self.get(endpoint=endpoint, params=params)

    async def get_cashflow_info(self, stock_symbol: str, params: dict = None):
        """
        Денежный поток

        Args:
            stock_symbol (str): tiker
            params (dict, optional): Limit - количество отчетов. Period - annual, quarter (отчет год или квартал).

        Returns:
            _type_: [{}, {}]
        """
        endpoint = "api/v3/cash-flow-statement/" + stock_symbol
        return await self.get(endpoint=endpoint, params=params)

    async def get_leaders_volatility(self):
        """
        Лидеры по волатильности

        Returns:
            Массив словарей.
        """

        endpoint = "api/v3/stock-screener"
        return await self.get(endpoint=endpoint)

    async def get_high_low_price_info(self, stock_symbol: str):
        """
        Информация о максимуме-минимуме за год и др.

        Args:
            stock_symbol (str): tiker

        Returns:
            Информация о ценах.
        """
        endpoint = "stable/batch-quote?symbols=" + stock_symbol
        return await self.get(endpoint=endpoint)

    async def get_industry_info(self, params: dict):
        """
        Информация о отрасле.

        Args:
            start (str): 2022-08-10
            exchange (str): NYSE, NASDAQ, AMEX

        Returns:
            Информация о отрасле.
        """
        endpoint = "api/v4/industry_price_earning_ratio"
        return await self.get(endpoint=endpoint, params=params)

    async def get_institut_info(self, stock_symbol: str):
        """
        Фонды держатели

        Args:
            stock_symbol (str): tiker

        Returns:
            Информация количества акций у фондов.
        """
        endpoint = "api/v3/institutional-holder/" + stock_symbol
        return await self.get(endpoint=endpoint)

    async def get_dividends_info(self, stock: str):
        endpoint = "stable/dividends?symbol=" + stock
        return await self.get(endpoint=endpoint)

    async def get_company_screener(self, sector: str = None, limit: int = 25):
        """
        Получает данные о компаниях с возможностью фильтрации по сектору.

        Args:
            sector (str, optional): Сектор для фильтрации
            limit (int, optional): Количество записей (по умолчанию 25)

        Returns:
            Массив компаний с информацией о ценах, объемах торгов и других показателях
        """
        print(f"🔍 [FMP CLIENT] get_company_screener called with sector={sector}, limit={limit}")
        
        endpoint = "stable/company-screener"
        params = {}
        
        if sector:
            params["sector"] = sector
        
        if limit:
            params["limit"] = limit
            
        print(f"📡 [FMP CLIENT] Making request to endpoint: {endpoint} with params: {params}")
        
        try:
            result = await self.get(endpoint=endpoint, params=params)
            print(f"✅ [FMP CLIENT] API response received: {len(result) if isinstance(result, list) else 'not a list'} items")
            print(f"📊 [FMP CLIENT] API response sample: {result[:2] if isinstance(result, list) and len(result) > 0 else result}")
            return result
        except Exception as e:
            print(f"❌ [FMP CLIENT] API error: {str(e)}")
            raise

    async def get_historical_chart_1hour(self, symbol: str, from_date: str = None, to_date: str = None, nonadjusted: bool = False):
        """
        Получает часовые данные по акции (1 Hour Interval Stock Chart API).

        Args:
            symbol (str): Символ акции (например, "AAPL")
            from_date (str, optional): Дата начала в формате YYYY-MM-DD
            to_date (str, optional): Дата окончания в формате YYYY-MM-DD
            nonadjusted (bool, optional): Нескорректированные данные (по умолчанию False)

        Returns:
            Массив часовых данных с open, high, low, close, volume для каждого часа
        """
        endpoint = f"stable/historical-chart/1hour?symbol={symbol}"
        params = {}
        
        if from_date:
            params["from"] = from_date
        
        if to_date:
            params["to"] = to_date
            
        if nonadjusted:
            params["nonadjusted"] = str(nonadjusted).lower()
            
        return await self.get(endpoint=endpoint, params=params)

    async def get_historical_price_eod_full(self, symbol: str, from_date: str = None, to_date: str = None):
        """
        Получает полные исторические дневные данные по акции.

        Args:
            symbol (str): Символ акции (например, "AAPL")
            from_date (str, optional): Дата начала в формате YYYY-MM-DD
            to_date (str, optional): Дата окончания в формате YYYY-MM-DD

        Returns:
            Массив дневных данных с open, high, low, close, volume для каждого дня
        """
        endpoint = f"stable/historical-price-eod/full?symbol={symbol}"
        params = {}
        
        if from_date:
            params["from"] = from_date
        
        if to_date:
            params["to"] = to_date
            
        return await self.get(endpoint=endpoint, params=params)
