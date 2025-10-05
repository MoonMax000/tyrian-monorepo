package tests

import (
	"encoding/json"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"github.com/Capstane/AXA-socialweb-subscriptions/internal/config"
	"github.com/Capstane/AXA-socialweb-subscriptions/internal/handler"
	"github.com/Capstane/AXA-socialweb-subscriptions/internal/model"
	"github.com/Capstane/AXA-socialweb-subscriptions/internal/service"
	"github.com/Capstane/AXA-socialweb-subscriptions/internal/types"
)

// setupTestDB создает тестовую БД в памяти
func setupTestDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to test database")
	}

	// Мигрируем таблицы
	err = db.AutoMigrate(&model.User{}, &model.Follower{})
	if err != nil {
		panic("Failed to migrate test database")
	}

	return db
}

// createTestUser создает тестового пользователя в БД
func createTestUser(db *gorm.DB, username, email string) *model.User {
	user := &model.User{
		Username:       username,
		Email:          email,
		EmailConfirmed: true,
		PasswordHash:   "test_hash",
		Description:    "Test user description",
		AvatarURL:      "avatar.jpg",
		CoverURL:       "cover.jpg",
		DonationURL:    "https://donate.example.com",
		Roles:          []string{"user"},
	}

	db.Create(user)
	return user
}

// setupIntegrationTestApp создает тестовое приложение с БД
func setupIntegrationTestApp() (*fiber.App, *gorm.DB, *MockPostMakerService) {
	app := fiber.New()

	// Создаем тестовую БД
	db := setupTestDB()

	// Создаем мок сервиса
	mockService := new(MockPostMakerService)
	mockService.On("GetTop1000Users").Return([]service.Author{})

	// Создаем тестовую конфигурацию
	cfg := &config.Config{
		CdnPublicUrl: "https://cdn.example.com",
		RedisAddr:    "localhost:6379",
	}

	// Создаем хендлер с БД
	h := handler.NewHandler(db, cfg, mockService)

	// Настраиваем маршруты
	h.SetupRoutes(app)

	return app, db, mockService
}

// TestUserCRUD тестирует CRUD операции с пользователями
func TestUserCRUD(t *testing.T) {
	app, db, _ := setupIntegrationTestApp()

	// Создаем тестовых пользователей
	user1 := createTestUser(db, "testuser1", "test1@example.com")
	user2 := createTestUser(db, "testuser2", "test2@example.com")

	// Создаем тестового пользователя для аутентификации
	testUser := &TestSessionUser{
		ID:       user1.ID,
		Username: user1.Username,
		Email:    user1.Email,
		Roles:    user1.Roles,
	}

	// Тест 1: Получение пользователя по ID
	resp := CreateTestRequest(t, app, "GET", "/api/v1/users/"+user1.ID.String(), nil, testUser)
	assert.Equal(t, 200, resp.Code)

	var userResponse types.GetUserByIdResponse
	err := json.Unmarshal(resp.Body.Bytes(), &userResponse)
	assert.NoError(t, err)
	assert.Equal(t, "success", userResponse.Status)
	assert.Equal(t, user1.ID, userResponse.Data.ID)
	assert.Equal(t, user1.Username, userResponse.Data.Username)

	// Тест 2: Получение пользователя по username
	resp = CreateTestRequest(t, app, "GET", "/api/v1/users/"+user1.Username, nil, testUser)
	assert.Equal(t, 200, resp.Code)

	err = json.Unmarshal(resp.Body.Bytes(), &userResponse)
	assert.NoError(t, err)
	assert.Equal(t, user1.ID, userResponse.Data.ID)

	// Тест 3: Получение нескольких пользователей по ID
	requestBody := types.UserIdsRequest{
		UserIds: []string{user1.ID.String(), user2.ID.String()},
	}
	resp = CreateTestRequest(t, app, "POST", "/api/v1/users/batch", requestBody, testUser)
	assert.Equal(t, 200, resp.Code)

	var batchResponse types.FollowersResponse
	err = json.Unmarshal(resp.Body.Bytes(), &batchResponse)
	assert.NoError(t, err)
	assert.Equal(t, "success", batchResponse.Status)
	assert.Len(t, batchResponse.Data, 2)
}

// TestFollowUnfollow тестирует операции подписки и отписки
func TestFollowUnfollow(t *testing.T) {
	app, db, _ := setupIntegrationTestApp()

	// Создаем тестовых пользователей
	follower := createTestUser(db, "follower", "follower@example.com")
	followed := createTestUser(db, "followed", "followed@example.com")

	// Создаем тестового пользователя для аутентификации
	testUser := &TestSessionUser{
		ID:       follower.ID,
		Username: follower.Username,
		Email:    follower.Email,
		Roles:    follower.Roles,
	}

	// Тест 1: Подписка на пользователя
	followRequest := types.FollowRequest{
		UserId: followed.ID,
	}
	resp := CreateTestRequest(t, app, "POST", "/api/v1/users/me/follow", followRequest, testUser)
	assert.Equal(t, 200, resp.Code)

	var followResponse types.SuccessResponse
	err := json.Unmarshal(resp.Body.Bytes(), &followResponse)
	assert.NoError(t, err)
	assert.Equal(t, "success", followResponse.Status)

	// Проверяем, что подписка создалась в БД
	var subscription model.Follower
	err = db.Where("follower_id = ? AND followed_id = ?", follower.ID, followed.ID).First(&subscription).Error
	assert.NoError(t, err)

	// Тест 2: Попытка повторной подписки
	resp = CreateTestRequest(t, app, "POST", "/api/v1/users/me/follow", followRequest, testUser)
	assert.Equal(t, 400, resp.Code)

	// Тест 3: Получение списка подписок
	resp = CreateTestRequestWithQuery(t, app, "GET", "/api/v1/users/me/followed", map[string]string{
		"page":      "1",
		"page_size": "10",
	}, testUser)
	assert.Equal(t, 200, resp.Code)

	var followedResponse types.FollowedResponse
	err = json.Unmarshal(resp.Body.Bytes(), &followedResponse)
	assert.NoError(t, err)
	assert.Equal(t, "success", followedResponse.Status)
	assert.Len(t, followedResponse.Data, 1)
	assert.Equal(t, followed.ID, followedResponse.Data[0].ID)

	// Тест 4: Отписка от пользователя
	unfollowRequest := types.UnfollowRequest{
		UserId: followed.ID,
	}
	resp = CreateTestRequest(t, app, "POST", "/api/v1/users/me/unfollow", unfollowRequest, testUser)
	assert.Equal(t, 200, resp.Code)

	var unfollowResponse types.SuccessResponse
	err = json.Unmarshal(resp.Body.Bytes(), &unfollowResponse)
	assert.NoError(t, err)
	assert.Equal(t, "success", unfollowResponse.Status)

	// Проверяем, что подписка удалилась из БД
	err = db.Where("follower_id = ? AND followed_id = ?", follower.ID, followed.ID).First(&subscription).Error
	assert.Error(t, err) // Должна быть ошибка, так как запись удалена
}

