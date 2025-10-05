import asyncio
import json
from datetime import datetime, timedelta
from logger import logger

from cache import cacher
from http_client import http_client
from .get_block_data import BlockDataGetter
from services.data_converters.stocks import sort_market_leaders_data


class MarketLeadersGrowthFullGetter(BlockDataGetter):
    async def _get_highest_volume_data(self, formatted_data: list, limit: int | None = None) -> list:
        """
        Фильтрует данные по наибольшему объему торгов за последний день и возвращает limit записей.
        """
        # Сортируем по объему торгов за последний день
        formatted_data.sort(key=lambda x: x.get("volume", 0), reverse=True)

        # Возвращаем limit записей
        return formatted_data[:limit]

    async def _build_percentage_changes_cache_key(self, formatted_data: list) -> str:
        """
        Создает ключ кэша для данных с процентными изменениями.
        Ключ зависит от содержимого данных и параметров.
        """
        import hashlib
        import json
        
        # Создаем уникальный ключ на основе данных
        data_hash = hashlib.md5()
        
        # Добавляем символы и цены в хеш
        symbols_data = []
        for item in formatted_data:
            if isinstance(item, dict):
                symbol = item.get('symbol', '')
                price = item.get('price', 0)
                volume = item.get('volume', 0)
                symbols_data.append(f"{symbol}:{price}:{volume}")
        
        # Сортируем для стабильности хеша
        symbols_data.sort()
        
        # Добавляем параметры в хеш
        params_str = json.dumps(self.params, sort_keys=True) if self.params else "{}"
        
        # Создаем финальную строку для хеширования
        hash_string = f"{json.dumps(symbols_data, sort_keys=True)}:{params_str}"
        data_hash.update(hash_string.encode('utf-8'))
        
        # Добавляем дату для кэширования по дням
        today = datetime.now().strftime("%Y-%m-%d")
        cache_key = f"percentage_changes:{self.block_slug}:{self.country_slug}:{data_hash.hexdigest()}:{today}"
        
        return cache_key

    async def _get_percentage_changes_cached(self, formatted_data: list) -> list | None:
        """
        Получает данные с процентными изменениями из кэша.
        """
        try:
            cache_key = await self._build_percentage_changes_cache_key(formatted_data)
            cached_data = await cacher.get(cache_key)
            if cached_data:
                logger.debug(f"Getting percentage changes from cache: {cache_key}")
                return json.loads(cached_data)
        except Exception as e:
            logger.warning(f"Error getting percentage changes from cache: {str(e)}")
        return None

    async def _save_percentage_changes_to_cache(self, formatted_data: list, data_with_changes: list) -> None:
        """
        Сохраняет данные с процентными изменениями в кэш.
        """
        try:
            cache_key = await self._build_percentage_changes_cache_key(formatted_data)
            # Используем короткое время жизни для кэша процентных изменений (1 час)
            await cacher.set(
                cache_key,
                json.dumps(data_with_changes),
                expire=3600,  # 1 час
            )
            logger.info(f"Percentage changes cached with key: {cache_key}")
        except Exception as e:
            logger.warning(f"Error saving percentage changes to cache: {str(e)}")

    async def _add_percentage_changes(self, formatted_data: list) -> list:
        """
        Добавляет поля изменения цены к отформатированным данным используя параллельные запросы.
        Сначала проверяет кэш, если данных нет - выполняет запросы и кэширует результат.
        """
        if not isinstance(formatted_data, list):
            logger.warning(f"formatted_data is not a list, got {type(formatted_data)}")
            return formatted_data

        try:
            # Проверяем кэш для данных с процентными изменениями
            cached_data = await self._get_percentage_changes_cached(formatted_data)
            if cached_data:
                logger.info("✅ Using cached percentage changes data - no API calls needed")
                return cached_data
            
            logger.info("🔄 Percentage changes not found in cache, fetching from API...")
            
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
                
                # Проверяем, что у элемента есть символ
                symbol = item.get('symbol', '').strip()
                if not symbol:
                    logger.warning(f"Skipping item without symbol: {item}")
                    # Устанавливаем значения по умолчанию для элементов без символа
                    item["change_percent_1h"] = None
                    item["change_percent_24h"] = None
                    item["change_percent_7d"] = None
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
                logger.warning("No valid items with symbols found")
                return formatted_data
            
            logger.info(f"🚀 Starting parallel requests for {len(valid_items)} symbols")
            
            # Выполняем все запросы параллельно
            start_time = datetime.now()
            results_1h, results_24h = await asyncio.gather(
                asyncio.gather(*tasks_1h, return_exceptions=True),
                asyncio.gather(*tasks_24h, return_exceptions=True)
            )
            end_time = datetime.now()
            
            logger.info(f"⚡ Parallel requests completed in {(end_time - start_time).total_seconds():.2f} seconds")
            
            # Обрабатываем результаты и добавляем данные к элементам
            for i, (item, result_1h, result_24h) in enumerate(zip(valid_items, results_1h, results_24h)):
                current_price = item.get("price", 0)
                
                # Добавляем поле icon для акции
                symbol = item.get('symbol', '').upper()
                item["icon"] = f"/media/company_icons/{symbol}.png"
                
                # Обрабатываем часовые данные
                if isinstance(result_1h, Exception):
                    logger.error(f"Error getting 1h data for {item.get('symbol')}: {str(result_1h)}")
                    item["change_percent_1h"] = None
                elif result_1h and len(result_1h) > 0:
                    change_percent_1h = result_1h[0].get("close", 0) - result_1h[0].get("open", 0)
                    item["change_percent_1h"] = change_percent_1h
                else:
                    item["change_percent_1h"] = None
                
                # Обрабатываем дневные данные
                if isinstance(result_24h, Exception):
                    logger.error(f"Error getting 24h data for {item.get('symbol')}: {str(result_24h)}")
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

            # Кэшируем результат с процентными изменениями (БЕЗ сортировки)
            await self._save_percentage_changes_to_cache(formatted_data, formatted_data)
            logger.info("💾 Percentage changes data cached successfully")
            
            return formatted_data

        except Exception as e:
            logger.error(f"Error adding percentage changes: {str(e)}")
            # В случае ошибки добавляем None для всех полей
            for item in formatted_data:
                if isinstance(item, dict):
                    item["change_percent_1h"] = None
                    item["change_percent_24h"] = None
                    item["change_percent_7d"] = None

        return formatted_data

    async def get_block_data(self) -> dict:
        """
        Переопределяем для правильного порядка операций:
        1. Получение и форматирование первичных данных
        2. Добавление полей изменения цены (с кэшированием)
        3. Сортировка по новым полям (всегда применяется)
        """
        try:
            # Определяем limit в начале
            limit = self.limit
            
            # Получаем первичные данные и применяем форматирование
            formatted_data = await self._get_block_data()
            logger.debug(f"formatted_data: {formatted_data}")
            
            # Фильтруем данные по наибольшему объему торгов за последний день
            formatted_data = await self._get_highest_volume_data(formatted_data, limit)
            logger.debug(f"formatted_data after highest volume: {formatted_data}")

            # Добавляем поля изменения цены к отформатированным данным (с кэшированием)
            formatted_data = await self._add_percentage_changes(formatted_data)
            logger.debug(f"formatted_data after percentage changes: {formatted_data}")

            # ВСЕГДА применяем сортировку по новым полям (даже если данные из кэша)
            if self.params and "sort_by" in self.params:
                logger.info(f"Applying sorting: sort_by={self.params.get('sort_by')}, sort_direction={self.params.get('sort_direction', 'desc')}")
                formatted_data = await sort_market_leaders_data(formatted_data, limit, self.params)
                logger.debug(f"formatted_data after sorting: {formatted_data}")
            else:
                logger.info("No sorting parameters, using default order")
            
            return formatted_data
            
        except Exception as e:
            logger.error(f"Error getting data: {str(e)}")
            raise

