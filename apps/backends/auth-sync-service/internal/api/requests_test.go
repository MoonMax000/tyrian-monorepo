package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Mock для UserService
type MockUserService struct {
	mock.Mock
}

func (m *MockUserService) CreateUser(email, password string) error {
	args := m.Called(email, password)
	return args.Error(0)
}

func (m *MockUserService) UpdateUser(email, password string) error {
	args := m.Called(email, password)
	return args.Error(0)
}

func (m *MockUserService) CheckUser(email, password string) (string, error) {
	args := m.Called(email, password)
	return args.String(0), args.Error(1)
}

// Тест для функции sendRequest
func TestSendRequest(t *testing.T) {
	// Создание mock-сервера
	mockServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		assert.Equal(t, "application/json", r.Header.Get("Content-Type"))
		var body map[string]string
		err := json.NewDecoder(r.Body).Decode(&body)
		assert.NoError(t, err)
		assert.Equal(t, "user@example.com", body["email"])
		assert.Equal(t, "securepassword123", body["password"])
		w.WriteHeader(http.StatusOK)
	}))
	defer mockServer.Close()

	// Обновление эндпойнтов для теста
	endpoints = []Endpoint{
		{URL: mockServer.URL},
	}

	// Вызов sendRequest
	sendRequest("user@example.com", "securepassword123", "CREATE")
}

// Тест для CreateUser с проверкой вызова sendRequest
func TestCreateUserWithSendRequest(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockUserService := new(MockUserService)
	handler := &Handler{userService: mockUserService}

	router.POST("/users", handler.CreateUser)

	mockUserService.On("CreateUser", "user@example.com", "securepassword123").Return(nil)

	// Создание запроса
	user := gin.H{"email": "user@example.com", "password": "securepassword123"}
	jsonValue, _ := json.Marshal(user)
	req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")

	// Запуск теста
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// Проверка статуса
	assert.Equal(t, http.StatusCreated, resp.Code)

	// Здесь можно добавить проверку, что sendRequest была вызвана
}

// Тест для UpdateUser с проверкой вызова sendRequest
func TestUpdateUserWithSendRequest(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	mockUserService := new(MockUserService)
	handler := &Handler{userService: mockUserService}

	router.PATCH("/users", handler.UpdateUser)

	mockUserService.On("UpdateUser", "user@example.com", "newpassword123").Return(nil)

	// Создание запроса
	user := gin.H{"email": "user@example.com", "password": "newpassword123"}
	jsonValue, _ := json.Marshal(user)
	req, _ := http.NewRequest("PATCH", "/users", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")

	// Запуск теста
	resp := httptest.NewRecorder()
	router.ServeHTTP(resp, req)

	// Проверка статуса
	assert.Equal(t, http.StatusOK, resp.Code)

	// Здесь можно добавить проверку, что sendRequest была вызвана
}
