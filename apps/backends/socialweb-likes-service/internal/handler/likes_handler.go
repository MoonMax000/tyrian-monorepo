package handler

import (
	"context"
	"fmt"
	"math"
	"slices"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"github.com/Capstane/AXA-socialweb-likes/internal/model"
	"github.com/Capstane/AXA-socialweb-likes/internal/queue"
	"github.com/Capstane/AXA-socialweb-likes/internal/types"
	"github.com/Capstane/authlib/typex"
)

// List of liking posts
// @Summary Liking posts
// @Description Liking posts
// @Tags like
// @Accept json
// @Produce json
// @Param page query int false "Page number (default: 1, min: 1)"
// @Param page_size query int false "Number of items per page (default: 10, max: 1000)"
// @Param sort_type query string false "Sort type: latest or recommended (default: latest)"
// @Param post_type query string false "Post type: ideas, video or script (default: all)"
// @Success 200 {object} types.PostsResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /like/ [get]
func (h *Handler) getList(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	pagination := types.PaginationRequest{
		Page:     1,
		PageSize: 10,
		SortType: "latest",
		PostType: []string{},
	}
	if err := c.QueryParser(&pagination); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
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
	if pagination.SortType != "latest" && pagination.SortType != "recommended" {
		pagination.SortType = "latest"
	}

	offset := (pagination.Page - 1) * pagination.PageSize

	var posts []model.Post
	query := h.db.Model(&posts).Where("id in (?)", h.db.Model(&model.Like{}).Select("post_id").Where("user_id = ?", userPtr.ID))
	var totalRecords int64
	if err := query.Count(&totalRecords).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to count posts",
			Error:   err.Error(),
		})
	}

	if len(pagination.PostType) > 0 && !slices.Contains(pagination.PostType, "all") {
		query.Where("type in (?)", pagination.PostType)
	}

	query = query.Preload("Files").Offset(offset).Limit(pagination.PageSize).Find(&posts)
	if pagination.SortType == "recommended" {
		query = query.Order("created_at DESC")
	} else {
		query = query.Order("created_at DESC")
	}

	if err := query.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch posts",
			Error:   err.Error(),
		})
	}

	responsePosts := make([]types.Post, min(len(posts), pagination.PageSize))
	for i, post := range posts[:min(len(posts), pagination.PageSize)] {
		needPayment := false
		if post.Payment != nil {
			if post.UserId != userPtr.ID {
				var postCount int64
				err := h.db.Table("postsubscriptions").
					Where("postsubscriptions.user_id = ? AND postsubscriptions.post_id = ?", userPtr.ID, post.ID).Count(&postCount).Error
				if err != nil || postCount == 0 {
					needPayment = true
				} else {
					needPayment = false
				}
			} else {
				needPayment = false
			}
		}

		var responseFiles []*types.File
		for _, f := range post.Files {
			url := h.S3Client.GeneratePresignedURL(context.TODO(), f.Name, post.ID.String(), h.cfg.S3AvatarsBucketName)
			if url == "" {
				return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
					Status:  "error",
					Message: "Failed to generate presigned url",
				})
			}
			responseFiles = append(responseFiles, &types.File{
				ID:       f.ID,
				Name:     f.Name,
				UserName: f.UserName,
				FileSize: f.FileSize,
				Ext:      f.Ext,
				Type:     f.Type,
				Url:      url,
			})
		}

		author, _ := h.getUserById(post.UserId)
		likeCount, _ := h.getLikeCount(post.ID)
		var likeAt, favoredAt *time.Time
		if userPtr != nil {
			likeAt, _ = h.getLikeAt(post.ID, userPtr.ID)
			favoredAt, _ = h.getFavoredAt(post.ID, userPtr.ID)
		}
		var tags []*types.Tag
		err := h.db.Table("tags").
			Joins("JOIN post_tags ON post_tags.tag_id = tags.id").
			Where("post_tags.post_id = ?", post.ID).
			Find(&tags).Error

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch tags for post",
				Error:   err.Error(),
			})
		}

		responsePosts[i] = types.Post{
			ID:           post.ID,
			UserId:       post.UserId,
			UserName:     author.Username,
			AuthorAvatar: author.GetAvatarUrl(h.cfg.CdnPublicUrl),
			Type:         post.Type,
			Title:        post.Title,
			Payment:      post.Payment,
			Tags:         tags,
			CreatedAt:    post.CreatedAt,
			NeedPayment:  needPayment,
		}
		if needPayment == false {
			responsePosts[i].Content = post.Content
			responsePosts[i].MediaURL = post.MediaURL
			responsePosts[i].Files = responseFiles
			responsePosts[i].LikeCount = likeCount
			responsePosts[i].LikeAt = likeAt
			responsePosts[i].FavoredAt = favoredAt
		}
	}

	totalPages := int(math.Ceil(float64(totalRecords) / float64(pagination.PageSize)))

	return c.JSON(types.PostsResponse{
		Status: "success",
		Data:   responsePosts,
		Pagination: types.PaginationResponse{
			CurrentPage:  pagination.Page,
			PageSize:     pagination.PageSize,
			TotalPages:   totalPages,
			TotalRecords: totalRecords,
		},
	})
}

