# Сервис чатов

Вход через сессию.  

Также поднимается http для эндпоинтов чата, на порте переменной HTTP_PORT  

Environment settings:
 
```bash
# RabbitMQ settings
RMQ_CONN_URL=amqp://guest:guest@rabbitmq:5672/
RMQ_QUEUE_CONSUME=STATUS_CHAT_QUEUE
RMQ_BINDING_CONSUME=status-chat.*
RMQ_EXCHANGE=status-chat
RMQ_QUEUE_CONSUME_AUTOCREATE_DISABLED=
# Notifi
RMQ_NOTIFY_EXCHANGE=notify
RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED=
# PostgresQL settings
POSTGRES_HOST=yugabyte
POSTGRES_PORT=5433
POSTGRES_DB=mydatabase
POSTGRES_USER=yugabyte
POSTGRES_PASSWORD=
# Chat settings
DEBUG=true
LISTENADDRESS=0.0.0.0:1118
MAXPROCESSES=0
CHATDELAY=300000000
MAXTHROTTLETIME=300000000000
ALLOWEDORIGINHOST=localhost
 # Redis settings, от docker-compose stream-auth, в котором лежат streaming:mail
REDIS_ADDRESS=localhost:6379
REDIS_DATABASE=0
REDIS_PASSWORD=
# Redis global, где лежат :1:django.contrib.sessions.cache
GLOBAL_REDIS_URL=redis://localhost:6379
# Private package
GITHUB_TOKEN=
# Для yugabyte_with_logs.sh (только для локальной разработки)
YUGABYTE_MASTER_HOSTS=6555d4f0602e,6521c0908453
# Для http
HTTP_PORT=1119
```

Подсказки для фронта можно увидеть в docs/debug.html


коннект с чатом строка 29
```
        chat = new WebSocket(`wss://${window.location.host}/ws`, ["chat", chatId, authorizationBearer])
        // chat = new WebSocket(`wss://${window.location.host}/ws`)
```

Типы сообщений:
* MSG
```
{"data": "Hello!", "extradata": "", "duration": 100}
```
* BAN
```
{"nick": "Bobi", "banip": bool, "duration": 100, "ispermanent": bool, "reason": "Spammer"}
duration - длительность в наносекунда, при значении ноль - константа с бека.
```
* UNBAN
```
{"data": "Bobi", "extradata": "", "duration": 100}
data - nick
```
* ROLE
```
{"nick": "Bobi", "role": "moderator"}
роль строка - "moderator"
```
