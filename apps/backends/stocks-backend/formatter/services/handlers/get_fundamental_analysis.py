from httpx import AsyncClient
from logger import logger

from http_client import http_client
from .get_block_data import BlockDataGetter


class FundamentalAnalysisGetter(BlockDataGetter):
    async def get_block_data(self) -> dict:
        """
        Получает данные для указанного блока из кэша или источника.
        """
        if cached_data := await self._get_cached_data():
            return cached_data

        try:
            formatted_data = await self._get_block_data()

            # Добавляем данные доп запросом

            # Макс и мин цена за год
            endpoint = f"/stocks/high_low_price/{self.params['ticker']}"
            try:
                url = f"http://{self.source}:{self.port}{endpoint}"
                data = await http_client.get(url=url)
            except Exception as e:
                logger.error(f"Error getting year price data: {str(e)}")
                data = None

            year_price_data = {}
            if data and len(data) > 0:
                year_price_data = data[0]

            # Добавляем данные в блок
            formatted_data["year_price"]["max"] = year_price_data.get("yearHigh", 0)
            formatted_data["year_price"]["min"] = year_price_data.get("yearLow", 0)
            formatted_data["year_price"]["current"] = year_price_data.get("price", 0)

            await self._save_to_cache(formatted_data)
            return formatted_data
        except Exception as e:
            logger.error(f"Error getting data: {str(e)}")
            raise
