package handler

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"

	"github.com/Capstane/AXA-socialweb-profile/internal/model"
	"github.com/Capstane/AXA-socialweb-profile/internal/types"
	"github.com/Capstane/authlib/typex"
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
func (h *Handler) myProfile(c *fiber.Ctx) error {

	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	var userProfile model.UserProfile
	var notificationSettings *types.ProfileNotificationSettings = nil
	tx := h.db.Where("id = ?", userPtr.ID).First(&userProfile)
	if tx.Error == nil {
		notificationSettings = &types.ProfileNotificationSettings{
			EnableNotifications:       &userProfile.EnableNotifications,
			NotificationSound:         &userProfile.NotificationSound,
			DesktopNotifications:      &userProfile.DesktopNotifications,
			SuspiciousAttemptsToLogon: &userProfile.SuspiciousAttemptsToLogon,

			WhenSomeoneFollowsYouEmail:                 &userProfile.WhenSomeoneFollowsYouEmail,
			WhenSomeoneFollowsYouWs:                    &userProfile.WhenSomeoneFollowsYouWs,
			WhenSomeoneMentionsYouInIdeaCommentsWs:     &userProfile.WhenSomeoneFollowsYouWs,
			WhenSomeoneMentionsYouWhileYouOfflineEmail: &userProfile.WhenSomeoneMentionsYouWhileYouOfflineEmail,
			WhenSomeoneMentionsYouWhileYouOfflineWs:    &userProfile.WhenSomeoneMentionsYouWhileYouOfflineWs,

			WhenSomeoneCommentsYouIdeaEmail: &userProfile.WhenSomeoneCommentsYouIdeaEmail,
			WhenSomeoneCommentsYouIdeaWs:    &userProfile.WhenSomeoneCommentsYouIdeaWs,
			WhenSomeoneLikesYouIdeaEmail:    &userProfile.WhenSomeoneLikesYouIdeaEmail,
			WhenSomeoneLikesYouIdeaWs:       &userProfile.WhenSomeoneLikesYouIdeaWs,

			WhenTheyPublishNewIdeaEmail:    &userProfile.WhenTheyPublishNewIdeaEmail,
			WhenTheyPublishNewIdeaWs:       &userProfile.WhenTheyPublishNewIdeaWs,
			WhenTheyPublishNewOpinionEmail: &userProfile.WhenTheyPublishNewOpinionEmail,
			WhenTheyPublishNewOpinionWs:    &userProfile.WhenTheyPublishNewOpinionWs,

			WhenIdeaUpdateEmail: &userProfile.WhenIdeaUpdateEmail,
			WhenIdeaUpdateWs:    &userProfile.WhenIdeaUpdateWs,

			WhenScriptUpdateEmail: &userProfile.WhenScriptUpdateEmail,
			WhenScriptUpdateWs:    &userProfile.WhenScriptUpdateWs,

			WhenSomeoneMentionsYouInOpinionEmail:  &userProfile.WhenSomeoneMentionsYouInOpinionEmail,
			WhenSomeoneMentionsYouInOpinionWs:     &userProfile.WhenSomeoneMentionsYouInOpinionWs,
			WhenSomeoneMentionsYouInIdeaCommentWs: &userProfile.WhenSomeoneMentionsYouInIdeaCommentWs,
		}
	}

	return c.Status(fiber.StatusOK).JSON(types.Profile{
		ID:                   userPtr.ID.String(),
		Username:             userPtr.Username,
		Email:                userPtr.Email,
		EmailConfirmed:       userPtr.EmailConfirmed,
		Description:          userPtr.Description,
		AvatarURL:            userPtr.GetAvatarUrl(h.cfg.CdnPublicUrl),
		CoverURL:             userPtr.GetCoverUrl(h.cfg.CdnPublicUrl),
		DonationURL:          userPtr.DonationURL,
		Roles:                userPtr.Roles,
		NotificationSettings: notificationSettings,
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
	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	var (
		userProfile          model.UserProfile
		update               types.ProfileUpdateRequest
		notificationSettings *types.ProfileNotificationSettings = nil
	)

	if err := c.BodyParser(&update); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}
	if update.Username != "" && update.Username != userPtr.Username {
		var existingUser model.User
		if err := h.db.Where("username = ? AND id != ?", update.Username, userPtr.ID).First(&existingUser).Error; err == nil {
			return c.Status(fiber.StatusConflict).JSON(types.FailureResponse{
				Status:  "error",
				Message: "Username already taken",
			})
		}
	}

	if c.Method() == "PUT" {
		userPtr.Username = update.Username
		userPtr.Description = update.Description
	} else {
		if update.Username != "" {
			userPtr.Username = update.Username
		}
		if update.Description != "" {
			userPtr.Description = update.Description
		}
		if update.DonationURL != "" {
			userPtr.DonationURL = update.DonationURL
		}
		if update.NotificationSettings != nil {
			tx := h.db.Where("id = ?", userPtr.ID).First(&userProfile)
			if err := tx.Error; err != nil {
				log.Warn().Msgf("UserProfile doesn't exists for user %v, so will create new", userPtr.ID)
				userProfile.ID = userPtr.ID
			}
			if update.NotificationSettings.EnableNotifications != nil {
				userProfile.EnableNotifications = *update.NotificationSettings.EnableNotifications
			}

			if update.NotificationSettings.NotificationSound != nil {
				userProfile.NotificationSound = *update.NotificationSettings.NotificationSound
			}
			if update.NotificationSettings.DesktopNotifications != nil {
				userProfile.DesktopNotifications = *update.NotificationSettings.DesktopNotifications
			}
			if update.NotificationSettings.SuspiciousAttemptsToLogon != nil {
				userProfile.SuspiciousAttemptsToLogon = *update.NotificationSettings.SuspiciousAttemptsToLogon
			}

			if update.NotificationSettings.WhenSomeoneFollowsYouEmail != nil {
				userProfile.WhenSomeoneFollowsYouEmail = *update.NotificationSettings.WhenSomeoneFollowsYouEmail
			}
			if update.NotificationSettings.WhenSomeoneFollowsYouWs != nil {
				userProfile.WhenSomeoneFollowsYouWs = *update.NotificationSettings.WhenSomeoneFollowsYouWs
			}
			if update.NotificationSettings.WhenSomeoneMentionsYouInIdeaCommentsWs != nil {
				userProfile.WhenSomeoneMentionsYouInIdeaCommentsWs = *update.NotificationSettings.WhenSomeoneMentionsYouInIdeaCommentsWs
			}
			if update.NotificationSettings.WhenSomeoneMentionsYouWhileYouOfflineEmail != nil {
				userProfile.WhenSomeoneMentionsYouWhileYouOfflineEmail = *update.NotificationSettings.WhenSomeoneMentionsYouWhileYouOfflineEmail
			}
			if update.NotificationSettings.WhenSomeoneMentionsYouWhileYouOfflineWs != nil {
				userProfile.WhenSomeoneMentionsYouWhileYouOfflineWs = *update.NotificationSettings.WhenSomeoneMentionsYouWhileYouOfflineWs
			}

			if update.NotificationSettings.WhenSomeoneCommentsYouIdeaEmail != nil {
				userProfile.WhenSomeoneCommentsYouIdeaEmail = *update.NotificationSettings.WhenSomeoneCommentsYouIdeaEmail
			}
			if update.NotificationSettings.WhenSomeoneCommentsYouIdeaWs != nil {
				userProfile.WhenSomeoneCommentsYouIdeaWs = *update.NotificationSettings.WhenSomeoneCommentsYouIdeaWs
			}
			if update.NotificationSettings.WhenSomeoneLikesYouIdeaEmail != nil {
				userProfile.WhenSomeoneLikesYouIdeaEmail = *update.NotificationSettings.WhenSomeoneLikesYouIdeaEmail
			}
			if update.NotificationSettings.WhenSomeoneLikesYouIdeaWs != nil {
				userProfile.WhenSomeoneLikesYouIdeaWs = *update.NotificationSettings.WhenSomeoneLikesYouIdeaWs
			}

			if update.NotificationSettings.WhenTheyPublishNewIdeaEmail != nil {
				userProfile.WhenTheyPublishNewIdeaEmail = *update.NotificationSettings.WhenTheyPublishNewIdeaEmail
			}
			if update.NotificationSettings.WhenTheyPublishNewIdeaWs != nil {
				userProfile.WhenTheyPublishNewIdeaWs = *update.NotificationSettings.WhenTheyPublishNewIdeaWs
			}
			if update.NotificationSettings.WhenTheyPublishNewOpinionEmail != nil {
				userProfile.WhenTheyPublishNewOpinionEmail = *update.NotificationSettings.WhenTheyPublishNewOpinionEmail
			}
			if update.NotificationSettings.WhenTheyPublishNewOpinionWs != nil {
				userProfile.WhenTheyPublishNewOpinionWs = *update.NotificationSettings.WhenTheyPublishNewOpinionWs
			}

			if update.NotificationSettings.WhenIdeaUpdateEmail != nil {
				userProfile.WhenIdeaUpdateEmail = *update.NotificationSettings.WhenIdeaUpdateEmail
			}
			if update.NotificationSettings.WhenIdeaUpdateWs != nil {
				userProfile.WhenIdeaUpdateWs = *update.NotificationSettings.WhenIdeaUpdateWs
			}

			if update.NotificationSettings.WhenScriptUpdateEmail != nil {
				userProfile.WhenScriptUpdateEmail = *update.NotificationSettings.WhenScriptUpdateEmail
			}
			if update.NotificationSettings.WhenScriptUpdateWs != nil {
				userProfile.WhenScriptUpdateWs = *update.NotificationSettings.WhenScriptUpdateWs
			}

			if update.NotificationSettings.WhenSomeoneMentionsYouInOpinionEmail != nil {
				userProfile.WhenSomeoneMentionsYouInOpinionEmail = *update.NotificationSettings.WhenSomeoneMentionsYouInOpinionEmail
			}
			if update.NotificationSettings.WhenSomeoneMentionsYouInOpinionWs != nil {
				userProfile.WhenSomeoneMentionsYouInOpinionWs = *update.NotificationSettings.WhenSomeoneMentionsYouInOpinionWs
			}
			if update.NotificationSettings.WhenSomeoneMentionsYouInIdeaCommentWs != nil {
				userProfile.WhenSomeoneMentionsYouInIdeaCommentWs = *update.NotificationSettings.WhenSomeoneMentionsYouInIdeaCommentWs
			}

			tx = h.db.Save(&userProfile)
			if err := tx.Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
					Status:  "error",
					Message: "Internal Server Error",
					Error:   err.Error(),
				})
			}
			notificationSettings = update.NotificationSettings
		}
	}

	tx := h.db.Save(&userPtr)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal Server Error",
			Error:   err.Error(),
		})
	}

	if h.cfg.ChatServiceApiUrl != "" {
		h.syncChatForUser(userPtr)
	}

	return c.Status(fiber.StatusOK).JSON(types.Profile{
		ID:                   userPtr.ID.String(),
		Username:             userPtr.Username,
		Email:                userPtr.Email,
		Description:          userPtr.Description,
		AvatarURL:            userPtr.AvatarURL,
		CoverURL:             userPtr.CoverURL,
		DonationURL:          userPtr.DonationURL,
		Roles:                userPtr.Roles,
		NotificationSettings: notificationSettings,
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

	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
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

	userPtr.AvatarURL = fmt.Sprintf("/%s/%s", info.Bucket, info.Key)
	tx := h.db.Model(&userPtr).Where("id = ?", userPtr.ID).Update("AvatarURL", userPtr.AvatarURL)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}
	log.Info().Msgf("Successfully uploaded avatar %s of size %d\n", info.Key, info.Size)

	if h.cfg.ChatServiceApiUrl != "" {
		h.syncChatForUser(userPtr)
	}

	return c.Status(fiber.StatusOK).JSON(types.FileUploadResponse{
		Url: userPtr.GetAvatarUrl(h.cfg.CdnPublicUrl),
	})
}

