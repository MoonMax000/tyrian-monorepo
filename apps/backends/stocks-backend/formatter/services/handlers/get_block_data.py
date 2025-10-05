import json

from cache import cacher
from logger import logger

from http_client import http_client
from services.data_converters import *

# from ..get_block import get_block  # Убираем для избежания циклических импортов


class BlockDataGetter:
    def __init__(self, block_slug: str, country_slug: str, **params: dict[str, str]):
        self.block_slug = block_slug
        self.country_slug = country_slug
        self.params = params.get("params", {})
        self.limit = int(self.params.get("limit")) if self.params.get("limit") else None

        self.source = None
        self.port = None
        self.endpoint = None
        self.expiration_time = None
        self.data_formatter = None

    async def _get_data_from_source(self):
        if not all([self.source, self.port]):
            raise ValueError(
                f"Source or port not found for block {self.block_slug}",
            )

        url = f"http://{self.source}:{self.port}{self.endpoint}"
        data = await http_client.get(url=url)
        return data

    async def _format_data(self, data: dict, limit: int | None = None, *kwargs) -> dict:
        """
        Эхо-форматттер: возвращает полученные данные.
        Служит заглушкой при отсутствии специфичного форматтера.
        """
        if limit:
            data = data[:limit]
        return data
    
    async def _build_cache_key(self) -> str:
        return cacher.key_builder(
            self.block_slug,
            self.country_slug,
            self.params,
        )

    async def _replace_params_in_endpoint(self) -> None:
        for key, value in self.params.items():
            self.endpoint = self.endpoint.replace(f"<{key}>", str(value))

    async def _get_cached_data(self) -> bytes | None:
        cache_key = await self._build_cache_key()
        cached_data = await cacher.get(cache_key)
        if cached_data:
            logger.debug(f"Getting data from cache: {cache_key}")
            return json.loads(cached_data)
        return None

    async def _save_to_cache(self, data: dict) -> None:
        cache_key = await self._build_cache_key()
        await cacher.set(
            cache_key,
            json.dumps(data),
            expire=self.expiration_time,
        )
        logger.info(f"Data cached with key: {cache_key}")

    async def _get_block_data(self) -> dict:
        from shared import data_blocks  # Отложенный импорт
        block = data_blocks.get(self.block_slug, {}).get(self.country_slug)
        
        self.source = block.get("source")
        self.port = block.get("port")
        self.endpoint = block.get("endpoint")
        self.expiration_time = block.get("expiration_time", 3600)
        self.data_formatter = block.get("data_formatter", self._format_data)

        await self._replace_params_in_endpoint()

        source_data = await self._get_data_from_source()
        formatted_data = await self.data_formatter(source_data, self.limit, self.params)
        return formatted_data


    async def get_block_data(self) -> dict:
        """
        Получает данные для указанного блока из кэша или источника.
        """
        if cached_data := await self._get_cached_data():
            return cached_data

        try:
            formatted_data = await self._get_block_data()
            await self._save_to_cache(formatted_data)
            return formatted_data
        except Exception as e:
            logger.error(f"Error getting data: {str(e)}")
            raise


class BlockDataGetterTester(BlockDataGetter):

    async def _get_data_from_source(self):
        if not all([self.source, self.port]):
            raise ValueError(
                f"Source or port not found for block {self.block_slug}",
            )
        data = {
            "block_slug": self.block_slug,
            "country_slug": self.country_slug,
            **self.params,
            "data": {
                "peRatio": 10,
                "marketCap": 1000000,
                "eps": 10,
                "revenue": 1000000,
                "profit": 100000,
                "assets": 1000000,
            "liabilities": 100000,
        }
        }
        
        return data
