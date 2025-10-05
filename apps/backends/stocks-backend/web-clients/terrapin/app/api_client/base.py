import asyncio
import time
from typing import Any

import aiohttp
from app.settings import settings, redis


class BaseAsyncApiClient:
    """
    Базовый класс для асинхронной работы с API
    """

    def __init__(
        self,
        base_url: str,
        bearer_api_key: str | None = None,
        params_api_key: str | None = None,
        timeout: int = 10,
    ):
        """
        Инициализация клиента

        :param base_url: Базовый URL API
        :param api_key: API ключ
        :param timeout: Таймаут запросов в секундах
        """
        self.base_url = str(base_url).rstrip("/")
        self.bearer_api_key = bearer_api_key
        self.params_api_key = params_api_key
        self.headers = self._build_headers()
        
        # Rate limiting settings
        self.requests_per_minute = settings.TERRAPIN_REQUEST_PER_MINUTE
        self.delay_between_requests = 60.0 / self.requests_per_minute  # секунды между запросами
        self.redis_key = "terrapin_last_request_time"

    def _set_params_api_key(self, params: dict[str, Any]) -> None:
        params["apikey"] = self.params_api_key

    def _build_headers(self) -> dict[str, str]:
        """
        Создание базовых заголовков для запросов

        :return: Словарь с заголовками
        """
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        if self.bearer_api_key:
            headers["Authorization"] = f"Bearer {self.bearer_api_key}"
        return headers

    async def _wait_for_rate_limit(self) -> None:
        """
        Проверяет rate limit и при необходимости ждет перед выполнением запроса
        """
        try:
            # Используем блокировку для предотвращения параллельных запросов
            lock_key = f"{self.redis_key}_lock"
            
            # Пытаемся получить блокировку
            lock_acquired = await redis.set(lock_key, "1", nx=True, ex=30)  # 30 секунд блокировка
            
            if not lock_acquired:
                # Если блокировка не получена, ждем случайное время и пробуем снова
                import random
                wait_time = random.uniform(0.1, 1.0)
                print(f"⏳ [RATE LIMIT] Waiting for lock, retrying in {wait_time:.2f} seconds")
                await asyncio.sleep(wait_time)
                return await self._wait_for_rate_limit()
            
            try:
                # Получаем время последнего запроса из Redis
                last_request_time_str = await redis.get(self.redis_key)
                
                if last_request_time_str:
                    last_request_time = float(last_request_time_str)
                    current_time = time.time()
                    time_since_last_request = current_time - last_request_time
                    
                    # Если прошло недостаточно времени, ждем
                    if time_since_last_request < self.delay_between_requests:
                        sleep_time = self.delay_between_requests - time_since_last_request
                        print(f"⏳ [RATE LIMIT] Waiting {sleep_time:.2f} seconds before next request")
                        await asyncio.sleep(sleep_time)
                else:
                    print(f"🚀 [RATE LIMIT] No previous request found, proceeding immediately")
                    
            finally:
                # Освобождаем блокировку
                await redis.delete(lock_key)
                
        except Exception as e:
            print(f"⚠️ [RATE LIMIT] Error checking rate limit: {e}, proceeding anyway")

    async def _update_rate_limit_timestamp(self) -> None:
        """
        Обновляет время последнего запроса в Redis
        """
        try:
            current_time = time.time()
            await redis.set(self.redis_key, str(current_time))
            print(f"📝 [RATE LIMIT] Updated last request time: {current_time}")
        except Exception as e:
            print(f"⚠️ [RATE LIMIT] Error updating rate limit timestamp: {e}")

    async def _request(self, method: str, endpoint: str, **kwargs) -> dict:
        """
        Метод для выполнения HTTP-запросов с повторными попытками и rate limiting.

        :param method: HTTP метод (GET, POST, PUT, DELETE и т.д.)
        :param endpoint: Конечная точка API
        :param params: Параметры запроса (для GET-запросов)
        :param data: Данные в формате формы (для POST/PUT/PATCH)
        :param json: JSON данные (для POST/PUT/PATCH)
        :return: Ответ сервера в формате JSON
        """
        # Проверяем rate limit перед запросом
        await self._wait_for_rate_limit()
        
        url = f"{self.base_url}/{endpoint.lstrip('/')}"

        params = kwargs.pop("params", {}) or {}
        if self.params_api_key:
            self._set_params_api_key(params)

        print(f"🌐 [HTTP REQUEST] {method} {url}")
        print(f"📋 [HTTP REQUEST] Params: {params}")
        print(f"🔑 [HTTP REQUEST] Headers: {self.headers}")

        max_retries = 5  # Уменьшаем количество попыток

        for attempt in range(max_retries):
            try:
                async with aiohttp.ClientSession(
                    headers=self.headers
                ) as session:
                    async with session.request(
                        method, url, params=params, **kwargs
                    ) as response:
                        print(f"📡 [HTTP RESPONSE] Status: {response.status} {response.reason}")
                        print(f"📡 [HTTP RESPONSE] Headers: {dict(response.headers)}")
                        
                        # Обрабатываем 429 ошибку с Retry-After
                        if response.status == 429:
                            retry_after = response.headers.get('Retry-After')
                            if retry_after:
                                wait_time = int(retry_after)
                                print(f"⏳ [RATE LIMIT] 429 error, waiting {wait_time} seconds (Retry-After)")
                                await asyncio.sleep(wait_time)
                                continue
                            else:
                                # Если нет Retry-After, используем экспоненциальную задержку
                                wait_time = (2 ** attempt) * 5  # 5, 10, 20, 40 секунд
                                print(f"⏳ [RATE LIMIT] 429 error, waiting {wait_time} seconds (exponential backoff)")
                                await asyncio.sleep(wait_time)
                                continue
                        
                        # Обрабатываем 402 ошибку (Payment Required)
                        if response.status == 402:
                            print(f"💰 [PAYMENT] 402 Payment Required - API quota exceeded")
                            raise ValueError("API quota exceeded (402 Payment Required)")
                        
                        response.raise_for_status()
                        result = await response.json()
                        
                        print(f"✅ [HTTP RESPONSE] Response received: {type(result)}")
                        if isinstance(result, list):
                            print(f"📊 [HTTP RESPONSE] List length: {len(result)}")
                            if len(result) > 0:
                                print(f"📊 [HTTP RESPONSE] First item: {result[0]}")
                        elif isinstance(result, dict):
                            print(f"📊 [HTTP RESPONSE] Dict keys: {list(result.keys())}")
                        
                        # Обновляем timestamp после успешного запроса
                        await self._update_rate_limit_timestamp()
                        
                        return result
            except aiohttp.ClientResponseError as http_err:
                error_message = f"HTTP error occurred: {http_err.status} {http_err.message}"
                print(f"❌ [HTTP ERROR] {error_message}")
                
                # Логируем содержимое ответа при ошибке
                try:
                    error_response = await response.json()
                    print(f"📄 [HTTP ERROR] Response body (JSON): {error_response}")
                except Exception as json_err:
                    try:
                        error_text = await response.text()
                        print(f"📄 [HTTP ERROR] Response text: {error_text}")
                    except Exception as text_err:
                        print(f"📄 [HTTP ERROR] Could not read response body")
                        print(f"📄 [HTTP ERROR] Text read error: {text_err}")
                
                # Если это 429, 402 или 404, не повторяем запрос
                if http_err.status in [429, 402, 404]:
                    raise ValueError(f"API error: {http_err.status} {http_err.message}")
                    
            except aiohttp.ClientError as err:
                error_message = f"Error occurred: {str(err)}"
                print(f"❌ [HTTP ERROR] {error_message}")
            except Exception as err:
                error_message = f"An error occurred: {str(err)}"
                print(f"❌ [HTTP ERROR] {error_message}")

            if attempt == max_retries - 1:
                raise ValueError(error_message)

            # Экспоненциальная задержка для других ошибок
            wait_time = (2 ** attempt) * 2  # 2, 4, 8, 16 секунд
            print(f"⏳ [RETRY] Waiting {wait_time} seconds before retry {attempt + 1}/{max_retries}")
            await asyncio.sleep(wait_time)

        raise ValueError("Unexpected error occurred")

    async def get(
        self, endpoint: str, params: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        """
        Выполнить GET-запрос

        :param endpoint: Конечная точка API
        :param params: Параметры запроса
        :return: Ответ сервера в формате JSON
        """
        return await self._request("GET", endpoint, params=params)

    async def post(
        self,
        endpoint: str,
        data: dict[str, Any] | None = None,
        json: dict[str, Any] | None = None,
        params: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """
        Выполнить POST-запрос

        :param endpoint: Конечная точка API
        :param data: Данные в формате формы
        :param json: JSON данные
        :param params: параметры запроса
        :return: Ответ сервера в формате JSON
        """
        return await self._request("POST", endpoint, data=data, json=json, params=params)

    async def put(
        self,
        endpoint: str,
        data: dict[str, Any] | None = None,
        json: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """
        Выполнить PUT-запрос

        :param endpoint: Конечная точка API
        :param data: Данные в формате формы
        :param json: JSON данные
        :return: Ответ сервера в формате JSON
        """
        return await self._request("PUT", endpoint, data=data, json=json)

    async def patch(
        self,
        endpoint: str,
        data: dict[str, Any] | None = None,
        json: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """
        Выполнить PATCH-запрос

        :param endpoint: Конечная точка API
        :param data: Данные в формате формы
        :param json: JSON данные
        :return: Ответ сервера в формате JSON
        """
        return await self._request("PATCH", endpoint, data=data, json=json)
