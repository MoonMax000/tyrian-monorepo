package api_test

import (
	"auth-sync/internal/api"
	"auth-sync/internal/models"
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

var (
	ErrUserExists   = errors.New("user already exists")
	ErrUserNotFound = errors.New("user not found")
)

type mockUserService struct {
	users map[string]string // email -> password
}

func newMockUserService() *mockUserService {
	return &mockUserService{
		users: make(map[string]string),
	}
}

func (m *mockUserService) CreateUser(email, password string) error {
	if _, exists := m.users[email]; exists {
		return ErrUserExists
	}
	m.users[email] = password
	return nil
}

func (m *mockUserService) CheckUser(email, password string) (string, error) {
	storedPassword, exists := m.users[email]
	if !exists {
		return "unregistered", nil
	}
	if storedPassword == password {
		return "registered", nil
	}
	return "email_exists", nil
}

func (m *mockUserService) UpdateUser(email, password string) error {
	if _, exists := m.users[email]; !exists {
		return ErrUserNotFound
	}
	m.users[email] = password
	return nil
}

func setupTestRouter() (*gin.Engine, *mockUserService) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	mockService := newMockUserService()
	handler := api.NewHandler(mockService)
	api.SetupRoutes(r, handler)
	return r, mockService
}

func TestCreateUser(t *testing.T) {
	r, _ := setupTestRouter()

	tests := []struct {
		name       string
		user       models.User
		wantStatus int
	}{
		{
			name: "Valid user",
			user: models.User{
				Email:    "test@example.com",
				Password: "password123",
			},
			wantStatus: http.StatusCreated,
		},
		{
			name: "Duplicate user",
			user: models.User{
				Email:    "test@example.com",
				Password: "password123",
			},
			wantStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			body, _ := json.Marshal(tt.user)
			req := httptest.NewRequest("POST", "/api/users", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)
			assert.Equal(t, tt.wantStatus, w.Code)
		})
	}
}

func TestCheckUser(t *testing.T) {
	router, mockService := setupTestRouter()

	// Create a test user
	_ = mockService.CreateUser("test@example.com", "password123")

	tests := []struct {
		name       string
		user       models.User
		wantStatus int
		wantBody   models.UserResponse
	}{
		{
			name: "Valid credentials",
			user: models.User{
				Email:    "test@example.com",
				Password: "password123",
			},
			wantStatus: http.StatusOK,
			wantBody:   models.UserResponse{Status: "registered"},
		},
		{
			name: "Wrong password",
			user: models.User{
				Email:    "test@example.com",
				Password: "wrongpassword",
			},
			wantStatus: http.StatusOK,
			wantBody:   models.UserResponse{Status: "email_exists"},
		},
		{
			name: "Unregistered user",
			user: models.User{
				Email:    "nonexistent@example.com",
				Password: "password123",
			},
			wantStatus: http.StatusOK,
			wantBody:   models.UserResponse{Status: "unregistered"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			body, _ := json.Marshal(tt.user)
			req := httptest.NewRequest("POST", "/api/users/check", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.wantStatus, w.Code)

			var response models.UserResponse
			err := json.Unmarshal(w.Body.Bytes(), &response)
			assert.NoError(t, err)
			assert.Equal(t, tt.wantBody.Status, response.Status)
		})
	}
}

func TestUpdateUser(t *testing.T) {
	router, mockService := setupTestRouter()

	// Create a test user first
	_ = mockService.CreateUser("test@example.com", "password123")

	tests := []struct {
		name       string
		user       models.User
		wantStatus int
	}{
		{
			name: "Valid update",
			user: models.User{
				Email:    "test@example.com",
				Password: "newpassword123",
			},
			wantStatus: http.StatusOK,
		},
		{
			name: "Non-existent user",
			user: models.User{
				Email:    "nonexistent@example.com",
				Password: "password123",
			},
			wantStatus: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			body, _ := json.Marshal(tt.user)
			req := httptest.NewRequest("PATCH", "/api/users", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)
			assert.Equal(t, tt.wantStatus, w.Code)
		})
	}
}