// Chat profile sync
// @Summary Synchronization with chat service
// @Description Synchronization with chat service
// @Tags profile
// @Accept json
// @Produce json
// @Success 200 {object} string
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /profile/chat-sync [put]
func (h *Handler) chatSync(c *fiber.Ctx) error {
	if h.cfg.ChatServiceApiUrl == "" {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "There is endpoint disabled when environment variable: CHAT_SERVICE_API_URL is empty",
		})
	}

	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	var users []model.User
	tx := h.db.Find(&users)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}
	errors := make([]error, 0, 10)
	for _, user := range users {
		err := h.syncChatForUser(&user)
		if err != nil {
			errors = append(errors, err)
		}
	}
	if len(errors) > 0 {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   fmt.Errorf("%v", errors).Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON("ok")
}

func (h *Handler) syncChatForUser(user *model.User) error {
	fullUrl := fmt.Sprintf("%s/%s", h.cfg.ChatServiceApiUrl, "auth/as-user-control")
	data, _ := json.Marshal(types.ChatUserProfile{
		ID:             user.ID.String(),
		Email:          user.Email,
		EmailConfirmed: user.EmailConfirmed,
		Description:    user.Description,
		AvatarURL:      user.AvatarURL,
		CoverURL:       user.CoverURL,
		Username:       user.Username,
	})

	log.Info().
		Str("url", fullUrl).
		Str("method", "POST").
		Str("request_body", string(data)).
		Msg("Sending user creation request to external service")

	agent := fiber.Post(fullUrl).Body(data).ContentType("application/json")

	code, body, errs := agent.Bytes()
	if len(errs) > 0 {
		err := fmt.Errorf("errors %v", errs)
		log.Error().
			Err(err).
			Str("url", fullUrl).
			Str("method", "POST").
			Str("request_body", string(data)).
			Str("response_body", string(body)).
			Str("response_code", fmt.Sprint(code)).
			Msg("Failed to create user in external service")
		return err
	}
	if code < 200 || code > 299 {
		return fmt.Errorf("(Request %v) status: %v, message: %v", fullUrl, code, string(body))
	}
	log.Info().Msgf("synchronization (create chat user) with auth service success (input message %v)", string(body))

	return nil
}

