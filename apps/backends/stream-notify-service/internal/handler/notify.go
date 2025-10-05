package handler

import (
	"github.com/Capstane/stream-notify-service/internal/dto"
	"github.com/Capstane/stream-notify-service/internal/types"
	"github.com/gofiber/fiber/v2"
)

// Test notify NotifyOnLiveBroadcast
// @Summary Test notify NotifyOnLiveBroadcast
// @Description Test notify NotifyOnLiveBroadcast
// @Tags notify
// @Accept json
// @Produce json
// @Param request body types.NotifyOnLiveBroadcast true "profile notify settings change"
// @Success 200 {object} types.NotifyOnLiveBroadcast
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /notify/notify-on-live-broadcast [put]
func (h *Handler) notifyOnLiveBroadcast(c *fiber.Ctx) error {

	var (
		message types.NotifyOnLiveBroadcast
	)

	if err := c.BodyParser(&message); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	err := h.qConn.PushNotify(&dto.NotifyUserInfo{
		UserId: message.UserID,
		Email:  message.Email,
	}, dto.NotifyOnLiveBroadcast, message)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (Can't send message)",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(message)
}

// Test notify NotifyOnVOD
// @Summary Test notify NotifyOnVOD
// @Description Test notify NotifyOnVOD
// @Tags notify
// @Accept json
// @Produce json
// @Param request body types.NotifyOnVOD true "profile notify settings change"
// @Success 200 {object} types.NotifyOnVOD
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /notify/notify-on-vod [put]
func (h *Handler) notifyOnVOD(c *fiber.Ctx) error {

	var (
		message types.NotifyOnVOD
	)

	if err := c.BodyParser(&message); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	err := h.qConn.PushNotify(&dto.NotifyUserInfo{
		UserId: message.UserID,
		Email:  message.Email,
	}, dto.NotifyOnVOD, message)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (Can't send message)",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(message)
}

// Test notify NotifyOnMention
// @Summary Test notify NotifyOnMention
// @Description Test notify NotifyOnMention
// @Tags notify
// @Accept json
// @Produce json
// @Param request body types.NotifyOnMention true "profile notify settings change"
// @Success 200 {object} types.NotifyOnMention
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /notify/notify-on-mention [put]
func (h *Handler) notifyOnMention(c *fiber.Ctx) error {

	var (
		message types.NotifyOnMention
	)

	if err := c.BodyParser(&message); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	err := h.qConn.PushNotify(&dto.NotifyUserInfo{
		UserId: message.UserID,
		Email:  message.Email,
	}, dto.NotifyOnMention, message)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (Can't send message)",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(message)
}

// Test notify NotifyOnNewSubscriber
// @Summary Test notify NotifyOnNewSubscriber
// @Description Test notify NotifyOnNewSubscriber
// @Tags notify
// @Accept json
// @Produce json
// @Param request body types.NotifyOnNewSubscriber true "profile notify settings change"
// @Success 200 {object} types.NotifyOnNewSubscriber
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /notify/notify-on-new-subscriber [put]
func (h *Handler) notifyOnNewSubscriber(c *fiber.Ctx) error {

	var (
		message types.NotifyOnNewSubscriber
	)

	if err := c.BodyParser(&message); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	err := h.qConn.PushNotify(&dto.NotifyUserInfo{
		UserId: message.UserID,
		Email:  message.Email,
	}, dto.NotifyOnNewSubscriber, message)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (Can't send message)",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(message)
}

// Test notify NotifyOnRecommendations
// @Summary Test notify NotifyOnRecommendations
// @Description Test notify NotifyOnRecommendations
// @Tags notify
// @Accept json
// @Produce json
// @Param request body types.NotifyOnRecommendations true "profile notify settings change"
// @Success 200 {object} types.NotifyOnRecommendations
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /notify/notify-on-recommendations [put]
func (h *Handler) notifyOnRecommendations(c *fiber.Ctx) error {

	var (
		message types.NotifyOnRecommendations
	)

	if err := c.BodyParser(&message); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	err := h.qConn.PushNotify(&dto.NotifyUserInfo{
		UserId: message.UserID,
		Email:  message.Email,
	}, dto.NotifyOnRecommendations, message)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (Can't send message)",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(message)
}

// Test notify NotifyOnNews
// @Summary Test notify NotifyOnNews
// @Description Test notify NotifyOnNews
// @Tags notify
// @Accept json
// @Produce json
// @Param request body types.NotifyOnNews true "profile notify settings change"
// @Success 200 {object} types.NotifyOnNews
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /notify/notify-on-news [put]
func (h *Handler) notifyOnNews(c *fiber.Ctx) error {

	var (
		message types.NotifyOnNews
	)

	claims := c.Locals("claims")
	if claims == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (parse session claims fail)",
			Error:   "Claims doesn't set",
		})
	}

	if err := c.BodyParser(&message); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	err := h.qConn.PushNotify(&dto.NotifyUserInfo{
		UserId: message.UserID,
		Email:  message.Email,
	}, dto.NotifyOnNews, message)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (Can't send message)",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(message)
}
