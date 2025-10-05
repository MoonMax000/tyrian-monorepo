package admin

import (
	"context"
	"fmt"
	"math"
	"slices"
	"time"

	"github.com/Capstane/authlib/typex"
	"github.com/Capstane/go-notifylib"
	"github.com/Capstane/stream-auth-service/internal/model"
	"github.com/Capstane/stream-auth-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/rs/zerolog/log"
	"golang.org/x/crypto/bcrypt"
)

// Update user roles
// @Summary Update user roles
// @Description Update user roles
// @Tags admin
// @Accept json
// @Produce json
// @Param request body types.UpdateUserRolesRequest true "info for updating"
// @Success 200 {object} types.Profile
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /admin/users/roles [post]
func (h *AdminHandler) SetUserRoles(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)

	var req types.UpdateUserRolesRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{Status: "error", Message: "invalid body", Error: err.Error()})
	}

	profile, err := h.SetUserRolesCore(c.Context(), req, claims.UserId)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{Status: "error", Message: "Internal server error", Error: err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(profile)
}

func (h *AdminHandler) SetUserRolesCore(ctx context.Context, req types.UpdateUserRolesRequest, actorUserID uuid.UUID) (types.Profile, error) {
	var user model.User

	uid, err := uuid.Parse(req.UserId)
	if err != nil {
		return types.Profile{}, fmt.Errorf("parse user id failed: %w", err)
	}

	if err := h.db.Where("id = ?", uid).First(&user).Error; err != nil {
		return types.Profile{}, fmt.Errorf("user not found: %w", err)
	}

	user.Roles = req.Roles
	if err := h.db.Save(&user).Error; err != nil {
		return types.Profile{}, fmt.Errorf("save user failed: %w", err)
	}

	if err := h.approveAllRoleRequestsForUser(uid); err != nil {
		log.Warn().Msgf("Warning: failed to auto-approve role requests for user %s: %v", uid, err)
	}

	h.userInfoCacheClient.Invalidate(user.Email)

	messageUpdateRole := map[string]any{
		"type": "update_role",
		"data": req.Roles,
	}
	notifylib.PushMessage("system", req.UserId, messageUpdateRole, actorUserID.String())

	return types.Profile{
		ID:          user.ID.String(),
		Username:    user.Username,
		Email:       user.Email,
		Description: user.Description,
		AvatarURL:   user.AvatarURL,
		CoverURL:    user.CoverURL,
		DonationURL: user.DonationURL,
		Roles:       user.Roles,
	}, nil
}

func (h *AdminHandler) CopySetUserRolesCore(ctx context.Context, req types.UpdateUserRolesRequest, actorUserID uuid.UUID) (types.Profile, error) {
	var user model.User

	// uid, err := uuid.Parse(req.UserId)
	// if err != nil {
	// 	return types.Profile{}, fmt.Errorf("parse user id failed: %w", err)
	// }

	if err := h.db.Where("email = ?", req.UserId).First(&user).Error; err != nil {
		return types.Profile{}, fmt.Errorf("user not found: %w", err)
	}

	user.Roles = req.Roles
	if err := h.db.Save(&user).Error; err != nil {
		return types.Profile{}, fmt.Errorf("save user failed: %w", err)
	}

	if err := h.copyApproveAllRoleRequestsForUser(req.UserId); err != nil {
		log.Warn().Msgf("Warning: failed to auto-approve role requests for user %s: %v", req.UserId, err)
	}

	h.userInfoCacheClient.Invalidate(user.Email)

	// messageUpdateRole := map[string]any{
	// 	"type": "update_role",
	// 	"data": req.Roles,
	// }
	// notifylib.PushMessage("system", req.UserId, messageUpdateRole, actorUserID.String())

	return types.Profile{
		ID:          user.ID.String(),
		Username:    user.Username,
		Email:       user.Email,
		Description: user.Description,
		AvatarURL:   user.AvatarURL,
		CoverURL:    user.CoverURL,
		DonationURL: user.DonationURL,
		Roles:       user.Roles,
	}, nil
}