// getUserList godoc
// @Summary List of liking posts
// @Description Liking posts
// @Tags like
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param page query int false "Page number (default: 1, min: 1)"
// @Param page_size query int false "Number of items per page (default: 10, max: 1000)"
// @Param sort_type query string false "Sort type: latest or recommended (default: latest)"
// @Param post_type query string false "Post type: ideas, video or script (default: all)"
// @Success 200 {object} types.PostsResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /like/{id} [get]
func (h *Handler) getUserList(c *fiber.Ctx) error {
	userTextId := c.Params("id")
	userId, _ := uuid.Parse(userTextId)

	pagination := types.PaginationRequest{
		Page:     1,
		PageSize: 10,
		SortType: "latest",
		PostType: []string{},
	}
	if err := c.QueryParser(&pagination); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
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
	if pagination.SortType != "latest" && pagination.SortType != "recommended" {
		pagination.SortType = "latest"
	}

	offset := (pagination.Page - 1) * pagination.PageSize

	var posts []model.Post
	query := h.db.Model(&posts).Where("id in (?)", h.db.Model(&model.Like{}).Select("post_id").Where("user_id = ?", userId))
	var totalRecords int64
	if err := query.Count(&totalRecords).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to count posts",
			Error:   err.Error(),
		})
	}

	if len(pagination.PostType) > 0 && !slices.Contains(pagination.PostType, "all") {
		query.Where("type in (?)", pagination.PostType)
	}

	query = query.Preload("Files").Offset(offset).Limit(pagination.PageSize).Find(&posts)
	if pagination.SortType == "recommended" {
		query = query.Order("created_at DESC")
	} else {
		query = query.Order("created_at DESC")
	}

	if err := query.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch posts",
			Error:   err.Error(),
		})
	}

	responsePosts := make([]types.Post, min(len(posts), pagination.PageSize))
	for i, post := range posts[:min(len(posts), pagination.PageSize)] {
		needPayment := false
		if post.Payment != nil {
			if post.UserId != userId {
				var postCount int64
				err := h.db.Table("postsubscriptions").
					Where("postsubscriptions.user_id = ? AND postsubscriptions.post_id = ?", userId, post.ID).Count(&postCount).Error
				if err != nil || postCount == 0 {
					needPayment = true
				} else {
					needPayment = false
				}
			} else {
				needPayment = false
			}
		}
		var responseFiles []*types.File
		for _, f := range post.Files {
			url := h.S3Client.GeneratePresignedURL(context.TODO(), f.Name, post.ID.String(), h.cfg.S3AvatarsBucketName)
			if url == "" {
				return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
					Status:  "error",
					Message: "Failed to generate presigned url",
				})
			}
			responseFiles = append(responseFiles, &types.File{
				ID:       f.ID,
				Name:     f.Name,
				UserName: f.UserName,
				FileSize: f.FileSize,
				Ext:      f.Ext,
				Type:     f.Type,
				Url:      url,
			})
		}

		author, _ := h.getUserById(post.UserId)
		likeCount, _ := h.getLikeCount(post.ID)
		var likeAt, favoredAt *time.Time

		likeAt, _ = h.getLikeAt(post.ID, userId)
		favoredAt, _ = h.getFavoredAt(post.ID, userId)

		var tags []*types.Tag
		err := h.db.Table("tags").
			Joins("JOIN post_tags ON post_tags.tag_id = tags.id").
			Where("post_tags.post_id = ?", post.ID).
			Find(&tags).Error

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch tags for post",
				Error:   err.Error(),
			})
		}

		responsePosts[i] = types.Post{
			ID:           post.ID,
			UserId:       post.UserId,
			UserName:     author.Username,
			AuthorAvatar: author.GetAvatarUrl(h.cfg.CdnPublicUrl),
			Type:         post.Type,
			Title:        post.Title,
			Payment:      post.Payment,
			Tags:         tags,
			CreatedAt:    post.CreatedAt,
			NeedPayment:  needPayment,
		}
		if needPayment == false {
			responsePosts[i].Content = post.Content
			responsePosts[i].MediaURL = post.MediaURL
			responsePosts[i].Files = responseFiles
			responsePosts[i].LikeCount = likeCount
			responsePosts[i].LikeAt = likeAt
			responsePosts[i].FavoredAt = favoredAt
		}
	}

	totalPages := int(math.Ceil(float64(totalRecords) / float64(pagination.PageSize)))

	return c.JSON(types.PostsResponse{
		Status: "success",
		Data:   responsePosts,
		Pagination: types.PaginationResponse{
			CurrentPage:  pagination.Page,
			PageSize:     pagination.PageSize,
			TotalPages:   totalPages,
			TotalRecords: totalRecords,
		},
	})
}

