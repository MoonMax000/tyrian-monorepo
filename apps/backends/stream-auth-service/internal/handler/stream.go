package handler

import (
	"time"

	"github.com/Capstane/stream-auth-service/internal/types"
	"github.com/gofiber/fiber/v2"
)

// Stream settings
// @Summary Stream settings
// @Description Stream settings
// @Tags stream
// @Accept json
// @Produce json
// @Success 200 {object} types.StreamSettingsResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /stream/settings [get]
func (h *Handler) streamSettings(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(types.StreamSettingsResponse{
		Resolution:   "1920x1080",
		Bitrate:      4500,
		FrameRate:    60,
		AudioQuality: "high",
		VideoCodec:   "H.264",
		AudioCodec:   "AAC",
	})
}

// Stream settings change
// @Summary Stream settings change
// @Description Stream settings change
// @Tags stream
// @Accept json
// @Produce json
// @Param request body types.StreamSettingsUpdateRequest true "stream settings change"
// @Success 200 {object} types.StreamSettingsResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /stream/settings [put]
// @Router /stream/settings [patch]
func (h *Handler) streamSettingsChange(c *fiber.Ctx) error {
	var update types.StreamSettingsUpdateRequest

	if err := c.BodyParser(&update); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(update)
}

// Stream plan settings
// @Summary Stream plan settings
// @Description Stream plan settings
// @Tags stream
// @Accept json
// @Produce json
// @Success 200 {object} types.StreamPlanSettingsResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /stream/plan [get]
func (h *Handler) streamPlanSettings(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON([]types.StreamPlanSettingsResponse{
		{
			Game:        "Dota 2",
			Description: "Play Dota 2 with me!",
			StartTime:   time.Unix(1733900400, 0),
			EndTime:     time.Unix(1733907600, 0),
		},
		{
			Game:        "Fortnite",
			Description: "see you in Fortnite!",
			StartTime:   time.Unix(1734087600, 0),
			EndTime:     time.Unix(1734098400, 0),
		},
		{
			Game:        "Dota 2",
			Description: "Testing carry CM",
			StartTime:   time.Unix(1734238800, 0),
			EndTime:     time.Unix(1734264000, 0),
		},
		{
			Game:        "GTA 6",
			Description: "Here we go again...",
			StartTime:   time.Unix(1749546000, 0),
			EndTime:     time.Unix(1749574800, 0),
		},
	})
}

// Stream plan settings change
// @Summary Stream plan settings change
// @Description Stream plan settings change
// @Tags stream
// @Accept json
// @Produce json
// @Param request body types.StreamPlanSettingsUpdateRequest true "stream plan settings change"
// @Success 200 {object} types.StreamPlanSettingsResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /stream/plan [put]
// @Router /stream/plan [patch]
func (h *Handler) streamPlanSettingsChange(c *fiber.Ctx) error {
	var update types.StreamPlanSettingsUpdateRequest

	if err := c.BodyParser(&update); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(update)
}
