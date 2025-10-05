from logger import logger

from http_client import http_client
from .get_block_data import BlockDataGetter


class MarketLeadersVolumeGetter(BlockDataGetter):
    async def get_block_data(self) -> dict:
        """
        Получает данные для указанного блока из кэша или источника.
        """
        if cached_data := await self._get_cached_data():
            return cached_data

        try:
            formatted_data = await self._get_block_data()

            # Добавляем данные доп запросом

            # добавляем собственно volume
            for item in formatted_data:
                # получаем volume
                endpoint = f"/stocks/{item['symbol']}"

                try:
                    url = f"http://{self.source}:{self.port}{endpoint}"
                    data = await http_client.get(url=url)
                except Exception as e:
                    logger.error(f"Error getting volume and price data: {str(e)}")
                    data = None

                volume_data = {}
                if data and len(data) > 0:
                    volume_data = data[0]

                # Добавляем данные в блок
                item["volume"] = volume_data.get("volume", 0)
                item["price"] = volume_data.get("price", 0)

            await self._save_to_cache(formatted_data)
            return formatted_data
        except Exception as e:
            logger.error(f"Error getting data: {str(e)}")
            raise

