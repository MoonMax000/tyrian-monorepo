package handler

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/Capstane/AXA-socialweb-posts/internal/model"
	"github.com/Capstane/AXA-socialweb-posts/internal/types"
	"github.com/Capstane/AXA-socialweb-posts/internal/validation"
	"github.com/Capstane/authlib/typex"
	"github.com/Capstane/authlib/utilx"
	"github.com/disintegration/imaging"
	"github.com/elastic/go-elasticsearch/v8/esapi"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"io"
	"log"
	"math"
	"mime/multipart"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

func (h *Handler) processTags(db *gorm.DB, inputTags []*types.Tag) ([]*model.Tag, error) {
	var tags []*model.Tag

	for _, inputTag := range inputTags {
		if inputTag == nil || strings.TrimSpace(inputTag.Name) == "" {
			continue
		}

		var existingTag model.Tag
		if err := db.Where("LOWER(name) = LOWER(?)", inputTag.Name).First(&existingTag).Error; err == nil {
			tags = append(tags, &existingTag)
		} else if errors.Is(err, gorm.ErrRecordNotFound) {
			newTag := model.Tag{
				ID:   uuid.New(),
				Name: inputTag.Name,
			}
			if err := db.Create(&newTag).Error; err != nil {
				return nil, fmt.Errorf("failed to create tag: %w", err)
			}
			tags = append(tags, &newTag)
		} else {
			return nil, fmt.Errorf("failed to check tag: %w", err)
		}
	}

	return tags, nil
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
			log.Printf("Warning: block %s not found in block map", currentBlockID)
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

func (h *Handler) GetPostInfoByID(claims *typex.SessionClaims, userId string, post model.Post, flag bool) (*types.PostV2, error) {

	NeedPayment := false

	authorId, _ := uuid.Parse(userId)
	if post.Payment != nil {
		if post.UserId != authorId {
			var subscription model.Postsubscription
			if err := h.db.Where("user_id = ? AND post_id = ?", authorId, post.ID).First(&subscription).Error; err != nil {
				NeedPayment = true
			} else {
				NeedPayment = false
			}
		} else {
			NeedPayment = false
		}
	}

	author, _ := h.getUserById(post.UserId)
	likeCount, _ := h.getLikeCount(post.ID)
	var likeAt, favoredAt *time.Time
	if claims != nil {
		likeAt, _ = h.getLikeAt(post.ID, claims.UserId)
		favoredAt, _ = h.getFavoredAt(post.ID, claims.UserId)
	} else if flag {
		likeAt, _ = h.getLikeAt(post.ID, authorId)
		favoredAt, _ = h.getFavoredAt(post.ID, authorId)
	}

	responsePost := types.PostV2{
		ID:           post.ID,
		UserId:       post.UserId,
		UserEmail:    author.Email,
		AuthorAvatar: author.GetAvatarUrl(h.cfg.CdnPublicUrl),
		Type:         post.Type,
		Title:        post.Title,
		Payment:      post.Payment,
		LikeCount:    likeCount,
		Tags: utilx.Mapping(post.Tags, func(x *model.Tag) *types.Tag {
			return &types.Tag{
				ID:   x.ID,
				Name: x.Name,
			}
		}),
		CreatedAt:    post.CreatedAt,
		NeedPayment:  NeedPayment,
		FirstBlockID: *post.FirstBlockID,
	}
	blocks, err := h.GetBlocksByOrder(post)
	if err != nil {
		return nil, err
	}
	responsePost.Blocks = blocks
	if NeedPayment == false {
		responsePost.Content = post.Content
		responsePost.MediaURL = post.MediaURL
		//responsePost.Blocks = blocks
		responsePost.LikeAt = likeAt
		responsePost.FavoredAt = favoredAt
	}
	return &responsePost, nil
}

// GetPostsByUserEmail godoc
// @Summary Get all posts by userEmail
// @Description Returns all posts with pagination and sorting
// @Tags posts
// @Accept json
// @Produce json
// @Param filter query string false "ForYou, Popular, Following"
// @Param type query string false "Post type: ideas|videos|opinions|analytics|softwares (Popular only)"
// @Param user_email path string true "User Email"
// @Param page query int false "Page number (default: 1, min: 1)"
// @Param page_size query int false "Number of items per page (default: 10, max: 1000)"
// @Param sort_type query string false "Sort type: latest or recommended (default: latest)"
// @Param tags query string false "Sort by tags: ex.: idea,video"
// @Success 200 {object} types.PostsResponse "Success response with pagination"
// @Failure 400 {object} types.FailureResponse "Invalid pagination parameters"
// @Failure 500 {object} types.FailureErrorResponse "Server error"
// @Router /posts/user/{userId} [get]
func (h *Handler) GetPostsByUserEmail(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)

	tagsQuery := c.Query("tags", "")
	tagNames := strings.Split(tagsQuery, ",")
	filter := c.Query("filter")
	postType := strings.ToLower(strings.TrimSpace(c.Query("type", "")))

	authorEmailText := c.Params("user_email")
	authorObject, err := h.getUserByEmail(authorEmailText)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "User by email not found",
		})
	}
	author := *authorObject
	authorId := author.ID

	pagination := types.PaginationRequest{
		Page:     1,
		PageSize: 10,
		SortType: "latest",
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

	var posts []model.Post
	query := h.db.Preload("Blocks").Preload("Blocks.Files").Preload("Tags").Model(&posts)
	// ForYou: игнорируем остальные фильтры, сортируем по количеству лайков
	if strings.EqualFold(filter, "ForYou") {
		query = query.
			Joins("LEFT JOIN likes ON likes.post_id = posts.id").
			Group("posts.id").
			Order("COUNT(likes.id) DESC").
			Order("posts.created_at DESC")
	} else {
		// Фильтр по тегам
		if len(tagNames) > 0 && tagNames[0] != "" {
			query = query.Joins("JOIN post_tags ON post_tags.post_id = posts.id").
				Joins("JOIN tags ON tags.id = post_tags.tag_id").
				Where("tags.name IN ?", tagNames).
				Group("posts.id")
		}

		// Popular: фильтр по типу
		if strings.EqualFold(filter, "Popular") && postType != "" {
			switch postType {
			case "ideas", "videos", "opinions", "analytics", "softwares":
				query = query.Where("posts.type = ?", postType)
			default:
				return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
					Status:  "error",
					Message: "Invalid post type filter",
				})
			}
		}

		// Сортировка по sort_type
		if pagination.SortType == "recommended" {
			query = query.
				Joins("LEFT JOIN likes ON likes.post_id = posts.id").
				Group("posts.id").
				Order("COUNT(likes.id) DESC").
				Order("posts.created_at DESC")
		} else {
			query = query.Order("posts.created_at DESC")
		}
	}
	query = query.Where("user_id = ?", authorId)

	var totalRecords int64
	countQuery := h.db.Model(&model.Post{}).Where("user_id = ?", authorId)
	if strings.EqualFold(filter, "ForYou") {
		// Считаем все посты
		if err := countQuery.Count(&totalRecords).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to count posts",
				Error:   err.Error(),
			})
		}
	} else {
		// Те же фильтры (кроме сортировки и лайков)
		if len(tagNames) > 0 && tagNames[0] != "" {
			countQuery = countQuery.Joins("JOIN post_tags ON post_tags.post_id = posts.id").
				Joins("JOIN tags ON tags.id = post_tags.tag_id").
				Where("tags.name IN ?", tagNames).
				Group("posts.id")
		}
		if strings.EqualFold(filter, "Popular") && postType != "" {
			countQuery = countQuery.Where("posts.type = ?", postType)
		}

		if len(tagNames) > 0 && tagNames[0] != "" {
			if err := countQuery.Select("COUNT(DISTINCT posts.id)").Count(&totalRecords).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
					Status:  "error",
					Message: "Failed to count posts",
					Error:   err.Error(),
				})
			}
		} else {
			if err := countQuery.Count(&totalRecords).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
					Status:  "error",
					Message: "Failed to count posts",
					Error:   err.Error(),
				})
			}
		}
	}
	offset := (pagination.Page - 1) * pagination.PageSize
	if err := query.Offset(offset).Limit(pagination.PageSize).Find(&posts).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch posts",
			Error:   err.Error(),
		})
	}

	responsePosts := make([]types.PostV2, min(len(posts), pagination.PageSize))
	for i, post := range posts[:min(len(posts), pagination.PageSize)] {
		getPost, err := h.GetPostInfoByID(claims, authorId.String(), post, true)
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

	return c.JSON(types.PostsResponseV2{
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

// GetPostByIdV2 godoc
// @Summary Get post by ID
// @Description Returns single post.
// @Tags posts
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path string true "Post ID"
// @Param user_email query string false "User ID"
// @Success 200 {object} types.PostsResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 404 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /posts/{id} [get]
func (h *Handler) GetPostByIdV2(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)

	postId := c.Params("id")
	postUuid, _ := uuid.Parse(postId)

	authorEmailText := c.Query("user_email")
	authorObject, err := h.getUserByEmail(authorEmailText)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "User by email not found",
		})
	}
	author := *authorObject
	authorIdText := author.ID.String()

	var post model.Post
	if err := h.db.Preload("Blocks").Preload("Blocks.Files").Preload("Tags").Where("id = ?", postUuid).First(&post).Error; err != nil {
		return c.Status(404).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Post not found",
		})
	}
	postResult, err := h.GetPostInfoByID(claims, authorIdText, post, false)
	if err != nil {
		return c.Status(404).JSON(types.FailureResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}
	return c.JSON(types.PosResponseV2{
		Status: "success",
		Data:   *postResult,
	})
}

