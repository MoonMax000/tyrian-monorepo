.PHONY: branch flush-redis

PROJECT_NAME = td

build:
	docker compose build

stop:
	docker compose down

stop_rabbit:
	docker compose -f docker-compose.rabbitmq.yaml down

restart:
	docker compose restart

rerun:
	docker compose down
	docker compose up -d --build

run:
	docker compose up -d --build

test-core:
	docker exec -e DJANGO_SETTINGS_MODULE=project.settings $(PROJECT_NAME)-backend /bin/bash -c "python -m pytest"

test-fmp:
	docker exec -e PYTHONPATH=/usr/src/app $(PROJECT_NAME)-fmp /bin/bash -c "pytest tests"

pip-list:
	docker exec $(PROJECT_NAME)-backend /bin/bash -c "pip list"

log:
	docker logs $(PROJECT_NAME)-backend -f --tail=100

log-db:
	docker logs $(PROJECT_NAME)-db -f --tail=100

log-celery:
	docker logs $(PROJECT_NAME)-celery-beat -f --tail=100

log-formatter:
	docker logs $(PROJECT_NAME)-formatter -f --tail=100

log-fmp:
	docker logs $(PROJECT_NAME)-fmp -f --tail=100

log-terrapin:
	docker logs $(PROJECT_NAME)-terrapin -f --tail=100

flake:
	black .
	flake8

pytest:
	docker exec -e DJANGO_SETTINGS_MODULE=project.settings $(PROJECT_NAME)-backend /bin/bash -c "python -m pytest"

branch:
	@git branch -v --sort=-committerdate --format="%(refname:short) %(committerdate:short) %(contents:subject)" | awk '{
		COLOR_BRANCH="\033[0;34m";
		COLOR_DATE="\033[0;32m";
		COLOR_COMMIT="\033[0;33m";
		COLOR_RESET="\033[0m";
		branch=$1;
		date=$2;
		commit=$3;
		subject="";
		for (i = 4; i <= NF; i++) subject = subject " " $i;
		sub(/^ /, "", subject);
		printf "%s%s%s %s%s%s %s%s%s %s\n", COLOR_BRANCH, branch, COLOR_RESET, COLOR_DATE, date, COLOR_RESET, COLOR_COMMIT, commit, COLOR_RESET, subject
	}'


flush-redis:
	docker exec td-redis redis-cli FLUSHALL