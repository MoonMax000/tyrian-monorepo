# Recommendations microservice

Full list fo environment variables is:

```bash
# Http port for fiber (by default 8007)
HTTP_PORT=

# Service public urls (for correct generation confirmation links)
PUBLIC_EMAIL_CONFIRMATION_URL=http://localhost:8002/api/v1/auth/email/confirm
PUBLIC_PASSWORD_RESET_CONFIRMATION_URL=http://localhost:8002/front?token=
# This is for redirection after confirmation actions from email
PUBLIC_URL=http://localhost:8002/
PUBLIC_ERROR_URL=http://localhost:8002/

# PostgresQL settings
POSTGRES_HOST=localhost
POSTGRES_PORT=6555
POSTGRES_DB=aml-auth
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

RMQ_NOTIFY_EXCHANGE=notify
# If true or yeas or y or 1 enable autocreate queue if exchange doesn't exists
RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED=

# Stream events settings
RMQ_STREAM_EXCHANGE=stream
RMQ_STREAM_QUEUE=stream_events
RECEIVE_STATISTICS_MESSAGE_INTERVAL=10s

CDN_PUBLIC_URL=https://038ce6c9-bad5-4bb7-8da2-495126d7d90f.selstorage.ru
S3_AVATARS_BUCKET_NAME=images
S3_COVERS_BUCKET_NAME=covers

S3_REGION=ru-1
S3_ENDPOINT=test-streaming.s3.ru-1.storage.selcloud.ru
S3_ACCESS_KEY=Q3AM3UQ867SPQQA43P2F
S3_SECRET_ACCESS_KEY=zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG

# Secret key like in django
SECRET_KEY=super_secret_key_very_long

# Github application token (with read permission)
GITHUB_TOKEN=<github-token-for-build-dockerfile-with-private-modules>
```

For kuber deployment see stream-infra project

Warning: for generation of OpenAPI 3.0 documentation please install swaggo/swag with this command:

```bash
go install github.com/swaggo/swag/v2/cmd/swag@latest
```

## API Endpoints

### Channels

#### GET /api/v1/channels
Get all streamer channels with optional sorting.

Query Parameters:
- `page` (optional): Page number (default: 1, min: 1)
- `page_size` (optional): Number of items per page (default: 10, max: 100)
- `sort_type` (optional): Sorting type (default: "normal")
  - `normal`: Returns all channels with standard pagination
  - `recommended`: Returns only online channels sorted by viewer count (highest to lowest)

Example:
```bash
# Get all channels (normal sort)
curl -X GET "http://localhost:8080/api/v1/channels?page=1&page_size=10&sort_type=normal"

# Get recommended channels (online channels sorted by viewers)
curl -X GET "http://localhost:8080/api/v1/channels?page=1&page_size=10&sort_type=recommended"
```

#### POST /api/v1/channels/me/subscribe
Subscribe to a channel.

Request body:
```json
{
    "channel_id": "uuid-of-channel"
}
```

Response codes:
- 200: Successfully subscribed
- 400: Invalid request, already subscribed, or attempting to subscribe to own channel
- 401: Unauthorized
- 404: Channel not found
- 500: Server error

#### POST /api/v1/channels/me/unsubscribe
Unsubscribe from a channel.

Request body:
```json
{
    "channel_id": "uuid-of-channel"
}
```

Response codes:
- 200: Successfully unsubscribed
- 400: Invalid request or not subscribed to channel
- 401: Unauthorized
- 404: Channel not found
- 500: Server error

#### GET /api/v1/channels/me/subscribers
Get list of channel subscribers. Only available to channel owners (streamers).

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
            "is_streamer": boolean,
            "stream": {
                "viewer_count": integer,
                "is_online": boolean,
                "stream_name": "string"
            },
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
