# Dockerfile

# pull the official docker image
FROM python:3.11-slim

# set work directory
WORKDIR /home/coinMarketCap

# set env variables
ENV POETRY_VIRTUALENVS_CREATE 0
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --no-cache-dir poetry

COPY pyproject.toml poetry.lock /home/coinMarketCap

RUN poetry install --no-interaction --no-ansi --no-root

# copy project
COPY . .

EXPOSE 8053

CMD ["gunicorn", "main:app", "--workers", "2", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8053"]