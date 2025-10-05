# AXA-socialweb-posts

Список переменных окружения

```bash
# BASIC SERVICES ===========================

# Http port for fiber (by default 8004)
HTTP_PORT=

# PostgresQL settings
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=auth
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_MAX_IDLE_CONNS=
POSTGRES_MAX_OPEN_CONNS=
POSTGRES_CONN_MAX_LIFETIME=

RMQ_CONN_URL=amqp://guest:guest@rabbitmq:5672/
RMQ_EXCHANGE=posts
RMQ_QUEUE_CONSUME=POSTS
RMQ_BINDING_CONSUME=posts.*
# If true a microservice don't try to autocreate queue
RMQ_QUEUE_CONSUME_AUTOCREATE_DISABLED=

RMQ_NOTIFY_EXCHANGE=notify
RMQ_NOTIFY_ROUTING_KEY=notify.*
RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED=Y

# Session validation service
# Url format: redis[s]://[[username][:password]@][host][:port][/db-number]
SESSION_ID_REDIS_URL=redis://redis:6379/0
# User information cache (key is email)
# Url format: redis[s]://[[username][:password]@][host][:port][/db-number]
USER_INFO_REDIS_URL=redis://redis:6379/0

CDN_PUBLIC_URL=https://038ce6c9-bad5-4bb7-8da2-495126d7d90f.selstorage.ru

# Secret key like in django
SECRET_KEY=super_secret_key_very_long

# AWS S3 settings
S3_CONTENT_BUCKET_NAME=images
S3_COVERS_BUCKET_NAME=covers

#ElasticSearch params
ES_USER=elastic
ES_PASSWORD=admin123
ES_PORT=9200
ES_CONTAINER=elasticsearch

S3_REGION=ru-1
S3_ENDPOINT=test-streaming.s3.ru-1.storage.selcloud.ru
S3_ACCESS_KEY=...
S3_SECRET_ACCESS_KEY=...
```

**Эндпоинты**
1. Создание поста
```bash
POST ~api/v1/posts/create
```
Пример **post** с tags 
```bash
post={"content":"...","media_url":"...","title":"...","type":"...","tags":[{"name":"12444"}],"payment":1}
```
Запрос создает объект в postgres и elastic search

2. Получение тегов
```bash
GET ~api/v1/posts/search/tags
```
**q** - подстрока для поиска тегов 
**page** - номер страницы
**page_size** - количество тегов на странице

3. Сортировка постов 
```bash
GET ~/api/v1/posts/search
```
**userId** - для дальнейшей сортировки постов по userId (относительно пользователя с NeedPayment) // не реализовано

**q** - подстрока для поиска.
При q = 'fly' -> посты с 'fly', 'flying' в title, content, types в зависимости от sort_type
Несколько q = 'fly,golang' -> посты с 'fly', 'flying', 'golang' в title, content, types в зависимости от sort_type
При q = '' -> сортировка по created
При q != '' -> сортировка по релевантности и далее сортировка результата по created

**sort** - сортировка выводимого результата по title, content, type, created (дата создания)

**tags** - сортировка постов по тегам. Например, tags = tag1,tag2

**sort_type** - порядок полнотекстового поиска:
title,content,type -> преимущественно ищет в title, потом в content и только потом в type
title,content -> преимущественно ищет в title, потом в content. По type поиск не производится


**page** - номер страницы
**page_size** - размер страницы
