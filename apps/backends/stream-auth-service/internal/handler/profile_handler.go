package handler

import (
	"errors"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/Capstane/authlib/typex"
	"github.com/Capstane/stream-auth-service/internal/model"
	"github.com/Capstane/stream-auth-service/internal/types"
)

// Profile
// @Summary Profile
// @Description Profile
// @Tags profile
// @Accept json
// @Produce json
// @Success 200 {object} types.Profile
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /profile/me [get]
func (h *Handler) profileMe(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)

	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not exists)",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(types.Profile{
		ID:             userPtr.ID.String(),
		Username:       userPtr.Username,
		Email:          userPtr.Email,
		EmailConfirmed: userPtr.EmailConfirmed,
		Description:    userPtr.Description,
		AvatarURL:      userPtr.GetAvatarUrl(h.cfg.CdnPublicUrl),
		CoverURL:       userPtr.GetCoverUrl(h.cfg.CdnPublicUrl),
		DonationURL:    userPtr.DonationURL,
		Roles:          userPtr.Roles,
	})
}

// Profile update
// @Summary Profile update
// @Description Profile update
// @Tags profile
// @Accept json
// @Produce json
// @Param request body types.ProfileUpdateRequest true "info for updating"
// @Success 200 {object} types.Profile
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /profile/me [patch]
// @Router /profile/me [put]
func (h *Handler) updateMyProfile(c *fiber.Ctx) error {
	var (
		user   model.User
		update types.ProfileUpdateRequest
	)

	claims := c.Locals("claims").(*typex.SessionClaims)

	tx := h.db.Where("id = ?", claims.UserId).First(&user)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	if err := c.BodyParser(&update); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	if c.Method() == "PUT" {
		user.Username = update.Username
		user.Description = update.Description
	} else {
		if update.Username != "" {
			user.Username = update.Username
		}
		if update.Description != "" {
			user.Description = update.Description
		}
		if update.DonationURL != "" {
			user.DonationURL = update.DonationURL
		}
	}

	tx = h.db.Save(&user)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal Server Error",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(types.Profile{
		ID:          user.ID.String(),
		Username:    user.Username,
		Email:       user.Email,
		Description: user.Description,
		AvatarURL:   user.AvatarURL,
		CoverURL:    user.CoverURL,
		DonationURL: user.DonationURL,
		Roles:       user.Roles,
	})
}

// Set profile avatar
// @Summary Set profile avatar
// @Description Set profile avatar
// @Tags profile
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "this is a test file"
// @Success 200 {object} types.FileUploadResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /profile/me/set-avatar [put]
func (h *Handler) setProfileAvatar(c *fiber.Ctx) error {
	var (
		user model.User
	)

	claims := c.Locals("claims").(*typex.SessionClaims)

	tx := h.db.Where("id = ?", claims.UserId).First(&user)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	info, err := h.FileUpload(file)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	user.AvatarURL = fmt.Sprintf("/%s/%s", info.Bucket, info.Key)
	tx = h.db.Model(&user).Where("id = ?", user.ID).Update("AvatarURL", user.AvatarURL)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}
	log.Infof("Successfully uploaded avatar %s of size %d\n", info.Key, info.Size)

	return c.Status(fiber.StatusOK).JSON(types.FileUploadResponse{
		Url: user.GetAvatarUrl(h.cfg.CdnPublicUrl),
	})
}

// Set profile cover
// @Summary Set profile cover
// @Description Set profile cover
// @Tags profile
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "this is a test file"
// @Success 200 {object} types.FileUploadResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /profile/me/set-cover [put]
func (h *Handler) setProfileCover(c *fiber.Ctx) error {
	var (
		user model.User
	)

	claims := c.Locals("claims").(*typex.SessionClaims)

	tx := h.db.Where("id = ?", claims.UserId).First(&user)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	info, err := h.FileUpload(file)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	user.CoverURL = fmt.Sprintf("/%s/%s", info.Bucket, info.Key)
	tx = h.db.Model(&user).Where("id = ?", user.ID).Update("CoverURL", user.CoverURL)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}
	log.Infof("Successfully uploaded cover %s of size %d\n", info.Key, info.Size)

	return c.Status(fiber.StatusOK).JSON(types.FileUploadResponse{
		Url: user.GetCoverUrl(h.cfg.CdnPublicUrl),
	})
}

