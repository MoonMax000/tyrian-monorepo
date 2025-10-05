# Likes microservice

Environment variables are:

```bash
# @see https://pkg.go.dev/github.com/rs/zerolog#Level
# -1 for trace level (view sql requests in logs) INFO by default
LOG_LEVEL=1

# BASIC SERVICES ===========================

# Http port for fiber (by default 8008)
HTTP_PORT=8008

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

CDN_PUBLIC_URL=https://038ce6c9-bad5-4bb7-8da2-495126d7d90f.selstorage.ru
S3_AVATARS_BUCKET_NAME=images
S3_COVERS_BUCKET_NAME=covers

S3_REGION=ru-1
S3_ENDPOINT=test-streaming.s3.ru-1.storage.selcloud.ru
S3_ACCESS_KEY=Q3AM3UQ867SPQQA43P2F
S3_SECRET_ACCESS_KEY=zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG

# Secret key like in django
SECRET_KEY=super_secret_key_very_long

REDIS_ADDR=redis:6379
REDIS_DB=0

# Github application token (with read permission)
GITHUB_TOKEN=<github-token-for-build-dockerfile-with-private-modules>
```
