package handler

import (
	"fmt"
	"math"
	"net/url"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"github.com/Capstane/AXA-socialweb-subscriptions/internal/model"
	"github.com/Capstane/AXA-socialweb-subscriptions/internal/types"
	"github.com/Capstane/authlib/typex"
)

// GetMyFollowed godoc
// @Summary Get user's followed
// @Description Returns list of users the user is followed to
// @Tags users
// @Accept json
// @Produce json
// @Security CookieAuth
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 10, max: 100)"
// @Success 200 {object} types.FollowedResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /users/me/followed [get]
func (h *Handler) GetMyFollowed(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	// Get pagination parameters
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

	query := h.db.Table("auth_user").
		Joins("INNER JOIN subscriptions_follower s1 ON s1.followed_id = auth_user.id").
		Where("s1.follower_id = ? AND auth_user.deleted_at IS NULL", userPtr.ID)

	// Get total count for pagination
	var totalCount int64
	if err := query.
		Count(&totalCount).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to count followers",
			Error:   err.Error(),
		})
	}

	// Get paginated followers
	type UserWithCount struct {
		model.User
	}
	var followed []UserWithCount
	if err := query.Offset(offset).Limit(pageSize).Find(&followed).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch followers",
			Error:   err.Error(),
		})
	}

	// Get follower counts for each user
	followerIDs := make([]uuid.UUID, len(followed))
	for i, sub := range followed {
		followerIDs[i] = sub.ID
	}

	// Get socialing status and enrich subscriber data
	followedData := make([]types.Followed, len(followed))

	// Get mutual followers in a single query
	type MutualSub struct {
		UserID uuid.UUID `gorm:"column:follower_id"`
	}
	var mutualSubs []MutualSub
	if len(followerIDs) > 0 {
		if err := h.db.Model(&model.Follower{}).
			Select("follower_id").
			Where("followed_id = ? AND follower_id IN ?", userPtr.ID, followerIDs).
			Find(&mutualSubs).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch mutual followers",
				Error:   err.Error(),
			})
		}
	}

	// Create a map for faster mutual follower lookups
	mutualSubMap := make(map[uuid.UUID]bool, len(mutualSubs))
	for _, ms := range mutualSubs {
		mutualSubMap[ms.UserID] = true
	}

	for i, sub := range followed {
		followedData[i] = types.Followed{
			ID:        sub.ID,
			Email:     sub.Email,
			Username:  sub.Username,
			AvatarURL: sub.GetAvatarUrl(h.cfg.CdnPublicUrl),
		}
	}

	// Calculate pagination metadata
	totalPages := int(math.Ceil(float64(totalCount) / float64(pageSize)))
	if totalPages < 1 {
		totalPages = 1
	}

	return c.JSON(types.FollowedResponse{
		Status: "success",
		Data:   followedData,
		Pagination: types.PaginationResponse{
			CurrentPage:  page,
			PageSize:     pageSize,
			TotalPages:   totalPages,
			TotalRecords: totalCount,
		},
	})
}

func decodeEmail(encodedEmail string) (string, error) {
	decoded, err := url.QueryUnescape(encodedEmail)
	if err != nil {
		return "", err
	}
	return decoded, nil
}

