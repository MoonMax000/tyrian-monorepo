package handler

import (
	"context"
	"fmt"
	"github.com/Capstane/authlib/typex"
	"math"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"

	"github.com/Capstane/AXA-socialweb-favorites/internal/model"
	"github.com/Capstane/AXA-socialweb-favorites/internal/types"
	"github.com/Capstane/authlib/utilx"
)

// Favorite posts
// @Summary favorite posts
// @Description favorite posts
// @Tags favorite
// @Accept json
// @Produce json
// @Param page query int false "Page number (default: 1, min: 1)"
// @Param page_size query int false "Number of items per page (default: 10, max: 1000)"
// @Param sort_type query string false "Sort type: latest or recommended (default: latest)"
// @Success 200 {object} types.PostsResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /favorite/ [get]
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
		SortType: "normal",
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
	if pagination.SortType != "normal" && pagination.SortType != "recommended" {
		pagination.SortType = "normal"
	}

	offset := (pagination.Page - 1) * pagination.PageSize

	var posts []model.Post
	query := h.db.Model(&posts).Where("id in (?)", h.db.Model(&model.Favorite{}).Select("post_id").Where("user_id = ?", userPtr.ID))

	var totalRecords int64
	if err := query.Count(&totalRecords).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to count posts",
			Error:   err.Error(),
		})
	}

	query = query.
		Preload("Blocks").
		Preload("Blocks.Files").
		Preload("Tags").
		Offset(offset).
		Limit(pagination.PageSize).
		Order("created_at DESC").
		Find(&posts)

	if err := query.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch posts",
			Error:   err.Error(),
		})
	}

	responsePosts := make([]types.Post, min(len(posts), pagination.PageSize))
	for i, post := range posts[:min(len(posts), pagination.PageSize)] {
		getPost, err := h.GetPostInfoByID(post, userPtr)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch post",
				Error:   err.Error(),
			})
		}
		if getPost != nil {
			responsePosts[i] = *getPost
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

func (h *Handler) GetPostInfoByID(post model.Post, userPtr *model.User) (*types.Post, error) {
	author, _ := h.getUserById(post.UserId)
	likeCount, _ := h.getLikeCount(post.ID)

	var likeAt, favoredAt *time.Time
	if userPtr != nil {
		likeAt, _ = h.getLikeAt(post.ID, userPtr.ID)
		favoredAt, _ = h.getFavoredAt(post.ID, userPtr.ID)
	}
	responsePost := types.Post{
		ID:           post.ID,
		UserId:       post.UserId,
		UserName:     author.Username,
		AuthorAvatar: author.GetAvatarUrl(h.cfg.CdnPublicUrl),
		Type:         post.Type,
		Title:        post.Title,
		Content:      post.Content,
		MediaURL:     post.MediaURL,
		LikeCount:    likeCount,
		Tags: utilx.Mapping(post.Tags, func(x *model.Tag) *types.Tag {
			return &types.Tag{
				ID:   x.ID,
				Name: x.Name,
			}
		}),
		LikeAt:       likeAt,
		FavoredAt:    favoredAt,
		CreatedAt:    post.CreatedAt,
		FirstBlockID: *post.FirstBlockID,
	}

	blocks, err := h.GetBlocksByOrder(post)
	if err != nil {
		return nil, err
	}
	responsePost.Blocks = blocks
	return &responsePost, nil
}

func (h *Handler) GetBlocksByOrder(post model.Post) ([]*types.Block, error) {
	blockMap := make(map[uuid.UUID]model.Block)
	for _, block := range post.Blocks {
		blockMap[block.ID] = block
	}
	var resultBlocks []*model.Block
	currentBlockID := *post.FirstBlockID
	for {
		currentBlock, exists := blockMap[currentBlockID]
		if !exists {
			break
		}
		resultBlocks = append(resultBlocks, &currentBlock)
		if *currentBlock.NextBlockID == *post.FirstBlockID {
			break
		}
		currentBlockID = *currentBlock.NextBlockID
	}
	var resultBlocksRequest []*types.Block
	for _, block := range resultBlocks {
		var responseFiles []*types.File

		for _, f := range block.Files {
			url := h.S3Client.GeneratePresignedURL(
				context.TODO(),
				f.Name,
				post.ID.String(),
				h.cfg.S3ContentBucketName,
				block.ID.String(),
			)
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
		resultBlocksRequest = append(resultBlocksRequest, &types.Block{
			ID:          block.ID,
			PostID:      block.PostID,
			Files:       responseFiles,
			Content:     block.Content,
			MediaURL:    block.MediaURL,
			NextBlockID: block.NextBlockID.String(),
		})
	}
	return resultBlocksRequest, nil
}

// Mark post as favorite
// @Summary Mark post as favorite
// @Description Mark post as favorite
// @Tags favorite
// @Accept json
// @Produce json
// @Param postId path string true "Post ID"
// @Success 200 {object} types.Post
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /favorite/{postId} [put]
func (h *Handler) markFavorite(c *fiber.Ctx) error {
	var (
		favorite model.Favorite
		post     model.Post
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

	tx := h.db.Where("PostId = ? and UserId = ?", postId, userPtr.ID).First(&favorite)
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

	favorite.UserId = userPtr.ID
	favorite.PostId = postId
	tx = h.db.Save(&favorite)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal Server Error",
			Error:   err.Error(),
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

// Unmark post as favorite
// @Summary Unmark post as favorite
// @Description Unmark post as favorite
// @Tags favorite
// @Accept json
// @Produce json
// @Param postId path string true "Post ID"
// @Success 200 {object} types.Post
// @Failure 500 {object} types.FailureErrorResponse
// @Security CookieAuth
// @Router /favorite/{postId} [delete]
func (h *Handler) unfavorite(c *fiber.Ctx) error {
	var (
		favorite model.Favorite
		post     model.Post
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

	tx := h.db.Where("post_id = ? and user_id = ?", postId, userPtr.ID).Delete(&favorite)
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
