import hashlib
import json
from functools import wraps
from typing import Any, Callable, Coroutine

import redis
from pydantic import BaseModel

from config import settings

Jsonable = list[dict[str, Any]] | dict[str, Any] | None
class RedisClient:
    def __init__(
        self,
    ):
        self._redis_client = redis.StrictRedis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)

    async def get(self, cache_key: str) -> Jsonable:
        # Извлекаем результат конкретного запроса из кэша
        cached_result = self._redis_client.get(cache_key.encode('utf-8'))
        if cached_result:
            return self._deserialize_data(cached_result.decode('utf-8'))  # Декодируем и десериализуем
        else:
            return None

    def set(
        self,
        cache_key: str,
        value: Jsonable,
        ttl: int | None = None,
    ) -> None:
        self._redis_client.set(cache_key, self._serialize_data(value))
        if ttl:
            self._redis_client.expire(cache_key, ttl)

    @staticmethod
    def _serialize_data(data: Jsonable) -> str:
        return json.dumps(data)

    @staticmethod
    def _deserialize_data(value: str) -> Jsonable:
        return json.loads(value)

    @staticmethod
    def generate_cache_key(params: dict[str, Any]) -> str:
        param_string = json.dumps(params, sort_keys=True)
        return hashlib.md5(param_string.encode()).hexdigest()

redis_client = RedisClient()


ReturnType = Coroutine[None, None, Jsonable]
FuncSignature = Callable[[Any, BaseModel | None], ReturnType]
def async_cache_decorator(
    prefix: str,
    ttl: int | None = None,
) -> Callable[[FuncSignature], FuncSignature]:
    def decorator(func: FuncSignature) -> FuncSignature:
        @wraps(func)
        async def wrapper(self, payload: BaseModel | None = None) -> Jsonable:
            params = {}
            if payload:
                params = payload.model_dump()

            cache_key = f"{prefix}:{redis_client.generate_cache_key(params)}"
            all_cached_results = await redis_client.get(cache_key)

            if all_cached_results:
                print("Используем кешированные данные")
                return all_cached_results  # Возвращаем все кэшированные данные

            result = await func(self, payload)
            redis_client.set(
                cache_key=cache_key,
                value=result,
                ttl=ttl,
            )
            return result

        return wrapper

    return decorator
