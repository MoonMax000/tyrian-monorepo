from datetime import datetime, timedelta
from logger import logger
from .get_block_data import BlockDataGetter
from http_client import http_client


class ETFGetter(BlockDataGetter):


    async def _add_price_and_change_price_data(self, formatted_data: list) -> list:
        """
        Добавляет данные о ценах и изменении цен из etf_share_classes_quotes.
        """
        if not isinstance(formatted_data, list) or len(formatted_data) == 0:
            logger.warning(f"formatted_data is not a valid list, got {type(formatted_data)}")
            return formatted_data

        try:
            # Получаем ID всех ETF для запроса
            etf_ids = [str(item.get("id", "")) for item in formatted_data if isinstance(item, dict) and item.get("id")]
            
            logger.debug(f"Processing price data for {len(formatted_data)} ETF records")
            logger.debug(f"ETF IDs to process: {etf_ids}")
            
            if not etf_ids:
                logger.warning("No ETF IDs found in formatted data")
                return formatted_data

            # Получаем текущую и вчерашнюю даты
            today = datetime.now().strftime("%Y-%m-%d")
            yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

            # Запрос на текущую дату
            url = "http://stocks-cbonds:8054/etf/etf_share_classes_quotes"
            ids_string = ";".join(etf_ids)
            
            # Получаем данные на сегодня
            today_params = {
                "filters": f"id:in:{ids_string};date:eq:{today}",
                "limit": len(etf_ids),
                "offset": 0,
                "fields": "id,close,open"
            }
            
            logger.debug(f"Requesting today's quotes for {len(etf_ids)} ETFs")
            logger.debug(f"Today URL: {url}")
            logger.debug(f"Today params: {today_params}")
            today_data = await http_client.get(url=url, params=today_params)
            logger.debug(f"Today data response: {today_data}")
            
            # Получаем данные на вчера
            yesterday_params = {
                "filters": f"id:in:{ids_string};date:eq:{yesterday}",
                "limit": len(etf_ids),
                "offset": 0,
                "fields": "id,close"
            }
            
            logger.debug(f"Requesting yesterday's quotes for {len(etf_ids)} ETFs")
            logger.debug(f"Yesterday URL: {url}")
            logger.debug(f"Yesterday params: {yesterday_params}")
            yesterday_data = await http_client.get(url=url, params=yesterday_params)
            logger.debug(f"Yesterday data response: {yesterday_data}")

            # Создаем словари для быстрого поиска
            today_prices = {}
            yesterday_prices = {}
            
            if today_data and "items" in today_data:
                logger.debug(f"Processing {len(today_data.get('items', []))} today's items")
                for item in today_data.get("items", []):
                    if isinstance(item, dict):
                        etf_id = str(item.get("id", ""))
                        close_price = item.get("close")
                        open_price = item.get("open")
                        
                        logger.debug(f"ETF {etf_id}: close={close_price}, open={open_price}")
                        
                        # Определяем цену: сначала close, если пустое, то open, если и open пустое, то null
                        price = None
                        if close_price is not None and close_price != "":
                            price = close_price
                        elif open_price is not None and open_price != "":
                            price = open_price
                            
                        if etf_id and price is not None:
                            today_prices[etf_id] = float(price)
                            logger.debug(f"Added today price for ETF {etf_id}: {price}")
            else:
                logger.warning(f"No today data or items found. Response: {today_data}")

            if yesterday_data and "items" in yesterday_data:
                logger.debug(f"Processing {len(yesterday_data.get('items', []))} yesterday's items")
                for item in yesterday_data.get("items", []):
                    if isinstance(item, dict):
                        etf_id = str(item.get("id", ""))
                        close_price = item.get("close")
                        logger.debug(f"ETF {etf_id}: close={close_price}")
                        if etf_id and close_price is not None and close_price != "":
                            yesterday_prices[etf_id] = float(close_price)
                            logger.debug(f"Added yesterday price for ETF {etf_id}: {close_price}")
            else:
                logger.warning(f"No yesterday data or items found. Response: {yesterday_data}")

            logger.debug(f"Received today's prices for {len(today_prices)} ETFs, yesterday's for {len(yesterday_prices)} ETFs")

            # Добавляем данные к отформатированным данным
            for item in formatted_data:
                if isinstance(item, dict):
                    etf_id = str(item.get("id", ""))
                    
                    # Добавляем текущую цену
                    if etf_id in today_prices:
                        item["price"] = today_prices[etf_id]
                    else:
                        item["price"] = None
                    
                    # Рассчитываем изменение цены
                    if etf_id in today_prices and etf_id in yesterday_prices:
                        today_price = today_prices[etf_id]
                        yesterday_price = yesterday_prices[etf_id]
                        if yesterday_price != 0:
                            price_change = ((today_price - yesterday_price) / yesterday_price) * 100
                            item["price_change"] = round(price_change, 2)
                        else:
                            item["price_change"] = None
                    else:
                        item["price_change"] = None

            logger.info(f"Successfully added price data to {len(formatted_data)} ETF records")

        except Exception as e:
            logger.error(f"Error getting price data: {str(e)}")
            # В случае ошибки добавляем None для всех записей
            for item in formatted_data:
                if isinstance(item, dict):
                    item["price"] = None
                    item["price_change"] = None

        return formatted_data

    async def _add_total_return_on_net_assets_data(self, formatted_data: list) -> list:
        """
        Добавляет данные о общей доходности (Total Return) на основе дивидендов и изменения цен.
        """
        if not isinstance(formatted_data, list) or len(formatted_data) == 0:
            logger.warning(f"formatted_data is not a valid list, got {type(formatted_data)}")
            return formatted_data

        try:
            # Получаем ID всех ETF для запроса
            etf_ids = [str(item.get("id", "")) for item in formatted_data if isinstance(item, dict) and item.get("id")]
            
            logger.debug(f"Processing total return data for {len(formatted_data)} ETF records")
            logger.debug(f"ETF IDs to process: {etf_ids}")
            
            if not etf_ids:
                logger.warning("No ETF IDs found in formatted data")
                return formatted_data

            # Получаем даты
            today = datetime.now().strftime("%Y-%m-%d")
            yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
            one_year_ago = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")

            # Получаем дивиденды за последний год
            dividends_url = "http://stocks-cbonds:8054/etf/etf_share_classes_dividends"
            ids_string = ";".join(etf_ids)
            
            dividends_params = {
                "filters": f"id:in:{ids_string};payable_date:gte:{one_year_ago}",
                "limit": 1000,  # Большой лимит для получения всех дивидендов
                "offset": 0,
                "fields": "id,amount"
            }
            
            logger.debug(f"Requesting dividends for {len(etf_ids)} ETFs from {one_year_ago}")
            logger.debug(f"Dividends URL: {dividends_url}")
            logger.debug(f"Dividends params: {dividends_params}")
            dividends_data = await http_client.get(url=dividends_url, params=dividends_params)
            logger.debug(f"Dividends data response: {dividends_data}")

            # Получаем цены на сегодня/вчера и год назад
            quotes_url = "http://stocks-cbonds:8054/etf/etf_share_classes_quotes"
            
            # Запрос на сегодня/вчера
            current_params = {
                "filters": f"id:in:{ids_string};date:eq:{today}",
                "limit": len(etf_ids),
                "offset": 0,
                "fields": "id,close,open"
            }
            
            logger.debug(f"Requesting current prices for {len(etf_ids)} ETFs")
            logger.debug(f"Current prices URL: {quotes_url}")
            logger.debug(f"Current prices params: {current_params}")
            current_data = await http_client.get(url=quotes_url, params=current_params)
            logger.debug(f"Current prices data response: {current_data}")
            
            # Если нет данных на сегодня, берем вчерашние
            if not current_data or not current_data.get("items"):
                current_params["filters"] = f"id:in:{ids_string};date:eq:{yesterday}"
                logger.debug(f"No data for today, requesting yesterday's prices")
                current_data = await http_client.get(url=quotes_url, params=current_params)

            # Запрос на год назад
            year_ago_params = {
                "filters": f"id:in:{ids_string};date:eq:{one_year_ago}",
                "limit": len(etf_ids),
                "offset": 0,
                "fields": "id,close"
            }
            
            logger.debug(f"Requesting year-ago prices for {len(etf_ids)} ETFs")
            logger.debug(f"Year-ago URL: {quotes_url}")
            logger.debug(f"Year-ago params: {year_ago_params}")
            year_ago_data = await http_client.get(url=quotes_url, params=year_ago_params)
            logger.debug(f"Year-ago data response: {year_ago_data}")

            # Обрабатываем дивиденды
            dividends_by_etf = {}
            if dividends_data and "items" in dividends_data:
                logger.debug(f"Processing {len(dividends_data.get('items', []))} dividend items")
                for item in dividends_data.get("items", []):
                    if isinstance(item, dict):
                        etf_id = str(item.get("id", ""))
                        amount = item.get("amount")
                        logger.debug(f"ETF {etf_id}: dividend amount={amount}")
                        if etf_id and amount is not None:
                            if etf_id not in dividends_by_etf:
                                dividends_by_etf[etf_id] = 0
                            dividends_by_etf[etf_id] += float(amount)
                            logger.debug(f"Added dividend for ETF {etf_id}: {amount}, total: {dividends_by_etf[etf_id]}")
            else:
                logger.warning(f"No dividends data or items found. Response: {dividends_data}")

            # Обрабатываем текущие цены
            current_prices = {}
            if current_data and "items" in current_data:
                logger.debug(f"Processing {len(current_data.get('items', []))} current price items")
                for item in current_data.get("items", []):
                    if isinstance(item, dict):
                        etf_id = str(item.get("id", ""))
                        close_price = item.get("close")
                        open_price = item.get("open")
                        
                        logger.debug(f"ETF {etf_id}: close={close_price}, open={open_price}")
                        
                        # Определяем цену: сначала close, если пустое, то open
                        price = None
                        if close_price is not None and close_price != "":
                            price = close_price
                        elif open_price is not None and open_price != "":
                            price = open_price
                            
                        if etf_id and price is not None:
                            current_prices[etf_id] = float(price)
                            logger.debug(f"Added current price for ETF {etf_id}: {price}")
            else:
                logger.warning(f"No current price data or items found. Response: {current_data}")

            # Обрабатываем цены год назад
            year_ago_prices = {}
            if year_ago_data and "items" in year_ago_data:
                logger.debug(f"Processing {len(year_ago_data.get('items', []))} year-ago price items")
                for item in year_ago_data.get("items", []):
                    if isinstance(item, dict):
                        etf_id = str(item.get("id", ""))
                        close_price = item.get("close")
                        logger.debug(f"ETF {etf_id}: year-ago close={close_price}")
                        if etf_id and close_price is not None and close_price != "":
                            year_ago_prices[etf_id] = float(close_price)
                            logger.debug(f"Added year-ago price for ETF {etf_id}: {close_price}")
            else:
                logger.warning(f"No year-ago price data or items found. Response: {year_ago_data}")

            logger.debug(f"Received dividends for {len(dividends_by_etf)} ETFs, current prices for {len(current_prices)} ETFs, year-ago prices for {len(year_ago_prices)} ETFs")

            # Рассчитываем Total Return для каждой акции
            for item in formatted_data:
                if isinstance(item, dict):
                    etf_id = str(item.get("id", ""))
                    
                    total_return = None
                    if (etf_id in current_prices and 
                        etf_id in year_ago_prices and 
                        year_ago_prices[etf_id] != 0):
                        
                        current_price = current_prices[etf_id]
                        year_ago_price = year_ago_prices[etf_id]
                        dividends = dividends_by_etf.get(etf_id, 0)
                        
                        logger.debug(f"Calculating Total Return for ETF {etf_id}: current={current_price}, year_ago={year_ago_price}, dividends={dividends}")
                        
                        # Total Return = (Конечная стоимость - Начальная стоимость + Дивиденды) / Начальная стоимость * 100%
                        total_return = ((current_price - year_ago_price + dividends) / year_ago_price) * 100
                        total_return = round(total_return, 2)
                        logger.debug(f"Total Return for ETF {etf_id}: {total_return}%")
                    else:
                        logger.debug(f"Cannot calculate Total Return for ETF {etf_id}: current_price={'yes' if etf_id in current_prices else 'no'}, year_ago_price={'yes' if etf_id in year_ago_prices else 'no'}")
                    
                    item["total_return_on_net_assets"] = total_return

            logger.info(f"Successfully added total return data to {len(formatted_data)} ETF records")

        except Exception as e:
            logger.error(f"Error getting total return data: {str(e)}")
            # В случае ошибки добавляем None для всех записей
            for item in formatted_data:
                if isinstance(item, dict):
                    item["total_return_on_net_assets"] = None

        return formatted_data

    async def _get_block_data(self) -> dict:
        """
        Переопределяем для добавления Price, Change price и Total return on net assets данных до сортировки.
        """
        from ..get_block import get_block
        block = await get_block(self.block_slug, self.country_slug)
        
        self.source = block.get("source")
        self.port = block.get("port")
        self.endpoint = block.get("endpoint")
        self.expiration_time = block.get("expiration_time", 60)
        self.data_formatter = block.get("data_formatter", self._format_data)

        await self._replace_params_in_endpoint()

        source_data = await self._get_data_from_source()
        source_data = source_data.get("items", [])
        
        # Сначала применяем форматирование/фильтрацию (без сортировки)
        formatted_data = await self.data_formatter(source_data, self.limit, self.params)
        
        # Добавляем Price и Change price к отформатированным данным
        formatted_data = await self._add_price_and_change_price_data(formatted_data)
        
        # Добавляем Total return on net assets к отформатированным данным
        formatted_data = await self._add_total_return_on_net_assets_data(formatted_data)

        # Теперь применяем сортировку по Price и Change price и Total return on net assets если указана
        if self.params and "sort_by" in self.params:
            formatted_data = await sort_etf_data(formatted_data, self.limit, self.params)
        
        return formatted_data

    async def get_block_data(self) -> dict:
        """
        Получает данные для указанного блока из кэша или источника.
        """
        if cached_data := await self._get_cached_data():
            return cached_data

        try:
            formatted_data = await self._get_block_data()
            if len(formatted_data) == 0:
                return formatted_data

            await self._save_to_cache(formatted_data)
            return formatted_data
        except Exception as e:
            logger.error(f"Error getting ETF data: {str(e)}")
            raise