// GetAllPostsV2 godoc
// @Summary Get all posts
// @Description Returns all posts with pagination and sorting
// @Tags posts
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param filter query string false "ForYou, Popular, Following"
// @Param type query string false "Post type: ideas|videos|opinions|analytics|softwares (Popular only)"
// @Param page query int false "Page number (default: 1, min: 1)"
// @Param page_size query int false "Number of items per page (default: 10, max: 1000)"
// @Param sort_type query string false "Sort type: latest or recommended (default: latest)"
// @Param tags query string false "Sort by tags: ex.: idea,video"
// @Success 200 {object} types.PostsResponse "Success response with pagination"
// @Failure 400 {object} types.FailureResponse "Invalid pagination parameters"
// @Failure 500 {object} types.FailureErrorResponse "Server error"
// @Router /posts [get]
func (h *Handler) GetAllPostsV2(c *fiber.Ctx) error {
	tagsQuery := c.Query("tags", "")
	tagNames := strings.Split(tagsQuery, ",")
	filter := c.Query("filter")
	postType := strings.ToLower(strings.TrimSpace(c.Query("type", "")))

	claims := c.Locals("claims").(*typex.SessionClaims)
	userID := claims.UserId

	pagination := types.PaginationRequest{
		Page:     1,
		PageSize: 10,
		SortType: "latest",
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

	var posts []model.Post
	query := h.db.Preload("Blocks").Preload("Blocks.Files").Preload("Tags").Model(&posts)

	// ForYou: игнорируем остальные фильтры, сортируем по количеству лайков
	if strings.EqualFold(filter, "ForYou") {
		query = query.
			Joins("LEFT JOIN likes ON likes.post_id = posts.id").
			Group("posts.id").
			Order("COUNT(likes.id) DESC").
			Order("posts.created_at DESC")
	} else {
		// Фильтр по тегам
		if len(tagNames) > 0 && tagNames[0] != "" {
			query = query.Joins("JOIN post_tags ON post_tags.post_id = posts.id").
				Joins("JOIN tags ON tags.id = post_tags.tag_id").
				Where("tags.name IN ?", tagNames).
				Group("posts.id")
		}

		// Popular: фильтр по типу
		if strings.EqualFold(filter, "Popular") && postType != "" {
			switch postType {
			case "ideas", "videos", "opinions", "analytics", "softwares":
				query = query.Where("posts.type = ?", postType)
			default:
				return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
					Status:  "error",
					Message: "Invalid post type filter",
				})
			}
		}

		// Following: посты авторов, на которых подписан текущий пользователь
		if strings.EqualFold(filter, "Following") {
			if userID == uuid.Nil {
				return c.Status(fiber.StatusUnauthorized).JSON(types.FailureResponse{
					Status:  "error",
					Message: "Unauthorized",
				})
			}
			query = query.Joins("JOIN subscriptions_follower sf ON sf.followed_id = posts.user_id AND sf.follower_id = ?", userID)
		}

		// Сортировка по sort_type
		if pagination.SortType == "recommended" {
			query = query.
				Joins("LEFT JOIN likes ON likes.post_id = posts.id").
				Group("posts.id").
				Order("COUNT(likes.id) DESC").
				Order("posts.created_at DESC")
		} else {
			query = query.Order("posts.created_at DESC")
		}
	}

	var totalRecords int64
	countQuery := h.db.Model(&model.Post{})

	if strings.EqualFold(filter, "ForYou") {
		// Считаем все посты
		if err := countQuery.Count(&totalRecords).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to count posts",
				Error:   err.Error(),
			})
		}
	} else {
		// Те же фильтры (кроме сортировки и лайков)
		if len(tagNames) > 0 && tagNames[0] != "" {
			countQuery = countQuery.Joins("JOIN post_tags ON post_tags.post_id = posts.id").
				Joins("JOIN tags ON tags.id = post_tags.tag_id").
				Where("tags.name IN ?", tagNames).
				Group("posts.id")
		}
		if strings.EqualFold(filter, "Popular") && postType != "" {
			countQuery = countQuery.Where("posts.type = ?", postType)
		}
		if strings.EqualFold(filter, "Following") {
			if userID == uuid.Nil {
				return c.Status(fiber.StatusUnauthorized).JSON(types.FailureResponse{
					Status:  "error",
					Message: "Unauthorized",
				})
			}
			countQuery = countQuery.Joins("JOIN subscriptions_follower sf ON sf.followed_id = posts.user_id AND sf.follower_id = ?", userID)
		}

		if len(tagNames) > 0 && tagNames[0] != "" {
			if err := countQuery.Select("COUNT(DISTINCT posts.id)").Count(&totalRecords).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
					Status:  "error",
					Message: "Failed to count posts",
					Error:   err.Error(),
				})
			}
		} else {
			if err := countQuery.Count(&totalRecords).Error; err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
					Status:  "error",
					Message: "Failed to count posts",
					Error:   err.Error(),
				})
			}
		}
	}

	offset := (pagination.Page - 1) * pagination.PageSize
	if err := query.Offset(offset).Limit(pagination.PageSize).Find(&posts).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch posts",
			Error:   err.Error(),
		})
	}

	responsePosts := make([]types.PostV2, min(len(posts), pagination.PageSize))
	for i, post := range posts[:min(len(posts), pagination.PageSize)] {
		getPost, err := h.GetPostInfoByID(claims, userID.String(), post, false)
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

	return c.JSON(types.PostsResponseV2{
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

func (h *Handler) checkImageDimensions(file *multipart.FileHeader, maxWidth, maxHeight, maxLongSide int) error {
	src, err := file.Open()
	if err != nil {
		return fmt.Errorf("failed to open image file: %v", err)
	}
	defer src.Close()

	defer func() {
		if seeker, ok := src.(io.Seeker); ok {
			seeker.Seek(0, io.SeekStart)
		}
	}()

	img, err := imaging.Decode(src)
	if err != nil {
		return fmt.Errorf("failed to decode image: %v", err)
	}

	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	if width < maxWidth || height < maxHeight {
		return fmt.Errorf("image dimensions %dx%d exceed minimum allowed %dx%d",
			width, height, maxWidth, maxHeight)
	}

	longSide := width
	if height > width {
		longSide = height
	}

	if longSide > maxLongSide {
		return fmt.Errorf("image long side %d exceeds maximum allowed %d",
			longSide, maxLongSide)
	}

	return nil
}

func checkMediaDuration(file *multipart.FileHeader, maxDuration time.Duration) error {
	// TODO пока заглушка
	return nil
}

// CreatePostV2 godoc
// @Summary Create a new block for post
// @Description Creates a new block for post for the authenticated user, type_example: ideas videos opinions analytics softwares
// @Tags posts
// @Accept multipart/form-data
// @Produce json
// @Security ApiKeyAuth
// @Param user_plan query string false "User plan"
// @Param post formData string true "Post JSON data"
// @Param block formData string false "Block JSON data {"media_url":"","content":"","name":""}")"
// @Param files_metadata formData string false "JSON metadata: {\"files\": [{\"original_name\": \"img1.jpg\", \"block\": \"block1\", \"type\": \"photo\"}, ...]}"
// @Param files formData []file false "Files to upload"
// @Success 201 {object} types.PostCreateV2
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /posts/create [post]
func (h *Handler) CreatePostV2(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	var postForm types.CreatePostRequest
	postJson := c.FormValue("post")
	if err := json.Unmarshal([]byte(postJson), &postForm); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Invalid JSON in 'post' field",
		})
	}

	errorsLocal, err := validation.ValidateStruct(postForm)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Validation failed",
			Errors:  errorsLocal,
		})
	}

	tags, err := h.processTags(h.db, postForm.Tags)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}
	var userPlan string
	userPlanText := c.Query("user_plan")
	userPlan = userPlanText
	if userPlanText == "" {
		userPlan = "1"
	}

	newPost := model.Post{
		UserId:   userPtr.ID,
		Type:     postForm.Type,
		Title:    postForm.Title,
		Content:  postForm.Content,
		MediaURL: postForm.MediaURL,
		Payment:  postForm.Payment,
		Tags:     tags,
	}

	if err := h.db.Create(&newPost).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to create post",
			Error:   err.Error(),
		})
	}

	author, _ := h.getUserById(newPost.UserId)
	postUUID := newPost.ID

	newBlock := model.Block{
		Content:  "",
		MediaURL: "",
		PostID:   postUUID,
	}

	if err := h.db.Create(&newBlock).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to create first block",
			Error:   err.Error(),
		})
	}
	newBlock.NextBlockID = &newBlock.ID
	if err := h.db.Save(&newBlock).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to update post",
			Error:   err.Error(),
		})
	}
	newPost.FirstBlockID = &newBlock.ID
	if err := h.db.Save(&newPost).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to update post",
			Error:   err.Error(),
		})
	}

	postForIndex := types.IndexPost{
		ID:        newPost.ID,
		UserId:    newPost.UserId,
		UserEmail: author.Email,
		Type:      newPost.Type,
		Title:     newPost.Title,
		Content:   newPost.Content,
		MediaURL:  newPost.MediaURL,
		Payment:   newPost.Payment,
		Tags: utilx.Mapping(newPost.Tags, func(x *model.Tag) *types.Tag {
			return &types.Tag{
				ID:   x.ID,
				Name: x.Name,
			}
		}),
		CreatedAt: newPost.CreatedAt,
	}
	body, err := json.Marshal(postForIndex)
	if err != nil {
		log.Println("Failed to marshal post for ES:", err)
	} else {
		req := esapi.IndexRequest{
			Index:      "posts",
			DocumentID: postForIndex.ID.String(),
			Body:       strings.NewReader(string(body)),
			Refresh:    "true",
		}
		res, err := req.Do(context.Background(), h.ES)
		if err != nil {
			log.Printf("Failed to index post in Elasticsearch: %v", err)
		}
		defer res.Body.Close()

		if res.IsError() {
			log.Printf("Elasticsearch returned error response: %s", res.String())
		}

	}

	metadataJSON := c.FormValue("files_metadata")
	var metadata GetFiles
	fileNamesMapping := make(map[string]FilesInfo)

	if metadataJSON != "" {
		if err := json.Unmarshal([]byte(metadataJSON), &metadata); err != nil {
			log.Println("Error parsing files_metadata:", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  "error",
				"message": "Invalid JSON in 'files_metadata' field",
			})
		}
		errorsLocal, err = validation.ValidateStruct(metadata)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
				Status:  "error",
				Message: "Validation failed",
				Errors:  errorsLocal,
			})
		}
		for _, fileMeta := range metadata.Files {
			if fileMeta.Name != "" {
				fileNamesMapping[fileMeta.Name] = FilesInfo{
					OriginalName: fileMeta.OriginalName,
					Type:         fileMeta.Type,
				}
			} else {
				fileNamesMapping[fileMeta.OriginalName] = FilesInfo{
					OriginalName: fileMeta.OriginalName,
					Type:         fileMeta.Type,
				}
			}
		}
	} else {
		metadata = GetFiles{Files: []FileMetadata{}}
	}
	blocksJson := c.FormValue("block")
	var blocks types.GetBlocks

	if blocksJson != "" {
		if err := json.Unmarshal([]byte(blocksJson), &blocks); err != nil {
			log.Println("Failed to unmarshal blocks json:", err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"status":  "error",
				"message": "Invalid JSON in 'blocks' field: " + err.Error(),
			})
		}
	} else {
		blocks = types.GetBlocks{Blocks: []types.CreateBlockRequest{}}
	}

	var filesMap map[string][]FileMetadata

	if metadata.Files != nil && len(metadata.Files) > 0 {
		filesMap = createBlockFilesMap(metadata.Files)
	} else {
		filesMap = make(map[string][]FileMetadata)
	}
	fileRestrictions := map[string]struct {
		Extensions         []string
		MaxSize            int64
		CheckDimensions    bool
		MinWidth           int
		MinHeight          int
		MaxLongSide        int
		CheckDuration      bool
		MaxDuration        time.Duration
		CheckArchiveSafety bool
		BlockedExtensions  []string
	}{
		"photo": {
			Extensions:      []string{".jpg", ".jpeg", ".png", ".webp"},
			MaxSize:         10 * 1024 * 1024, // 10 MB
			CheckDimensions: true,
			MinWidth:        400,
			MinHeight:       400,
			MaxLongSide:     4096,
		},
		"video": {
			Extensions:    []string{".mp4", ".mov"},
			MaxSize:       500 * 1024 * 1024, // 500 MB
			CheckDuration: true,
			MaxDuration:   5 * time.Minute,
		},
		"document": {
			Extensions: []string{".pdf", ".docx", ".xlsx", ".csv", ".txt", ".json"},
			MaxSize:    20 * 1024 * 1024, // 20 MB
		},
		"audio": {
			Extensions:    []string{".mp3", ".wav", ".aac"},
			MaxSize:       50 * 1024 * 1024, // 50 MB
			CheckDuration: true,
			MaxDuration:   10 * time.Minute,
		},
		"archive": {
			Extensions:         []string{".zip", ".tar", ".gz"},
			MaxSize:            100 * 1024 * 1024, // 100 MB
			CheckArchiveSafety: true,
			BlockedExtensions:  []string{".exe", ".dll", ".bat", ".ps1", ".sh", ".cmd", ".com", ".scr", ".msi"},
		},
	}

	form, err := c.MultipartForm()
	if err != nil {
		log.Println("Error when create MultipartForm:", err)
	}
	allFiles := form.File["files"]
	log.Printf("all files %v", allFiles)

	fileMap := make(map[string]*multipart.FileHeader)
	for _, file := range allFiles {
		fileMap[file.Filename] = file
	}
	log.Printf("Files map %v", fileMap)
	var responseBlocks []types.BlockCreate
	if len(blocks.Blocks) > 0 {
		prevBlockUUID := *newPost.FirstBlockID
		for _, block := range blocks.Blocks {
			log.Printf("Block %v", block)
			var createdBlock *types.BlockCreate

			blockMetadata, exists := filesMap[block.Name]
			log.Printf("Metadata %v", blockMetadata)
			if !exists {
				log.Println("Block without files")
				createdBlock, err = h.CreateBlock(c, userPtr, newPost.ID, block, nil, prevBlockUUID, fileNamesMapping)
				if err != nil {
					return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
						"status":  "error",
						"message": "Error when create block: " + err.Error(),
					})
				}
				responseBlocks = append(responseBlocks, *createdBlock)
				prevBlockUUID = createdBlock.ID
				continue
			}
			var blockFiles []*multipart.FileHeader

			for _, fileMeta := range blockMetadata {
				log.Printf("File %v, name %v, type %v", fileMeta, fileMeta.Name, fileMeta.Type)
				if file, found := fileMap[fileMeta.Name]; found {
					log.Printf("file founded")
					restrictions, ok := fileRestrictions[fileMeta.Type]
					if !ok {
						return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
							"error": fmt.Sprintf("Invalid file type: %s", fileMeta.Type),
						})
					}

					ext := strings.ToLower(filepath.Ext(file.Filename))
					validExt := false
					for _, allowedExt := range restrictions.Extensions {
						if ext == allowedExt {
							validExt = true
							break
						}
					}

					if !validExt {
						return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
							"error": fmt.Sprintf("Invalid file extension for %s: %s. Allowed: %v",
								fileMeta.Type, ext, restrictions.Extensions),
						})
					}

					if file.Size > restrictions.MaxSize {
						return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
							"error": fmt.Sprintf("File %s exceeds maximum size for %s (%d MB)",
								file.Filename, fileMeta.Type, restrictions.MaxSize/(1024*1024)),
						})
					}

					switch fileMeta.Type {
					case "photo":
						if restrictions.CheckDimensions {
							if err := h.checkImageDimensions(file, restrictions.MinWidth,
								restrictions.MinHeight, restrictions.MaxLongSide); err != nil {
								return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
									"error": fmt.Sprintf("Image validation failed: %v", err),
								})
							}
						}

					case "video", "audio":
						maxDuration := restrictions.MaxDuration
						if fileMeta.Type == "video" {
							maxSize := restrictions.MaxSize
							if userPlan == "2" {
								maxDuration = 15 * time.Minute
								maxSize = 1024 * 1024 * 1024
							}
							if file.Size > maxSize {
								return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
									"error": fmt.Sprintf("Video file exceeds your plan limit (%d MB)",
										maxSize/(1024*1024)),
								})
							}
						}

						if restrictions.CheckDuration {
							if err := checkMediaDuration(file, maxDuration); err != nil {
								return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
									"error": fmt.Sprintf("Media duration validation failed: %v", err),
								})
							}
						}

					}
					blockFiles = append(blockFiles, file)
				} else {
					fmt.Printf("Warning: File %s not found for block %s\n",
						fileMeta.OriginalName, block.Name)
				}
			}
			log.Println("files for block ", blockFiles)
			sort.Slice(blockFiles, func(i, j int) bool {
				metaI := findMetadataForFile(blockMetadata, blockFiles[i].Filename)
				metaJ := findMetadataForFile(blockMetadata, blockFiles[j].Filename)
				return metaI.Order < metaJ.Order
			})
			log.Println("files for block sorted ", blockFiles)
			createdBlock, err = h.CreateBlock(c, userPtr, newPost.ID, block, blockFiles, prevBlockUUID, fileNamesMapping)
			if err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"status":  "error",
					"message": "Error when create block: " + err.Error(),
				})
			}
			responseBlocks = append(responseBlocks, *createdBlock)
			prevBlockUUID = createdBlock.ID
		}
	}
	return c.Status(fiber.StatusCreated).JSON(types.PostCreateResponse{
		Status: "success",
		Data: types.PostCreateV2{
			ID:        newPost.ID,
			UserId:    newPost.UserId,
			UserEmail: author.Email,
			Type:      newPost.Type,
			Title:     newPost.Title,
			Content:   newPost.Content,
			MediaURL:  newPost.MediaURL,
			Payment:   newPost.Payment,
			Tags: utilx.Mapping(newPost.Tags, func(x *model.Tag) *types.Tag {
				return &types.Tag{
					ID:   x.ID,
					Name: x.Name,
				}
			}),
			FirstBlockID: *newPost.FirstBlockID,
			CreatedAt:    newPost.CreatedAt,
			Blocks:       responseBlocks,
		},
	})
}