func (h *AdminHandler) copyApproveAllRoleRequestsForUser(mail string) error {
	result := h.db.
		Model(&model.RoleRequest{}).
		Where("email = ? AND status != ?", mail, "approved").
		Update("status", "approved")

	if result.Error != nil {
		return fmt.Errorf("failed to bulk-approve role requests: %w", result.Error)
	}

	if result.RowsAffected > 0 {
		log.Printf("Auto-approved %d role requests for user %s", result.RowsAffected, mail)
	}

	return nil
}

func (h *AdminHandler) approveAllRoleRequestsForUser(userID uuid.UUID) error {
	result := h.db.
		Model(&model.RoleRequest{}).
		Where("user_id = ? AND status != ?", userID, "approved").
		Update("status", "approved")

	if result.Error != nil {
		return fmt.Errorf("failed to bulk-approve role requests: %w", result.Error)
	}

	if result.RowsAffected > 0 {
		log.Printf("Auto-approved %d role requests for user %s", result.RowsAffected, userID)
	}

	return nil
}

func (h *AdminHandler) RejectAllRoleRequestsForUser(userID uuid.UUID) error {
	var requests []model.RoleRequest
	if err := h.db.
		Where("user_id = ? AND status NOT IN ?", userID, []string{"approved", "rejected"}).
		Find(&requests).Error; err != nil {
		return fmt.Errorf("failed to find role requests: %w", err)
	}

	if len(requests) == 0 {
		return nil // ничего не нашли — выходим
	}

	// Обновляем статус на "rejected"
	for i := range requests {
		requests[i].Status = "rejected"
		if err := h.db.Save(&requests[i]).Error; err != nil {
			return fmt.Errorf("failed to reject role request %s: %w", requests[i].ID, err)
		}
	}

	log.Printf("Auto-rejected %d role requests for user %s", len(requests), userID)
	return nil
}

// func (h *AdminHandler) SetUserRoles(c *fiber.Ctx) error {
// 	claims := c.Locals("claims").(*typex.SessionClaims)

// 	var (
// 		user model.User
// 	)

// 	body := c.BodyRaw()
// 	log.Infof(">>Update request body %v", string(body))

// 	var updateUserRolesRequest types.UpdateUserRolesRequest
// 	err := json.Unmarshal(body, &updateUserRolesRequest) // Pass a pointer to the struct

// 	if err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
// 			Status:  "error",
// 			Message: "Internal server error",
// 			Error:   err.Error(),
// 		})
// 	}

// 	log.Infof("<<--------------------- %v", updateUserRolesRequest)
// 	updatedUserId, err := uuid.Parse(updateUserRolesRequest.UserId)
// 	if err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
// 			Status:  "error",
// 			Message: "Internal server error (parse updated user id false)",
// 			Error:   err.Error(),
// 		})
// 	}

// 	tx := h.db.Where("id = ?", updatedUserId).First(&user)
// 	if err := tx.Error; err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
// 			Status:  "error",
// 			Message: "Internal server error",
// 			Error:   err.Error(),
// 		})
// 	}

// 	user.Roles = updateUserRolesRequest.Roles

// 	tx = h.db.Save(&user)
// 	if err := tx.Error; err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
// 			Status:  "error",
// 			Message: "Internal Server Error",
// 			Error:   err.Error(),
// 		})
// 	}

// 	h.userInfoCacheClient.Invalidate(user.Email)

// 	// Формируем сообщение
// 	messageuUpdateRole := map[string]string{
// 		"type": "update_role",
// 		"data": "streamer",
// 	}

// 	// Отправляем уведомления
// 	notifylib.PushMessage("system", updateUserRolesRequest.UserId, messageuUpdateRole, claims.UserId.String())

// 	return c.Status(fiber.StatusOK).JSON(types.Profile{
// 		ID:          user.ID.String(),
// 		Username:    user.Username,
// 		Email:       user.Email,
// 		Description: user.Description,
// 		AvatarURL:   user.AvatarURL,
// 		CoverURL:    user.CoverURL,
// 		DonationURL: user.DonationURL,
// 		Roles:       user.Roles,
// 	})
// }

// getUser godoc
// @Summary Get user by id
// @Description Returns user info
// @Tags admin
// @Produce json
// @Security CookieAuth
// @Param id path string true "user id"
// @Success 200 {object} types.ListedUserInfo
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /admin/users/{id} [get]
func (h *AdminHandler) GetUser(c *fiber.Ctx) error {
	return h.filterUser(c, "", "users", "All users")
}

