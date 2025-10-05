import time
from redis.asyncio.client import Redis


class RequestCounter:
    def __init__(self, redis: Redis, counter_key: str):
        self.redis = redis
        self.counter_key = counter_key

    async def record_request(self, route: str) -> None:
        """
        Записывает информацию о запуске роутера в Redis.
        """
        timestamp = int(time.time())
        await self.redis.zadd(
            self.counter_key, {f"{route}:{timestamp}": timestamp}
        )
        await self.redis.expire(
            self.counter_key,
            60,
        )

    async def get_total_requests(self) -> int:
        """
        Возвращает общее количество запусков роутеров за минуту.
        """
        one_minute_ago = int(time.time()) - 60
        count = await self.redis.zcount(
            self.counter_key, min=one_minute_ago, max="+inf"
        )
        return count
