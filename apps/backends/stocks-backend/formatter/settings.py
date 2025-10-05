import os
from typing import Optional


class Settings:
    """Настройки для Formatter сервиса"""
    
    def __init__(self):
        self.TERRAPIN_API_URL = os.getenv("TERRAPIN_API_URL", "http://stocks-terrapin:8054")
        self.CBONDS_API_URL = os.getenv("CBONDS_API_URL", "http://stocks-cbonds:8054")
        self.FMP_API_URL = os.getenv("FMP_API_URL", "http://stocks-fmp:8052")
        self.CMC_API_URL = os.getenv("CMC_API_URL", "http://stocks-cmc:8053")


# Глобальный экземпляр настроек
settings = Settings()