func (h *AdminHandler) filterUser(c *fiber.Ctx, role string, collectionId string, collectionName string) error {
	id := c.Params("id")
	var user model.User

	tx := h.db.Where("id = ?", id).First(&user)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("Internal server error (user \"%v\" doesn't exists)", id),
			Error:   err.Error(),
		})
	}

	if role != "" && !slices.Contains(user.Roles, role) {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("Internal server error (user \"%v\" doesn't exists)", id),
			Error:   fmt.Sprintf("User %v doesn't have %v role", id, role),
		})
	}

	return c.JSON(types.ListedUserInfo{
		UserInfo: types.UserInfo{
			Id:             user.ID.String(),
			Username:       user.Username,
			Email:          user.Email,
			EmailConfirmed: user.EmailConfirmed,
			Description:    user.Description,
			AvatarURL:      user.AvatarURL,
			CoverURL:       user.CoverURL,
			DonationURL:    user.DonationURL,
			Roles:          user.Roles,

			Created: user.CreatedAt,
			Updated: user.UpdatedAt,
		},

		CollectionId:   collectionId,
		CollectionName: collectionName,
	})
}

// User update
// @Summary User update
// @Description User update
// @Tags admin
// @Accept json
// @Produce json
// @Param request body types.UserUpdateRequest true "user info for updating"
// @Success 200 {object} types.ListedUserInfo
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /admin/users/{id} [patch]
func (h *AdminHandler) PatchUser(c *fiber.Ctx) error {
	return h._patchUser(c, "", "users", "All users")
}

// User delete
// @Summary User delete
// @Description User delete
// @Tags admin
// @Accept json
// @Produce json
// @Success 200 {object} types.ListedUserInfo
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /admin/users/{id} [delete]
func (h *AdminHandler) DeleteUser(c *fiber.Ctx) error {
	return h._deleteUser(c, "", "users", "All users")
}

func (h *AdminHandler) _patchUser(c *fiber.Ctx, role string, collectionId string, collectionName string) error {
	id := c.Params("id")
	var (
		user   model.User
		update types.UserUpdateRequest
	)

	tx := h.db.Where("id = ?", id).First(&user)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("Internal server error (user %v not found)", id),
			Error:   err.Error(),
		})
	}

	if role != "" && !slices.Contains(user.Roles, role) {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("Internal server error (user %v doesn't has role %v)", id, role),
			Error:   fmt.Sprintf("user doesn't has role %v", role),
		})
	}

	if err := c.BodyParser(&update); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (invalid patch request UserUpdateRequest)",
			Error:   err.Error(),
		})
	}

	// Update user fields
	if update.Username != "" {
		user.Username = update.Username
	}
	if update.Description != "" {
		user.Description = update.Description
	}
	if update.Email != "" {
		user.Email = update.Email
	}
	if update.EmailConfirmed != nil {
		user.EmailConfirmed = *update.EmailConfirmed
	}
	if update.AvatarURL != "" {
		user.AvatarURL = update.AvatarURL
	}
	if update.CoverURL != "" {
		user.AvatarURL = update.CoverURL
	}
	if update.DonationURL != "" {
		user.DonationURL = update.DonationURL
	}
	if update.Roles != nil {
		user.Roles = update.Roles
	}

	tx = h.db.Save(&user)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("Internal Server Error (rollback user %v changes)", id),
			Error:   err.Error(),
		})
	}

	h.userInfoCacheClient.Invalidate(user.Email)

	return c.Status(fiber.StatusOK).JSON(types.ListedUserInfo{
		UserInfo: types.UserInfo{
			Id:             user.ID.String(),
			Username:       user.Username,
			Email:          user.Email,
			EmailConfirmed: user.EmailConfirmed,
			Description:    user.Description,
			AvatarURL:      user.AvatarURL,
			CoverURL:       user.CoverURL,
			DonationURL:    user.DonationURL,
			Roles:          user.Roles,

			Created: user.CreatedAt,
			Updated: user.UpdatedAt,
		},

		CollectionId:   collectionId,
		CollectionName: collectionName,
	})
}