// Mark post as like
// @Summary Mark post as like
// @Description Mark post as like
// @Tags like
// @Accept json
// @Produce json
// @Param postId path string true "Post ID"
// @Success 200 {object} types.Post
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /like/{postId} [put]
func (h *Handler) like(c *fiber.Ctx) error {
	var (
		like model.Like
		post model.Post
	)

	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	postIdText := c.Params("postId")
	postId, err := uuid.Parse(postIdText)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid post ID",
		})
	}

	tx := h.db.Where("post_id = ? and user_id = ?", postId, userPtr.ID).First(&like)
	if err := tx.Error; err == nil {
		h.db.First(&post, postId)
		return c.Status(fiber.StatusCreated).JSON(types.PostResponse{
			Status: "success",
			Data: types.Post{
				ID:       post.ID,
				UserId:   post.UserId,
				Type:     post.Type,
				Title:    post.Title,
				Content:  post.Content,
				MediaURL: post.MediaURL,
				// Tags:     newPost.Tags,
			},
		})
	}

	like.UserId = userPtr.ID
	like.PostId = postId
	tx = h.db.Save(&like)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal Server Error",
			Error:   err.Error(),
		})
	}
	h.db.First(&post, postId)

	// create message
	if userPtr.ID != post.UserId {
		userPost, _ := h.getUserById(post.UserId)
		messageData := map[string]string{
			"type":              "like_post",
			"user_email":        userPost.Email,
			"data":              post.ID.String(),
			"post_title":        post.Title,
			"target_user_name":  userPtr.Username,
			"target_user_email": userPtr.Email,
		}
		queue.PushMessage(post.UserId.String(), messageData, userPtr.ID.String(), h.cfg)
	}

	return c.Status(fiber.StatusCreated).JSON(types.PostResponse{
		Status: "success",
		Data: types.Post{
			ID:       post.ID,
			UserId:   post.UserId,
			Type:     post.Type,
			Title:    post.Title,
			Content:  post.Content,
			MediaURL: post.MediaURL,
			// Tags:     newPost.Tags,
		},
	})
}

// Unmark post as like
// @Summary Unmark post as like
// @Description Unmark post as like
// @Tags like
// @Accept json
// @Produce json
// @Param postId path string true "Post ID"
// @Success 200 {object} types.Post
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /like/{postId} [delete]
func (h *Handler) unlike(c *fiber.Ctx) error {
	var (
		like model.Like
		post model.Post
	)

	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	postIdText := c.Params("postId")
	postId, err := uuid.Parse(postIdText)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid post ID",
		})
	}

	tx := h.db.Where("post_id = ? and user_id = ?", postId, userPtr.ID).Delete(&like)
	if err := tx.Error; err == nil {
		h.db.First(&post, postId)
		return c.Status(fiber.StatusCreated).JSON(types.PostResponse{
			Status: "success",
			Data: types.Post{
				ID:       post.ID,
				UserId:   post.UserId,
				Type:     post.Type,
				Title:    post.Title,
				Content:  post.Content,
				MediaURL: post.MediaURL,
				// Tags:     newPost.Tags,
			},
		})
	}

	h.db.First(&post, postId)

	return c.Status(fiber.StatusCreated).JSON(types.PostResponse{
		Status: "success",
		Data: types.Post{
			ID:       post.ID,
			UserId:   post.UserId,
			Type:     post.Type,
			Title:    post.Title,
			Content:  post.Content,
			MediaURL: post.MediaURL,
			// Tags:     newPost.Tags,
		},
	})
}
