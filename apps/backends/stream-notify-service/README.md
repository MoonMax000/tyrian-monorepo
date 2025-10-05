# Микросервис нотификаций

Пример отправки фильтров по ws для сохранения

Подключение к сервису уведомлений через uuid пользователя и отправка lasttime.  
lasttime - используется чтобы не получать уже полученные ранее уведомления.  

```bash
{"type": "filters", "subscription": true, "status_stream": true}
```

Пример отправки последнего времени прочтения
```
{"type": "lasttime", "value": 123456789}
````


.env

Environment settings:

```bash
# @see https://pkg.go.dev/github.com/rs/zerolog#Level
LOG_LEVEL=1

# Http port for fiber (by default 8080)
HTTP_PORT=

# PostgresQL settings
POSTGRES_HOST=localhost
POSTGRES_PORT=6555
POSTGRES_DB=aml-notify
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_MAX_IDLE_CONNS=
POSTGRES_MAX_OPEN_CONNS=
POSTGRES_CONN_MAX_LIFETIME=

# Session validation service
# Url format: redis[s]://[[username][:password]@][host][:port][/db-number]
SESSION_ID_REDIS_URL=redis://redis:6379/0
# User information cache (key is email)
# Url format: redis[s]://[[username][:password]@][host][:port][/db-number]
USER_INFO_REDIS_URL=redis://redis:6379/0

RMQ_CONN_URL=amqp://guest:guest@rabbitmq:5672/
RMQ_MAIL_EXCHANGE=mail
# If true or yeas or y or 1 enable autocreate queue if exchange doesn't exists
RMQ_MAIL_EXCHANGE_AUTOCREATE_ENABLED=

# Rest API consumer
RMQ_NOTIFY_EXCHANGE=notify
# If true or yeas or y or 1 enable autocreate queue if exchange doesn't exists
RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED=

# Queue listener settings ============
RMQ_EXCHANGE=notify
RMQ_QUEUE_CONSUME=NOTIFY_QUEUE
RMQ_BINDING_CONSUME=notify.*
RMQ_QUEUE_CONSUME_AUTOCREATE_DISABLED=

# Secret key like in django
SECRET_KEY=super_secret_key_very_long

# Settings Redis
REDIS_ADDRESS=localhost:6379
REDIS_DATABASE=0
REDIS_PASSWORD=

LISTENADDRESS=localhost:8080
```
