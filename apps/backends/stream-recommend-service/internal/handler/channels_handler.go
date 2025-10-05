package handler

import (
	"math"
	"sort"
	"strings"

	"github.com/Capstane/authlib/utilx"
	"github.com/Capstane/stream-recommend-service/internal/model"
	"github.com/Capstane/stream-recommend-service/internal/service"
	"github.com/Capstane/stream-recommend-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"github.com/rs/zerolog/log"
)

// GetChannelsByIds godoc
// @Summary Get multiple channels
// @Description Returns channel information for given channel IDs
// @Tags channels
// @Accept json
// @Produce json
// @Param request body types.ChannelIdsRequest true "Channel IDs"
// @Success 200 {object} types.ChannelsResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /channels/batch [post]
func (h *Handler) GetChannelsByIds(c *fiber.Ctx) error {

	authenticatedUserId := h.getAuthenticatedUserId(c)

	var request types.ChannelIdsRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid request body",
		})
	}

	// Parse all valid UUIDs first
	var channelIds []uuid.UUID
	for _, id := range request.ChannelIds {
		if channelId, err := uuid.Parse(id); err == nil {
			channelIds = append(channelIds, channelId)
		}
	}

	// Get all users in a single query with selected fields
	var users []model.User
	if err := h.db.Select("id, username, description, avatar_url, cover_url").
		Where("id IN ? AND roles LIKE ?", channelIds, "%\"streamer\"%").
		Find(&users).Error; err != nil {
		return c.Status(500).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch channels",
			Error:   err.Error(),
		})
	}

	// Get all subscriber counts in a single query
	type SubCount struct {
		ChannelID uuid.UUID `gorm:"column:channel_id"`
		Count     int64     `gorm:"column:count"`
	}
	var subCounts []SubCount
	if err := h.db.Model(&model.Subscription{}).
		Select("channel_id, count(*) as count").
		Where("channel_id IN ?", channelIds).
		Group("channel_id").
		Find(&subCounts).Error; err != nil {
		return c.Status(500).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch subscriber counts",
			Error:   err.Error(),
		})
	}

	// Create a map for faster subscriber count lookups
	countMap := make(map[uuid.UUID]int64, len(subCounts))
	for _, sc := range subCounts {
		countMap[sc.ChannelID] = sc.Count
	}

	// Build response
	channels := make([]types.Channel, len(users))
	subscribedFlags := h.isSubscribedOnChannels(authenticatedUserId, utilx.Mapping(users, func(user model.User) uuid.UUID {
		return user.ID
	}))

	for i, user := range users {

		var subscribed *bool = nil
		if authenticatedUserId != nil {
			_, ok := subscribedFlags[user.ID]
			subscribed = &ok
		}

		channels[i] = types.Channel{
			ID:              user.ID,
			Username:        user.Username,
			Description:     user.Description,
			AvatarURL:       user.GetAvatarUrl(h.cfg.CdnPublicUrl),
			CoverURL:        user.GetCoverUrl(h.cfg.CdnPublicUrl),
			Subscribed:      subscribed,
			SubscriberCount: countMap[user.ID],
			Stream:          h.streamService.GetStreamData(user.ID),
		}
	}

	return c.JSON(types.ChannelsResponse{
		Status: "success",
		Data:   channels,
	})
}

// GetChannelById godoc
// @Summary Get channel by ID or username
// @Description Returns single channel information with subscriber count. Channel can be looked up by either ID or username.
// @Tags channels
// @Accept json
// @Produce json
// @Param id path string true "Channel ID or username"
// @Success 200 {object} types.ChannelResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 404 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /channels/{id} [get]
func (h *Handler) GetChannelById(c *fiber.Ctx) error {

	authenticatedUserId := h.getAuthenticatedUserId(c)

	channelId := c.Params("id")
	var user model.User

	// Try to parse as UUID first
	channelUUID, err := uuid.Parse(channelId)
	if err == nil {
		// Look up by ID
		if err := h.db.Where("id = ? AND roles LIKE ?", channelUUID, "%\"streamer\"%").First(&user).Error; err != nil {
			return c.Status(404).JSON(types.FailureResponse{
				Status:  "error",
				Message: "Channel not found",
			})
		}
	} else {
		// Look up by username
		if err := h.db.Where("username = ? AND roles LIKE ?", channelId, "%\"streamer\"%").First(&user).Error; err != nil {
			return c.Status(404).JSON(types.FailureResponse{
				Status:  "error",
				Message: "Channel not found",
			})
		}
	}

	var subscription model.Subscription
	count, _ := subscription.GetSubscriberCount(h.db, user.ID)

	var subscribed *bool = h.isSubscribed(authenticatedUserId, user.ID)

	return c.JSON(types.ChannelResponse{
		Status: "success",
		Data: types.Channel{
			ID:              user.ID,
			Username:        user.Username,
			Description:     user.Description,
			AvatarURL:       user.GetAvatarUrl(h.cfg.CdnPublicUrl),
			CoverURL:        user.GetCoverUrl(h.cfg.CdnPublicUrl),
			DonationURL:     user.DonationURL,
			Subscribed:      subscribed,
			SubscriberCount: count,
			Stream:          h.streamService.GetStreamData(user.ID),
		},
	})
}