// getUsers godoc
// @Summary Get users
// @Description Returns list of users
// @Tags admin
// @Accept json
// @Produce json
// @Security CookieAuth
// @Param page query int false "Page number (default: 1)"
// @Param perPage query int false "Page size (default: 10, max: 100)"
// @Param sort query string false "Sort fields and directions (example: +username)"
// @Success 200 {object} types.UserListResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /admin/users [get]
func (h *AdminHandler) GetUsers(c *fiber.Ctx) error {
	return h.filterUsers(c, "", "users", "All users")
}

func (h *AdminHandler) filterUsers(c *fiber.Ctx, role string, collectionId string, collectionName string) error {
	var user model.User

	claims := c.Locals("claims").(*typex.SessionClaims)

	tx := h.db.Where("id = ?", claims.UserId).First(&user)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user doesn't exists)",
			Error:   err.Error(),
		})
	}

	// Get pagination parameters
	page := c.QueryInt("page", 1)
	if page < 1 {
		page = 1
	}
	pageSize := c.QueryInt("perPage", 10)
	if pageSize < 1 {
		pageSize = 10
	} else if pageSize > 100 {
		pageSize = 100
	}
	offset := (page - 1) * pageSize

	// Base query to get subscribers with their subscriber counts
	query := h.db.Table("auth_user").
		Select("auth_user.*")

	// Get sorting parameters
	sort := parseSortString(c.Query("sort", ""))
	if sort != nil {

		// Validate sort field
		validSortFields := map[string]string{
			"username":         "auth_user.username",
			"subscriber_count": "subscriber_count",
		}

		for _, sortByField := range sort {
			if sortByField.SortDirection == SortDirectionUnsorted {
				continue
			}
			dbSortField, ok := validSortFields[sortByField.FieldName]
			if !ok {
				dbSortField = "auth_user.username"
			}

			// Apply sorting
			query = query.Order(fmt.Sprintf("%s %s", dbSortField, sortByField.SortDirection))
		}
	}

	if role != "" {
		query = query.Where("roles LIKE ?", "%\""+role+"\"%")
	}

	// Get total count for pagination FIXME: calc count for query
	var totalCount int64
	if err := h.db.Table("auth_user").
		Count(&totalCount).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to count users",
			Error:   err.Error(),
		})
	}

	var users []model.User
	if err := query.Offset(offset).Limit(pageSize).Find(&users).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch users",
			Error:   err.Error(),
		})
	}

	// Get enrich user data
	usersData := make([]types.ListedUserInfo, len(users))

	for i, user := range users {
		usersData[i] = types.ListedUserInfo{
			UserInfo: types.UserInfo{
				Id:             user.ID.String(),
				Username:       user.Username,
				Email:          user.Email,
				EmailConfirmed: user.EmailConfirmed,
				Description:    user.Description,
				AvatarURL:      user.AvatarURL,
				CoverURL:       user.CoverURL,
				DonationURL:    user.DonationURL,
				Roles:          user.Roles,

				Created: user.CreatedAt,
				Updated: user.UpdatedAt,
			},
			CollectionId:   collectionId,
			CollectionName: collectionName,
		}

	}

	// Calculate pagination metadata
	totalPages := int(math.Ceil(float64(totalCount) / float64(pageSize)))
	if totalPages < 1 {
		totalPages = 1
	}

	return c.JSON(types.UserListResponse{
		Status:     "success",
		Items:      usersData,
		Page:       page,
		PerPage:    pageSize,
		TotalPages: totalPages,
		TotalItems: int(totalCount),
	})
}

// getAdmins godoc
// @Summary Get admins
// @Description Returns list of admins
// @Tags admin
// @Accept json
// @Produce json
// @Security CookieAuth
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 10, max: 100)"
// @Param sort_by query string false "Sort field"
// @Param sort_dir query string false "Sort direction (asc or desc)"
// @Success 200 {object} types.UserListResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /admin/admins [get]
func (h *AdminHandler) GetAdmins(c *fiber.Ctx) error {
	return h.filterUsers(c, "admin", "admins", "Administrators")
}

