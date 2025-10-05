import httpx
import logging
import time
from typing import Any, Optional

logger = logging.getLogger(__name__)

# Константы для retry механизма
MAX_RETRIES = 5  # Максимальное количество попыток
RETRY_DELAY = 1  # Пауза между попытками в секундах
RETRY_DELAY_STEP = 0.5  # Шаг увеличения паузы
REQUEST_TIMEOUT = 30  # Таймаут запроса в секундах


class HttpClient:
    """
    HTTP клиент с retry механизмом и логированием.
    """
    
    @staticmethod
    def get(url: str, params: Optional[dict[str, Any]] = None) -> dict:
        """
        Выполняет GET запрос с retry механизмом.

        Args:
            url: URL для запроса
            params: Параметры запроса

        Returns:
            dict: Ответ от сервера в формате JSON

        Raises:
            ValueError: Если все попытки запроса завершились неудачно
        """
        logger.info(f"HttpClient.get called with URL: {url}, params: {params}")
        attempt = 0
        last_error = None

        while attempt < MAX_RETRIES:
            try:
                logger.info(f"Making GET request to {url} with params {params}. Attempt {attempt + 1}")
                
                with httpx.Client(timeout=REQUEST_TIMEOUT) as client:
                    response = client.get(url, params=params)
                    logger.info(f"Received response: status_code={response.status_code}, headers={dict(response.headers)}")
                    
                    if response.status_code != 200:
                        logger.warning(f"Non-200 response: {response.status_code}, content: {response.text[:500]}")
                    
                    response.raise_for_status()
                    
                    try:
                        result = response.json()
                        logger.info(f"Successfully parsed JSON response, type: {type(result)}")
                        return result
                    except Exception as json_error:
                        logger.error(f"Failed to parse JSON response: {str(json_error)}, content: {response.text[:500]}")
                        raise ValueError(f"Invalid JSON response: {str(json_error)}")

            except httpx.TimeoutException as e:
                last_error = e
                logger.warning(f"Timeout error on attempt {attempt + 1}: {str(e)}")

            except httpx.RequestError as e:
                last_error = e
                logger.warning(f"Connection error on attempt {attempt + 1}: {str(e)}")

            except httpx.HTTPStatusError as e:
                # Не retry-им ошибки статусов, они означают проблему с запросом
                logger.error(f"HTTP Status error: {str(e)}, response: {e.response.text[:500]}")
                raise ValueError(f"HTTP error occurred: {e.response.status_code}")

            except Exception as e:
                last_error = e
                logger.warning(f"Unexpected error on attempt {attempt + 1}: {str(e)}")

            attempt += 1
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY + (attempt * RETRY_DELAY_STEP))  # Увеличиваем паузу

        logger.error(f"All {MAX_RETRIES} attempts failed. Last error: {str(last_error)}")
        raise ValueError(f"Failed to get response after {MAX_RETRIES} attempts") 


http_client = HttpClient()
