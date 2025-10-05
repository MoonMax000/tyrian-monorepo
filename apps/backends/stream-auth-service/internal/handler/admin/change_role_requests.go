package admin

import (
	"fmt"
	"math"

	"github.com/Capstane/authlib/typex"
	"github.com/Capstane/go-notifylib"
	"github.com/Capstane/stream-auth-service/internal/model"
	"github.com/Capstane/stream-auth-service/internal/types"
	"github.com/gofiber/fiber/v2"
)

// GetChangeRoleRequests godoc
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
// @Success 200 {object} types.RoleRequestListResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /admin/change-role-requests [get]
func (h *AdminHandler) GetChangeRoleRequests(c *fiber.Ctx) error {
	return h.filterRoleRequests(c)
}

// GetChangeRoleRequest godoc
// @Summary Get admin by id
// @Description Returns role request info
// @Tags admin
// @Produce json
// @Security CookieAuth
// @Param id path string true "role request id"
// @Success 200 {object} types.ListedRoleRequestInfo
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /admin/change-role-requests/{id} [get]
func (h *AdminHandler) GetChangeRoleRequest(c *fiber.Ctx) error {
	return h.filterRoleRequest(c)
}

// ChangeRoleRequest update
// @Summary admin update
// @Description ChangeRoleRequest update
// @Tags admin
// @Accept json
// @Produce json
// @Param id path string true "role request id"
// @Param request body types.UpdateRoleRequest true "role request info for updating, for approved to streamer"
// @Success 200 {object} types.ListedRoleRequestInfo
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /admin/change-role-requests/{id} [patch]
func (h *AdminHandler) PatchChangeRoleRequest(c *fiber.Ctx) error {
	return h._patchRoleRequest(c)
}

func (h *AdminHandler) filterRoleRequest(c *fiber.Ctx) error {
	id := c.Params("id")
	var roleRequest model.RoleRequest

	tx := h.db.Where("id = ?", id).First(&roleRequest)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("Internal server error (role request \"%v\" doesn't exists)", id),
			Error:   err.Error(),
		})
	}

	return c.JSON(types.ListedRoleRequestInfo{
		RoleRequestInfo: types.RoleRequestInfo{
			Id:      roleRequest.ID.String(),
			UserId:  roleRequest.UserId.String(),
			Email:   roleRequest.Email,
			Role:    roleRequest.Role,
			Comment: roleRequest.Comment,
			Status:  roleRequest.Status,
		},

		CollectionId:   "change-role-requests",
		CollectionName: "Change role requests",
	})
}

func (h *AdminHandler) _patchRoleRequest(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)

	id := c.Params("id")
	var (
		roleRequest model.RoleRequest
		update      types.UpdateRoleRequest
	)

	tx := h.db.Where("id = ?", id).First(&roleRequest)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("Internal server error (role request %v not found)", id),
			Error:   err.Error(),
		})
	}

	if err := c.BodyParser(&update); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (invalid patch request UpdateRoleRequest)",
			Error:   err.Error(),
		})
	}

	// Update role request fields
	if update.Status != "" {
		roleRequest.Status = update.Status
	}

	tx = h.db.Save(&roleRequest)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: fmt.Sprintf("Internal Server Error (rollback role request %v changes)", id),
			Error:   err.Error(),
		})
	}

	if roleRequest.Status == "approved" {
		var user model.User
		tx := h.db.Where("id = ?", roleRequest.UserId).First(&user)
		if err := tx.Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Internal server error",
				Error:   err.Error(),
			})
		}

		user.Roles = append(user.Roles, "streamer")
		user.Roles = RemoveDuplicateStrings(user.Roles...)

		tx = h.db.Save(&user)
		if err := tx.Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Internal Server Error",
				Error:   err.Error(),
			})
		}

		// Формируем сообщение
		messageuUpdateRole := map[string]string{
			"type": "update_role",
			"data": "streamer",
		}

		// Отправляем уведомления
		notifylib.PushMessage("system", roleRequest.UserId.String(), messageuUpdateRole, claims.UserId.String())

		h.userInfoCacheClient.Invalidate(user.Email)

	}

	return c.Status(fiber.StatusOK).JSON(types.ListedRoleRequestInfo{
		RoleRequestInfo: types.RoleRequestInfo{
			Id: roleRequest.ID.String(),
		},

		CollectionId:   "change-role-requests",
		CollectionName: "Change role requests",
	})
}

func (h *AdminHandler) filterRoleRequests(c *fiber.Ctx) error {
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
	query := h.db.Table("role_requests").
		Select("role_requests.*")

	// Get sorting parameters
	sort := parseSortString(c.Query("sort", ""))
	if sort != nil {

		// Validate sort field
		validSortFields := map[string]string{
			"email": "role_requests.email",
		}

		for _, sortByField := range sort {
			if sortByField.SortDirection == SortDirectionUnsorted {
				continue
			}
			dbSortField, ok := validSortFields[sortByField.FieldName]
			if !ok {
				dbSortField = "role_requests.email"
			}

			// Apply sorting
			query = query.Order(fmt.Sprintf("%s %s", dbSortField, sortByField.SortDirection))
		}
	}

	// Get total count for pagination FIXME: calc count for query
	var totalCount int64
	if err := h.db.Table("role_requests").
		Count(&totalCount).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to count role requests",
			Error:   err.Error(),
		})
	}

	var roleRequests []model.RoleRequest
	if err := query.Offset(offset).Limit(pageSize).Find(&roleRequests).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch role requests",
			Error:   err.Error(),
		})
	}

	// Get enrich role request
	roleRequestsData := make([]types.ListedRoleRequestInfo, len(roleRequests))

	for i, roleRequest := range roleRequests {
		roleRequestsData[i] = types.ListedRoleRequestInfo{
			RoleRequestInfo: types.RoleRequestInfo{
				Id:      roleRequest.ID.String(),
				UserId:  roleRequest.UserId.String(),
				Email:   roleRequest.Email,
				Role:    roleRequest.Role,
				Comment: roleRequest.Comment,
				Status:  roleRequest.Status,
			},
			CollectionId:   "change-role-requests",
			CollectionName: "Change role requests",
		}

	}

	// Calculate pagination metadata
	totalPages := int(math.Ceil(float64(totalCount) / float64(pageSize)))
	if totalPages < 1 {
		totalPages = 1
	}

	return c.JSON(types.RoleRequestListResponse{
		Status:     "success",
		Items:      roleRequestsData,
		Page:       page,
		PerPage:    pageSize,
		TotalPages: totalPages,
		TotalItems: int(totalCount),
	})
}