type FileMetadata struct {
	OriginalName string `json:"original_name"`
	Name         string `json:"name"`
	BlockIndex   string `json:"block_index"`
	Type         string `json:"type"`
	Order        int    `json:"order"`
}
type GetFiles struct {
	Files []FileMetadata `json:"files"`
}

type FilesInfo struct {
	OriginalName string `json:"original_name"`
	Type         string `json:"type"`
}

func findMetadataForFile(metadata []FileMetadata, filename string) FileMetadata {
	for _, meta := range metadata {
		if meta.OriginalName == filename {
			return meta
		}
	}
	return FileMetadata{}
}

func createBlockFilesMap(filesMetadata []FileMetadata) map[string][]FileMetadata {
	blockFilesMap := make(map[string][]FileMetadata)

	for _, meta := range filesMetadata {
		blockFilesMap[meta.BlockIndex] = append(blockFilesMap[meta.BlockIndex], meta)
	}

	return blockFilesMap
}

func (h *Handler) CreateBlock(
	c *fiber.Ctx,
	userPtr *model.User,
	postUuid uuid.UUID,
	blockInfo types.CreateBlockRequest,
	files []*multipart.FileHeader,
	prevBlockUUID uuid.UUID,
	fileNamesMap map[string]FilesInfo,
) (*types.BlockCreate, error) {
	newBlock := model.Block{
		Content:  blockInfo.Content,
		MediaURL: blockInfo.MediaURL,
		PostID:   postUuid,
	}
	tx := h.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var post model.Post
	if err := tx.First(&post, "id = ?", postUuid).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	if err := h.db.Create(&newBlock).Error; err != nil {
		return nil, err
	}

	blockUUID := newBlock.ID
	blockId := blockUUID.String()

	var previousBlock model.Block
	if err := tx.First(&previousBlock, "id = ?", prevBlockUUID).Error; err != nil {
		tx.Rollback()
		return nil, err
	}
	newBlock.NextBlockID = previousBlock.NextBlockID
	previousBlock.NextBlockID = &newBlock.ID

	if err := tx.Save(&previousBlock).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	if err := tx.Save(&newBlock).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	var responseFiles []*types.FileCreate

	if len(files) > 0 {
		tx := h.db.Begin()
		defer func() {
			if r := recover(); r != nil {
				tx.Rollback()
			}
		}()
		for _, fileHeader := range files {
			log.Printf("file from block %v", fileHeader)
			f, err := fileHeader.Open()
			if err != nil {
				return nil, err
			}

			fileId := uuid.New()
			fileName, url, err := h.S3Client.UploadFile(
				context.TODO(),
				f,
				postUuid.String(),
				fileId.String(),
				h.cfg.S3ContentBucketName,
				h.cfg.S3Endpoint,
				blockId,
			)
			log.Println(url)
			f.Close()
			if err != nil {
				tx.Rollback()
				return nil, err
			}
			origName := fileHeader.Filename
			typeFile := ""
			if info, exists := fileNamesMap[fileHeader.Filename]; exists {
				origName = info.OriginalName
				typeFile = info.Type
			}

			newFile := model.File{
				ID:       fileId,
				Name:     fileName,
				UserName: origName,
				FileSize: fileHeader.Size,
				Ext:      filepath.Ext(fileHeader.Filename),
				Type:     typeFile,
				BlockID:  blockUUID,
			}

			if err := tx.Create(&newFile).Error; err != nil {
				tx.Rollback()
				return nil, err
			}

			urlFile := h.S3Client.GeneratePresignedURL(
				context.TODO(),
				newFile.Name,
				post.ID.String(),
				h.cfg.S3ContentBucketName,
				blockId,
			)
			if url == "" {
				log.Println("Failed to generate presigned url")
			}

			responseFiles = append(responseFiles, &types.FileCreate{
				ID:       newFile.ID,
				Name:     newFile.Name,
				UserName: newFile.UserName,
				FileSize: newFile.FileSize,
				Ext:      newFile.Ext,
				Type:     newFile.Type,
				Url:      urlFile,
			})
		}

		if err := tx.Commit().Error; err != nil {
			return nil, err
		}
	}

	postForIndex := types.IndexBlock{
		ID:        newBlock.ID,
		PostId:    postUuid,
		Content:   newBlock.Content,
		MediaURL:  newBlock.MediaURL,
		Files:     responseFiles,
		CreatedAt: newBlock.CreatedAt,
	}
	body, err := json.Marshal(postForIndex)
	if err != nil {
		log.Println("Failed to marshal post for ES:", err)
	} else {
		req := esapi.IndexRequest{
			Index:      "blocks",
			DocumentID: postForIndex.ID.String(),
			Body:       strings.NewReader(string(body)),
			Refresh:    "true",
		}
		res, err := req.Do(context.Background(), h.ES)
		if err != nil {
			log.Printf("Failed to index post in Elasticsearch: %v", err)
		}
		defer res.Body.Close()

		if res.IsError() {
			log.Printf("Elasticsearch returned error response: %s", res.String())
		}

	}
	log.Printf("response files: %v", responseFiles)
	return &types.BlockCreate{
		ID:        blockUUID,
		Content:   newBlock.Content,
		MediaURL:  newBlock.MediaURL,
		Files:     responseFiles,
		CreatedAt: newBlock.CreatedAt,
		PrevBlock: prevBlockUUID,
		NextBlock: newBlock.NextBlockID,
	}, nil
}