// GetAllChannels godoc
// @Summary Get all streamer channels
// @Description Returns paginated list of all streamer channels with subscriber counts
// @Tags channels
// @Accept json
// @Produce json
// @Param category query string false "Category name"
// @Param tag query string false "Tag name"
// @Param page query int false "Page number (default: 1, min: 1)"
// @Param page_size query int false "Number of items per page (default: 10, max: 100)"
// @Param sort_type query string false "Sort type: normal or recommended (default: normal)"
// @Success 200 {object} types.ChannelsResponse "Success response with pagination"
// @Failure 400 {object} types.FailureResponse "Invalid pagination parameters"
// @Failure 500 {object} types.FailureErrorResponse "Server error"
// @Router /channels [get]
func (h *Handler) GetAllChannels(c *fiber.Ctx) error {
	authenticatedUserId := h.getAuthenticatedUserId(c)

	request := types.GetAllChannelsRequest{
		Category: "",
		Tag:      "",
		PaginationRequest: types.PaginationRequest{
			Page:     1,
			PageSize: 10,
			SortType: "normal",
		},
	}
	if err := c.QueryParser(&request); err != nil {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid pagination parameters",
		})
	}

	// Validate pagination
	if request.Page < 1 {
		request.Page = 1
	}
	if request.PageSize < 1 || request.PageSize > 100 {
		request.PageSize = 10
	}
	if request.SortType != "normal" && request.SortType != "recommended" {
		request.SortType = "normal"
	}

	// Получаем онлайн-данные, нужны для фильтрации
	onlineChannels := h.streamService.GetOnlineChannels()
	onlineStreamMap := make(map[uuid.UUID]*types.StreamData)
	for _, streamInfo := range onlineChannels {
		fullData := h.streamService.GetStreamData(streamInfo.UserID)
		if fullData != nil {
			onlineStreamMap[streamInfo.UserID] = fullData
		}
	}

	var users []model.User
	var totalCount int64
	var channelIds []uuid.UUID

	if request.SortType == "recommended" {
		// Режим "recommended": только онлайн-каналы, сортированные по зрителям

		// Применяем фильтрацию к onlineChannels
		filteredOnline := make([]service.StreamInfo, 0)
		for _, streamInfo := range onlineChannels {
			streamData, ok := onlineStreamMap[streamInfo.UserID]
			if !ok {
				continue
			}

			// Фильтр по категории
			if request.Category != "" {
				if !strings.Contains(strings.ToLower(streamData.StreamCategory), strings.ToLower(request.Category)) {
					continue
				}
			}

			// Фильтр по тегу
			if request.Tag != "" {
				found := false
				for _, tag := range streamData.StreamTags {
					if strings.Contains(strings.ToLower(tag), strings.ToLower(request.Tag)) {
						found = true
						break
					}
				}
				if !found {
					continue
				}
			}

			filteredOnline = append(filteredOnline, streamInfo)
		}

		// Пагинация
		offset := (request.Page - 1) * request.PageSize
		start := offset
		end := start + request.PageSize
		if start >= len(filteredOnline) {
			start = len(filteredOnline)
		}
		if end > len(filteredOnline) {
			end = len(filteredOnline)
		}

		totalCount = int64(len(filteredOnline))

		// Извлекаем ID для загрузки из БД
		channelIds = make([]uuid.UUID, 0, end-start)
		for i := start; i < end; i++ {
			channelIds = append(channelIds, filteredOnline[i].UserID)
		}

		// Загружаем пользователей
		if len(channelIds) > 0 {
			if err := h.db.Where("id IN ?", channelIds).Find(&users).Error; err != nil {
				return c.Status(500).JSON(types.FailureErrorResponse{
					Status:  "error",
					Message: "Failed to fetch channels",
					Error:   err.Error(),
				})
			}

			// Сортируем по порядку filteredOnline
			userMap := make(map[uuid.UUID]model.User)
			for _, u := range users {
				userMap[u.ID] = u
			}
			sortedUsers := make([]model.User, 0, len(channelIds))
			for _, ch := range filteredOnline[start:end] {
				if u, ok := userMap[ch.UserID]; ok {
					sortedUsers = append(sortedUsers, u)
				}
			}
			users = sortedUsers
		}

	} else {
		// Режим "normal": все стримеры из БД с пагинацией

		if err := h.db.Model(&model.User{}).
			Where("roles LIKE ?", "%\"streamer\"%").
			Count(&totalCount).Error; err != nil {
			return c.Status(500).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to count channels",
				Error:   err.Error(),
			})
		}

		if err := h.db.Where("roles LIKE ?", "%\"streamer\"%").
			Offset((request.Page - 1) * request.PageSize).
			Limit(request.PageSize).
			Find(&users).Error; err != nil {
			return c.Status(500).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch channels",
				Error:   err.Error(),
			})
		}

		// Фильтрация по category/tag — только для онлайн-каналов
		filteredUsers := make([]model.User, 0)
		for _, user := range users {
			streamData, isOnline := onlineStreamMap[user.ID]

			if request.Category != "" {
				if !isOnline || !strings.Contains(strings.ToLower(streamData.StreamCategory), strings.ToLower(request.Category)) {
					continue
				}
			}

			if request.Tag != "" {
				if !isOnline {
					continue
				}
				found := false
				for _, tag := range streamData.StreamTags {
					if strings.Contains(strings.ToLower(tag), strings.ToLower(request.Tag)) {
						found = true
						break
					}
				}
				if !found {
					continue
				}
			}

			filteredUsers = append(filteredUsers, user)
		}

		users = filteredUsers
		channelIds = utilx.Mapping(users, func(u model.User) uuid.UUID { return u.ID })
	}

	type SubCount struct {
		ChannelID uuid.UUID `gorm:"column:channel_id"`
		Count     int64     `gorm:"column:count"`
	}
	var subCounts []SubCount
	if len(channelIds) > 0 {
		if err := h.db.Model(&model.Subscription{}).
			Select("channel_id, count(*) as count").
			Where("channel_id IN ?", channelIds).
			Group("channel_id").
			Find(&subCounts).Error; err != nil {
			return c.Status(500).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch subscriber counts",
				Error:   err.Error(),
			})
		}
	}

	countMap := make(map[uuid.UUID]int64)
	for _, sc := range subCounts {
		countMap[sc.ChannelID] = sc.Count
	}

	subscribedFlags := h.isSubscribedOnChannels(authenticatedUserId, utilx.Mapping(users, func(u model.User) uuid.UUID {
		return u.ID
	}))

	result := make([]types.Channel, len(users))
	for i, user := range users {
		var subscribed *bool
		if authenticatedUserId != nil {
			v := subscribedFlags[user.ID]
			subscribed = &v
		}

		streamData := onlineStreamMap[user.ID]

		result[i] = types.Channel{
			ID:              user.ID,
			Username:        user.Username,
			Description:     user.Description,
			AvatarURL:       user.GetAvatarUrl(h.cfg.CdnPublicUrl),
			CoverURL:        user.GetCoverUrl(h.cfg.CdnPublicUrl),
			Subscribed:      subscribed,
			SubscriberCount: countMap[user.ID],
			Stream:          streamData,
		}
	}

	totalPages := int(math.Ceil(float64(totalCount) / float64(request.PageSize)))

	return c.JSON(types.ChannelsResponse{
		Status: "success",
		Data:   result,
		Pagination: types.PaginationResponse{
			CurrentPage:  request.Page,
			PageSize:     request.PageSize,
			TotalPages:   totalPages,
			TotalRecords: totalCount,
		},
	})
}