async def sort_etf_data(formatted_data: list, limit: int | None = None, params: dict = None) -> list:
    """
    Сортирует данные ETF по указанным полям.
    """
    if not isinstance(formatted_data, list) or len(formatted_data) == 0:
        return formatted_data
    
    if not params or "sort_by" not in params:
        return formatted_data
    
    sort_by = params.get("sort_by")
    sort_order = params.get("sort_order", "desc")  # По умолчанию по убыванию
    
    try:
        # Определяем функцию для извлечения значения для сортировки
        def get_sort_value(item, field):
            if not isinstance(item, dict):
                return None
            
            value = item.get(field)
            if value is None:
                return None
            
            # Для числовых полей возвращаем float, для остальных - исходное значение
            if field in ["price", "price_change", "total_return_on_net_assets"]:
                try:
                    return float(value)
                except (ValueError, TypeError):
                    return None
            
            return value
        
        # Сортируем данные
        reverse = sort_order.lower() == "desc"
        formatted_data.sort(
            key=lambda x: get_sort_value(x, sort_by) or (float('-inf') if reverse else float('inf')),
            reverse=reverse
        )
        
        # Применяем лимит если указан
        if limit and limit > 0:
            formatted_data = formatted_data[:limit]
        
        logger.info(f"Successfully sorted {len(formatted_data)} ETF records by {sort_by} in {sort_order} order")
        
    except Exception as e:
        logger.error(f"Error sorting ETF data: {str(e)}")
    
    return formatted_data