// TestFollowers тестирует получение списка подписчиков
func TestFollowers(t *testing.T) {
	app, db, _ := setupIntegrationTestApp()

	// Создаем тестовых пользователей
	user1 := createTestUser(db, "user1", "user1@example.com")
	user2 := createTestUser(db, "user2", "user2@example.com")
	user3 := createTestUser(db, "user3", "user3@example.com")

	// Создаем подписки
	db.Create(&model.Follower{FollowerId: user2.ID, FollowedId: user1.ID})
	db.Create(&model.Follower{FollowerId: user3.ID, FollowedId: user1.ID})

	// Создаем тестового пользователя для аутентификации
	testUser := &TestSessionUser{
		ID:       user1.ID,
		Username: user1.Username,
		Email:    user1.Email,
		Roles:    user1.Roles,
	}

	// Тест: Получение списка подписчиков
	resp := CreateTestRequestWithQuery(t, app, "GET", "/api/v1/users/me/followers", map[string]string{
		"page":      "1",
		"page_size": "10",
	}, testUser)
	assert.Equal(t, 200, resp.Code)

	var followersResponse types.FollowersListResponse
	err := json.Unmarshal(resp.Body.Bytes(), &followersResponse)
	assert.NoError(t, err)
	assert.Equal(t, "success", followersResponse.Status)
	assert.Len(t, followersResponse.Data, 2)
}

// TestPagination тестирует пагинацию
func TestPagination(t *testing.T) {
	app, db, _ := setupIntegrationTestApp()

	// Создаем несколько тестовых пользователей
	for i := 1; i <= 15; i++ {
		createTestUser(db, "user"+string(rune(i)), "user"+string(rune(i))+"@example.com")
	}

	// Создаем тестового пользователя для аутентификации
	testUser := CreateTestUser()

	// Тест 1: Первая страница
	resp := CreateTestRequestWithQuery(t, app, "GET", "/api/v1/users", map[string]string{
		"page":      "1",
		"page_size": "10",
	}, testUser)
	assert.Equal(t, 200, resp.Code)

	var response types.FollowersResponse
	err := json.Unmarshal(resp.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, "success", response.Status)
	assert.Len(t, response.Data, 10)
	assert.Equal(t, 1, response.Pagination.CurrentPage)
	assert.Equal(t, 10, response.Pagination.PageSize)
	assert.Equal(t, 2, response.Pagination.TotalPages) // 15 пользователей / 10 на страницу = 2 страницы

	// Тест 2: Вторая страница
	resp = CreateTestRequestWithQuery(t, app, "GET", "/api/v1/users", map[string]string{
		"page":      "2",
		"page_size": "10",
	}, testUser)
	assert.Equal(t, 200, resp.Code)

	err = json.Unmarshal(resp.Body.Bytes(), &response)
	assert.NoError(t, err)
	assert.Equal(t, 2, response.Pagination.CurrentPage)
	assert.Len(t, response.Data, 5) // Осталось 5 пользователей
}

// TestErrorHandling тестирует обработку ошибок
func TestErrorHandling(t *testing.T) {
	app, db, _ := setupIntegrationTestApp()

	// Создаем тестового пользователя
	testUser := CreateTestUser()

	// Тест 1: Запрос несуществующего пользователя
	resp := CreateTestRequest(t, app, "GET", "/api/v1/users/"+uuid.New().String(), nil, testUser)
	assert.Equal(t, 404, resp.Code)

	// Тест 2: Подписка на несуществующего пользователя
	followRequest := types.FollowRequest{
		UserId: uuid.New(),
	}
	resp = CreateTestRequest(t, app, "POST", "/api/v1/users/me/follow", followRequest, testUser)
	assert.Equal(t, 400, resp.Code)

	// Тест 3: Подписка на самого себя
	user := createTestUser(db, "selfuser", "self@example.com")
	testUser.ID = user.ID
	followRequest.UserId = user.ID
	resp = CreateTestRequest(t, app, "POST", "/api/v1/users/me/follow", followRequest, testUser)
	assert.Equal(t, 400, resp.Code)

	// Тест 4: Отписка от пользователя, на которого не подписан
	unfollowRequest := types.UnfollowRequest{
		UserId: uuid.New(),
	}
	resp = CreateTestRequest(t, app, "POST", "/api/v1/users/me/unfollow", unfollowRequest, testUser)
	assert.Equal(t, 400, resp.Code)
}