// PlaceBlock return next uuid
func (h *Handler) PlaceBlock(c *fiber.Ctx, prevBlock model.Block, newBlock model.Block) error {
	newBlock.NextBlockID = prevBlock.NextBlockID
	prevBlock.NextBlockID = &newBlock.ID

	if err := h.db.Save(&prevBlock).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to update post",
			Error:   err.Error(),
		})
	}
	if err := h.db.Save(&newBlock).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to update post",
			Error:   err.Error(),
		})
	}
	return nil
}

// UpdateBlock godoc
// @Summary Update an existing block of post
// @Description Updates an existing post for the authenticated user
// @Tags posts
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path string true "Block ID"
// @Param post body types.UpdateBlockRequest true "Updated block data and order"
// @Success 200 {object} types.PostResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 404 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /posts/block/{id} [put]
func (h *Handler) UpdateBlock(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	blockId := c.Params("id")
	blockUuid, err := uuid.Parse(blockId)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid block ID",
		})
	}

	var existingBlock model.Block
	if err := h.db.Where("id = ?", blockUuid).First(&existingBlock).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(types.FailureResponse{
				Status:  "error",
				Message: "Block not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch block",
			Error:   err.Error(),
		})
	}

	if existingBlock.Post.UserId != userPtr.ID {
		return c.Status(fiber.StatusForbidden).JSON(types.FailureResponse{
			Status:  "error",
			Message: "You are not authorized to update this post",
		})
	}

	var requestBody types.UpdateBlockRequest
	if err := c.BodyParser(&requestBody); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid request body",
		})
	}

	errorsLocal, err := validation.ValidateStruct(requestBody)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Validation failed",
			Errors:  errorsLocal,
		})
	}

	if requestBody.Content != "" {
		existingBlock.Content = requestBody.Content
	}
	if requestBody.MediaURL != "" {
		existingBlock.MediaURL = requestBody.MediaURL
	}
	if requestBody.NextBlockID != "" {
		newNextBlockUuid, err1 := uuid.Parse(requestBody.NextBlockID)
		if err1 != nil {
			return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
				Status:  "error",
				Message: "Invalid nextBlockID block",
			})
		}

		var previousBlock model.Block
		if err := h.db.Where("next_block_id = ?", newNextBlockUuid).First(&previousBlock).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return c.Status(fiber.StatusNotFound).JSON(types.FailureResponse{
					Status:  "error",
					Message: "Block not found",
				})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch previous block",
				Error:   err.Error(),
			})
		}
		previousBlock.NextBlockID = &existingBlock.ID
		existingBlock.NextBlockID = &newNextBlockUuid
		if err := h.db.Save(&previousBlock).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to update previous post",
				Error:   err.Error(),
			})
		}

	}
	if err := h.db.Save(&existingBlock).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to update post",
			Error:   err.Error(),
		})
	}

	postForIndex := types.IndexBlock{
		ID:        existingBlock.ID,
		PostId:    existingBlock.PostID,
		Content:   existingBlock.Content,
		MediaURL:  existingBlock.MediaURL,
		CreatedAt: existingBlock.CreatedAt,
	}

	body, err := json.Marshal(postForIndex)
	if err != nil {
		log.Printf("Failed to marshal post for ES: %v", err)
	} else {
		req := esapi.IndexRequest{
			Index:      "blocks",
			DocumentID: existingBlock.ID.String(),
			Body:       strings.NewReader(string(body)),
			Refresh:    "true",
		}
		res, err := req.Do(context.Background(), h.ES)
		if err != nil {
			log.Printf("Failed to update post in ES: %v", err)
		} else {
			defer res.Body.Close()
			if res.IsError() {
				log.Printf("ES returned error updating document: %s", res.String())
			}
		}
	}

	return c.JSON(types.BlockResponse{
		Status: "success",
		Data: types.Block{
			ID:          existingBlock.ID,
			Content:     existingBlock.Content,
			MediaURL:    existingBlock.MediaURL,
			PostID:      existingBlock.PostID,
			NextBlockID: existingBlock.NextBlockID.String(),
		},
	})
}

