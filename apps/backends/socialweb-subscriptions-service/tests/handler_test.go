package tests

import (
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"github.com/Capstane/AXA-socialweb-subscriptions/internal/config"
	"github.com/Capstane/AXA-socialweb-subscriptions/internal/handler"
	"github.com/Capstane/AXA-socialweb-subscriptions/internal/service"
	"github.com/Capstane/AXA-socialweb-subscriptions/internal/types"
)

// MockPostMakerService мок для PostMakerService
type MockPostMakerService struct {
	mock.Mock
}

func (m *MockPostMakerService) GetTop1000Users() []service.Author {
	args := m.Called()
	return args.Get(0).([]service.Author)
}

func (m *MockPostMakerService) OnSubscribeTo(userId uuid.UUID) {
	m.Called(userId)
}

func (m *MockPostMakerService) OnUnsubscribeFrom(userId uuid.UUID) {
	m.Called(userId)
}

// setupTestApp создает тестовое приложение
func setupTestApp() (*fiber.App, *MockPostMakerService) {
	app := fiber.New()

	// Создаем мок сервиса
	mockService := new(MockPostMakerService)

	// Создаем тестовую конфигурацию
	cfg := &config.Config{
		CdnPublicUrl: "https://cdn.example.com",
		RedisAddr:    "localhost:6379",
	}

	// Создаем хендлер (без БД для тестов)
	h := handler.NewHandler(nil, cfg, mockService)

	// Настраиваем маршруты вручную (без SetupRoutes)
	api := app.Group("/api")
	v1 := api.Group("/v1")
	users := v1.Group("/users")

	// Добавляем маршруты без middleware для тестирования
	users.Get("/", h.GetAllUsers)
	users.Post("/batch", h.GetUsersByIds)
	users.Get("/:id", h.GetUserById)
	users.Get("/me/followed", h.GetMyFollowed)
	users.Get("/me/followers", h.GetUserFollowers)
	users.Post("/me/follow", h.Follow)
	users.Post("/me/unfollow", h.Unfollow)
	users.Get("/:id/followed", h.GetUserFollowed)
	users.Get("/:id/followers", h.GetFollowersUser)

	return app, mockService
}

// TestGetAllUsers тестирует эндпойнт получения всех пользователей
func TestGetAllUsers(t *testing.T) {
	app, mockService := setupTestApp()

	// Настраиваем мок
	mockService.On("GetTop1000Users").Return([]service.Author{})

	// Тест без аутентификации
	resp := CreateTestRequestWithQuery(t, app, "GET", "/api/v1/users", map[string]string{
		"page":      "1",
		"page_size": "10",
	}, nil)

	// Должен вернуть 200, так как middleware не подключен
	assert.Equal(t, 200, resp.Code)

	// Проверяем, что мок был вызван
	mockService.AssertExpectations(t)
}

// TestFollowRequest тестирует запрос подписки
func TestFollowRequest(t *testing.T) {
	app, mockService := setupTestApp()

	// Настраиваем мок
	mockService.On("OnSubscribeTo", mock.AnythingOfType("uuid.UUID")).Return()

	// Создаем тестового пользователя
	testUser := CreateTestUser()

	// Тест подписки
	followRequest := types.FollowRequest{
		UserId: uuid.New(),
	}

	resp := CreateTestRequest(t, app, "POST", "/api/v1/users/me/follow", followRequest, testUser)

	// Должен вернуть 200, так как middleware не подключен
	assert.Equal(t, 200, resp.Code)

	// Проверяем, что мок был вызван
	mockService.AssertExpectations(t)
}

// TestUnfollowRequest тестирует запрос отписки
func TestUnfollowRequest(t *testing.T) {
	app, mockService := setupTestApp()

	// Настраиваем мок
	mockService.On("OnUnsubscribeFrom", mock.AnythingOfType("uuid.UUID")).Return()

	// Создаем тестового пользователя
	testUser := CreateTestUser()

	// Тест отписки
	unfollowRequest := types.UnfollowRequest{
		UserId: uuid.New(),
	}

	resp := CreateTestRequest(t, app, "POST", "/api/v1/users/me/unfollow", unfollowRequest, testUser)

	// Должен вернуть 200, так как middleware не подключен
	assert.Equal(t, 200, resp.Code)

	// Проверяем, что мок был вызван
	mockService.AssertExpectations(t)
}

// TestGetUserById тестирует получение пользователя по ID
func TestGetUserById(t *testing.T) {
	app, _ := setupTestApp()

	// Создаем тестового пользователя
	testUser := CreateTestUser()

	// Тест получения пользователя
	resp := CreateTestRequest(t, app, "GET", "/api/v1/users/"+testUser.ID.String(), nil, testUser)

	// Должен вернуть 200, так как middleware не подключен
	assert.Equal(t, 200, resp.Code)
}

// TestGetUsersByIds тестирует получение пользователей по ID
func TestGetUsersByIds(t *testing.T) {
	app, _ := setupTestApp()

	// Создаем тестового пользователя
	testUser := CreateTestUser()

	// Тест получения пользователей по ID
	requestBody := types.UserIdsRequest{
		UserIds: []string{testUser.ID.String()},
	}

	resp := CreateTestRequest(t, app, "POST", "/api/v1/users/batch", requestBody, testUser)

	// Должен вернуть 200, так как middleware не подключен
	assert.Equal(t, 200, resp.Code)
}

// TestPaginationParameters тестирует параметры пагинации
func TestPaginationParameters(t *testing.T) {
	app, mockService := setupTestApp()

	// Настраиваем мок
	mockService.On("GetTop1000Users").Return([]service.Author{})

	testCases := []struct {
		name     string
		params   map[string]string
		expected int
	}{
		{
			name: "Default pagination",
			params: map[string]string{
				"page":      "1",
				"page_size": "10",
			},
			expected: 200,
		},
		{
			name: "Custom pagination",
			params: map[string]string{
				"page":      "2",
				"page_size": "20",
			},
			expected: 200,
		},
		{
			name: "Recommended sorting",
			params: map[string]string{
				"page":      "1",
				"page_size": "10",
				"sort_type": "recommended",
			},
			expected: 200,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			resp := CreateTestRequestWithQuery(t, app, "GET", "/api/v1/users", tc.params, nil)
			assert.Equal(t, tc.expected, resp.Code)
		})
	}

	mockService.AssertExpectations(t)
}
