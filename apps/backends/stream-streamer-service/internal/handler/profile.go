package handler

import (
	"errors"
	"fmt"

	"github.com/Capstane/authlib/typex"
	"github.com/Capstane/stream-streamer-service/internal/model"
	"github.com/Capstane/stream-streamer-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

// Profile request streamer role
// @Summary Profile request streamer role
// @Description Submit a request to become a streamer. If a request with status 'created' already exists, returns an error.
// @Tags profile
// @Accept json
// @Produce json
// @Param request body types.BecomeStreamerRequest true "become streamer request"
// @Success 200 {string} string "ok"
// @Failure 400 {object} types.FailureResponse "Validation error or request already exists"
// @Failure 500 {object} types.FailureErrorResponse "Database error"
// @Security ApiKeyAuth
// @Router /profile/me/become-streamer-request [post]
func (h *Handler) becomeStreamerRequest(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)
	log.Debug().
		Str("claims", fmt.Sprintf("%+v", claims)).
		Msg("Full claims structure")


	var streamerRequest types.BecomeStreamerRequest
	if err := c.BodyParser(&streamerRequest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid request body",
		})
	}

	// Проверяем, есть ли уже заявка со статусом "created"
	var existingRequest model.RoleRequest
	err := h.db.Where("user_id = ? AND role = ? AND status = ?", claims.UserId, model.StreamerRole, "created").
		First(&existingRequest).Error

	if err == nil {
		// Заявка уже существует и на рассмотрении
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "You have already submitted a request. It is under review.",
		})
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to check existing request",
			Error:   err.Error(),
		})
	}

	newRequest := model.RoleRequest{
		UserId:  claims.UserId,
		Email:   streamerRequest.Email,
		Role:    model.StreamerRole,
		Comment: streamerRequest.AdditionalText,
		Status:  "created",
	}

	if err := h.db.Create(&newRequest).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to save request to database",
			Error:   err.Error(),
		})
	}

	// Логика отправки заявки в коннектор для SF
	err = h.streamRequestQueue.PushStreamerRequest(claims.UserId.String(), claims.Email, streamerRequest.AdditionalText)
	if err != nil {
		log.Error().Msgf("error push message StreamerRequest, %v", err)
	}

	return c.Status(fiber.StatusOK).SendString("ok")
}

// Get streamer request status
// @Summary Get streamer role request status
// @Description Returns the current status of the user's streamer role request (e.g. created, rejected, approved)
// @Tags profile
// @Produce json
// @Success 200 {object} types.StreamerRequestStatusResponse
// @Failure 404 {object} types.FailureResponse "Request not found"
// @Failure 500 {object} types.FailureErrorResponse "Database error"
// @Security ApiKeyAuth
// @Router /profile/me/status-streamer-request [get]
func (h *Handler) statusStreamerRequest(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)

	var request model.RoleRequest
	err := h.db.Where("user_id = ?", claims.UserId).
		Order("created_at DESC").
		First(&request).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(types.FailureResponse{
				Status:  "error",
				Message: "No streamer request found",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch request status",
			Error:   err.Error(),
		})
	}

	return c.JSON(types.StreamerRequestStatusResponse{
		ID:     request.ID,
		Status: request.Status,
	})
}