// GetUserFollowed godoc
// @Summary Get user's followed
// @Description Returns list of users the user is followed to
// @Tags users
// @Accept json
// @Produce json
// @Security CookieAuth
// @Param id path string true "User ID"
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 10, max: 100)"
// @Success 200 {object} types.FollowedResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /users/{id}/followed [get]
func (h *Handler) GetUserFollowed(c *fiber.Ctx) error {
	userTextId := c.Params("id")
	var user model.User
	userId, err := uuid.Parse(userTextId)
	if err == nil {
		// Look up by ID
		if err := h.db.Where("id = ?", userId).First(&user).Error; err != nil {
			return c.Status(404).JSON(types.FailureResponse{
				Status:  "error",
				Message: "User not found",
			})
		}
	} else {
		decodedEmail, _ := decodeEmail(userTextId)
		if err := h.db.Where("email = ?", decodedEmail).First(&user).Error; err != nil {
			return c.Status(404).JSON(types.FailureResponse{
				Status:  "error",
				Message: "User not found",
			})
		}
		userId = user.ID
	}

	// Get pagination parameters
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

	query := h.db.Table("auth_user").
		Joins("INNER JOIN subscriptions_follower s1 ON s1.followed_id = auth_user.id").
		Where("s1.follower_id = ? AND auth_user.deleted_at IS NULL", userId)

	// Get total count for pagination
	var totalCount int64
	if err := query.
		Count(&totalCount).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to count followers",
			Error:   err.Error(),
		})
	}

	// Get paginated followers
	type UserWithCount struct {
		model.User
	}
	var followed []UserWithCount
	if err := query.Offset(offset).Limit(pageSize).Find(&followed).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch followers",
			Error:   err.Error(),
		})
	}

	// Get follower counts for each user
	followerIDs := make([]uuid.UUID, len(followed))
	for i, sub := range followed {
		followerIDs[i] = sub.ID
	}

	// Get socialing status and enrich subscriber data
	followedData := make([]types.Followed, len(followed))

	// Get mutual followers in a single query
	type MutualSub struct {
		UserID uuid.UUID `gorm:"column:follower_id"`
	}
	var mutualSubs []MutualSub
	if len(followerIDs) > 0 {
		if err := h.db.Model(&model.Follower{}).
			Select("follower_id").
			Where("followed_id = ? AND follower_id IN ?", userId, followerIDs).
			Find(&mutualSubs).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch mutual followers",
				Error:   err.Error(),
			})
		}
	}

	// Create a map for faster mutual follower lookups
	mutualSubMap := make(map[uuid.UUID]bool, len(mutualSubs))
	for _, ms := range mutualSubs {
		mutualSubMap[ms.UserID] = true
	}

	for i, sub := range followed {
		followedData[i] = types.Followed{
			ID:        sub.ID,
			Username:  sub.Username,
			Email:     sub.Email,
			AvatarURL: sub.GetAvatarUrl(h.cfg.CdnPublicUrl),
		}
	}

	// Calculate pagination metadata
	totalPages := int(math.Ceil(float64(totalCount) / float64(pageSize)))
	if totalPages < 1 {
		totalPages = 1
	}

	return c.JSON(types.FollowedResponse{
		Status: "success",
		Data:   followedData,
		Pagination: types.PaginationResponse{
			CurrentPage:  page,
			PageSize:     pageSize,
			TotalPages:   totalPages,
			TotalRecords: totalCount,
		},
	})
}

// GetUsersByIds godoc
// @Summary Get multiple users
// @Description Returns user information for given user IDs
// @Tags users
// @Accept json
// @Produce json
// @Security CookieAuth
// @Param request body types.UserIdsRequest true "User IDs"
// @Success 200 {object} types.FollowerResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /users/batch [post]
func (h *Handler) GetUsersByIds(c *fiber.Ctx) error {

	// authenticatedUserId := getAuthenticatedUserId(c.Request())
	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	authenticatedUserId := &userPtr.ID

	var request types.UserIdsRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid request body",
		})
	}

	// Parse all valid UUIDs first
	var userIds []uuid.UUID
	for _, id := range request.UserIds {
		if userId, err := uuid.Parse(id); err == nil {
			userIds = append(userIds, userId)
		}
	}

	// Get all users in a single query with selected fields
	var users []model.User
	if err := h.db.Select("id, username, description, avatar_url, cover_url").
		Where("id IN ?", userIds).
		Find(&users).Error; err != nil {
		return c.Status(500).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch users",
			Error:   err.Error(),
		})
	}

	// Get all subscriber counts in a single query
	type SubCount struct {
		UserID uuid.UUID `gorm:"column:followed_id"`
		Count  int64     `gorm:"column:count"`
	}
	var subCounts []SubCount
	if err := h.db.Model(&model.Follower{}).
		Select("followed_id, count(*) as count").
		Where("followed_id IN ?", userIds).
		Group("followed_id").
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
		countMap[sc.UserID] = sc.Count
	}

	// Build response
	Followers := make([]types.Follower, len(users))
	subscribedFlags := h.isSubscribedOnUsers(authenticatedUserId, Map(users, func(user model.User) uuid.UUID {
		return user.ID
	}))

	for i, user := range users {

		var subscribed *bool = nil
		if authenticatedUserId != nil {
			_, ok := subscribedFlags[user.ID]
			subscribed = &ok
		}

		Followers[i] = types.Follower{
			ID:            user.ID,
			Username:      user.Username,
			Description:   user.Description,
			AvatarURL:     user.GetAvatarUrl(h.cfg.CdnPublicUrl),
			CoverURL:      user.GetCoverUrl(h.cfg.CdnPublicUrl),
			Subscribed:    subscribed,
			FollowerCount: countMap[user.ID],
		}
	}

	return c.JSON(types.FollowersResponse{
		Status: "success",
		Data:   Followers,
	})
}

