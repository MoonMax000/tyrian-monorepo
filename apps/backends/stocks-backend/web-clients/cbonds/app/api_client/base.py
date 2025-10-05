from typing import Any
import aiohttp


class BaseAsyncApiClient:
    """
    Базовый класс для асинхронной работы с API
    """

    def __init__(
        self,
        base_url: str,
        login: str | None = None,
        password: str | None = None,
        timeout: int = 10,
    ):
        """
        Инициализация клиента

        :param base_url: Базовый URL API
        :param login: Логин для аутентификации
        :param password: Пароль для аутентификации
        :param timeout: Таймаут запросов в секундах
        """
        self.base_url = base_url
        self.login = login
        self.password = password
        self.headers = self._build_headers()

    def _build_headers(self) -> dict[str, str]:
        """
        Создание базовых заголовков для запросов

        :return: Словарь с заголовками
        """
        return {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    def _build_auth_payload(self) -> dict[str, Any]:
        """
        Создание тела запроса для аутентификации

        :return: Словарь с данными аутентификации
        """
        if self.login and self.password:
            return {"auth": {"login": self.login, "password": self.password}}
        return {}

    async def _request(
        self,
        method: str,
        endpoint: str,
        params: dict[str, Any] | None = None,
        data: dict[str, Any] | None = None,
        json: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """
        Метод для выполнения HTTP-запросов

        :param method: HTTP метод (GET, POST, PUT, DELETE и т.д.)
        :param endpoint: Конечная точка API
        :param params: Параметры запроса (для GET-запросов)
        :param data: Данные в формате формы (для POST/PUT/PATCH)
        :param json: JSON данные (для POST/PUT/PATCH)
        :return: Ответ сервера в формате JSON
        """
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        params = dict(params) if params else {}
        json = json or {}

        # Добавляем данные аутентификации в тело запроса для POST-запросов
        if method == "POST":
            auth_payload = self._build_auth_payload()
            json.update(auth_payload)

        try:
            async with aiohttp.ClientSession(headers=self.headers) as session:
                async with session.request(
                    method=method,
                    url=url,
                    params=params,
                    data=data,
                    json=json,
                ) as response:
                    response.raise_for_status()
                    return await response.json()
        except aiohttp.ClientResponseError as http_err:
            raise Exception(
                f"HTTP error occurred: {http_err} "
                f"({await http_err.response.text()})"
            )
        except aiohttp.ClientConnectionError as conn_err:
            raise Exception(f"Connection error occurred: {conn_err}")
        except aiohttp.ServerTimeoutError as timeout_err:
            raise Exception(f"Timeout error occurred: {timeout_err}")
        except aiohttp.ClientError as req_err:
            raise Exception(f"An error occurred: {req_err}")

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
