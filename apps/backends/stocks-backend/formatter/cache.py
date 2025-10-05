import os
import json

from abc import ABC, abstractmethod
from redis import asyncio as aioredis


class BaseCache(ABC):

    @abstractmethod
    async def get(self, key: str):
        pass

    @abstractmethod
    async def set(self, key: str, value, expire: int = None):
        pass

    @abstractmethod
    def key_builder(self, *args) -> str:
        pass

    @abstractmethod
    async def clear(self):
        pass


class RedisCache(BaseCache):

    def init(self):
        redis_host = os.getenv('REDIS_HOST')
        redis_port = os.getenv('REDIS_PORT')
        self.redis = aioredis.from_url(f"redis://{redis_host}:{redis_port}")

    async def get(self, key: str):
        return await self.redis.get(key)

    async def set(self, key: str, value, expire: int = None):
        await self.redis.set(key, value, ex=expire)

    def key_builder(self, *args) -> str:
        return ":".join(json.dumps(arg) for arg in args)

    async def clear(self):
        await self.redis.flushdb()


cacher = RedisCache()
cacher.init()