// getChannelsSearch godoc
// @Summary Search streamer channels
// @Description Searches for live streamer channels by substring in category, tag, stream name, or username. Returns up to 10 best matches.
// @Tags channels
// @Accept json
// @Produce json
// @Param q query string true "Search query (by category, tag, stream name, or username)"
// @Success 200 {object} types.SearchChannelsResponse "List of matching channels with match type"
// @Failure 400 {object} types.FailureResponse "Invalid request or empty query"
// @Failure 500 {object} types.FailureErrorResponse "Server error"
// @Router /channels/search [get]
func (h *Handler) getChannelsSearch(c *fiber.Ctx) error {
	query := c.Query("q")
	if query == "" {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Search query 'q' is required",
		})
	}

	log.Debug().Msgf("[getChannelsSearch] Called with query: '%s'", query)

	queryLower := strings.ToLower(strings.TrimSpace(query))

	// Получаем все онлайн-каналы
	onlineChannels := h.streamService.GetOnlineChannels()

	// Получаем полные данные стримов
	onlineStreamMap := make(map[uuid.UUID]*types.StreamData)
	for _, streamInfo := range onlineChannels {
		fullData := h.streamService.GetStreamData(streamInfo.UserID)
		if fullData != nil {
			onlineStreamMap[streamInfo.UserID] = fullData
		}
	}

	// Получаем пользователей (для username, avatar и т.д.)
	var userIds []uuid.UUID
	for userID := range onlineStreamMap {
		userIds = append(userIds, userID)
	}

	var users []model.User
	if len(userIds) > 0 {
		if err := h.db.Where("id IN ?", userIds).Find(&users).Error; err != nil {
			return c.Status(500).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch user data",
				Error:   err.Error(),
			})
		}
	}

	userMap := make(map[uuid.UUID]model.User)
	for _, u := range users {
		userMap[u.ID] = u
	}

	// Подсчёт подписчиков
	type SubCount struct {
		ChannelID uuid.UUID `gorm:"column:channel_id"`
		Count     int64     `gorm:"column:count"`
	}
	var subCounts []SubCount
	if len(userIds) > 0 {
		if err := h.db.Model(&model.Subscription{}).
			Select("channel_id, count(*) as count").
			Where("channel_id IN ?", userIds).
			Group("channel_id").
			Find(&subCounts).Error; err != nil {
			return c.Status(500).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch subscriber counts",
				Error:   err.Error(),
			})
		}
	}

	countMap := make(map[uuid.UUID]int64)
	for _, sc := range subCounts {
		countMap[sc.ChannelID] = sc.Count
	}

	// Поиск и ранжирование
	type match struct {
		user      model.User
		stream    *types.StreamData
		matchedOn string
		score     int // чем выше — тем лучше совпадение
	}

	var matches []match

	for userID, stream := range onlineStreamMap {
		user, ok := userMap[userID]
		if !ok {
			continue
		}

		var matchedOn string
		var score int

		// 1. По категории
		if stream.StreamCategory != "" && strings.Contains(strings.ToLower(stream.StreamCategory), queryLower) {
			matchedOn = "category"
			pos := strings.Index(strings.ToLower(stream.StreamCategory), queryLower)
			score = 100 - pos - len(query) // простой скор
		}

		// 2. По тегам
		if matchedOn == "" {
			for _, tag := range stream.StreamTags {
				if strings.Contains(strings.ToLower(tag), queryLower) {
					matchedOn = "tag"
					pos := strings.Index(strings.ToLower(tag), queryLower)
					score = 90 - pos
					break
				}
			}
		}

		// 3. По названию стрима
		if matchedOn == "" && stream.StreamName != "" && strings.Contains(strings.ToLower(stream.StreamName), queryLower) {
			matchedOn = "stream_name"
			pos := strings.Index(strings.ToLower(stream.StreamName), queryLower)
			score = 95 - pos
		}

		// 4. По имени автора
		if matchedOn == "" && strings.Contains(strings.ToLower(user.Username), queryLower) {
			matchedOn = "username"
			pos := strings.Index(strings.ToLower(user.Username), queryLower)
			score = 100 - pos
		}

		if matchedOn != "" {
			matches = append(matches, match{
				user:      user,
				stream:    stream,
				matchedOn: matchedOn,
				score:     score,
			})
		}
	}

	// Сортировка: по score (самые релевантные — первыми)
	sort.Slice(matches, func(i, j int) bool {
		return matches[i].score > matches[j].score
	})

	// Ограничиваем 10 результатами
	if len(matches) > 10 {
		matches = matches[:10]
	}

	// После цикла с matches — собираем channelIds
	var channelIds []uuid.UUID
	for _, m := range matches {
		channelIds = append(channelIds, m.user.ID)
	}

	// Один запрос на проверку подписок
	authenticatedUserId := h.getAuthenticatedUserId(c)
	subscribedFlags := h.isSubscribedOnChannels(authenticatedUserId, channelIds)

	// Формируем ответ
	results := make([]types.SearchResult, len(matches))
	for i, m := range matches {
		var subscribed *bool
		if authenticatedUserId != nil {
			isSub := subscribedFlags[m.user.ID]
			subscribed = &isSub
		}

		results[i] = types.SearchResult{
			Channel: types.Channel{
				ID:              m.user.ID,
				Username:        m.user.Username,
				Description:     m.user.Description,
				AvatarURL:       m.user.GetAvatarUrl(h.cfg.CdnPublicUrl),
				CoverURL:        m.user.GetCoverUrl(h.cfg.CdnPublicUrl),
				Subscribed:      subscribed,
				SubscriberCount: countMap[m.user.ID],
				Stream:          m.stream,
			},
			MatchedOn: m.matchedOn,
			Score:     m.score,
		}
	}

	return c.JSON(types.SearchChannelsResponse{
		Status: "success",
		Data:   results,
	})
}