// GetUserById godoc
// @Summary Get user by ID or username
// @Description Returns single user information with followed count. User can be looked up by either ID or username.
// @Tags users
// @Accept json
// @Produce json
// @Security CookieAuth
// @Param id path string true "User ID or username"
// @Success 200 {object} types.GetUserByIdResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 404 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /users/{id} [get]
func (h *Handler) GetUserById(c *fiber.Ctx) error {

	claims := c.Locals("claims").(*typex.SessionClaims)
	authenticatedUserId := &claims.UserId

	userId := c.Params("id")
	var user model.User

	// Try to parse as UUID first
	userUUID, err := uuid.Parse(userId)
	if err == nil {
		// Look up by ID
		if err := h.db.Where("id = ?", userUUID).First(&user).Error; err != nil {
			return c.Status(404).JSON(types.FailureResponse{
				Status:  "error",
				Message: "User not found",
			})
		}
	} else {
		// Look up by username
		if err := h.db.Where("username = ?", userId).First(&user).Error; err != nil {
			decodedEmail, _ := decodeEmail(userId)
			if err := h.db.Where("email = ?", decodedEmail).First(&user).Error; err != nil {
				return c.Status(404).JSON(types.FailureResponse{
					Status:  "error",
					Message: "User not found",
				})
			}
		}
		userUUID = user.ID
	}

	var followerCount int64
	queryFollower := h.db.Table("auth_user").
		Select("auth_user.*, COALESCE(sub_counts.follower_count, 0) as follower_count").
		Joins("INNER JOIN subscriptions_follower s1 ON s1.follower_id = auth_user.id").
		Joins("LEFT JOIN (SELECT followed_id, COUNT(*) as follower_count FROM subscriptions_follower GROUP BY followed_id) sub_counts ON sub_counts.followed_id = auth_user.id").
		Where("s1.followed_id = ? AND auth_user.deleted_at IS NULL", userUUID)

	if err := queryFollower.Model(&model.Follower{}).Count(&followerCount).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch followers",
			Error:   err.Error(),
		})
	}

	var postCount int64
	err = h.db.Table("posts").
		Where("posts.user_id = ? AND posts.deleted_at IS NULL", userUUID).
		Count(&postCount).Error

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to count user posts",
			Error:   err.Error(),
		})
	}

	var subscription model.Follower
	count, _ := subscription.GetSubscriberCount(h.db, user.ID)

	var subscribed *bool = h.isSubscribed(authenticatedUserId, user.ID)

	return c.JSON(types.GetUserByIdResponse{
		Status: "success",
		Data: types.GetUserByIdData{
			ID:            user.ID,
			Username:      user.Username,
			Email:         user.Email,
			Description:   user.Description,
			AvatarURL:     user.GetAvatarUrl(h.cfg.CdnPublicUrl),
			CoverURL:      user.GetCoverUrl(h.cfg.CdnPublicUrl),
			DonationURL:   user.DonationURL,
			Subscribed:    subscribed,
			FollowedCount: count,
			FollowerCount: followerCount,
			PostCount:     postCount,
			CreatedAt:     user.CreatedAt,
		},
	})
}

