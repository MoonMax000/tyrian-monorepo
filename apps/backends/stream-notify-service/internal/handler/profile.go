package handler

import (
	"strings"

	"github.com/Capstane/stream-notify-service/internal/model"
	"github.com/Capstane/stream-notify-service/internal/types"
	"github.com/gofiber/fiber/v2"

	"github.com/Capstane/authlib/typex"
)

// Profile notify settings
// @Summary Profile notify settings
// @Description Profile notify settings
// @Tags profile
// @Accept json
// @Produce json
// @Success 200 {object} types.NotifyResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security ApiKeyAuth
// @Router /profile/me/notify-settings [get]
func (h *Handler) myNotifySettings(c *fiber.Ctx) error {

	var (
		userNotifications model.UserNotificationSettings
	)

	claims := c.Locals("claims").(typex.SessionClaims)

	tx := h.db.Where("user_id = ?", claims.UserId).First(&userNotifications)
	if err := tx.Error; err != nil && !strings.Contains(err.Error(), "record not found") {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (myNotifySettings())",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(types.NotifyResponse{
		EmailNotifications:      userNotifications.EmailNotifications,
		NotifyOnLiveBroadcast:   userNotifications.NotifyOnLiveBroadcast,
		NotifyOnVOD:             userNotifications.NotifyOnVOD,
		NotifyOnMention:         userNotifications.NotifyOnMention,
		NotifyOnNewSubscriber:   userNotifications.NotifyOnNewSubscriber,
		NotifyOnRecommendations: userNotifications.NotifyOnRecommendations,
		NotifyOnNews:            userNotifications.NotifyOnNews,
	})
}

// Profile notify settings change
// @Summary Profile notify settings change
// @Description Profile notify settings change
// @Tags profile
// @Accept json
// @Produce json
// @Param request body types.NotifyUpdateRequest true "profile notify settings change"
// @Success 200 {object} types.NotifyResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security ApiKeyAuth
// @Router /profile/me/notify-settings [put]
// @Router /profile/me/notify-settings [patch]
func (h *Handler) myNotifySettingsChange(c *fiber.Ctx) error {

	var (
		update            types.NotifyUpdateRequest
		userNotifications model.UserNotificationSettings
	)

	if err := c.BodyParser(&update); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	claims := c.Locals("claims").(typex.SessionClaims)
	userUUID := claims.UserId

	userNotifications.UserID = userUUID
	userNotifications.EmailNotifications = update.EmailNotifications
	userNotifications.EmailNotifications = update.EmailNotifications
	userNotifications.NotifyOnLiveBroadcast = update.NotifyOnLiveBroadcast
	userNotifications.NotifyOnVOD = update.NotifyOnVOD
	userNotifications.NotifyOnMention = update.NotifyOnMention
	userNotifications.NotifyOnNewSubscriber = update.NotifyOnNewSubscriber
	userNotifications.NotifyOnRecommendations = update.NotifyOnRecommendations
	userNotifications.NotifyOnNews = update.NotifyOnNews

	tx := h.db.Save(&userNotifications)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (myNotifySettingsChange())",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(update)
}
