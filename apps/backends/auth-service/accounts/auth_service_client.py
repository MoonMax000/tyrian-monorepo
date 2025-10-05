from project import settings # type: ignore
import requests # type: ignore


class AuthServiceApiClient:
    url = settings.AUTH_SERVICE_API_URL.rstrip('/')

    @classmethod
    def create_user(cls, email, password):
        endpoint = cls.url + '/users'
        return cls._request(method='POST', endpoint=endpoint, json={'email': email, 'password': password})

    @classmethod
    def update_user(cls, email, password):
        endpoint = cls.url + '/users'
        return cls._request(method='PATCH', endpoint=endpoint, json={'email': email, 'password': password})

    @classmethod
    def check_user(cls, email, password):
        endpoint = cls.url + '/users/check'
        return cls._request(method='POST', endpoint=endpoint, json={'email': email, 'password': password})

    @staticmethod
    def _request(endpoint, method, json):
        try:
            res = requests.request(method=method, url=endpoint, json=json)
            return res.json()
        except:  # todo обрабатывать исключения
            pass
