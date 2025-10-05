.PHONY: test test-unit test-integration test-all build run clean help

# Переменные
BINARY_NAME=axa-subscriptions
MAIN_FILE=cmd/main.go
TEST_DIR=tests

# Цвета для вывода
GREEN=\033[0;32m
RED=\033[0;31m
YELLOW=\033[1;33m
NC=\033[0m # No Color

# Помощь
help: ## Показать справку
	@echo "$(GREEN)Доступные команды:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

# Тесты
test: ## Запустить все тесты
	@echo "$(GREEN)Запуск всех тестов...$(NC)"
	go test -v ./...

test-unit: ## Запустить unit тесты
	@echo "$(GREEN)Запуск unit тестов...$(NC)"
	go test -v ./internal/...

test-integration: ## Запустить интеграционные тесты
	@echo "$(GREEN)Запуск интеграционных тестов...$(NC)"
	go test -v ./tests/...

test-coverage: ## Запустить тесты с покрытием
	@echo "$(GREEN)Запуск тестов с покрытием...$(NC)"
	go test -v -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html
	@echo "$(GREEN)Отчет о покрытии сохранен в coverage.html$(NC)"

test-benchmark: ## Запустить benchmark тесты
	@echo "$(GREEN)Запуск benchmark тестов...$(NC)"
	go test -bench=. ./...

# Сборка
build: ## Собрать приложение
	@echo "$(GREEN)Сборка приложения...$(NC)"
	go build -o $(BINARY_NAME) $(MAIN_FILE)

build-linux: ## Собрать для Linux
	@echo "$(GREEN)Сборка для Linux...$(NC)"
	GOOS=linux GOARCH=amd64 go build -o $(BINARY_NAME)-linux $(MAIN_FILE)

build-windows: ## Собрать для Windows
	@echo "$(GREEN)Сборка для Windows...$(NC)"
	GOOS=windows GOARCH=amd64 go build -o $(BINARY_NAME)-windows.exe $(MAIN_FILE)

# Запуск
run: build ## Собрать и запустить приложение
	@echo "$(GREEN)Запуск приложения...$(NC)"
	./$(BINARY_NAME)

run-dev: ## Запустить в режиме разработки
	@echo "$(GREEN)Запуск в режиме разработки...$(NC)"
	go run $(MAIN_FILE)

# Очистка
clean: ## Очистить скомпилированные файлы
	@echo "$(GREEN)Очистка...$(NC)"
	go clean
	rm -f $(BINARY_NAME)
	rm -f $(BINARY_NAME)-linux
	rm -f $(BINARY_NAME)-windows.exe
	rm -f coverage.out
	rm -f coverage.html

# Зависимости
deps: ## Установить зависимости
	@echo "$(GREEN)Установка зависимостей...$(NC)"
	go mod download
	go mod tidy

deps-update: ## Обновить зависимости
	@echo "$(GREEN)Обновление зависимостей...$(NC)"
	go get -u ./...
	go mod tidy

# Линтинг и форматирование
lint: ## Запустить линтер
	@echo "$(GREEN)Проверка кода линтером...$(NC)"
	golangci-lint run

format: ## Форматировать код
	@echo "$(GREEN)Форматирование кода...$(NC)"
	go fmt ./...

# Генерация документации
docs: ## Генерировать документацию
	@echo "$(GREEN)Генерация документации...$(NC)"
	swag init -g $(MAIN_FILE)

# Проверка безопасности
security: ## Проверка безопасности зависимостей
	@echo "$(GREEN)Проверка безопасности...$(NC)"
	govulncheck ./...

# Docker
docker-build: ## Собрать Docker образ
	@echo "$(GREEN)Сборка Docker образа...$(NC)"
	docker build -t $(BINARY_NAME) .

docker-run: ## Запустить Docker контейнер
	@echo "$(GREEN)Запуск Docker контейнера...$(NC)"
	docker run -p 8007:8007 $(BINARY_NAME)

# CI/CD
ci: deps lint test build ## Полный CI пайплайн
	@echo "$(GREEN)CI пайплайн завершен успешно!$(NC)"

# Разработка
dev-setup: deps docs ## Настройка окружения для разработки
	@echo "$(GREEN)Окружение для разработки настроено!$(NC)"

# Мониторинг
monitor: ## Запустить мониторинг (если доступен)
	@echo "$(GREEN)Запуск мониторинга...$(NC)"
	@echo "$(YELLOW)Мониторинг не настроен$(NC)"

# Резервное копирование
backup: ## Создать резервную копию (если настроено)
	@echo "$(GREEN)Создание резервной копии...$(NC)"
	@echo "$(YELLOW)Резервное копирование не настроено$(NC)"

# Информация о проекте
info: ## Показать информацию о проекте
	@echo "$(GREEN)Информация о проекте:$(NC)"
	@echo "  Название: $(BINARY_NAME)"
	@echo "  Основной файл: $(MAIN_FILE)"
	@echo "  Директория тестов: $(TEST_DIR)"
	@echo "  Go версия: $(shell go version)"
	@echo "  Архитектура: $(shell go env GOARCH)"
	@echo "  ОС: $(shell go env GOOS)" 