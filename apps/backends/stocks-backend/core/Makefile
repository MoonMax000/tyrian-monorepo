.PHONY: branch

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

pytest:
	docker exec -e DJANGO_SETTINGS_MODULE=project.settings $(PROJECT_NAME)-backend /bin/bash -c "python -m pytest"

pip-list:
	docker exec $(PROJECT_NAME)-backend /bin/bash -c "pip list"

log:
	docker logs $(PROJECT_NAME)-backend -f --tail=100

log-db:
	docker logs $(PROJECT_NAME)-db -f --tail=100

log-celery:
	docker logs $(PROJECT_NAME)-celery-beat -f --tail=100

flake:
	black .
	flake8 

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
