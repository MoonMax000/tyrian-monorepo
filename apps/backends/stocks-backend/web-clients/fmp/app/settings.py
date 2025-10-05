import asyncio
import logging

from contextlib import asynccontextmanager
from app.redis.metric_request import RequestCounter
from redis import asyncio as aioredis
from fastapi import FastAPI
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import HttpUrl, RedisDsn


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    FMP_API_URL: HttpUrl
    FMP_API_KEY: str
    TIMEOUT: int = 50
    redisdns: RedisDsn = RedisDsn("redis://stocks-redis:6375/0")
    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()

redis = aioredis.from_url(
    settings.redisdns.unicode_string(), decode_responses=True
)

# Создаем экземпляр класса RequestCounter
request_counter = RequestCounter(
    redis=redis, counter_key="router_request_count"
)


@asynccontextmanager
async def lifespan(_: FastAPI):
    asyncio.create_task(log_requests_periodically())
    yield
    await redis.close()


async def log_requests_periodically():
    while True:
        total_requests = await request_counter.get_total_requests()
        logger.info(f"Total requests in the last minute: {total_requests}")
        await asyncio.sleep(60)