// Profile subscription
// @Summary Profile subscription
// @Description Profile subscription
// @Tags profile
// @Accept json
// @Produce json
// @Success 200 {object} types.SubscriptionsResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /profile/me/subscriptions [get]
func (h *Handler) mySubscriptions(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(types.SubscriptionsResponse{
		Status: "ok",
		Data: []types.Subscription{
			{
				ChannelId:    uuid.MustParse("aa1841db-946c-4f5c-8966-ff9a7bde9970"),
				ChannelName:  "Crypto Talks",
				SubscribedAt: time.Unix(1733903302, 0),
			},
			{
				ChannelId:    uuid.MustParse("73c677a4-5532-4052-9dc3-85bb2d7624ec"),
				ChannelName:  "MaximClass",
				SubscribedAt: time.Unix(1733873302, 0),
			},
			{
				ChannelId:    uuid.MustParse("9426a3a1-27ef-46ac-9280-b27b3da2e433"),
				ChannelName:  "DmitryIdea",
				SubscribedAt: time.Unix(1733853302, 0),
			},
		},
	})
}

// Profile subscribe
// @Summary Profile subscribe
// @Description Profile subscribe
// @Tags profile
// @Accept json
// @Produce json
// @Param request body types.SubscribeRequest true "profile subscribe"
// @Success 200 {object} types.SuccessResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /profile/me/subscribe [post]
func (h *Handler) subscribe(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(types.SuccessResponse{
		Status:  "ok",
		Message: "Channel subscribed",
	})
}

// Profile like
// @Summary Profile like
// @Description Profile like
// @Tags profile
// @Accept json
// @Produce json
// @Param request body types.LikeRequest true "profile like"
// @Success 200 {object} types.SuccessResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /profile/me/like [post]
func (h *Handler) like(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(types.SuccessResponse{
		Status:  "ok",
		Message: "Channel liked",
	})
}

// Profile getUserEmail
// @Summary Get User Email
// @Description Get User Email by user ID (UUID)
// @Tags profile
// @Accept json
// @Produce json
// @Param id path string true "user id (UUID)"
// @Success 200 {object} types.SuccessResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 404 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /profile/get-email/{id} [get]
func (h *Handler) getUserEmail(c *fiber.Ctx) error {
	idParam := c.Params("id")
	if idParam == "" {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "User ID is required",
		})
	}

	id, err := uuid.Parse(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid user ID format. Must be a valid UUID.",
		})
	}

	redisKey := fmt.Sprintf("userIdAuth:%s", id.String())

	cachedEmail, err := h.redisClient.Get(c.Context(), redisKey).Result()
	if err == nil {
		// Ключ найден в Redis — возвращаем из кеша
		return c.Status(fiber.StatusOK).JSON(types.SuccessResponse{
			Status:  "ok",
			Message: cachedEmail,
		})
	}

	if err != redis.Nil {
		fmt.Printf("Redis error (get): %v\n", err)
	}

	var user model.User
	result := h.db.Select("email").First(&user, "id = ?", id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(types.FailureResponse{
				Status:  "error",
				Message: "User not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to retrieve user from database",
			Error:   result.Error.Error(),
		})
	}

	// Сохраняем email в Redis с TTL 1 час
	if err := h.redisClient.Set(c.Context(), redisKey, user.Email, time.Hour).Err(); err != nil {
		fmt.Printf("Redis error (set): %v\n", err)
	}

	return c.Status(fiber.StatusOK).JSON(types.SuccessResponse{
		Status:  "ok",
		Message: user.Email,
	})
}
