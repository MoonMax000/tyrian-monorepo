package handler

import (
	"time"

	"github.com/Capstane/authlib/typex"
	"github.com/Capstane/go-notifylib"
	"github.com/Capstane/stream-streamer-service/internal"
	"github.com/Capstane/stream-streamer-service/internal/dto"
	"github.com/Capstane/stream-streamer-service/internal/encdec"
	"github.com/Capstane/stream-streamer-service/internal/model"
	"github.com/Capstane/stream-streamer-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"

	"crypto/rand"
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
// @Security ApiKeyAuth
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
// @Security ApiKeyAuth
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
// @Security ApiKeyAuth
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
// @Security ApiKeyAuth
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

// Stream key generation
// @Summary Stream key generation
// @Description Stream key generation
// @Tags stream-keys
// @Produce json
// @Success 200 {object} types.StreamKeyResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security ApiKeyAuth
// @Router /stream-keys/new [get]
func (h *Handler) newStreamKey(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)

	var userStreamKey model.UserStreamKey
	tx := h.db.Where("user_id = ?", claims.UserId).Delete(&userStreamKey)
	if err := tx.Error; err != nil {
		// Omit error for a non existing key
	}

	key := make([]byte, 16)
	_, err := rand.Read(key)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	userStreamKey.StreamKey = key
	userStreamKey.UserID = claims.UserId
	tx = h.db.Create(&userStreamKey)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(types.StreamKeyResponse{
		Key: encdec.StreamKeyEncoding.EncodeToString(key),
	})
}

// Reset stream key
// @Summary Reset stream key
// @Description Reset stream key
// @Tags stream-keys
// @Success 200
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security ApiKeyAuth
// @Router /stream-keys/reset [delete]
func (h *Handler) resetStreamKey(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)

	var userStreamKey model.UserStreamKey
	tx := h.db.Where("user_id = ?", claims.UserId).Delete(&userStreamKey)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).Send([]byte{})
}

// Start live stream
// @Summary Start live stream
// @Description Start live stream
// @Tags stream
// @Accept json
// @Produce json
// @Param request body types.LiveStreamRequest true "live stream settings"
// @Success 200
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security ApiKeyAuth
// @Router /stream/start [put]
func (h *Handler) liveStreamStart(c *fiber.Ctx) error {
	var liveStreamRequest types.LiveStreamRequest

	if err := c.BodyParser(&liveStreamRequest); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	claims := c.Locals("claims").(*typex.SessionClaims)

	var userStreamKey model.UserStreamKey
	tx := h.db.Where("user_id = ?", claims.UserId).First(&userStreamKey)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (can't find stream key for user, perhaps you should call /stream-keys/new first)",
			Error:   err.Error(),
		})
	}

	suffix := make([]byte, encdec.SUFFIX_LENGTH)
	_, err := rand.Read(suffix)
	if err != nil {
		log.Error().Msgf("can't generate random bytes, error is %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (can't generate random bytes)",
			Error:   err.Error(),
		})
	}
	encodedSuffix := encdec.StreamKeyEncoding.EncodeToString(suffix)

	translationUrl := internal.JoinUrl(h.cfg.WebRtcPublicUrl, encodedSuffix)
	err = h.liveStreamQueue.PushLiveStream(
		dto.LiveStreamCommandStart,
		liveStreamRequest.Name,
		liveStreamRequest.Category,
		&liveStreamRequest.Tags,
		&dto.NotifyUserInfo{
			UserId:   claims.UserId,
			Email:    claims.Email,
			Username: claims.Username,
			Roles:    claims.Roles,
		}, &dto.LiveStreamParams{
			Key:            userStreamKey.StreamKey,
			TranslationUrl: translationUrl,
			Resolution:     "1920x1080",
			Bitrate:        4500,
			FrameRate:      60,
			AudioQuality:   "high",
			VideoCodec:     "H.264",
			AudioCodec:     "AAC",
		})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	// Получаем список подписчиков
	var subscriberIDs []uuid.UUID
	if err := h.db.Model(&model.Subscription{}).
		Where("channel_id = ?", claims.UserId).
		Pluck("user_id", &subscriberIDs).Error; err != nil {
		log.Warn().Msgf("[liveStreamStart] No Subscription")
	}

	// Формируем сообщение
	messageStartStream := map[string]string{
		"type": "status_stream",
		"data": "start",
	}

	log.Info().Msgf("[liveStreamStart] subscriberIDs: %s", subscriberIDs)

	// Отправляем уведомления
	for _, userID := range subscriberIDs {
		notifylib.PushMessage("system", userID.String(), messageStartStream, claims.UserId.String())
	}

	return c.Status(fiber.StatusOK).SendString(translationUrl)
}

// Stop live stream
// @Summary Stop live stream
// @Description Stop live stream
// @Tags stream
// @Success 200
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security ApiKeyAuth
// @Router /stream/stop [delete]
func (h *Handler) liveStreamStop(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)

	var userStreamKey model.UserStreamKey
	tx := h.db.Where("user_id = ?", claims.UserId).First(&userStreamKey)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (can't find stream key for user, perhaps you should call /stream-keys/new first)",
			Error:   err.Error(),
		})
	}

	err := h.liveStreamQueue.PushLiveStream(
		dto.LiveStreamCommandStop,
		"",
		"",
		nil,
		&dto.NotifyUserInfo{
			UserId:   claims.UserId,
			Email:    claims.Email,
			Username: claims.Username,
			Roles:    claims.Roles,
		},
		&dto.LiveStreamParams{
			Key: userStreamKey.StreamKey,
		},
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).Send([]byte{})
}
