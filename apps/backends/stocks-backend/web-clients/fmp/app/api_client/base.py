import asyncio
from typing import Any

import aiohttp


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
        self.base_url = base_url
        self.bearer_api_key = bearer_api_key
        self.params_api_key = params_api_key
        self.headers = self._build_headers()

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

    async def _request(self, method: str, endpoint: str, **kwargs) -> dict:
        """
        Метод для выполнения HTTP-запросов с повторными попытками.

        :param method: HTTP метод (GET, POST, PUT, DELETE и т.д.)
        :param endpoint: Конечная точка API
        :param params: Параметры запроса (для GET-запросов)
        :param data: Данные в формате формы (для POST/PUT/PATCH)
        :param json: JSON данные (для POST/PUT/PATCH)
        :return: Ответ сервера в формате JSON
        """
        url = f"{self.base_url}/{endpoint.lstrip('/')}"

        params = kwargs.pop("params", {}) or {}
        if self.params_api_key:
            self._set_params_api_key(params)

        print(f"🌐 [HTTP REQUEST] {method} {url}")
        print(f"📋 [HTTP REQUEST] Params: {params}")
        print(f"🔑 [HTTP REQUEST] Headers: {self.headers}")

        max_retries = 10  # Максимальное количество попыток

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
                        
                        response.raise_for_status()
                        result = await response.json()
                        
                        print(f"✅ [HTTP RESPONSE] Response received: {type(result)}")
                        if isinstance(result, list):
                            print(f"📊 [HTTP RESPONSE] List length: {len(result)}")
                            if len(result) > 0:
                                print(f"📊 [HTTP RESPONSE] First item: {result[0]}")
                        elif isinstance(result, dict):
                            print(f"📊 [HTTP RESPONSE] Dict keys: {list(result.keys())}")
                        
                        return result
            except aiohttp.ClientResponseError as http_err:
                error_message = f"HTTP error occurred: {http_err.status} {http_err.message}"
                print(f"❌ [HTTP ERROR] {error_message}")
            except aiohttp.ClientError as err:
                error_message = f"Error occurred: {str(err)}"
                print(f"❌ [HTTP ERROR] {error_message}")
            except Exception as err:
                error_message = f"An error occurred: {str(err)}"
                print(f"❌ [HTTP ERROR] {error_message}")

            if attempt == max_retries - 1:
                raise ValueError(error_message)

            await asyncio.sleep(attempt)

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
    ) -> dict[str, Any]:
        """
        Выполнить POST-запрос

        :param endpoint: Конечная точка API
        :param data: Данные в формате формы
        :param json: JSON данные
        :return: Ответ сервера в формате JSON
        """
        return await self._request("POST", endpoint, data=data, json=json)

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