// getStreamers godoc
// @Summary Get streamers
// @Description Returns list of streamers
// @Tags admin
// @Accept json
// @Produce json
// @Security CookieAuth
// @Param page query int false "Page number (default: 1)"
// @Param page_size query int false "Page size (default: 10, max: 100)"
// @Param sort_by query string false "Sort field"
// @Param sort_dir query string false "Sort direction (asc or desc)"
// @Success 200 {object} types.UserListResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /admin/streamers [get]
func (h *AdminHandler) GetStreamers(c *fiber.Ctx) error {
	return h.filterUsers(c, "streamer", "streamers", "Streamers")
}

// getAdmin godoc
// @Summary Get admin by id
// @Description Returns user info
// @Tags admin
// @Produce json
// @Security CookieAuth
// @Param id path string true "user id"
// @Success 200 {object} types.ListedUserInfo
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /admin/admins/{id} [get]
func (h *AdminHandler) GetAdmin(c *fiber.Ctx) error {
	return h.filterUser(c, "admin", "admins", "Administrators")
}

// getStreamer godoc
// @Summary Get streamer by id
// @Description Returns user info
// @Tags admin
// @Produce json
// @Security CookieAuth
// @Param id path string true "user id"
// @Success 200 {object} types.ListedUserInfo
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /admin/streamers/{id} [get]
func (h *AdminHandler) GetStreamer(c *fiber.Ctx) error {
	return h.filterUser(c, "streamer", "streamers", "Streamers")
}

// getStatistics godoc
// @Summary Get statistics
// @Description Returns statistics by users
// @Tags admin
// @Produce json
// @Security CookieAuth
// @Success 200 {object} types.StatisticsResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /admin/statistics [get]
func (h *AdminHandler) GetStatistics(c *fiber.Ctx) error {
	return c.JSON(types.UserListResponse{
		Status:     "success",
		Items:      nil,
		Page:       1,
		PerPage:    40,
		TotalPages: -1,
		TotalItems: -1,
	})
}

// Admin update
// @Summary admin update
// @Description Admin update
// @Tags admin
// @Accept json
// @Produce json
// @Param request body types.UserUpdateRequest true "user info for updating"
// @Success 200 {object} types.ListedUserInfo
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /admin/admins/{id} [patch]
func (h *AdminHandler) PatchAdmin(c *fiber.Ctx) error {
	return h._patchUser(c, "", "admins", "Administrators")
}

// Streamer update
// @Summary streamer update
// @Description Streamer update
// @Tags admin
// @Accept json
// @Produce json
// @Param id path string true "id streamer"
// @Param request body types.UserUpdateRequest true "user info for updating"
// @Success 200 {object} types.ListedUserInfo
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /admin/streamers/{id} [patch]
func (h *AdminHandler) PatchStreamer(c *fiber.Ctx) error {
	return h._patchUser(c, "", "streamers", "Streamers")
}

// Auth service integration
// @Summary Create user (if request from ip list: USER_SERVICE_IP_LIST environment variable) omit control for session
// @Description Create user
// @Tags admin
// @Accept json
// @Produce json
// @Param request body types.AuthServiceUserInfo true "user info for updating"
// @Success 200 {object} types.UserInfo
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /admin/service/users [post]
func (h *AdminHandler) AuthServicePostUsers(c *fiber.Ctx) error {
	input := new(types.AuthServiceUserInfo)

	if err := c.BodyParser(input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Error on auth service request",
			Error:   err.Error(),
		})
	}

	if !validateEmail(input.Email) {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid email address in auth service request",
		})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to hash password in auth service request",
			Error:   err.Error(),
		})
	}

	user := model.User{
		Username:     input.Email,
		Email:        input.Email,
		PasswordHash: string(hashedPassword),
	}

	tx := h.db.Create(&user)
	if err := tx.Error; err != nil {
		if err.(*pgconn.PgError).Code == "23505" {
			return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
				Status:  "error",
				Message: "Username or email already taken",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal Server Error (Create(&user))",
			Error:   err.Error(),
		})
	}

	// return h._patchUser(c, "", "users", "All users")
	return c.Status(fiber.StatusOK).JSON(types.UserInfo{
		Id:             user.ID.String(),
		Username:       user.Username,
		Email:          user.Email,
		EmailConfirmed: user.EmailConfirmed,
		Description:    user.Description,
		AvatarURL:      user.AvatarURL,
		CoverURL:       user.CoverURL,
		DonationURL:    user.DonationURL,
		Roles:          user.Roles,

		Created: user.CreatedAt,
		Updated: user.UpdatedAt,
	},
	)
}