// DeleteBlock godoc
// @Summary Delete an existing post
// @Description Deletes an existing post for the authenticated user
// @Tags posts
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path string true "Block ID"
// @Success 200 {object} types.SuccessResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 404 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /posts/block/{id} [delete]
func (h *Handler) DeleteBlock(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	blockId := c.Params("id")
	blockUuid, err := uuid.Parse(blockId)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid post ID",
		})
	}

	var existingBlock model.Block
	if err := h.db.Where("id = ?", blockUuid).First(&existingBlock).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(types.FailureResponse{
				Status:  "error",
				Message: "Block not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch block",
			Error:   err.Error(),
		})
	}

	if existingBlock.Post.UserId != userPtr.ID {
		return c.Status(fiber.StatusForbidden).JSON(types.FailureResponse{
			Status:  "error",
			Message: "You are not authorized to delete this post",
		})
	}
	if existingBlock.NextBlockID != nil {
		var previousBlock model.Block
		if err := h.db.Where("next_block_id = ?", blockUuid).First(&previousBlock).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return c.Status(fiber.StatusNotFound).JSON(types.FailureResponse{
					Status:  "error",
					Message: "Previous block not found",
				})
			}
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to fetch previous block",
				Error:   err.Error(),
			})
		}
		previousBlock.NextBlockID = existingBlock.NextBlockID
		if err := h.db.Save(&previousBlock).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to update post",
				Error:   err.Error(),
			})
		}
	}

	if err := h.db.Delete(&existingBlock).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to delete post",
			Error:   err.Error(),
		})
	}

	// Удаляем из Elasticsearch
	req := esapi.DeleteRequest{
		Index:      "blocks",
		DocumentID: blockUuid.String(),
		Refresh:    "true",
	}
	res, err := req.Do(context.Background(), h.ES)
	if err != nil {
		log.Printf("Failed to delete post from ES: %v", err)
	} else {
		defer res.Body.Close()
		if res.IsError() {
			log.Printf("Elasticsearch delete error: %s", res.String())
		}
	}

	return c.JSON(types.SuccessResponse{
		Status:  "success",
		Message: "Block deleted successfully",
	})
}

