package handler

import (
	"fmt"
	"math"

	"github.com/Capstane/authlib/typex"
	"github.com/Capstane/go-notifylib"
	"github.com/Capstane/stream-recommend-service/internal/model"
	"github.com/Capstane/stream-recommend-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// GetMySubscriptions godoc
// @Summary Get user's subscriptions
// @Description Returns list of channels the user is subscribed to
// @Tags channels
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {object} types.SubscriptionsResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /channels/me/subscriptions [get]
func (h *Handler) GetMySubscriptions(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)

	var channelIDs []uuid.UUID
	if err := h.db.Model(&model.Subscription{}).
		Select("channel_id").
		Where("user_id = ?", claims.UserId).
		Pluck("channel_id", &channelIDs).Error; err != nil {
		return c.Status(500).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch subscriptions",
			Error:   err.Error(),
		})
	}

	return c.JSON(types.SubscriptionsResponse{
		Status: "success",
		Data:   channelIDs,
	})
}

// Subscribe godoc
// @Summary Subscribe to channel
// @Description Subscribe authenticated user to a channel
// @Tags channels
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param request body types.SubscribeRequest true "Subscribe Request"
// @Success 200 {object} types.SuccessResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /channels/me/subscribe [post]
func (h *Handler) Subscribe(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)

	var request types.SubscribeRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid request body",
		})
	}

	// Prevent self-subscription
	if claims.UserId == request.ChannelId {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Cannot subscribe to your own channel",
		})
	}

	// Check if already subscribed
	var existingSub model.Subscription
	if err := h.db.Where("user_id = ? AND channel_id = ? AND deleted_at is NULL", claims.UserId, request.ChannelId).First(&existingSub).Error; err == nil {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Already subscribed to this channel",
		})
	}

	if h.db.Where("id = ? AND roles LIKE ?", request.ChannelId, "%\"streamer\"%").First(&model.User{}).Error != nil {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Channel not found",
		})
	}

	subscription := model.Subscription{
		UserId:    claims.UserId,
		ChannelId: request.ChannelId,
	}

	if err := h.db.Create(&subscription).Error; err != nil {
		return c.Status(500).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to subscribe",
			Error:   err.Error(),
		})
	}

	// message notify
	messageSubscription := map[string]string{
		"type": "subscription",
		"data": "subscription to channel",
	}

	notifylib.PushMessage("system", request.ChannelId.String(), messageSubscription, claims.UserId.String())

	return c.JSON(types.SuccessResponse{
		Status:  "success",
		Message: "Successfully subscribed to channel",
	})
}

// Unsubscribe godoc
// @Summary Unsubscribe from channel
// @Description Unsubscribe authenticated user from a channel
// @Tags channels
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param request body types.UnsubscribeRequest true "Unsubscribe Request"
// @Success 200 {object} types.SuccessResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 401 {object} types.FailureResponse
// @Failure 404 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /channels/me/unsubscribe [post]
func (h *Handler) Unsubscribe(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)

	var request types.UnsubscribeRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid request body",
		})
	}

	// Check if the channel exists
	if h.db.Where("id = ? AND roles LIKE ?", request.ChannelId, "%\"streamer\"%").First(&model.User{}).Error != nil {
		return c.Status(404).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Channel not found",
		})
	}

	// Use Unscoped() to bypass soft delete and perform hard delete
	result := h.db.Unscoped().Where("user_id = ? AND channel_id = ?", claims.UserId, request.ChannelId).Delete(&model.Subscription{})
	if result.Error != nil {
		return c.Status(500).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to unsubscribe",
			Error:   result.Error.Error(),
		})
	}

	if result.RowsAffected == 0 {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Not subscribed to this channel",
		})
	}

	return c.JSON(types.SuccessResponse{
		Status:  "success",
		Message: "Successfully unsubscribed from channel",
	})
}