// Follow godoc
// @Summary Follow to user
// @Description Follow authenticated user to a user
// @Tags users
// @Accept json
// @Produce json
// @Security CookieAuth
// @Param request body types.FollowRequest true "Follow Request"
// @Success 200 {object} types.SuccessResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /users/me/follow [post]
func (h *Handler) Follow(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	var followRequest types.FollowRequest
	if err := c.BodyParser(&followRequest); err != nil {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid request body",
		})
	}

	// Prevent self-subscription
	if userPtr.ID == followRequest.UserId {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Cannot subscribe to your own user",
		})
	}

	// Check if already subscribed
	var existingSub model.Follower
	if err := h.db.Where("follower_id = ? AND followed_id = ?", userPtr.ID, followRequest.UserId).First(&existingSub).Error; err == nil {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Already subscribed to this user",
		})
	}

	if h.db.Where("id = ?", followRequest.UserId).First(&model.User{}).Error != nil {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "User not found",
		})
	}

	subscription := model.Follower{
		FollowerId: userPtr.ID,
		FollowedId: followRequest.UserId,
	}

	if err := h.db.Create(&subscription).Error; err != nil {
		return c.Status(500).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to subscribe",
			Error:   err.Error(),
		})
	}

	// Send event to rabbitmq
	if userPtr.ID != followRequest.UserId {
		userFollow, _ := h.getUserById(followRequest.UserId)
		messageData := map[string]string{
			"type":              "new_subscriber",
			"user_email":        userFollow.Email,
			"message":           "You have a new subscriber",
			"target_user_name":  userPtr.Username,
			"target_user_email": userPtr.Email,
		}
		h.notifyQueue.PushMessage(followRequest.UserId, messageData, userPtr.ID)
	}

	// Update statistics
	h.socialService.OnSubscribeTo(followRequest.UserId)

	return c.JSON(types.SuccessResponse{
		Status:  "success",
		Message: "Successfully follow to user",
	})
}

// GetAllUsers godoc
// @Summary Get all social web users
// @Description Returns paginated list of all social web users with subscriber counts
// @Tags users
// @Accept json
// @Produce json
// @Security CookieAuth
// @Param page query int false "Page number (default: 1, min: 1)"
// @Param page_size query int false "Number of items per page (default: 10, max: 1000)"
// @Param sort_type query string false "Sort type: normal or recommended (default: normal)"
// @Success 200 {object} types.FollowerResponse "Success response with pagination"
// @Failure 400 {object} types.FailureResponse "Invalid pagination parameters"
// @Failure 500 {object} types.FailureErrorResponse "Server error"
// @Router /users [get]
func (h *Handler) GetAllUsers(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)
	authenticatedUserId := &claims.UserId

	pagination := types.PaginationRequest{
		Page:     1,
		PageSize: 10,
		SortType: "normal",
	}
	if err := c.QueryParser(&pagination); err != nil {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid pagination parameters",
		})
	}

	// Validate pagination
	if pagination.Page < 1 {
		pagination.Page = 1
	}
	if pagination.PageSize < 1 || pagination.PageSize > 1000 {
		pagination.PageSize = 10
	}
	if pagination.SortType != "normal" && pagination.SortType != "recommended" {
		pagination.SortType = "normal"
	}

	var users []model.User
	var top100Count int64
	offset := (pagination.Page - 1) * pagination.PageSize

	if pagination.SortType == "recommended" {
		// Get online users sorted by viewer count
		top1000Users := h.socialService.GetTop1000Users()

		// Apply pagination to the sorted online users
		start := offset
		end := start + pagination.PageSize
		if start >= len(top1000Users) {
			start = len(top1000Users)
		}
		if end > len(top1000Users) {
			end = len(top1000Users)
		}

		// Extract user IDs for the current page
		var userIds []uuid.UUID
		if start < end {
			pageUsers := top1000Users[start:end]
			userIds = make([]uuid.UUID, len(pageUsers))
			for i, ch := range pageUsers {
				userIds[i] = ch.UserID
			}
		}

		// Get total count of top users
		top100Count = int64(len(top1000Users))

		// Fetch user data for the paginated user IDs
		if len(userIds) > 0 {
			if err := h.db.Where("id IN ?", userIds).
				Find(&users).Error; err != nil {
				return c.Status(500).JSON(types.FailureErrorResponse{
					Status:  "error",
					Message: "Failed to fetch users",
					Error:   err.Error(),
				})
			}

			// Sort users to match the order of userIds
			userMap := make(map[uuid.UUID]model.User)
			for _, user := range users {
				userMap[user.ID] = user
			}
			sortedUsers := make([]model.User, 0, len(userIds))
			for _, id := range userIds {
				if user, ok := userMap[id]; ok {
					sortedUsers = append(sortedUsers, user)
				}
			}
			users = sortedUsers
		}
	} else {
		// Normal sorting - fetch all social web users with pagination
		if err := h.db.Model(&model.User{}).
			Count(&top100Count).Error; err != nil {
			return c.Status(500).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to count users",
				Error:   err.Error(),
			})
		}

		if err := h.db.Offset(offset).
			Limit(pagination.PageSize).
			Find(&users).Error; err != nil {
			return c.Status(500).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch users",
				Error:   err.Error(),
			})
		}
	}

	// Get subscriber counts for the fetched users
	var userIds []uuid.UUID
	for _, user := range users {
		userIds = append(userIds, user.ID)
	}

	type SubCount struct {
		UserID uuid.UUID `gorm:"column:followed_id"`
		Count  int64     `gorm:"column:count"`
	}
	var subCounts []SubCount
	if len(userIds) > 0 {
		if err := h.db.Model(&model.Follower{}).
			Select("followed_id, count(*) as count").
			Where("followed_id IN ?", userIds).
			Group("followed_id").
			Find(&subCounts).Error; err != nil {
			return c.Status(500).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch subscriber counts",
				Error:   err.Error(),
			})
		}
	}

	// Create a map for faster subscriber count lookups
	countMap := make(map[uuid.UUID]int64, len(subCounts))
	for _, sc := range subCounts {
		countMap[sc.UserID] = sc.Count
	}

	// Build response
	Followers := make([]types.Follower, len(users))

	subscribedFlags := h.isSubscribedOnUsers(authenticatedUserId, Map(users, func(user model.User) uuid.UUID {
		return user.ID
	}))

	for i, user := range users {
		var subscribed *bool = nil
		if authenticatedUserId != nil {
			_, ok := subscribedFlags[user.ID]
			subscribed = &ok
		}

		Followers[i] = types.Follower{
			ID:            user.ID,
			Username:      user.Username,
			Description:   user.Description,
			AvatarURL:     user.GetAvatarUrl(h.cfg.CdnPublicUrl),
			CoverURL:      user.GetCoverUrl(h.cfg.CdnPublicUrl),
			Subscribed:    subscribed,
			FollowerCount: countMap[user.ID],
		}
	}

	// Calculate pagination response
	totalPages := int(math.Ceil(float64(top100Count) / float64(pagination.PageSize)))

	return c.JSON(types.FollowersResponse{
		Status: "success",
		Data:   Followers,
		Pagination: types.PaginationResponse{
			CurrentPage:  pagination.Page,
			PageSize:     pagination.PageSize,
			TotalPages:   totalPages,
			TotalRecords: top100Count,
		},
	})
}

