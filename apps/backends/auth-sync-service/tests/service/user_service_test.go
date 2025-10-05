package service_test

import (
	"auth-sync/internal/models"
	"auth-sync/internal/service"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func init() {
	os.Setenv("SECRET_KEY", "12345678901234567890123456789012")
}

type mockUserRepository struct {
	users map[string]*models.User
}

func newMockUserRepository() *mockUserRepository {
	return &mockUserRepository{
		users: make(map[string]*models.User),
	}
}

func (m *mockUserRepository) Create(user *models.User) error {
	if _, exists := m.users[user.Email]; exists {
		return service.ErrUserExists
	}
	m.users[user.Email] = user
	return nil
}

func (m *mockUserRepository) UserExists(email string) (bool, error) {
	_, exists := m.users[email]
	return exists, nil
}

func (m *mockUserRepository) FindByEmail(email string) (*models.User, error) {
	user, exists := m.users[email]
	if !exists {
		return nil, service.ErrUserNotFound
	}
	return user, nil
}

func (m *mockUserRepository) Update(user *models.User) error {
	if _, exists := m.users[user.Email]; !exists {
		return service.ErrUserNotFound
	}
	m.users[user.Email] = user
	return nil
}

func TestCreateUser(t *testing.T) {
	repo := newMockUserRepository()
	userService := service.NewUserService(repo)

	tests := []struct {
		name     string
		email    string
		password string
		wantErr  bool
	}{
		{
			name:     "Valid user creation",
			email:    "test@example.com",
			password: "password123",
			wantErr:  false,
		},
		{
			name:     "Duplicate user",
			email:    "test@example.com",
			password: "password123",
			wantErr:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := userService.CreateUser(tt.email, tt.password)
			assert.Equal(t, tt.wantErr, err != nil)
		})
	}
}

func TestCheckUser(t *testing.T) {
	repo := newMockUserRepository()
	userService := service.NewUserService(repo)

	// Create a test user
	err := userService.CreateUser("test@example.com", "password123")
	assert.NoError(t, err)

	tests := []struct {
		name       string
		email      string
		password   string
		wantStatus string
		wantErr    bool
	}{
		{
			name:       "Valid credentials",
			email:      "test@example.com",
			password:   "password123",
			wantStatus: "registered",
			wantErr:    false,
		},
		{
			name:       "Wrong password",
			email:      "test@example.com",
			password:   "wrongpassword",
			wantStatus: "email_exists",
			wantErr:    false,
		},
		{
			name:       "Unregistered user",
			email:      "nonexistent@example.com",
			password:   "password123",
			wantStatus: "unregistered",
			wantErr:    false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			status, err := userService.CheckUser(tt.email, tt.password)
			assert.Equal(t, tt.wantErr, err != nil)
			assert.Equal(t, tt.wantStatus, status)
		})
	}
}

func TestUpdateUser(t *testing.T) {
	repo := newMockUserRepository()
	userService := service.NewUserService(repo)

	// Create a test user
	err := userService.CreateUser("test@example.com", "password123")
	assert.NoError(t, err)

	tests := []struct {
		name     string
		email    string
		password string
		wantErr  bool
	}{
		{
			name:     "Valid update",
			email:    "test@example.com",
			password: "newpassword123",
			wantErr:  false,
		},
		{
			name:     "Non-existent user",
			email:    "nonexistent@example.com",
			password: "password123",
			wantErr:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := userService.UpdateUser(tt.email, tt.password)
			assert.Equal(t, tt.wantErr, err != nil)
		})
	}
}
