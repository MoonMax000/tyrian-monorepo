package handler

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/Capstane/stream-chat-service/internal/storage"
	"github.com/Capstane/stream-chat-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

// CheckUser
// @Summary CheckUser
// @Description CheckUser
// @Tags history
// @Produce json
// @Param chatID query string true "Chat history"
// @Param limit query int false "Limit the number of messages to fetch"
// @Success 200 {array} types.SuccessResponseHistory
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /history/chat [get]
func (h *Handler) getHistory(c *fiber.Ctx) error {
	chatID := c.Query("chatID")

	limitStr := c.Query("limit")
	if limitStr == "" {
		limitStr = "500" // Значение по умолчанию, если параметр не указан
	}

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid or missing 'limit' parameter",
		})
	}

	adminID, exists := storage.StreamOwnerToChat[chatID]
	if !exists {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Chat not found or stream is not active",
		})
	}

	tableName := fmt.Sprintf("history_%s", strings.ReplaceAll(adminID.String(), "-", "_"))

	query := fmt.Sprintf(`
        SELECT id, sender, nick, message, timestamp_message
        FROM %s
        ORDER BY timestamp_message DESC
        LIMIT $1;
    `, tableName)

	var history []types.MessageChat

	err = h.db.Raw(query, limit).Scan(&history).Error
	if err != nil {
		if strings.Contains(err.Error(), "does not exist") {
			log.Info().Msgf("Table '%s' does not exist", tableName)
			return c.Status(fiber.StatusOK).JSON([]types.SuccessResponseHistory{})
		}

		log.Error().Msgf("Unexpected error: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch public chat history",
			Error:   err.Error(),
		})
	}

	log.Debug().Msgf("Fetched %d messages for chatId %s", len(history), tableName)

	return c.Status(fiber.StatusOK).JSON(types.SuccessResponseHistory{
		Status:  "ok",
		Message: history,
	})
}