// GetChannelSubscribers godoc
// @Summary Get channel subscribers
// @Description Returns list of users subscribed to the authenticated streamer's channel
// @Tags channels
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 10, max: 100)"
// @Param sort_by query string false "Sort field (username or subscriber_count)"
// @Param sort_dir query string false "Sort direction (asc or desc)"
// @Success 200 {object} types.SubscriberListResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /channels/me/subscribers [get]
func (h *Handler) GetChannelSubscribers(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)

	var streamer model.User
	if err := h.db.Where("id = ? AND roles LIKE ?", claims.UserId, "%\"streamer\"%").First(&streamer).Error; err != nil {
		return c.Status(fiber.StatusForbidden).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Access denied: user is not a streamer",
		})
	}

	// Пагинация
	page := c.QueryInt("page", 1)
	if page < 1 {
		page = 1
	}
	pageSize := c.QueryInt("page_size", 10)
	if pageSize < 1 {
		pageSize = 10
	} else if pageSize > 100 {
		pageSize = 100
	}
	offset := (page - 1) * pageSize

	// Сортировка
	sortBy := c.Query("sort_by", "username")
	sortDir := c.Query("sort_dir", "asc")
	if sortDir != "asc" && sortDir != "desc" {
		sortDir = "asc"
	}

	var order string
	switch sortBy {
	case "subscriber_count":
		order = fmt.Sprintf("subscriber_count %s", sortDir)
	default:
		order = fmt.Sprintf("u.username %s", sortDir)
	}

	// === ОСНОВНОЙ ЗАПРОС: только SQL, никаких ? и подзапросов через GORM ===
	var subscribers []struct {
		ID              uuid.UUID `json:"id"`
		Username        string    `json:"username"`
		AvatarURL       string    `json:"avatar_url"`
		Roles           []string  `json:"roles"`
		SubscriberCount int64     `json:"subscriber_count"`
	}

	query := `
		SELECT 
			u.id,
			u.username,
			u.avatar_url,
			u.roles,
			COALESCE(sub_counts.subscriber_count, 0) AS subscriber_count
		FROM subscription s
		JOIN auth_user u ON u.id = s.user_id AND u.deleted_at IS NULL
		LEFT JOIN (
			SELECT channel_id, COUNT(*) AS subscriber_count
			FROM subscription
			GROUP BY channel_id
		) sub_counts ON sub_counts.channel_id = u.id
		WHERE s.channel_id = ?
		ORDER BY ` + order + `
		LIMIT ? OFFSET ?
	`
	// auth_subscription

	err := h.db.Raw(query, claims.UserId, pageSize, offset).Scan(&subscribers).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch subscribers",
			Error:   err.Error(),
		})
	}

	// Общее количество подписчиков
	var totalCount int64
	err = h.db.Model(&model.Subscription{}).
		Where("channel_id = ?", claims.UserId).
		Count(&totalCount).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to count subscribers",
			Error:   err.Error(),
		})
	}

	// Форматируем ответ
	data := make([]types.Subscriber, len(subscribers))
	for i, sub := range subscribers {
		isStreamer := false
		for _, role := range sub.Roles {
			if role == "streamer" {
				isStreamer = true
				break
			}
		}

		data[i] = types.Subscriber{
			ID:              sub.ID,
			Username:        sub.Username,
			AvatarURL:       sub.AvatarURL,
			IsStreamer:      isStreamer,
			Stream:          h.streamService.GetStreamData(sub.ID),
			SubscriberCount: sub.SubscriberCount,
			IsSubscribed:    true, // они подписаны на тебя
		}
	}

	totalPages := int(math.Ceil(float64(totalCount) / float64(pageSize)))
	if totalPages < 1 {
		totalPages = 1
	}

	return c.JSON(types.SubscriberListResponse{
		Status: "success",
		Data:   data,
		Pagination: types.PaginationResponse{
			CurrentPage:  page,
			PageSize:     pageSize,
			TotalPages:   totalPages,
			TotalRecords: totalCount,
		},
	})
}

// func (h *Handler) GetChannelSubscribers(c *fiber.Ctx) error {
// 	// Get and validate streamer ID from context
// 	claims := c.Locals("claims").(*typex.SessionClaims)

// 	// Verify user is a streamer
// 	var streamer model.User
// 	if err := h.db.Where("id = ? AND roles LIKE ?", claims.UserId, "%\"streamer\"%").First(&streamer).Error; err != nil {
// 		return c.Status(fiber.StatusForbidden).JSON(types.FailureResponse{
// 			Status:  "error",
// 			Message: "Access denied: user is not a streamer",
// 		})
// 	}

// 	// Get pagination parameters
// 	page := c.QueryInt("page", 1)
// 	if page < 1 {
// 		page = 1
// 	}
// 	pageSize := c.QueryInt("page_size", 10)
// 	if pageSize < 1 {
// 		pageSize = 10
// 	} else if pageSize > 100 {
// 		pageSize = 100
// 	}
// 	offset := (page - 1) * pageSize

// 	// Get sorting parameters
// 	sortBy := c.Query("sort_by", "username")
// 	sortDir := c.Query("sort_dir", "asc")
// 	if sortDir != "asc" && sortDir != "desc" {
// 		sortDir = "asc"
// 	}

// 	// Validate sort field
// 	validSortFields := map[string]string{
// 		"username":         "auth_user.username",
// 		"subscriber_count": "subscriber_count",
// 	}
// 	dbSortField, ok := validSortFields[sortBy]
// 	if !ok {
// 		dbSortField = "auth_user.username"
// 	}

// 	// Base query to get subscribers with their subscriber counts
// 	query := h.db.Debug().Table("auth_user").
// 		Select("auth_user.*, COALESCE(sub_counts.subscriber_count, 0) as subscriber_count").
// 		Joins("LEFT JOIN auth_subscription s1 ON s1.user_id = auth_user.id").
// 		Joins(`LEFT JOIN (
// 			SELECT channel_id, COUNT(*) as subscriber_count FROM auth_subscription GROUP BY channel_id
// 		) sub_counts ON sub_counts.channel_id = auth_user.id`).
// 		Where("s1.channel_id = ? AND auth_user.deleted_at IS NULL", claims.UserId)