// Unfollow godoc
// @Summary Unfollow from user
// @Description Unfollow authenticated user from a user
// @Tags users
// @Accept json
// @Produce json
// @Security CookieAuth
// @Param request body types.UnfollowRequest true "Unfollow Request"
// @Success 200 {object} types.SuccessResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 401 {object} types.FailureResponse
// @Failure 404 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /users/me/unfollow [post]
func (h *Handler) Unfollow(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	var unfollowRequest types.UnfollowRequest
	if err := c.BodyParser(&unfollowRequest); err != nil {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid request body",
		})
	}

	// Check if the user exists
	if h.db.Where("id = ?", unfollowRequest.UserId).First(&model.User{}).Error != nil {
		return c.Status(404).JSON(types.FailureResponse{
			Status:  "error",
			Message: "User not found",
		})
	}

	// Use Unscoped() to bypass soft delete and perform hard delete
	result := h.db.Unscoped().Where("follower_id = ? AND followed_id = ?", userPtr.ID, unfollowRequest.UserId).Delete(&model.Follower{})
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
			Message: "Not subscribed to this user",
		})
	}

	// Send event to rabbitmq
	if userPtr.ID != unfollowRequest.UserId {
		userUnfollow, _ := h.getUserById(unfollowRequest.UserId)
		messageData := map[string]string{
			"type":              "unsubscribe",
			"user_email":        userUnfollow.Email,
			"message":           "unsubscribe",
			"target_user_name":  userPtr.Username,
			"target_user_email": userPtr.Email,
		}
		h.notifyQueue.PushMessage(unfollowRequest.UserId, messageData, userPtr.ID)
	}

	// Update statistics
	h.socialService.OnUnsubscribeFrom(unfollowRequest.UserId)

	return c.JSON(types.SuccessResponse{
		Status:  "success",
		Message: "Successfully unfollow from user",
	})
}

