from httpx import AsyncClient
from logger import logger
from .get_block_data import BlockDataGetter
from http_client import http_client
from services.data_converters.stocks import filter_corporate_bonds_data, filter_goverment_bonds_data, sort_bonds_data
from ..get_block import get_block


class EmissionsWithYTMGetter(BlockDataGetter):

    async def _add_ytm_data(self, formatted_data: list) -> list:
        """
        Добавляет данные о YTM (yield to maturity) из tradings в список emissions.
        """
        # Проверяем, что данные имеют правильный формат
        if not isinstance(formatted_data, list):
            logger.warning(f"formatted_data is not a list, got {type(formatted_data)}")
            return formatted_data
            
        if len(formatted_data) == 0:
            return formatted_data

        try:
            # Получаем ID всех облигаций для запроса к tradings
            bond_ids = [str(item.get("id", "")) for item in formatted_data if isinstance(item, dict) and item.get("id")]
            
            if not bond_ids:
                logger.warning("No bond IDs found in emissions data")
                return formatted_data

            # Запрос к tradings через cbonds с оператором in
            url = f"http://stocks-cbonds:8054/market_leaders/tradings"
            # Объединяем ID через ; для оператора in
            ids_string = ";".join(bond_ids)
            params = {
                "filters": f"id:in:{ids_string}",
                "limit": len(bond_ids),
                "offset": 0,
                "fields": "id,ytm"
            }
            
            logger.debug(f"Requesting tradings data for {len(bond_ids)} bonds with filter: id:in:{ids_string}")
            tradings_data = await http_client.get(url=url, params=params)
            
            if not tradings_data or "items" not in tradings_data:
                logger.warning("No tradings data received or invalid format")
                return formatted_data

            # Создаем словарь {id: ytm} для быстрого поиска
            ytms = {}
            for item in tradings_data.get("items", []):
                if isinstance(item, dict):
                    bond_id = str(item.get("id", ""))
                    ytm = item.get("ytm")
                    if bond_id and ytm is not None:
                        ytms[bond_id] = ytm

            logger.debug(f"Received YTM data for {len(ytms)} bonds")

            # Добавляем ytm к данным emissions
            for item in formatted_data:
                if isinstance(item, dict):
                    bond_id = str(item.get("id", ""))
                    if bond_id in ytms:
                        item["ytm"] = ytms[bond_id]
                    else:
                        item["ytm"] = None

            logger.info(f"Successfully added YTM data to {len(formatted_data)} emissions records")

        except Exception as e:
            logger.error(f"Error getting YTM data from tradings: {str(e)}")
            # В случае ошибки добавляем None для всех записей
            for item in formatted_data:
                if isinstance(item, dict):
                    item["ytm"] = None

        return formatted_data

    async def _get_block_data(self) -> dict:
        """
        Переопределяем для добавления YTM данных до сортировки.
        """
        block = await get_block(self.block_slug, self.country_slug)
        
        self.source = block.get("source")
        self.port = block.get("port")
        self.endpoint = block.get("endpoint")
        self.expiration_time = block.get("expiration_time", 3600)
        self.data_formatter = block.get("data_formatter", self._format_data)

        await self._replace_params_in_endpoint()

        source_data = await self._get_data_from_source()
        
        # Сначала применяем форматирование/фильтрацию (без сортировки)
        formatted_data = await self.data_formatter(source_data, self.limit, self.params)
        
        # Затем добавляем YTM данные к отформатированным данным
        formatted_data = await self._add_ytm_data(formatted_data)
        
        # Теперь применяем сортировку по YTM если указана
        if self.params and "sort_by" in self.params:
            formatted_data = await sort_bonds_data(formatted_data, self.limit, self.params)
        
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
            logger.error(f"Error getting emissions with YTM data: {str(e)}")
            raise