// 	var ss []model.Subscription
// 	err := h.db.Model(&model.Subscription{}).Where("channel_id = ?", claims.UserId).Find(&ss).Error
// 	if err == nil {
// 		var uu []model.User
// 		err = h.db.Model(&model.User{}).Where("id in ?", utilx.Mapping(ss, func(s model.Subscription) uuid.UUID { return s.UserId })).Find(&uu).Error
// 		uuData, err := json.Marshal(&uu)
// 		if err != nil {
// 			log.Fatalf("Error marshalling map to JSON: %v", err)
// 		}
// 		ssData, err := json.Marshal(&ss)
// 		if err != nil {
// 			log.Fatalf("Error marshalling map to JSON: %v", err)
// 		}

// 		log.Infof("DEBUG: auth_user >>>>>>>>>>>>>>>>>>>>> %v", string(uuData))
// 		log.Infof("DEBUG: auth_subscription >>>>>>>>>>>>>>>>>>>>> %v", string(ssData))
// 	} else {
// 		log.Errorf("%s", err)
// 	}

// 	// Apply sorting
// 	if sortBy == "subscriber_count" {
// 		query = query.Order(fmt.Sprintf("subscriber_count %s", sortDir))
// 	} else {
// 		query = query.Order(fmt.Sprintf("%s %s", dbSortField, sortDir))
// 	}

// 	// Get total count for pagination
// 	var totalCount int64
// 	if err := h.db.Table("auth_subscription").
// 		Where("channel_id = ?", claims.UserId).
// 		Count(&totalCount).Error; err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
// 			Status:  "error",
// 			Message: "Failed to count subscribers",
// 			Error:   err.Error(),
// 		})
// 	}

// 	// Get paginated subscribers
// 	type UserWithCount struct {
// 		model.User
// 		SubscriberCount int64 `gorm:"column:subscriber_count"`
// 	}
// 	var subscribers []UserWithCount
// 	if err := query.Offset(offset).Limit(pageSize).Find(&subscribers).Error; err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
// 			Status:  "error",
// 			Message: "Failed to fetch subscribers",
// 			Error:   err.Error(),
// 		})
// 	}

// 	// Get subscriber counts for each user
// 	subscriberIDs := make([]uuid.UUID, len(subscribers))
// 	for i, sub := range subscribers {
// 		subscriberIDs[i] = sub.ID
// 	}

// 	// Get streaming status and enrich subscriber data
// 	subscriberData := make([]types.Subscriber, len(subscribers))

// 	// Get mutual subscriptions in a single query
// 	type MutualSub struct {
// 		UserID uuid.UUID `gorm:"column:user_id"`
// 	}
// 	var mutualSubs []MutualSub
// 	if len(subscriberIDs) > 0 {
// 		if err := h.db.Model(&model.Subscription{}).
// 			Select("user_id").
// 			Where("channel_id = ? AND user_id IN ?", claims.UserId, subscriberIDs).
// 			Find(&mutualSubs).Error; err != nil {
// 			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
// 				Status:  "error",
// 				Message: "Failed to fetch mutual subscriptions",
// 				Error:   err.Error(),
// 			})
// 		}
// 	}

// 	// Create a map for faster mutual subscription lookups
// 	mutualSubMap := make(map[uuid.UUID]bool, len(mutualSubs))
// 	for _, ms := range mutualSubs {
// 		mutualSubMap[ms.UserID] = true
// 	}

// 	for i, sub := range subscribers {
// 		isStreamer := false
// 		for _, role := range sub.Roles {
// 			if role == "streamer" {
// 				isStreamer = true
// 				break
// 			}
// 		}

// 		streamData := h.streamService.GetStreamData(sub.ID)
// 		subscriberData[i] = types.Subscriber{
// 			ID:              sub.ID,
// 			Username:        sub.Username,
// 			AvatarURL:       sub.GetAvatarUrl(h.cfg.CdnPublicUrl),
// 			IsStreamer:      isStreamer,
// 			Stream:          streamData,
// 			SubscriberCount: sub.SubscriberCount,
// 			IsSubscribed:    mutualSubMap[sub.ID], // Set based on mutual subscription check
// 		}
// 	}

// 	// Calculate pagination metadata
// 	totalPages := int(math.Ceil(float64(totalCount) / float64(pageSize)))
// 	if totalPages < 1 {
// 		totalPages = 1
// 	}

// 	return c.JSON(types.SubscriberListResponse{
// 		Status: "success",
// 		Data:   subscriberData,
// 		Pagination: types.PaginationResponse{
// 			CurrentPage:  page,
// 			PageSize:     pageSize,
// 			TotalPages:   totalPages,
// 			TotalRecords: totalCount,
// 		},
// 	})
// }
