package tests

import (
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/Capstane/AXA-socialweb-profile/internal/model"
	"github.com/Capstane/AXA-socialweb-profile/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestGetPublicProfile(t *testing.T) {
	app, h := setupTestApp(t)
	db := h.GetDB()

	// Создаем тестового пользователя
	user := model.User{
		Username:       "testuser",
		Email:          "test@example.com",
		EmailConfirmed: true,
		Description:    "Test user description",
		AvatarURL:      "/avatars/test.jpg",
		Roles:          []string{"user"},
	}
	db.Create(&user)

	// Создаем подписчиков
	follower1 := model.User{
		Username:       "follower1",
		Email:          "follower1@example.com",
		EmailConfirmed: true,
		Description:    "Follower 1 description",
		AvatarURL:      "/avatars/follower1.jpg",
		Roles:          []string{"user"},
	}
	db.Create(&follower1)

	follower2 := model.User{
		Username:       "follower2",
		Email:          "follower2@example.com",
		EmailConfirmed: true,
		Description:    "Follower 2 description",
		AvatarURL:      "/avatars/follower2.jpg",
		Roles:          []string{"user"},
	}
	db.Create(&follower2)

	// Создаем подписки
	following1 := model.User{
		Username:       "following1",
		Email:          "following1@example.com",
		EmailConfirmed: true,
		Description:    "Following 1 description",
		AvatarURL:      "/avatars/following1.jpg",
		Roles:          []string{"user"},
	}
	db.Create(&following1)

	following2 := model.User{
		Username:       "following2",
		Email:          "following2@example.com",
		EmailConfirmed: true,
		Description:    "Following 2 description",
		AvatarURL:      "/avatars/following2.jpg",
		Roles:          []string{"user"},
	}
	db.Create(&following2)

	// Создаем связи подписчиков
	db.Exec("INSERT INTO auth_follower (followed_id, follower_id) VALUES (?, ?)", user.ID, follower1.ID)
	db.Exec("INSERT INTO auth_follower (followed_id, follower_id) VALUES (?, ?)", user.ID, follower2.ID)

	// Создаем связи подписок
	db.Exec("INSERT INTO auth_follower (followed_id, follower_id) VALUES (?, ?)", following1.ID, user.ID)
	db.Exec("INSERT INTO auth_follower (followed_id, follower_id) VALUES (?, ?)", following2.ID, user.ID)

	// Создаем тестовые посты
	post1 := types.Post{
		ID:       uuid.New().String(),
		UserId:   user.ID.String(),
		Type:     "text",
		Title:    "Test Post 1",
		Content:  "Test content 1",
		MediaURL: "/media/post1.jpg",
	}
	db.Exec("INSERT INTO auth_post (id, user_id, type, title, content, media_url) VALUES (?, ?, ?, ?, ?, ?)",
		post1.ID, post1.UserId, post1.Type, post1.Title, post1.Content, post1.MediaURL)

	post2 := types.Post{
		ID:       uuid.New().String(),
		UserId:   user.ID.String(),
		Type:     "image",
		Title:    "Test Post 2",
		Content:  "Test content 2",
		MediaURL: "/media/post2.jpg",
	}
	db.Exec("INSERT INTO auth_post (id, user_id, type, title, content, media_url) VALUES (?, ?, ?, ?, ?, ?)",
		post2.ID, post2.UserId, post2.Type, post2.Title, post2.Content, post2.MediaURL)

	// Тест 1: Успешное получение профиля
	t.Run("Success", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/v1/profile/testuser/public", nil)
		resp, err := app.Test(req)
		assert.NoError(t, err)
		assert.Equal(t, fiber.StatusOK, resp.StatusCode)

		var profile types.PublicProfile
		err = json.NewDecoder(resp.Body).Decode(&profile)
		assert.NoError(t, err)

		assert.Equal(t, user.ID.String(), profile.ID)
		assert.Equal(t, user.Username, profile.Username)
		assert.Equal(t, user.GetAvatarUrl(h.GetConfig().CdnPublicUrl), profile.AvatarURL)
		assert.Equal(t, struct{}{}, profile.Bio)
		assert.Equal(t, "", profile.MemberSince)

		// Проверяем подписчиков
		assert.Len(t, profile.Followers, 2)
		followerUsernames := []string{profile.Followers[0].Username, profile.Followers[1].Username}
		assert.Contains(t, followerUsernames, "follower1")
		assert.Contains(t, followerUsernames, "follower2")

		// Проверяем подписки
		assert.Len(t, profile.Followings, 2)
		followingUsernames := []string{profile.Followings[0].Username, profile.Followings[1].Username}
		assert.Contains(t, followingUsernames, "following1")
		assert.Contains(t, followingUsernames, "following2")

		// Проверяем посты
		assert.Len(t, profile.Posts, 2)
		postTitles := []string{profile.Posts[0].Title, profile.Posts[1].Title}
		assert.Contains(t, postTitles, "Test Post 1")
		assert.Contains(t, postTitles, "Test Post 2")
	})

	// Тест 2: Пользователь не найден
	t.Run("User Not Found", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/v1/profile/nonexistent/public", nil)
		resp, err := app.Test(req)
		assert.NoError(t, err)
		assert.Equal(t, fiber.StatusNotFound, resp.StatusCode)

		var errorResp types.FailureErrorResponse
		err = json.NewDecoder(resp.Body).Decode(&errorResp)
		assert.NoError(t, err)
		assert.Equal(t, "error", errorResp.Status)
		assert.Equal(t, "User not found", errorResp.Message)
	})
}
