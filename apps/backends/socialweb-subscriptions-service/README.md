# socialweb subscriptions microservice №1

Environment variables are:

```bash
# BASIC SERVICES ===========================

# Http port for fiber (by default 8007)
HTTP_PORT=8007

# PostgresQL settings
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=auth
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_MAX_IDLE_CONNS=
POSTGRES_MAX_OPEN_CONNS=
POSTGRES_CONN_MAX_LIFETIME=

RMQ_CONN_URL=amqp://guest:guest@rabbitmq:5672/
RMQ_EXCHANGE=subscriptions
RMQ_QUEUE_CONSUME=SUBSCRIPTIONS_EVENTS_QUEUE
RMQ_BINDING_CONSUME=subscriptions.*
# If true a microservice don't try to autocreate queue
RMQ_QUEUE_CONSUME_AUTOCREATE_DISABLED=

# Session validation service
# Url format: redis[s]://[[username][:password]@][host][:port][/db-number]
SESSION_ID_REDIS_URL=redis://redis:6379/0
# User information cache (key is email)
# Url format: redis[s]://[[username][:password]@][host][:port][/db-number]
USER_INFO_REDIS_URL=redis://redis:6379/0

RMQ_NOTIFY_EXCHANGE=notify
RMQ_NOTIFY_ROUTING_KEY=notify.*
RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED=Y

CDN_PUBLIC_URL=https://038ce6c9-bad5-4bb7-8da2-495126d7d90f.selstorage.ru

# Secret key like in django
SECRET_KEY=super_secret_key_very_long
```

## API Endpoints

### Users

#### GET /api/v1/users

Get all users with optional sorting.

Query Parameters:

- `page` (optional): Page number (default: 1, min: 1)
- `page_size` (optional): Number of items per page (default: 10, max: 100)
- `sort_type` (optional): Sorting type (default: "normal")
  - `normal`: Returns all users with standard pagination
  - `recommended`: Returns only online users sorted by viewer count (highest to lowest)

Example:

```bash
# Get all users (normal sort)
curl -X GET "http://localhost:8080/api/v1/users?page=1&page_size=10&sort_type=normal"

# Get recommended users (online users sorted by viewers)
curl -X GET "http://localhost:8080/api/v1/users?page=1&page_size=10&sort_type=recommended"
```

#### POST /api/v1/users/me/subscribe

Subscribe to a user.

Request body:

```json
{
    "user_id": "uuid-of-user"
}
```

Response codes:

- 200: Successfully subscribed
- 400: Invalid request, already subscribed, or attempting to subscribe to own user
- 401: Unauthorized
- 404: User not found
- 500: Server error

#### POST /api/v1/users/me/unsubscribe

Unsubscribe from a user.

Request body:

```json
{
    "user_id": "uuid-of-user"
}
```

Response codes:

- 200: Successfully unsubscribed
- 400: Invalid request or not subscribed to user
- 401: Unauthorized
- 404: User not found
- 500: Server error

#### GET /api/v1/users/me/subscribers

Get list of user subscribers. Only available to user owners (streamers).

Query Parameters:

- `page` (optional): Page number (default: 1, min: 1)
- `page_size` (optional): Number of items per page (default: 10, max: 100)
- `sort_by` (optional): Field to sort by (default: "username")
  - `username`: Sort by username
  - `subscriber_count`: Sort by number of subscribers (for subscribers who are also streamers)
- `sort_dir` (optional): Sort direction (default: "asc")
  - `asc`: Ascending order
  - `desc`: Descending order

Response:

```json
{
    "status": "success",
    "data": [
        {
            "id": "uuid",
            "username": "string",
            "avatar_url": "string",
            "subscriber_count": integer,
            "is_subscribed": boolean
        }
    ],
    "pagination": {
        "current_page": integer,
        "page_size": integer,
        "total_pages": integer,
        "total_records": integer
    }
}
```

Response codes:

- 200: Successfully retrieved subscribers
- 400: Invalid request parameters
- 401: Unauthorized
- 403: Access denied (not a streamer)
- 500: Server error