// GetUserFollowers godoc
// @Summary Get social web user followers
// @Description Returns list of users followers to the authenticated social web user's
// @Tags users
// @Accept json
// @Produce json
// @Security CookieAuth
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 10, max: 100)"
// @Param sort_by query string false "Sort field (username or subscriber_count)"
// @Param sort_dir query string false "Sort direction (asc or desc)"
// @Success 200 {object} types.FollowersListResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /users/me/followers [get]
func (h *Handler) GetUserFollowers(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	// Get pagination parameters
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

	// Get sorting parameters
	sortBy := c.Query("sort_by", "username")
	sortDir := c.Query("sort_dir", "asc")
	if sortDir != "asc" && sortDir != "desc" {
		sortDir = "asc"
	}

	// Validate sort field
	validSortFields := map[string]string{
		"username":       "auth_user.username",
		"follower_count": "follower_count",
	}
	dbSortField, ok := validSortFields[sortBy]
	if !ok {
		dbSortField = "auth_user.username"
	}

	// Base query to get followers with their subscriber counts
	query := h.db.Table("auth_user").
		Select("auth_user.*, COALESCE(sub_counts.follower_count, 0) as follower_count").
		Joins("INNER JOIN subscriptions_follower s1 ON s1.follower_id = auth_user.id").
		Joins("LEFT JOIN (SELECT followed_id, COUNT(*) as follower_count FROM subscriptions_follower GROUP BY followed_id) sub_counts ON sub_counts.followed_id = auth_user.id").
		Where("s1.followed_id = ? AND auth_user.deleted_at IS NULL", userPtr.ID)

	// Apply sorting
	if sortBy == "follower_count" {
		query = query.Order(fmt.Sprintf("follower_count %s", sortDir))
	} else {
		query = query.Order(fmt.Sprintf("%s %s", dbSortField, sortDir))
	}

	// Get total count for pagination
	var totalCount int64
	if err := query.
		Count(&totalCount).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to count followers",
			Error:   err.Error(),
		})
	}

	// Get paginated followers
	type UserWithCount struct {
		model.User
		FollowerCount int64 `gorm:"column:follower_count"`
	}
	var followers []UserWithCount
	if err := query.Offset(offset).Limit(pageSize).Find(&followers).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch followers",
			Error:   err.Error(),
		})
	}

	// Get follower counts for each user
	followerIDs := make([]uuid.UUID, len(followers))
	for i, sub := range followers {
		followerIDs[i] = sub.ID
	}

	// Get socialing status and enrich subscriber data
	followerData := make([]types.Followers, len(followers))

	// Get mutual followers in a single query
	type MutualSub struct {
		UserID uuid.UUID `gorm:"column:follower_id"`
	}
	var mutualSubs []MutualSub
	if len(followerIDs) > 0 {
		if err := h.db.Model(&model.Follower{}).
			Select("follower_id").
			Where("followed_id = ? AND follower_id IN ?", userPtr.ID, followerIDs).
			Find(&mutualSubs).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch mutual followers",
				Error:   err.Error(),
			})
		}
	}

	// Create a map for faster mutual follower lookups
	mutualSubMap := make(map[uuid.UUID]bool, len(mutualSubs))
	for _, ms := range mutualSubs {
		mutualSubMap[ms.UserID] = true
	}

	for i, sub := range followers {
		followerData[i] = types.Followers{
			ID:            sub.ID,
			Username:      sub.Username,
			Email:         sub.Email,
			AvatarURL:     sub.GetAvatarUrl(h.cfg.CdnPublicUrl),
			FollowerCount: sub.FollowerCount,
			IsSubscribed:  mutualSubMap[sub.ID], // Set based on mutual follower check
		}
	}

	// Calculate pagination metadata
	totalPages := int(math.Ceil(float64(totalCount) / float64(pageSize)))
	if totalPages < 1 {
		totalPages = 1
	}

	return c.JSON(types.FollowersListResponse{
		Status: "success",
		Data:   followerData,
		Pagination: types.PaginationResponse{
			CurrentPage:  page,
			PageSize:     pageSize,
			TotalPages:   totalPages,
			TotalRecords: totalCount,
		},
	})
}

