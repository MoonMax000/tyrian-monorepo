import asyncio
import json
from datetime import datetime, timedelta
from logger import logger

from cache import cacher
from http_client import http_client
from .get_block_data import BlockDataGetter
from services.data_converters.stocks import sort_market_leaders_data


class MarketLeadersGainersGetter(BlockDataGetter):
    async def _get_top_gainers_data(self, formatted_data: list, limit: int | None = None) -> list:
        """
        Фильтрует данные по наибольшему росту цены за 24 часа и возвращает limit записей.
        """
        # Сортируем по change_percent_24h в порядке убывания (наибольший рост)
        formatted_data.sort(key=lambda x: x.get("change_percent_24h", 0) or 0, reverse=True)

        # Возвращаем limit записей
        return formatted_data[:limit]

    async def _add_percentage_changes(self, formatted_data: list) -> list:
        """
        Добавляет поля изменения цены к отформатированным данным используя параллельные запросы.
        """
        if not isinstance(formatted_data, list):
            logger.warning(f"formatted_data is not a list, got {type(formatted_data)}")
            return formatted_data

        try:
            # Подготавливаем все задачи для параллельного выполнения
            tasks_1h = []
            tasks_24h = []
            valid_items = []
            
            today = datetime.now().strftime("%Y-%m-%d")
            yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
            one_week_ago = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
            
            for item in formatted_data:
                if not isinstance(item, dict):
                    continue
                
                symbol = item.get('symbol', '').strip()
                if not symbol:
                    continue
                
                valid_items.append(item)
                
                # Создаем задачи для часовых данных
                endpoint_1h = f"/stocks/historical-chart/1hour?symbol={symbol}&from={today}&to={today}"
                url_1h = f"http://{self.source}:{self.port}{endpoint_1h}"
                task_1h = http_client.get(url=url_1h)
                tasks_1h.append(task_1h)
                
                # Создаем задачи для дневных данных
                endpoint_24h = f"/stocks/historical-price-eod/full?symbol={symbol}&from={one_week_ago}&to={yesterday}"
                url_24h = f"http://{self.source}:{self.port}{endpoint_24h}"
                task_24h = http_client.get(url=url_24h)
                tasks_24h.append(task_24h)
            
            if not valid_items:
                return formatted_data
            
            # Выполняем все запросы параллельно
            results_1h, results_24h = await asyncio.gather(
                asyncio.gather(*tasks_1h, return_exceptions=True),
                asyncio.gather(*tasks_24h, return_exceptions=True)
            )
            
            # Обрабатываем результаты
            for i, (item, result_1h, result_24h) in enumerate(zip(valid_items, results_1h, results_24h)):
                current_price = item.get("price", 0)
                
                # Добавляем поле icon для акции
                symbol = item.get('symbol', '').upper()
                item["icon"] = f"/media/company_icons/{symbol}.png"
                
                # Обрабатываем часовые данные
                if isinstance(result_1h, Exception):
                    item["change_percent_1h"] = None
                elif result_1h and len(result_1h) > 0:
                    change_percent_1h = result_1h[0].get("close", 0) - result_1h[0].get("open", 0)
                    item["change_percent_1h"] = change_percent_1h
                else:
                    item["change_percent_1h"] = None
                
                # Обрабатываем дневные данные
                if isinstance(result_24h, Exception):
                    item["change_percent_24h"] = None
                    item["change_percent_7d"] = None
                elif result_24h and len(result_24h) > 0:
                    price_yesterday = result_24h[0].get("close", 0)
                    price_one_week_ago = result_24h[-1].get("close", 0)
                    
                    if price_yesterday > 0:
                        change_percent_24h = (current_price - price_yesterday) / price_yesterday * 100
                    else:
                        change_percent_24h = None
                        
                    if price_one_week_ago > 0:
                        change_percent_7d = (current_price - price_one_week_ago) / price_one_week_ago * 100
                    else:
                        change_percent_7d = None
                        
                    item["change_percent_24h"] = change_percent_24h
                    item["change_percent_7d"] = change_percent_7d
                else:
                    item["change_percent_24h"] = None
                    item["change_percent_7d"] = None

            return formatted_data

        except Exception as e:
            logger.error(f"Error adding percentage changes: {str(e)}")
            return formatted_data

    async def _get_top_type_data(self, formatted_data: list, limit: int | None = None, data_type: str = "gainers") -> list:
        """
        Фильтрует данные по типу: gainers (рост) или losers (падение).
        """
        if data_type == "gainers":
            # Сортируем по change_percent_24h в порядке убывания (наибольший рост)
            formatted_data.sort(key=lambda x: x.get("change_percent_24h", 0) or 0, reverse=True)
        else:  # losers
            # Сортируем по change_percent_24h в порядке возрастания (наибольшее падение)
            formatted_data.sort(key=lambda x: x.get("change_percent_24h", 0) or 0, reverse=False)

        # Возвращаем limit записей
        return formatted_data[:limit]

    async def get_block_data(self) -> dict:
        """
        Порядок операций:
        1. Получение и форматирование первичных данных
        2. Добавление полей изменения цены
        3. Фильтрация по наибольшему росту (gainers)
        4. Сортировка по новым полям (если указана)
        """
        try:
            limit = self.limit
            
            # Получаем первичные данные
            formatted_data = await self._get_block_data()
            
            # Добавляем поля изменения цены
            formatted_data = await self._add_percentage_changes(formatted_data)

            # Фильтруем данные по типу (gainers/losers)
            data_type = self.params.get("type", "gainers") if self.params else "gainers"
            formatted_data = await self._get_top_type_data(formatted_data, limit, data_type)

            # Применяем сортировку если указана
            if self.params and "sort_by" in self.params:
                formatted_data = await sort_market_leaders_data(formatted_data, limit, self.params)
            
            return formatted_data
            
        except Exception as e:
            logger.error(f"Error getting data: {str(e)}")
            raise
