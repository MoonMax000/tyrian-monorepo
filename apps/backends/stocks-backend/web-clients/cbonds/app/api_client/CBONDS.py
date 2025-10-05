from asyncio.log import logger
from app.api_client.base import BaseAsyncApiClient


class SBONDSApiClient(BaseAsyncApiClient):
    async def get_base_info_stocks(
        self, filters: list = [], quantity: dict = None, sorting: list = []
    ) -> dict:
        payload = {
            "filters": filters,
            "quantity": quantity or {"limit": 40, "offset": 0},
            "sorting": sorting,
        }
        endpoint = "get_tradings_stocks_full/?lang=eng"
        return await self.post(endpoint, json=payload)

    async def get_base_info_kapitalization(
        self, filters: list = [], quantity: dict = None, sorting: list = []
    ) -> dict:
        payload = {
            "filters": filters,
            "quantity": quantity or {"limit": 40, "offset": 0},
            "sorting": sorting,
        }
        endpoint = "get_stocks_capitalization/?lang=eng"
        return await self.post(endpoint, json=payload)

    async def get_emitents(
        self, filters: list = None, quantity: dict = None, sorting: list = []
    ) -> dict:
        if not filters:
            filters = []
        payload = {
            "filters": filters,
            "quantity": quantity or {"limit": 40, "offset": 0},
            "sorting": sorting,
        }
        endpoint = "get_emitents/?lang=eng"
        return await self.post(endpoint, json=payload)

    async def get_report_msfo_finance(
        self, filters: list = [], quantity: dict = None, sorting: list = []
    ) -> dict:
        payload = {
            "filters": filters,
            "quantity": quantity or {"limit": 40, "offset": 0},
            "sorting": sorting,
        }
        endpoint = "get_report_msfo_finance/?lang=eng"
        return await self.post(endpoint, json=payload)

    async def get_report_nomenclature(
        self, filters: list = [], quantity: dict = None, sorting: list = []
    ) -> dict:
        payload = {
            "filters": filters,
            "quantity": quantity or {"limit": 40, "offset": 0},
            "sorting": sorting,
        }
        endpoint = "get_report_nomenclature/?lang=eng"
        return await self.post(endpoint, json=payload)

    async def get_emissions(
        self, filters: list = None, quantity: dict = None, sorting: list = []
    ) -> dict:
        if not filters:
            filters = []
        payload = {
            "filters": filters,
            "quantity": quantity or {},
            "sorting": sorting,
        }
        endpoint = "get_emissions/?lang=eng"
        data = await self.post(endpoint, json=payload)
        logger.info(f"CBONDS emissions data length: {len(data.get('items', []))}")
        return data

    async def get_tradings(
        self, filters: list = None, quantity: dict = None, sorting: list = None, fields: list = None
    ) -> dict:
        if not filters:
            filters = []
        if not sorting:
            sorting = [{"field": "id", "order": "asc"}]
        if not fields:
            fields = []
        payload = {
            "filters": filters,
            "quantity": quantity or {"limit": 40, "offset": 0},
            "sorting": sorting,
            "fields": fields,
        }
        endpoint = "get_tradings/?lang=eng"
        return await self.post(endpoint, json=payload)

    # ETF endpoints

    async def get_etf_funds(
        self, filters: list = None, quantity: dict = None, sorting: list = None, fields: list = None
    ) -> dict:
        """
        The data contains information about the results of global ETF trading on different
        trading platforms. Open and close prices, min and max prices, trading volumes are available.
        Archive data is available
        https://cbonds.com/api/catalog/folders/API_Funds/get_etf_funds/
        """
        if not filters:
            filters = []
        if not sorting:
            sorting = [{"field": "id", "order": "asc"}]
        if not fields:
            fields = []
        payload = {
            "filters": filters,
            "quantity": quantity or {"limit": 40, "offset": 0},
            "sorting": sorting,
            "fields": fields,
        }
        endpoint = "get_etf_funds/?lang=eng"
        return await self.post(endpoint, json=payload)

    async def get_etf_share_classes_quotes(
        self, filters: list = None, quantity: dict = None, sorting: list = None, fields: list = None
    ) -> dict:
        """
        The data contains information about the results of global ETF trading on different
        trading platforms. Open and close prices, min and max prices, trading volumes are available.
        Archive data is available
        https://cbonds.com/api/catalog/folders/API_Funds/get_etf_share_classes_quotes/

        Args:
            filters (list, optional): _description_. Defaults to None.
            quantity (dict, optional): _description_. Defaults to None.
            sorting (list, optional): _description_. Defaults to None.
            fields (list, optional): _description_. Defaults to None.

        Returns:
            dict: _description_
        """
        if not filters:
            filters = []
        if not sorting:
            sorting = [{"field": "id", "order": "asc"}]
        if not fields:
            fields = []
        payload = {
            "filters": filters,
            "quantity": quantity or {"limit": 40, "offset": 0},
            "sorting": sorting,
            "fields": fields,
        }
        endpoint = "get_etf_share_classes_quotes/?lang=eng"
        return await self.post(endpoint, json=payload)

    async def get_etf_share_classes_dividends(
        self, filters: list = None, quantity: dict = None, sorting: list = None, fields: list = None
    ) -> dict:
        """
        cb_api.get_etf_share_classes_dividends:fulltext
        https://cbonds.com/api/catalog/folders/API_Funds/get_etf_share_classes_dividends/
        """
        if not filters:
            filters = []
        if not sorting:
            sorting = [{"field": "id", "order": "asc"}]
        if not fields:
            fields = []
        payload = {
            "filters": filters,
            "quantity": quantity or {"limit": 40, "offset": 0},
            "sorting": sorting,
            "fields": fields,
        }
        endpoint = "get_etf_share_classes_dividends/?lang=eng"
        return await self.post(endpoint, json=payload)