// GetPublicProfile godoc
// @Summary Get public profile
// @Description Get public profile by username
// @Tags profile
// @Accept json
// @Produce json
// @Param username path string true "Username"
// @Success 200 {object} types.PublicProfile
// @Failure 400 {object} types.FailureErrorResponse
// @Failure 404 {object} types.FailureErrorResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /profile/{username}/public [get]
func (h *Handler) GetPublicProfile(c *fiber.Ctx) error {
	username := c.Params("username")
	if username == "" {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Username is required",
		})
	}

	var user model.User
	if err := h.db.Where("username = ?", username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "User not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error",
			Error:   err.Error(),
		})
	}

	// Получаем подписчиков
	var followers []model.User
	if err := h.db.Raw(`
		SELECT u.id, u.username, u.email, u.email_confirmed, u.description, u.avatar_url, u.cover_url, u.donation_url, u.roles, u.created_at, u.updated_at 
		FROM auth_user u
		JOIN auth_follower f ON f.follower_id = u.id
		WHERE f.followed_id = ?
	`, user.ID).Scan(&followers).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to get followers",
			Error:   err.Error(),
		})
	}

	// Получаем подписки
	var followings []model.User
	if err := h.db.Raw(`
		SELECT u.id, u.username, u.email, u.email_confirmed, u.description, u.avatar_url, u.cover_url, u.donation_url, u.roles, u.created_at, u.updated_at 
		FROM auth_user u
		JOIN auth_follower f ON f.followed_id = u.id
		WHERE f.follower_id = ?
	`, user.ID).Scan(&followings).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to get followings",
			Error:   err.Error(),
		})
	}

	// Получаем посты
	var posts []types.Post
	if err := h.db.Raw(`
		SELECT * FROM auth_post
		WHERE user_id = ?
	`, user.ID).Scan(&posts).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to get posts",
			Error:   err.Error(),
		})
	}

	// Преобразуем подписчиков в UserInfo
	followersInfo := make([]types.UserInfo, len(followers))
	for i, f := range followers {
		followersInfo[i] = types.UserInfo{
			Id:             f.ID.String(),
			Username:       f.Username,
			Email:          f.Email,
			EmailConfirmed: f.EmailConfirmed,
			Description:    f.Description,
			AvatarURL:      f.GetAvatarUrl(h.cfg.CdnPublicUrl),
			CoverURL:       f.GetCoverUrl(h.cfg.CdnPublicUrl),
			DonationURL:    f.DonationURL,
			Roles:          f.Roles,
			Created:        f.CreatedAt,
			Updated:        f.UpdatedAt,
		}
	}

	// Преобразуем подписки в UserInfo
	followingsInfo := make([]types.UserInfo, len(followings))
	for i, f := range followings {
		followingsInfo[i] = types.UserInfo{
			Id:             f.ID.String(),
			Username:       f.Username,
			Email:          f.Email,
			EmailConfirmed: f.EmailConfirmed,
			Description:    f.Description,
			AvatarURL:      f.GetAvatarUrl(h.cfg.CdnPublicUrl),
			CoverURL:       f.GetCoverUrl(h.cfg.CdnPublicUrl),
			DonationURL:    f.DonationURL,
			Roles:          f.Roles,
			Created:        f.CreatedAt,
			Updated:        f.UpdatedAt,
		}
	}

	profile := types.PublicProfile{
		ID:          user.ID.String(),
		Username:    user.Username,
		AvatarURL:   user.GetAvatarUrl(h.cfg.CdnPublicUrl),
		Bio:         struct{}{},
		MemberSince: "",
		Followers:   followersInfo,
		Followings:  followingsInfo,
		Posts:       posts,
	}

	return c.Status(fiber.StatusOK).JSON(profile)
}