// Auth service integration
// @Summary Patch user (if request from ip list: USER_SERVICE_IP_LIST environment variable) omit control for session
// @Description Patch user
// @Tags admin
// @Accept json
// @Produce json
// @Param request body types.AuthServiceUserInfo true "user info for updating"
// @Success 200 {object} types.UserInfo
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /admin/service/users [patch]
func (h *AdminHandler) AuthServicePatchUsers(c *fiber.Ctx) error {

	input := new(types.AuthServiceUserInfo)

	if err := c.BodyParser(input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Error on auth service request",
			Error:   err.Error(),
		})
	}

	if !validateEmail(input.Email) {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid email address in auth service request",
		})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to hash password in auth service request",
			Error:   err.Error(),
		})
	}

	// Find user and patch password
	var (
		user model.User
	)
	tx := h.db.Find(&user, "Email = ?", input.Email)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (passwordReset())",
			Error:   err.Error(),
		})
	}

	if user.ID == uuid.Nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", input.Email),
		})
	}

	user.PasswordHash = string(hashedPassword)
	tx = h.db.Save(&user)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal Server Error (h.db.Save(&user))",
			Error:   err.Error(),
		})
	}

	// return h._patchUser(c, "", "users", "All users")
	return c.Status(fiber.StatusOK).JSON(types.UserInfo{
		Id:             user.ID.String(),
		Username:       user.Username,
		Email:          user.Email,
		EmailConfirmed: user.EmailConfirmed,
		Description:    user.Description,
		AvatarURL:      user.AvatarURL,
		CoverURL:       user.CoverURL,
		DonationURL:    user.DonationURL,
		Roles:          user.Roles,

		Created: user.CreatedAt,
		Updated: user.UpdatedAt,
	},
	)
}

func (h *AdminHandler) _deleteUser(c *fiber.Ctx, role string, collectionId string, collectionName string) error {
	id := c.Params("id")
	var (
		user model.User
	)

	tx := h.db.Where("id = ?", id).First(&user)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("Internal server error (user %v not found)", id),
			Error:   err.Error(),
		})
	}

	if role != "" && !slices.Contains(user.Roles, role) {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("Internal server error (user %v doesn't has role %v)", id, role),
			Error:   fmt.Sprintf("user doesn't has role %v", role),
		})
	}

	if slices.Contains(user.Roles, "admin") {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("Internal server error (user %v has role admin and can't be delete)", id),
			Error:   "user has role admin",
		})
	}

	tx = h.db.Begin()
	tx.Model(&user).Where("id = ?", user.ID).Updates(map[string]interface{}{
		"email":    fmt.Sprintf("@%v@%v", time.Now().Format(time.RFC3339Nano), user.Email),
		"username": fmt.Sprintf("@%v@%v", time.Now().Format(time.RFC3339Nano), user.Username),
	})
	if err := tx.Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("Internal Server Error (store user email %v fail)", id),
			Error:   err.Error(),
		})
	}
	tx.Delete(&user)
	if err := tx.Error; err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("Internal Server Error (delete user %v fail)", id),
			Error:   err.Error(),
		})
	}
	tx.Commit()

	// Store previous email in format @deleted_at@email
	tx = h.db.Model(&user).Where("id = ?", user.ID).UpdateColumn("email", fmt.Sprintf("@%v@%v", time.Now().Format(time.RFC3339Nano), user.Email))
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("Internal Server Error (delete user %v fail)", id),
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(types.ListedUserInfo{
		UserInfo: types.UserInfo{
			Id:             user.ID.String(),
			Username:       user.Username,
			Email:          user.Email,
			EmailConfirmed: user.EmailConfirmed,
			Description:    user.Description,
			AvatarURL:      user.AvatarURL,
			CoverURL:       user.CoverURL,
			DonationURL:    user.DonationURL,
			Roles:          user.Roles,

			Created: user.CreatedAt,
			Updated: user.UpdatedAt,
		},

		CollectionId:   collectionId,
		CollectionName: collectionName,
	})
}
