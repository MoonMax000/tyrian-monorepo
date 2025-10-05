from importlib.metadata import PathDistribution
from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    API_KEY: str # X-CMC_PRO_API_KEY
    REDIS_HOST: str
    REDIS_PORT: int


settings = Settings()

