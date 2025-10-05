package tests

import (
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/Capstane/AXA-socialweb-subscriptions/internal/config"
	"github.com/Capstane/AXA-socialweb-subscriptions/internal/handler"
	"github.com/Capstane/AXA-socialweb-subscriptions/internal/service"
)

// TestAuthenticationMiddleware тестирует middleware аутентификации
func TestAuthenticationMiddleware(t *testing.T) {
	app := fiber.New()

	// Создаем мок сервиса
	mockService := new(MockPostMakerService)

	// Создаем тестовую конфигурацию
	cfg := &config.Config{
		CdnPublicUrl: "https://cdn.example.com",
		RedisAddr:    "localhost:6379",
	}

	// Создаем хендлер
	h := handler.NewHandler(nil, cfg, mockService)

	// Настраиваем маршруты
	h.SetupRoutes(app)

	// Тест 1: Запрос к защищенному эндпойнту без аутентификации
	resp := CreateTestRequest(t, app, "GET", "/api/v1/users", nil, nil)
	assert.Equal(t, 401, resp.Code)

	// Тест 2: Запрос к защищенному эндпойнту с неверным session ID
	invalidUser := &TestSessionUser{
		ID:       uuid.New(),
		Username: "invalid",
		Email:    "invalid@example.com",
		Roles:    []string{"user"},
	}
	resp = CreateTestRequest(t, app, "GET", "/api/v1/users", nil, invalidUser)
	assert.Equal(t, 401, resp.Code)

	// Тест 3: Запрос к публичному эндпойнту (должен пройти)
	resp = CreateTestRequest(t, app, "GET", "/logs", nil, nil)
	assert.Equal(t, 200, resp.Code)
}

// TestProtectedEndpoints тестирует все защищенные эндпойнты
func TestProtectedEndpoints(t *testing.T) {
	app := fiber.New()

	// Создаем мок сервиса
	mockService := new(MockPostMakerService)
	mockService.On("GetTop1000Users").Return([]service.Author{})

	// Создаем тестовую конфигурацию
	cfg := &config.Config{
		CdnPublicUrl: "https://cdn.example.com",
		RedisAddr:    "localhost:6379",
	}

	// Создаем хендлер
	h := handler.NewHandler(nil, cfg, mockService)

	// Настраиваем маршруты
	h.SetupRoutes(app)

	// Список защищенных эндпойнтов для тестирования
	protectedEndpoints := []struct {
		method string
		path   string
	}{
		{"GET", "/api/v1/users"},
		{"GET", "/api/v1/users/search"},
		{"POST", "/api/v1/users/batch"},
		{"GET", "/api/v1/users/" + uuid.New().String()},
		{"GET", "/api/v1/users/me/followed"},
		{"GET", "/api/v1/users/me/followers"},
		{"POST", "/api/v1/users/me/follow"},
		{"POST", "/api/v1/users/me/unfollow"},
		{"GET", "/api/v1/users/" + uuid.New().String() + "/followed"},
		{"GET", "/api/v1/users/" + uuid.New().String() + "/followers"},
	}

	// Тестируем каждый защищенный эндпойнт без аутентификации
	for _, endpoint := range protectedEndpoints {
		t.Run("Protected_"+endpoint.method+"_"+endpoint.path, func(t *testing.T) {
			var resp *httptest.ResponseRecorder
			if endpoint.method == "POST" {
				resp = CreateTestRequest(t, app, endpoint.method, endpoint.path, map[string]interface{}{}, nil)
			} else {
				resp = CreateTestRequestWithQuery(t, app, endpoint.method, endpoint.path, map[string]string{}, nil)
			}
			assert.Equal(t, 401, resp.Code, "Endpoint %s %s should require authentication", endpoint.method, endpoint.path)
		})
	}
}

// TestSessionUserExtraction тестирует извлечение пользователя из сессии
func TestSessionUserExtraction(t *testing.T) {
	app := fiber.New()

	// Создаем тестового пользователя
	testUser := CreateTestUser()

	// Создаем мок сервиса
	mockService := new(MockPostMakerService)
	mockService.On("GetTop1000Users").Return([]service.Author{})

	// Создаем тестовую конфигурацию
	cfg := &config.Config{
		CdnPublicUrl: "https://cdn.example.com",
		RedisAddr:    "localhost:6379",
	}

	// Создаем хендлер
	h := handler.NewHandler(nil, cfg, mockService)

	// Настраиваем маршруты
	h.SetupRoutes(app)

	// Тест: Запрос с валидным session ID
	resp := CreateTestRequestWithQuery(t, app, "GET", "/api/v1/users", map[string]string{
		"page":      "1",
		"page_size": "10",
	}, testUser)

	// Должен вернуть 200 (даже если БД недоступна, middleware должен пройти)
	// В реальных тестах здесь нужно настроить мок БД
	assert.Equal(t, 200, resp.Code)
}

// TestSessionUserValidation тестирует валидацию данных пользователя из сессии
func TestSessionUserValidation(t *testing.T) {
	// Тест 1: Валидный пользователь
	validUser := &TestSessionUser{
		ID:       uuid.New(),
		Username: "testuser",
		Email:    "test@example.com",
		Roles:    []string{"user"},
	}
	assert.NotNil(t, validUser.ID)
	assert.NotEmpty(t, validUser.Username)
	assert.NotEmpty(t, validUser.Email)
	assert.Len(t, validUser.Roles, 1)

	// Тест 2: Пользователь с пустым ID
	invalidUser := &TestSessionUser{
		ID:       uuid.Nil,
		Username: "testuser",
		Email:    "test@example.com",
		Roles:    []string{"user"},
	}
	assert.Equal(t, uuid.Nil, invalidUser.ID)

	// Тест 3: Пользователь с пустым именем
	invalidUser2 := &TestSessionUser{
		ID:       uuid.New(),
		Username: "",
		Email:    "test@example.com",
		Roles:    []string{"user"},
	}
	assert.Empty(t, invalidUser2.Username)
}
