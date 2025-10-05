import httpx
import time
import asyncio
from typing import Any, Optional

from logger import logger


# Константы для retry механизма
MAX_RETRIES = 50  # Максимальное количество попыток
RETRY_DELAY = 1  # Пауза между попытками в секундах
RETRY_DELAY_STEP = 1  # Шаг увеличения паузы
REQUEST_TIMEOUT =240  # Таймаут запроса в секундах


class HttpClient:
    """
    HTTP клиент с retry механизмом и логированием.
    """
    
    @staticmethod
    async def get(url: str, params: Optional[dict[str, Any]] = None) -> dict:
        """
        Выполняет асинхронный GET запрос с retry механизмом.

        Args:
            url: URL для запроса
            params: Параметры запроса

        Returns:
            dict: Ответ от сервера в формате JSON

        Raises:
            ValueError: Если все попытки запроса завершились неудачно
        """
        attempt = 0
        last_error = None

        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            while attempt < MAX_RETRIES:
                try:
                    logger.debug(f"Making GET request to {url} with params {params}. Attempt {attempt + 1}")
                    
                    response = await client.get(url, params=params)
                    response.raise_for_status()
                    return response.json()

                except httpx.TimeoutException as e:
                    last_error = e
                    logger.warning(f"Timeout error on attempt {attempt + 1}: {str(e)}")

                except httpx.RequestError as e:
                    last_error = e
                    logger.warning(f"Connection error on attempt {attempt + 1}: {str(e)}")

                except httpx.HTTPStatusError as e:
                    # Не retry-им ошибки статусов, они означают проблему с запросом
                    logger.error(f"HTTP Status error: {str(e)}")
                    raise ValueError(f"HTTP error occurred: {e.response.status_code}")

                except Exception as e:
                    last_error = e
                    logger.warning(f"Unexpected error on attempt {attempt + 1}: {str(e)}")

                attempt += 1
                if attempt < MAX_RETRIES:
                    await asyncio.sleep(RETRY_DELAY + (attempt * RETRY_DELAY_STEP))  # Увеличиваем паузу

        logger.error(f"All {MAX_RETRIES} attempts failed. Last error: {str(last_error)}")
        raise ValueError(f"Failed to get response after {MAX_RETRIES} attempts") 

    @staticmethod
    async def post(url: str, json: Optional[dict[str, Any]] = None, params: Optional[dict[str, Any]] = None) -> dict:
        """
        Выполняет асинхронный POST запрос с retry механизмом.

        Args:
            url: URL для запроса
            json: JSON данные для отправки
            params: Параметры запроса

        Returns:
            dict: Ответ от сервера в формате JSON

        Raises:
            ValueError: Если все попытки запроса завершились неудачно
        """
        attempt = 0
        last_error = None

        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            while attempt < MAX_RETRIES:
                try:
                    logger.debug(f"Making POST request to {url} with json {json} and params {params}. Attempt {attempt + 1}")
                    
                    response = await client.post(url, json=json, params=params)
                    response.raise_for_status()
                    return response.json()

                except httpx.TimeoutException as e:
                    last_error = e
                    logger.warning(f"Timeout error on attempt {attempt + 1}: {str(e)}")

                except httpx.RequestError as e:
                    last_error = e
                    logger.warning(f"Connection error on attempt {attempt + 1}: {str(e)}")

                except httpx.HTTPStatusError as e:
                    # Не retry-им ошибки статусов, они означают проблему с запросом
                    logger.error(f"HTTP Status error: {str(e)}")
                    raise ValueError(f"HTTP error occurred: {e.response.status_code}")

                except Exception as e:
                    last_error = e
                    logger.warning(f"Unexpected error on attempt {attempt + 1}: {str(e)}")

                attempt += 1
                if attempt < MAX_RETRIES:
                    await asyncio.sleep(RETRY_DELAY + (attempt * RETRY_DELAY_STEP))  # Увеличиваем паузу

        logger.error(f"All {MAX_RETRIES} attempts failed. Last error: {str(last_error)}")
        raise ValueError(f"Failed to get response after {MAX_RETRIES} attempts")


http_client = HttpClient()