// GetFollowersUser godoc
// @Summary Get social web user followers
// @Description Returns list of users followers to the authenticated social web user's
// @Tags users
// @Accept json
// @Produce json
// @Security CookieAuth
// @Param id path string true "User ID"
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 10, max: 100)"
// @Param sort_by query string false "Sort field (username or subscriber_count)"
// @Param sort_dir query string false "Sort direction (asc or desc)"
// @Success 200 {object} types.FollowersListResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /users/{id}/followers [get]
func (h *Handler) GetFollowersUser(c *fiber.Ctx) error {
	userTextId := c.Params("id")
	var user model.User
	userId, err := uuid.Parse(userTextId)
	if err == nil {
		// Look up by ID
		if err := h.db.Where("id = ?", userId).First(&user).Error; err != nil {
			return c.Status(404).JSON(types.FailureResponse{
				Status:  "error",
				Message: "User not found",
			})
		}
	} else {
		decodedEmail, _ := decodeEmail(userTextId)
		if err := h.db.Where("email = ?", decodedEmail).First(&user).Error; err != nil {
			return c.Status(404).JSON(types.FailureResponse{
				Status:  "error",
				Message: "User not found",
			})
		}
		userId = user.ID
	}

	// Get pagination parameters
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

	// Get sorting parameters
	sortBy := c.Query("sort_by", "username")
	sortDir := c.Query("sort_dir", "asc")
	if sortDir != "asc" && sortDir != "desc" {
		sortDir = "asc"
	}

	// Validate sort field
	validSortFields := map[string]string{
		"username":       "auth_user.username",
		"follower_count": "follower_count",
	}
	dbSortField, ok := validSortFields[sortBy]
	if !ok {
		dbSortField = "auth_user.username"
	}

	// Base query to get followers with their subscriber counts
	query := h.db.Table("auth_user").
		Select("auth_user.*, COALESCE(sub_counts.follower_count, 0) as follower_count").
		Joins("INNER JOIN subscriptions_follower s1 ON s1.follower_id = auth_user.id").
		Joins("LEFT JOIN (SELECT followed_id, COUNT(*) as follower_count FROM subscriptions_follower GROUP BY followed_id) sub_counts ON sub_counts.followed_id = auth_user.id").
		Where("s1.followed_id = ? AND auth_user.deleted_at IS NULL", userId)

	// Apply sorting
	if sortBy == "follower_count" {
		query = query.Order(fmt.Sprintf("follower_count %s", sortDir))
	} else {
		query = query.Order(fmt.Sprintf("%s %s", dbSortField, sortDir))
	}

	// Get total count for pagination
	var totalCount int64
	if err := query.
		Count(&totalCount).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to count followers",
			Error:   err.Error(),
		})
	}

	// Get paginated followers
	type UserWithCount struct {
		model.User
		FollowerCount int64 `gorm:"column:follower_count"`
	}
	var followers []UserWithCount
	if err := query.Offset(offset).Limit(pageSize).Find(&followers).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch followers",
			Error:   err.Error(),
		})
	}

	// Get follower counts for each user
	followerIDs := make([]uuid.UUID, len(followers))
	for i, sub := range followers {
		followerIDs[i] = sub.ID
	}

	// Get socialing status and enrich subscriber data
	followerData := make([]types.Followers, len(followers))

	// Get mutual followers in a single query
	type MutualSub struct {
		UserID uuid.UUID `gorm:"column:follower_id"`
	}
	var mutualSubs []MutualSub
	if len(followerIDs) > 0 {
		if err := h.db.Model(&model.Follower{}).
			Select("follower_id").
			Where("followed_id = ? AND follower_id IN ?", userId, followerIDs).
			Find(&mutualSubs).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch mutual followers",
				Error:   err.Error(),
			})
		}
	}

	// Create a map for faster mutual follower lookups
	mutualSubMap := make(map[uuid.UUID]bool, len(mutualSubs))
	for _, ms := range mutualSubs {
		mutualSubMap[ms.UserID] = true
	}

	for i, sub := range followers {
		followerData[i] = types.Followers{
			ID:            sub.ID,
			Username:      sub.Username,
			Email:         sub.Email,
			AvatarURL:     sub.GetAvatarUrl(h.cfg.CdnPublicUrl),
			FollowerCount: sub.FollowerCount,
			IsSubscribed:  mutualSubMap[sub.ID], // Set based on mutual follower check
		}
	}

	// Calculate pagination metadata
	totalPages := int(math.Ceil(float64(totalCount) / float64(pageSize)))
	if totalPages < 1 {
		totalPages = 1
	}

	return c.JSON(types.FollowersListResponse{
		Status: "success",
		Data:   followerData,
		Pagination: types.PaginationResponse{
			CurrentPage:  page,
			PageSize:     pageSize,
			TotalPages:   totalPages,
			TotalRecords: totalCount,
		},
	})
}