// SearchPosts godoc
// @Summary Get all posts and blocks with search
// @Description Returns all posts with pagination and sorting
// @Tags posts
// @Accept json
// @Produce json
// @Param user_email query string false "User email"
// @Param q query string false "query for search"
// @Param sort query string false "field for search desc: title, content, type, created, popular, popular-created, created-popular. default without q -> sort = created. default with q -> sort = "" (additional sort after relevant)."
// @Param page query int false "Page number (default: 1, min: 1)"
// @Param page_size query int false "Number of items per page (default: 10, max: 1000)"
// @Param sort_type query string false "Sort order: title,content,type"
// @Param tags query string false "Sort by tags: ex.: idea,video"
// @Param type query string false "Filter by post type: ideas videos opinions analytics softwares"
// @Success 200 {object} types.PostsResponse "Success response with pagination"
// @Failure 400 {object} types.FailureResponse "Invalid pagination parameters"
// @Failure 500 {object} types.FailureErrorResponse "Server error"
// @Router /posts/search [get]
func (h *Handler) SearchPosts(c *fiber.Ctx) error {
	ctx := context.Background()
	page, limit := parsePaginationParams(c)
	sortField := parseSortField(c)
	sortArray := addWeightsToArray(c.Query("sort_type", "title,content"))
	queryText := c.Query("q", "")
	authorEmailText := c.Query("user_email")
	authorObject, err := h.getUserByEmail(authorEmailText)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "User by email not found",
		})
	}
	author := *authorObject
	authorId := author.ID
	tagsParam := c.Query("tags", "")
	typeParam := c.Query("type", "")

	var tags []string
	if tagsParam != "" {
		tags = strings.Split(tagsParam, ",")
		for i := range tags {
			tags[i] = strings.TrimSpace(tags[i])
		}
	}

	var postType *string
	if typeParam != "" {
		trimmed := strings.TrimSpace(typeParam)
		postType = &trimmed
	}

	searchQuery := buildSearchQuery(queryText, sortArray, sortField, page, limit, tags, postType)
	log.Printf("%v", searchQuery)
	esResp, err := h.executeSearch(ctx, searchQuery)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}
	log.Println("ES_RESPONSE: ", esResp)
	posts, err := h.buildPostsResponse(esResp, authorId, sortField)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: err.Error(),
		})
	}
	total := len(posts)
	//esResp.Hits.Total.Value
	totalPages := int(math.Ceil(float64(total) / float64(limit)))
	return c.JSON(types.PostsResponseV2{
		Status: "success",
		Data:   posts,
		Pagination: types.PaginationResponse{
			CurrentPage:  page,
			PageSize:     limit,
			TotalPages:   totalPages,
			TotalRecords: int64(total),
		},
	})
}
