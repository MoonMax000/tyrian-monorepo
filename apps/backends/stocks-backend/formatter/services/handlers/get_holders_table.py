from httpx import AsyncClient
from logger import logger

from http_client import http_client

from .get_block_data import BlockDataGetter


class HoldersTableGetter(BlockDataGetter):
    async def get_block_data(self) -> dict:
        """
        Получает данные для указанного блока из кэша или источника.
        """
        if cached_data := await self._get_cached_data():
            return cached_data

        try:
            formatted_data = await self._get_block_data()

            # Добавляем данные доп запросом

            # Получим стоимость акции и вычислим общую стоимость
            # акций у каждого акционера
            endpoint = f"/stocks/{self.params['ticker'].upper()}"

            try:
                url = f"http://{self.source}:{self.port}{endpoint}"
                data = await http_client.get(url=url)
            except Exception as e:
                logger.error(f"Error getting stock price data: {str(e)}")
                data = None
            if data and len(data) > 0:
                price = data[0].get("price", 0)

            # добавляем собственно value в блок данных
            for item in formatted_data:
                item["value"] = int(item.get("shares", 0)) * price

            await self._save_to_cache(formatted_data)
            return formatted_data
        except Exception as e:
            logger.error(f"Error getting data: {str(e)}")
            raise

