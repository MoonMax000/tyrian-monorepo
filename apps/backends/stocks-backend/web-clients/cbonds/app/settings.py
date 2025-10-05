from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import HttpUrl


class Settings(BaseSettings):
    LOGIN: str
    PASSWORD: str
    CBONDS_API_URL: HttpUrl

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