// getUsersByUsername Get users by username
// @Summary Get users by username
// @Description Get users by username
// @Tags users
// @Produce json
// @Security CookieAuth
// @Param q query string false "Substring"
// @Param sort_by query string false "Field for sort: username (default). Doesn't use"
// @Param page query int false "Page number (default: 1, min: 1)"
// @Param page_size query int false "Number of items per page (default: 10, max: 1000)"
// @Param sort_type query string false "Sort type: normal or recommended (default: normal)"
// @Success 200 {object} types.UsersResponse "Success response with pagination"
// @Failure 400 {object} types.FailureResponse "Invalid pagination parameters"
// @Failure 500 {object} types.FailureErrorResponse "Server error"
// @Router /users/search [get]
func (h *Handler) getUsersByUsername(c *fiber.Ctx) error {
	//sortBy := c.Query("sort_by", "username")
	q := c.Query("q", "")

	pagination := types.PaginationRequest{
		Page:     1,
		PageSize: 10,
		SortType: "normal",
	}
	if err := c.QueryParser(&pagination); err != nil {
		return c.Status(400).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid pagination parameters",
		})
	}

	if pagination.Page < 1 {
		pagination.Page = 1
	}
	if pagination.PageSize < 1 || pagination.PageSize > 1000 {
		pagination.PageSize = 10
	}
	if pagination.SortType != "normal" && pagination.SortType != "recommended" {
		pagination.SortType = "normal"
	}

	var users []model.User
	var top100Count int64
	offset := (pagination.Page - 1) * pagination.PageSize

	if pagination.SortType == "recommended" {
		top1000Users := h.socialService.GetTop1000Users()

		start := offset
		end := start + pagination.PageSize
		if start >= len(top1000Users) {
			start = len(top1000Users)
		}
		if end > len(top1000Users) {
			end = len(top1000Users)
		}

		var userIds []uuid.UUID
		if start < end {
			pageUsers := top1000Users[start:end]
			userIds = make([]uuid.UUID, len(pageUsers))
			for i, ch := range pageUsers {
				userIds[i] = ch.UserID
			}
		}

		top100Count = int64(len(top1000Users))

		if len(userIds) > 0 {
			query := h.db.Where("id IN ?", userIds)
			if q != "" {
				q = strings.TrimSpace(q)

				query = query.
					Order(fmt.Sprintf(`
						CASE 
							WHEN username ILIKE '%s' THEN 1
							WHEN username ILIKE '%s%%' THEN 2
							ELSE 3
						END,
						username ASC
					`, q, q))
			}
			if err := query.Find(&users).Error; err != nil {
				return c.Status(500).JSON(types.FailureErrorResponse{
					Status:  "error",
					Message: "Failed to fetch users",
					Error:   err.Error(),
				})
			}

			userMap := make(map[uuid.UUID]model.User)
			for _, user := range users {
				userMap[user.ID] = user
			}

			sortedUsers := make([]model.User, 0, len(userIds))
			for _, id := range userIds {
				if user, ok := userMap[id]; ok {
					sortedUsers = append(sortedUsers, user)
				}
			}
			users = sortedUsers
		}
	} else {
		query := h.db.Model(&model.User{})
		if q != "" {
			q = strings.TrimSpace(q)
			query = query.Where("username ILIKE ?", q+"%").Order("username ASC")
		}

		if err := query.Count(&top100Count).Error; err != nil {
			return c.Status(500).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to count users",
				Error:   err.Error(),
			})
		}
		if err := query.
			Offset(offset).
			Limit(pagination.PageSize).
			Find(&users).
			Error; err != nil {
			return c.Status(500).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch users",
				Error:   err.Error(),
			})
		}
	}

	var userIds []uuid.UUID
	for _, user := range users {
		userIds = append(userIds, user.ID)
	}

	Followers := make([]types.UserResponse, len(users))

	for i, user := range users {

		Followers[i] = types.UserResponse{
			ID:        user.ID,
			Username:  user.Username,
			AvatarURL: user.GetAvatarUrl(h.cfg.CdnPublicUrl),
			CoverURL:  user.GetCoverUrl(h.cfg.CdnPublicUrl),
		}
	}

	totalPages := int(math.Ceil(float64(top100Count) / float64(pagination.PageSize)))

	return c.JSON(types.UsersResponse{
		Status: "success",
		Data:   Followers,
		Pagination: types.PaginationResponse{
			CurrentPage:  pagination.Page,
			PageSize:     pagination.PageSize,
			TotalPages:   totalPages,
			TotalRecords: top100Count,
		},
	})
}
