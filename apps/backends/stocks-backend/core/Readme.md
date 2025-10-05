# Дневник трейдера


## Настройки
Настройки для часовой зоны UTC.

    LANGUAGE_CODE = 'ru-RU'
    TIME_ZONE = 'UTC'

## Кастомная модель пользователя

Устанавливается кастомная модель пользователя

*settings.py*

    AUTH_USER_MODEL = 'accounts.User'

*accounts: models.py*

    class User(AbstractUser):
        pass


## Как запустить

Скачай репозиторий, создай файл с переменными окружения, взяв за основу файл *.env.example* в папке *project*. Далее, запусти докер-контейнер:
```
    docker compose up -d --build
```

В браузере по адресу:
```
http://127.0.0.1:9999
```
должна открыться страница сайта с текущим временем.

Админка доступна по адресу:
```
http://127.0.0.1:9999/admin/
```
Создание суперпользователя - стандартным образом через контейнер backend.

# Регистрация/авторизация юзера:
общее описание эндпойнтов см. 
https://djoser.readthedocs.io/en/latest/base_endpoints.html
https://djoser.readthedocs.io/en/latest/jwt_endpoints.html

1. Регистрация: POST api/auth/users/ тут шлём email/пароль
2. Верификация: На указанную почту приходит письмо (требуется донастройка почты на сервере), в письме ссылка вида uid/token. Эти uid и токен шлём на POST api/auth/users/activation/
3. Логин: POST api/auth/jwt/create/ , получаем доступ-токен

инфа о себе GET api/auth/users/me/, заголовок Authorization: JWT <token>

## Парсинг данных с Московской биржи

https://iss.moex.com/iss
