package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"math"
	"sort"

	//"path/filepath"
	//"sort"
	"strconv"
	"strings"
	"time"

	"github.com/Capstane/AXA-socialweb-posts/internal/model"
	"github.com/Capstane/AXA-socialweb-posts/internal/queue"
	"github.com/Capstane/AXA-socialweb-posts/internal/types"
	"github.com/Capstane/AXA-socialweb-posts/internal/validation"
	"github.com/Capstane/authlib/typex"
	"github.com/Capstane/authlib/utilx"

	//"github.com/elastic/go-elasticsearch/v8"
	"github.com/elastic/go-elasticsearch/v8/esapi"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

//// GetPostById godoc
//// @Summary Get post by ID
//// @Description Returns single post.
//// @Tags posts
//// @Accept json
//// @Produce json
//// @Param id path string true "Post ID"
//// @Param userId query string false "User ID"
//// @Success 200 {object} types.PostsResponse
//// @Failure 400 {object} types.FailureResponse
//// @Failure 404 {object} types.FailureResponse
//// @Failure 500 {object} types.FailureErrorResponse
//// @Router /posts/{id} [get]
//func (h *Handler) GetPostById(c *fiber.Ctx) error {
//	claims := c.Locals("claims").(*typex.SessionClaims)
//
//	postId := c.Params("id")
//	postUuid, _ := uuid.Parse(postId)
//	authorIdText := c.Query("userId")
//
//	var post model.Post
//	if err := h.db.Preload("Files").Preload("Tags").Where("id = ?", postUuid).First(&post).Error; err != nil {
//		return c.Status(404).JSON(types.FailureResponse{
//			Status:  "error",
//			Message: "Post not found",
//		})
//	}
//	NeedPayment := false
//
//	authorId, _ := uuid.Parse(authorIdText)
//	if post.Payment != nil {
//		if post.UserId != authorId {
//			var subscription model.Postsubscription
//			if err := h.db.Where("user_id = ? AND post_id = ?", authorId, post.ID).First(&subscription).Error; err != nil {
//				NeedPayment = true
//			} else {
//				NeedPayment = false
//			}
//		} else {
//			NeedPayment = false
//		}
//	}
//
//	var responseFiles []*types.File
//	for _, f := range post.Files {
//		url := h.S3Client.GeneratePresignedURL(context.TODO(), f.Name, post.ID.String(), h.cfg.S3ContentBucketName)
//		if url == "" {
//			return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
//				Status:  "error",
//				Message: "Failed to generate presigned url",
//			})
//		}
//		responseFiles = append(responseFiles, &types.File{
//			ID:       f.ID,
//			Name:     f.Name,
//			UserName: f.UserName,
//			FileSize: f.FileSize,
//			Ext:      f.Ext,
//			Type:     f.Type,
//			Url:      url,
//		})
//	}
//
//	author, _ := h.getUserById(post.UserId)
//	likeCount, _ := h.getLikeCount(post.ID)
//	var likeAt, favoredAt *time.Time
//	if claims != nil {
//		likeAt, _ = h.getLikeAt(post.ID, claims.UserId)
//		favoredAt, _ = h.getFavoredAt(post.ID, claims.UserId)
//	}
//	data := types.Post{
//		ID:           post.ID,
//		UserId:       post.UserId,
//		UserName:     author.Username,
//		AuthorAvatar: author.GetAvatarUrl(h.cfg.CdnPublicUrl),
//		Type:         post.Type,
//		Title:        post.Title,
//		Payment:      post.Payment,
//		Tags: utilx.Mapping(post.Tags, func(x *model.Tag) *types.Tag {
//			return &types.Tag{
//				ID:   x.ID,
//				Name: x.Name,
//			}
//		}),
//		CreatedAt:   post.CreatedAt,
//		NeedPayment: NeedPayment,
//	}
//	if NeedPayment == false {
//		data.Content = post.Content
//		data.MediaURL = post.MediaURL
//		data.Files = responseFiles
//		data.LikeCount = likeCount
//		data.LikeAt = likeAt
//		data.FavoredAt = favoredAt
//	}
//
//	return c.JSON(types.PosResponse{
//		Status: "success",
//		Data:   data,
//	})
//}

//// GetAllPosts godoc
//// @Summary Get all posts
//// @Description Returns all posts with pagination and sorting
//// @Tags posts
//// @Accept json
//// @Produce json
//// @Param filter query string false "ForYou, Popular, Following"
//// @Param type query string false "Post type: ideas|videos|opinions|analytics|softwares (Popular only)"
//// @Param userId query string false "User ID"
//// @Param page query int false "Page number (default: 1, min: 1)"
//// @Param page_size query int false "Number of items per page (default: 10, max: 1000)"
//// @Param sort_type query string false "Sort type: latest or recommended (default: latest)"
//// @Param tags query string false "Sort by tags: ex.: idea,video"
//// @Success 200 {object} types.PostsResponse "Success response with pagination"
//// @Failure 400 {object} types.FailureResponse "Invalid pagination parameters"
//// @Failure 500 {object} types.FailureErrorResponse "Server error"
//// @Security ApiKeyAuth
//// @Router /posts [get]
//func (h *Handler) GetAllPosts(c *fiber.Ctx) error {
//	tagsQuery := c.Query("tags", "")
//	tagNames := strings.Split(tagsQuery, ",")
//	filter := c.Query("filter")
//	postType := strings.ToLower(strings.TrimSpace(c.Query("type", "")))
//
//	claims := c.Locals("claims").(*typex.SessionClaims)
//	userID := claims.UserId
//
//	pagination := types.PaginationRequest{
//		Page:     1,
//		PageSize: 10,
//		SortType: "latest",
//	}
//	if err := c.QueryParser(&pagination); err != nil {
//		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
//			Status:  "error",
//			Message: "Invalid pagination parameters",
//		})
//	}
//
//	if pagination.Page < 1 {
//		pagination.Page = 1
//	}
//	if pagination.PageSize < 1 || pagination.PageSize > 1000 {
//		pagination.PageSize = 10
//	}
//	if pagination.SortType != "latest" && pagination.SortType != "recommended" {
//		pagination.SortType = "latest"
//	}
//
//	var posts []model.Post
//	query := h.db.Preload("Files").Preload("Tags").Model(&posts)
//
//	// ForYou: игнорируем остальные фильтры, сортируем по количеству лайков
//	if strings.EqualFold(filter, "ForYou") {
//		query = query.
//			Joins("LEFT JOIN likes ON likes.post_id = posts.id").
//			Group("posts.id").
//			Order("COUNT(likes.id) DESC").
//			Order("posts.created_at DESC")
//	} else {
//		// Фильтр по тегам
//		if len(tagNames) > 0 && tagNames[0] != "" {
//			query = query.Joins("JOIN post_tags ON post_tags.post_id = posts.id").
//				Joins("JOIN tags ON tags.id = post_tags.tag_id").
//				Where("tags.name IN ?", tagNames).
//				Group("posts.id")
//		}
//
//		// Popular: фильтр по типу
//		if strings.EqualFold(filter, "Popular") && postType != "" {
//			switch postType {
//			case "ideas", "videos", "opinions", "analytics", "softwares":
//				query = query.Where("posts.type = ?", postType)
//			default:
//				return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
//					Status:  "error",
//					Message: "Invalid post type filter",
//				})
//			}
//		}
//
//		// Following: посты авторов, на которых подписан текущий пользователь
//		if strings.EqualFold(filter, "Following") {
//			if userID == uuid.Nil {
//				return c.Status(fiber.StatusUnauthorized).JSON(types.FailureResponse{
//					Status:  "error",
//					Message: "Unauthorized",
//				})
//			}
//			query = query.Joins("JOIN subscriptions_follower sf ON sf.followed_id = posts.user_id AND sf.follower_id = ?", userID)
//		}
//
//		// Сортировка по sort_type
//		if pagination.SortType == "recommended" {
//			query = query.
//				Joins("LEFT JOIN likes ON likes.post_id = posts.id").
//				Group("posts.id").
//				Order("COUNT(likes.id) DESC").
//				Order("posts.created_at DESC")
//		} else {
//			query = query.Order("posts.created_at DESC")
//		}
//	}
//
//	var totalRecords int64
//	countQuery := h.db.Model(&model.Post{})
//
//	if strings.EqualFold(filter, "ForYou") {
//		// Считаем все посты
//		if err := countQuery.Count(&totalRecords).Error; err != nil {
//			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
//				Status:  "error",
//				Message: "Failed to count posts",
//				Error:   err.Error(),
//			})
//		}
//	} else {
//		// Те же фильтры (кроме сортировки и лайков)
//		if len(tagNames) > 0 && tagNames[0] != "" {
//			countQuery = countQuery.Joins("JOIN post_tags ON post_tags.post_id = posts.id").
//				Joins("JOIN tags ON tags.id = post_tags.tag_id").
//				Where("tags.name IN ?", tagNames).
//				Group("posts.id")
//		}
//		if strings.EqualFold(filter, "Popular") && postType != "" {
//			countQuery = countQuery.Where("posts.type = ?", postType)
//		}
//		if strings.EqualFold(filter, "Following") {
//			if userID == uuid.Nil {
//				return c.Status(fiber.StatusUnauthorized).JSON(types.FailureResponse{
//					Status:  "error",
//					Message: "Unauthorized",
//				})
//			}
//			countQuery = countQuery.Joins("JOIN subscriptions_follower sf ON sf.followed_id = posts.user_id AND sf.follower_id = ?", userID)
//		}
//
//		if len(tagNames) > 0 && tagNames[0] != "" {
//			if err := countQuery.Select("COUNT(DISTINCT posts.id)").Count(&totalRecords).Error; err != nil {
//				return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
//					Status:  "error",
//					Message: "Failed to count posts",
//					Error:   err.Error(),
//				})
//			}
//		} else {
//			if err := countQuery.Count(&totalRecords).Error; err != nil {
//				return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
//					Status:  "error",
//					Message: "Failed to count posts",
//					Error:   err.Error(),
//				})
//			}
//		}
//	}
//
//	offset := (pagination.Page - 1) * pagination.PageSize
//	if err := query.Offset(offset).Limit(pagination.PageSize).Find(&posts).Error; err != nil {
//		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
//			Status:  "error",
//			Message: "Failed to fetch posts",
//			Error:   err.Error(),
//		})
//	}
//
//	responsePosts := make([]types.Post, min(len(posts), pagination.PageSize))
//	for i, post := range posts[:min(len(posts), pagination.PageSize)] {
//		NeedPayment := false
//		if post.Payment != nil {
//			if post.UserId != userID {
//				var subscription model.Postsubscription
//				if err := h.db.Where("user_id = ? AND post_id = ?", userID, post.ID).First(&subscription).Error; err != nil {
//					NeedPayment = true
//				} else {
//					NeedPayment = false
//				}
//			} else {
//				NeedPayment = false
//			}
//		}
//		var responseFiles []*types.File
//		for _, f := range post.Files {
//			url := h.S3Client.GeneratePresignedURL(context.TODO(), f.Name, post.ID.String(), h.cfg.S3ContentBucketName)
//			if url == "" {
//				return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
//					Status:  "error",
//					Message: "Failed to generate presigned url",
//				})
//			}
//			responseFiles = append(responseFiles, &types.File{
//				ID:       f.ID,
//				Name:     f.Name,
//				UserName: f.UserName,
//				FileSize: f.FileSize,
//				Ext:      f.Ext,
//				Type:     f.Type,
//				Url:      url,
//			})
//		}
//
//		author, _ := h.getUserById(post.UserId)
//		likeCount, _ := h.getLikeCount(post.ID)
//		var likeAt, favoredAt *time.Time
//		if userID != uuid.Nil {
//			likeAt, _ = h.getLikeAt(post.ID, userID)
//			favoredAt, _ = h.getFavoredAt(post.ID, userID)
//		}
//
//		responsePosts[i] = types.Post{
//			ID:           post.ID,
//			UserId:       post.UserId,
//			UserName:     author.Username,
//			AuthorAvatar: author.GetAvatarUrl(h.cfg.CdnPublicUrl),
//			Type:         post.Type,
//			Title:        post.Title,
//			Payment:      post.Payment,
//			LikeCount:    likeCount,
//			Tags: utilx.Mapping(post.Tags, func(x *model.Tag) *types.Tag {
//				return &types.Tag{
//					ID:   x.ID,
//					Name: x.Name,
//				}
//			}),
//			CreatedAt:   post.CreatedAt,
//			NeedPayment: NeedPayment,
//		}
//		if NeedPayment == false {
//			responsePosts[i].Content = post.Content
//			responsePosts[i].MediaURL = post.MediaURL
//			responsePosts[i].Files = responseFiles
//			responsePosts[i].LikeCount = likeCount
//			responsePosts[i].LikeAt = likeAt
//			responsePosts[i].FavoredAt = favoredAt
//		}
//	}
//
//	totalPages := int(math.Ceil(float64(totalRecords) / float64(pagination.PageSize)))
//
//	return c.JSON(types.PostsResponse{
//		Status: "success",
//		Data:   responsePosts,
//		Pagination: types.PaginationResponse{
//			CurrentPage:  pagination.Page,
//			PageSize:     pagination.PageSize,
//			TotalPages:   totalPages,
//			TotalRecords: totalRecords,
//		},
//	})
//}
//
//// GetUserPosts godoc
//// @Summary Get all posts by userId
//// @Description Returns all posts with pagination and sorting
//// @Tags posts
//// @Accept json
//// @Produce json
//// @Param userId path string true "User ID"
//// @Param page query int false "Page number (default: 1, min: 1)"
//// @Param page_size query int false "Number of items per page (default: 10, max: 1000)"
//// @Param sort_type query string false "Sort type: latest or recommended (default: latest)"
//// @Param tags query string false "Sort by tags: ex.: idea,video"
//// @Success 200 {object} types.PostsResponse "Success response with pagination"
//// @Failure 400 {object} types.FailureResponse "Invalid pagination parameters"
//// @Failure 500 {object} types.FailureErrorResponse "Server error"
//// @Router /posts/user/{userId} [get]
//func (h *Handler) GetPostsByUserId(c *fiber.Ctx) error {
//	claims := c.Locals("claims").(*typex.SessionClaims)
//
//	tagsQuery := c.Query("tags", "")
//	tagNames := strings.Split(tagsQuery, ",")
//
//	authorIdText := c.Params("userId")
//	authorId, _ := uuid.Parse(authorIdText)
//
//	pagination := types.PaginationRequest{
//		Page:     1,
//		PageSize: 10,
//		SortType: "latest",
//	}
//	if err := c.QueryParser(&pagination); err != nil {
//		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
//			Status:  "error",
//			Message: "Invalid pagination parameters",
//		})
//	}
//
//	if pagination.Page < 1 {
//		pagination.Page = 1
//	}
//	if pagination.PageSize < 1 || pagination.PageSize > 1000 {
//		pagination.PageSize = 10
//	}
//	if pagination.SortType != "latest" && pagination.SortType != "recommended" {
//		pagination.SortType = "latest"
//	}
//
//	offset := (pagination.Page - 1) * pagination.PageSize
//
//	var posts []model.Post
//	query := h.db.Preload("Files").Preload("Tags").Model(&posts)
//
//	if pagination.SortType == "recommended" {
//		query = query.Order("created_at DESC")
//	} else {
//		query = query.Order("created_at DESC")
//	}
//
//	query = query.Where("user_id = ?", authorId)
//
//	// Фильтрация по тегам
//	if len(tagNames) > 0 && tagNames[0] != "" {
//		query = query.Joins("JOIN post_tags ON post_tags.post_id = posts.id").
//			Joins("JOIN tags ON tags.id = post_tags.tag_id").
//			Where("tags.name IN ?", tagNames).
//			Group("posts.id")
//	}
//
//	var totalRecords int64
//	countQuery := h.db.Model(&model.Post{}).Where("user_id = ?", authorId)
//	if len(tagNames) > 0 && tagNames[0] != "" {
//		countQuery = countQuery.Joins("JOIN post_tags ON post_tags.post_id = posts.id").
//			Joins("JOIN tags ON tags.id = post_tags.tag_id").
//			Where("tags.name IN ?", tagNames).
//			Group("posts.id")
//		err := countQuery.Select("COUNT(DISTINCT posts.id)").Count(&totalRecords).Error
//		if err != nil {
//			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
//				Status:  "error",
//				Message: "Failed to count posts",
//				Error:   err.Error(),
//			})
//		}
//	} else {
//		if err := countQuery.Count(&totalRecords).Error; err != nil {
//			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
//				Status:  "error",
//				Message: "Failed to count posts",
//				Error:   err.Error(),
//			})
//		}
//	}
//
//	if err := query.Offset(offset).Limit(pagination.PageSize).Find(&posts).Error; err != nil {
//		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
//			Status:  "error",
//			Message: "Failed to fetch posts",
//			Error:   err.Error(),
//		})
//	}
//
//	responsePosts := make([]types.Post, min(len(posts), pagination.PageSize))
//	for i, post := range posts[:min(len(posts), pagination.PageSize)] {
//		var responseFiles []*types.File
//		for _, f := range post.Files {
//			url := h.S3Client.GeneratePresignedURL(context.TODO(), f.Name, post.ID.String(), h.cfg.S3ContentBucketName)
//			if url == "" {
//				return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
//					Status:  "error",
//					Message: "Failed to generate presigned url",
//				})
//			}
//			responseFiles = append(responseFiles, &types.File{
//				ID:       f.ID,
//				Name:     f.Name,
//				UserName: f.UserName,
//				FileSize: f.FileSize,
//				Ext:      f.Ext,
//				Type:     f.Type,
//				Url:      url,
//			})
//		}
//		NeedPayment := false
//
//		author, _ := h.getUserById(post.UserId)
//		likeCount, _ := h.getLikeCount(post.ID)
//		var likeAt, favoredAt *time.Time
//		if claims != nil {
//			likeAt, _ = h.getLikeAt(post.ID, claims.UserId)
//			favoredAt, _ = h.getFavoredAt(post.ID, claims.UserId)
//		}
//
//		responsePosts[i] = types.Post{
//			ID:           post.ID,
//			UserId:       post.UserId,
//			UserName:     author.Username,
//			AuthorAvatar: author.GetAvatarUrl(h.cfg.CdnPublicUrl),
//			Type:         post.Type,
//			Title:        post.Title,
//			Content:      post.Content,
//			MediaURL:     post.MediaURL,
//			Payment:      post.Payment,
//			Tags: utilx.Mapping(post.Tags, func(x *model.Tag) *types.Tag {
//				return &types.Tag{
//					ID:   x.ID,
//					Name: x.Name,
//				}
//			}),
//			Files:       responseFiles, // Только активные файлы
//			CreatedAt:   post.CreatedAt,
//			LikeCount:   likeCount,
//			LikeAt:      likeAt,
//			FavoredAt:   favoredAt,
//			NeedPayment: NeedPayment,
//		}
//	}
//
//	totalPages := int(math.Ceil(float64(totalRecords) / float64(pagination.PageSize)))
//
//	return c.JSON(types.PostsResponse{
//		Status: "success",
//		Data:   responsePosts,
//		Pagination: types.PaginationResponse{
//			CurrentPage:  pagination.Page,
//			PageSize:     pagination.PageSize,
//			TotalPages:   totalPages,
//			TotalRecords: totalRecords,
//		},
//	})
//}

//func (h *Handler) processTags(db *gorm.DB, inputTags []*types.Tag) ([]*model.Tag, error) {
//	var tags []*model.Tag
//
//	for _, inputTag := range inputTags {
//		if inputTag == nil || strings.TrimSpace(inputTag.Name) == "" {
//			continue
//		}
//
//		var existingTag model.Tag
//		if err := db.Where("LOWER(name) = LOWER(?)", inputTag.Name).First(&existingTag).Error; err == nil {
//			tags = append(tags, &existingTag)
//		} else if errors.Is(err, gorm.ErrRecordNotFound) {
//			newTag := model.Tag{
//				ID:   uuid.New(),
//				Name: inputTag.Name,
//			}
//			if err := db.Create(&newTag).Error; err != nil {
//				return nil, fmt.Errorf("failed to create tag: %w", err)
//			}
//			tags = append(tags, &newTag)
//		} else {
//			return nil, fmt.Errorf("failed to check tag: %w", err)
//		}
//	}
//
//	return tags, nil
//}

//// CreatePost godoc
//// @Summary Create a new post
//// @Description Creates a new post for the authenticated user, type_example: ideas videos opinions analytics softwares
//// @Tags posts
//// @Accept multipart/form-data
//// @Produce json
//// @Security ApiKeyAuth
//// @Param post formData string true "Post JSON data (e.g. {\"content\":\"...\", \"media_url\":\"...\", \"title\":\"...\", \"type\":\"...\"})"
//// @Param files formData []file false "Files to upload"
//// @Param types formData []string false "Types of files (e.g. photo, video, document, audio)"
//// @Success 201 {object} types.PostResponse
//// @Failure 400 {object} types.FailureResponse
//// @Failure 500 {object} types.FailureErrorResponse
//// @Router /posts/create [post]
//func (h *Handler) CreatePost(c *fiber.Ctx) error {
//	claims := c.Locals("claims").(*typex.SessionClaims)
//	userPtr, err := h.getUserByEmail(claims.Email)
//	if err != nil || userPtr == nil {
//		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
//			Status:  "error",
//			Message: "Internal server error (user not found)",
//			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
//		})
//	}
//
//	postJson := c.FormValue("post")
//	var postForm types.CreatePostRequest
//	if err := json.Unmarshal([]byte(postJson), &postForm); err != nil {
//		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
//			"status":  "error",
//			"message": "Invalid JSON in 'post' field",
//		})
//	}
//
//	errorsLocal, err := validation.ValidateStruct(postForm)
//	if err != nil {
//		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
//			Status:  "error",
//			Message: "Validation failed",
//			Errors:  errorsLocal,
//		})
//	}
//
//	tags, err := h.processTags(h.db, postForm.Tags)
//	if err != nil {
//		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
//			"status":  "error",
//			"message": err.Error(),
//		})
//	}
//
//	newPost := model.Post{
//		UserId:   userPtr.ID,
//		Type:     postForm.Type,
//		Title:    postForm.Title,
//		Content:  postForm.Content,
//		MediaURL: postForm.MediaURL,
//		Payment:  postForm.Payment,
//		Tags:     tags,
//	}
//
//	if err := h.db.Create(&newPost).Error; err != nil {
//		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
//			Status:  "error",
//			Message: "Failed to create post",
//			Error:   err.Error(),
//		})
//	}
//
//	author, _ := h.getUserById(newPost.UserId)
//	postUUID := newPost.ID
//	postId := postUUID.String()
//
//	var responseFiles []*types.FileCreate
//	form, err := c.MultipartForm()
//
//	fileRestrictions := map[string]struct {
//		Extensions []string
//		MaxSize    int64
//	}{
//		"photo": {
//			Extensions: []string{".jpg", ".jpeg", ".png", ".webp"},
//			MaxSize:    10 * 1024 * 1024, // 10 MB
//		},
//		"video": {
//			Extensions: []string{".mp4", ".mov", ".avi", ".webm", ".mkv"},
//			MaxSize:    500 * 1024 * 1024, // 500 MB
//		},
//		"document": {
//			Extensions: []string{".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".rtf"},
//			MaxSize:    20 * 1024 * 1024, // 20 MB
//		},
//		"audio": {
//			Extensions: []string{".mp3", ".wav", ".aac", ".ogg", ".flac"},
//			MaxSize:    20 * 1024 * 1024, // 20 MB
//		},
//	}
//	if err == nil {
//		files := form.File["files"]
//		fileTypesStr := form.Value["types"]
//
//		if len(files) > 0 {
//			var fileTypes []string
//			if len(fileTypesStr) > 0 {
//				fileTypes = strings.Split(fileTypesStr[0], ",")
//			}
//
//			if len(files) != len(fileTypes) {
//				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
//					"error": "The number of files and types must match",
//				})
//			}
//
//			tx := h.db.Begin()
//			defer func() {
//				if r := recover(); r != nil {
//					tx.Rollback()
//				}
//			}()
//
//			var post model.Post
//			if err := tx.First(&post, "id = ?", postUUID).Error; err != nil {
//				tx.Rollback()
//				return c.Status(404).JSON(fiber.Map{"error": "Post not found"})
//			}
//			for i, fileHeader := range files {
//				fileType := fileTypes[i]
//				restrictions, ok := fileRestrictions[fileType]
//				if !ok {
//					tx.Rollback()
//					return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
//						"error": fmt.Sprintf("Invalid file type: %s", fileType),
//					})
//				}
//
//				ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
//				validExt := false
//				for _, allowedExt := range restrictions.Extensions {
//					if ext == allowedExt {
//						validExt = true
//						break
//					}
//				}
//
//				if !validExt {
//					tx.Rollback()
//					return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
//						"error": fmt.Sprintf("Invalid file extension for %s: %s. Allowed: %v",
//							fileType, ext, restrictions.Extensions),
//					})
//				}
//
//				if fileHeader.Size > restrictions.MaxSize {
//					tx.Rollback()
//					return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
//						"error": fmt.Sprintf("File %s exceeds maximum size for %s (%d MB)",
//							fileHeader.Filename, fileType, restrictions.MaxSize/(1024*1024)),
//					})
//				}
//
//			}
//
//			for i, fileHeader := range files {
//				fileType := fileTypes[i]
//				f, err := fileHeader.Open()
//				if err != nil {
//					return c.Status(500).JSON(fiber.Map{
//						"error": fmt.Sprintf("Failed to open file %s", fileHeader.Filename),
//					})
//				}
//
//				fileId := uuid.New()
//				fileName, url, err := h.S3Client.UploadFile(context.TODO(), f, postId, fileId.String(), h.cfg.S3ContentBucketName, h.cfg.S3Endpoint)
//				log.Println(url)
//				f.Close()
//				if err != nil {
//					tx.Rollback()
//					return c.Status(500).JSON(fiber.Map{
//						"error": fmt.Sprintf("Failed to upload file %s", fileHeader.Filename),
//					})
//				}
//
//				newFile := model.File{
//					ID:       fileId,
//					Name:     fileName,
//					UserName: fileHeader.Filename,
//					FileSize: fileHeader.Size,
//					Ext:      filepath.Ext(fileHeader.Filename),
//					Type:     fileType,
//					PostID:   post.ID,
//				}
//
//				if err := tx.Create(&newFile).Error; err != nil {
//					tx.Rollback()
//					return c.Status(500).JSON(fiber.Map{"error": "Failed to save file"})
//				}
//				urlFile := h.S3Client.GeneratePresignedURL(context.TODO(), newFile.Name, post.ID.String(), h.cfg.S3ContentBucketName)
//				if url == "" {
//					return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
//						Status:  "error",
//						Message: "Failed to generate presigned url",
//					})
//				}
//
//				responseFiles = append(responseFiles, &types.FileCreate{
//					ID:       newFile.ID,
//					Name:     newFile.Name,
//					UserName: newFile.UserName,
//					FileSize: newFile.FileSize,
//					Ext:      newFile.Ext,
//					Type:     newFile.Type,
//					Url:      urlFile,
//				})
//			}
//
//			if err := tx.Commit().Error; err != nil {
//				return c.Status(500).JSON(fiber.Map{"error": "Failed to commit transaction"})
//			}
//		}
//	}
//
//	postForIndex := types.IndexPost{
//		ID:       newPost.ID,
//		UserId:   newPost.UserId,
//		UserName: author.Username,
//		Type:     newPost.Type,
//		Title:    newPost.Title,
//		Content:  newPost.Content,
//		MediaURL: newPost.MediaURL,
//		Payment:  newPost.Payment,
//		Tags: utilx.Mapping(newPost.Tags, func(x *model.Tag) *types.Tag {
//			return &types.Tag{
//				ID:   x.ID,
//				Name: x.Name,
//			}
//		}),
//		Files:     responseFiles,
//		CreatedAt: newPost.CreatedAt,
//	}
//	body, err := json.Marshal(postForIndex)
//	if err != nil {
//		log.Println("Failed to marshal post for ES:", err)
//	} else {
//		req := esapi.IndexRequest{
//			Index:      "posts",
//			DocumentID: postForIndex.ID.String(),
//			Body:       strings.NewReader(string(body)),
//			Refresh:    "true",
//		}
//		res, err := req.Do(context.Background(), h.ES)
//		if err != nil {
//			log.Printf("Failed to index post in Elasticsearch: %v", err)
//		}
//		defer res.Body.Close()
//
//		if res.IsError() {
//			log.Printf("Elasticsearch returned error response: %s", res.String())
//		}
//
//	}
//
//	return c.Status(fiber.StatusCreated).JSON(types.PostCreateResponse{
//		Status: "success",
//		Data: types.PostCreate{
//			ID:       newPost.ID,
//			UserId:   newPost.UserId,
//			UserName: author.Username,
//			Type:     newPost.Type,
//			Title:    newPost.Title,
//			Content:  newPost.Content,
//			MediaURL: newPost.MediaURL,
//			Payment:  newPost.Payment,
//			Files:    responseFiles,
//			Tags: utilx.Mapping(newPost.Tags, func(x *model.Tag) *types.Tag {
//				return &types.Tag{
//					ID:   x.ID,
//					Name: x.Name,
//				}
//			}),
//			CreatedAt: newPost.CreatedAt,
//		},
//	})
//}

// UpdatePost godoc
// @Summary Update an existing post
// @Description Updates an existing post for the authenticated user
// @Tags posts
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path string true "Post ID"
// @Param post body types.UpdatePostRequest true "Updated post data"
// @Success 200 {object} types.PostResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 404 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /posts/{id} [put]
func (h *Handler) UpdatePost(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	postId := c.Params("id")
	postUuid, err := uuid.Parse(postId)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid post ID",
		})
	}

	var existingPost model.Post
	if err := h.db.Where("id = ?", postUuid).First(&existingPost).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(types.FailureResponse{
				Status:  "error",
				Message: "Post not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch post",
			Error:   err.Error(),
		})
	}

	if existingPost.UserId != userPtr.ID {
		return c.Status(fiber.StatusForbidden).JSON(types.FailureResponse{
			Status:  "error",
			Message: "You are not authorized to update this post",
		})
	}

	var requestBody types.UpdatePostRequest
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

	if requestBody.Title != "" {
		existingPost.Title = requestBody.Title
	}
	if requestBody.Content != "" {
		existingPost.Content = requestBody.Content
	}
	if requestBody.MediaURL != "" {
		existingPost.MediaURL = requestBody.MediaURL
	}
	if requestBody.Type != "" {
		existingPost.Type = requestBody.Type
	}
	if requestBody.Tags != nil {
		// Очистить старые связи
		if err := h.db.Model(&existingPost).Association("Tags").Clear(); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to clear existing tags",
				Error:   err.Error(),
			})
		}

		var updatedTags []*model.Tag
		for _, tagReq := range requestBody.Tags {
			var tag model.Tag
			// Проверить, существует ли тег с таким именем
			if err := h.db.Where("name = ?", tagReq.Name).First(&tag).Error; err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					// Если не найден — создать
					tag = model.Tag{
						ID:   uuid.New(),
						Name: tagReq.Name,
					}
					if err := h.db.Create(&tag).Error; err != nil {
						return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
							Status:  "error",
							Message: "Failed to create tag",
							Error:   err.Error(),
						})
					}
				} else {
					// Ошибка запроса
					return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
						Status:  "error",
						Message: "Failed to fetch tag",
						Error:   err.Error(),
					})
				}
			}
			updatedTags = append(updatedTags, &tag)
		}

		// Обновить связи
		if err := h.db.Model(&existingPost).Association("Tags").Replace(updatedTags); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to update tags",
				Error:   err.Error(),
			})
		}
	}

	if err := h.db.Save(&existingPost).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to update post",
			Error:   err.Error(),
		})
	}

	author, _ := h.getUserById(existingPost.UserId)
	likeCount, _ := h.getLikeCount(existingPost.ID)
	var likeAt, favoredAt *time.Time
	if userPtr != nil {
		likeAt, _ = h.getLikeAt(existingPost.ID, userPtr.ID)
		favoredAt, _ = h.getFavoredAt(existingPost.ID, userPtr.ID)
	}
	// Сформировать JSON-документ для обновления в Elasticsearch
	postForIndex := map[string]interface{}{
		"id":       existingPost.ID,
		"user_id":  existingPost.UserId,
		"title":    existingPost.Title,
		"content":  existingPost.Content,
		"mediaUrl": existingPost.MediaURL,
		"type":     existingPost.Type,
		"tags": utilx.Mapping(existingPost.Tags, func(x *model.Tag) string {
			return x.Name
		}),
		"createdAt": existingPost.CreatedAt,
	}

	body, err := json.Marshal(postForIndex)
	if err != nil {
		log.Printf("Failed to marshal post for ES: %v", err)
	} else {
		req := esapi.IndexRequest{
			Index:      "posts",
			DocumentID: existingPost.ID.String(),
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

	return c.JSON(types.PostResponse{
		Status: "success",
		Data: types.Post{
			ID:           existingPost.ID,
			UserId:       existingPost.UserId,
			UserEmail:    author.Email,
			AuthorAvatar: author.GetAvatarUrl(h.cfg.CdnPublicUrl),
			Type:         existingPost.Type,
			Title:        existingPost.Title,
			Content:      existingPost.Content,
			MediaURL:     existingPost.MediaURL,
			Payment:      existingPost.Payment,
			Tags: utilx.Mapping(existingPost.Tags, func(x *model.Tag) *types.Tag {
				return &types.Tag{
					ID:   x.ID,
					Name: x.Name,
				}
			}),
			LikeCount: likeCount,
			LikeAt:    likeAt,
			FavoredAt: favoredAt,
			CreatedAt: author.CreatedAt,
		},
	})
}

// DeletePost godoc
// @Summary Delete an existing post
// @Description Deletes an existing post for the authenticated user
// @Tags posts
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path string true "Post ID"
// @Success 200 {object} types.SuccessResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 404 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /posts/{id} [delete]
func (h *Handler) DeletePost(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}

	postId := c.Params("id")
	postUuid, err := uuid.Parse(postId)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid post ID",
		})
	}

	var existingPost model.Post
	if err := h.db.Where("id = ?", postUuid).First(&existingPost).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return c.Status(fiber.StatusNotFound).JSON(types.FailureResponse{
				Status:  "error",
				Message: "Post not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch post",
			Error:   err.Error(),
		})
	}

	if existingPost.UserId != userPtr.ID {
		return c.Status(fiber.StatusForbidden).JSON(types.FailureResponse{
			Status:  "error",
			Message: "You are not authorized to delete this post",
		})
	}
	// Очистка связей post <-> tags
	if err := h.db.Model(&existingPost).Association("Tags").Clear(); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to clear tags",
			Error:   err.Error(),
		})
	}
	if err := h.db.Delete(&existingPost).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to delete post",
			Error:   err.Error(),
		})
	}

	// Удаляем из Elasticsearch
	req := esapi.DeleteRequest{
		Index:      "posts",
		DocumentID: postUuid.String(),
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
		Message: "Post deleted successfully",
	})
}

//// PostUploadFiles godoc
//// @Summary Upload a file to S3
//// @Description Uploads a file to Object Storage
//// @Tags posts
//// @Accept multipart/form-data
//// @Produce json
//// @Security ApiKeyAuth
//// @Param files formData []file true "Files to upload"
//// @Param types formData []string true "Types of files (e.g. видео, скрипт, идея)"
//// @Param id path string true "Post ID"
//// @Success 200 {object} types.SuccessResponse{data=[]string} "URL of the uploaded file"
//// @Failure 400 {object} types.FailureResponse
//// @Failure 404 {object} types.FailureResponse
//// @Failure 500 {object} types.FailureErrorResponse
//// @Router /posts/{id}/files [post]
//func (h *Handler) PostUploadFiles(c *fiber.Ctx) error {
//	postId := c.Params("id")
//	postUUID, err := uuid.Parse(postId)
//	if err != nil {
//		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
//			Status:  "error",
//			Message: "Invalid post ID",
//		})
//	}
//
//	form, err := c.MultipartForm()
//	if err != nil {
//		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
//			"error": "Failed to parse form data",
//		})
//	}
//	files := form.File["files"]
//	if len(files) == 0 {
//		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
//			"error": "At least one file is required",
//		})
//	}
//	fileTypesStr := form.Value["types"]
//	var fileTypes []string
//	if len(fileTypesStr) > 0 {
//		fileTypes = strings.Split(fileTypesStr[0], ",")
//	}
//	if len(files) != len(fileTypes) {
//		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
//			"error": "The number of files and types must match",
//		})
//	}
//
//	var uploadedFiles []model.File
//	var uploadedURLs []string
//
//	tx := h.db.Begin()
//	defer func() {
//		if r := recover(); r != nil {
//			tx.Rollback()
//		}
//	}()
//
//	var post model.Post
//	if err := tx.First(&post, "id = ?", postUUID).Error; err != nil {
//		tx.Rollback()
//		return c.Status(404).JSON(fiber.Map{"error": "Post not found"})
//	}
//	for i, fileHeader := range files {
//		fileType := fileTypes[i] // Получаем тип для текущего файла
//		f, err := fileHeader.Open()
//		if err != nil {
//			return c.Status(500).JSON(fiber.Map{
//				"error": fmt.Sprintf("Failed to open file %s", fileHeader.Filename),
//			})
//		}
//		fileId := uuid.New()
//		fileName, url, err := h.S3Client.UploadFile(context.TODO(), f, postId, fileId.String(), h.cfg.S3ContentBucketName, h.cfg.S3Endpoint)
//		f.Close()
//		if err != nil {
//			tx.Rollback()
//			return c.Status(500).JSON(fiber.Map{
//				"error": fmt.Sprintf("Failed to upload file %s", fileHeader.Filename),
//			})
//		}
//
//		uploadedURLs = append(uploadedURLs, url)
//
//		newFile := model.File{
//			ID:       fileId,
//			Name:     fileName,
//			UserName: fileHeader.Filename,
//			FileSize: fileHeader.Size,
//			Ext:      filepath.Ext(fileHeader.Filename),
//			Type:     fileType,
//			PostID:   post.ID,
//		}
//
//		if err := tx.Create(&newFile).Error; err != nil {
//			tx.Rollback()
//			return c.Status(500).JSON(fiber.Map{"error": "Failed to save file"})
//		}
//
//		uploadedFiles = append(uploadedFiles, newFile)
//	}
//
//	if err := tx.Commit().Error; err != nil {
//		return c.Status(500).JSON(fiber.Map{"error": "Failed to commit transaction"})
//	}
//
//	var fileResponses []types.FileResponse
//
//	for _, file := range uploadedFiles {
//		fileResponses = append(fileResponses, types.FileResponse{
//			ID:  file.ID,
//			Url: fmt.Sprintf("https://%s/%s/%s", h.cfg.S3Endpoint, h.cfg.S3ContentBucketName, file.Name),
//		})
//	}
//
//	return c.Status(fiber.StatusCreated).JSON(types.StatusFilesResponse{
//		Status: "success",
//		Data: types.UploadFilesResponse{
//			ID:    postUUID,
//			Files: fileResponses,
//		},
//	})
//}

// DeletePostFiles godoc
// @Summary Delete files from post
// @Description Delete files from Object Storage and DB
// @Tags posts
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path string true "Post ID"
// @Param file_ids body types.DeleteFilesRequest true "File IDs to delete"
// @Success 200 {object} types.SuccessResponse{data=[]string} "Deleted file URLs"
// @Failure 400 {object} types.FailureResponse
// @Failure 404 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /posts/{id}/files [delete]
func (h *Handler) DeletePostFiles(c *fiber.Ctx) error {
	postId := c.Params("id")
	postUUID, err := uuid.Parse(postId)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid post ID",
		})
	}

	var body struct {
		FileIDs []string `json:"file_ids"`
	}
	if err := c.BodyParser(&body); err != nil || len(body.FileIDs) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid or missing file_ids",
		})
	}

	tx := h.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var post model.Post
	if err := tx.First(&post, "id = ?", postUUID).Error; err != nil {
		tx.Rollback()
		return c.Status(404).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Post not found",
		})
	}

	var fileUUIDs []uuid.UUID
	for _, idStr := range body.FileIDs {
		id, err := uuid.Parse(idStr)
		if err != nil {
			tx.Rollback()
			return c.Status(400).JSON(types.FailureResponse{
				Status:  "error",
				Message: fmt.Sprintf("Invalid file ID: %s", idStr),
			})
		}
		fileUUIDs = append(fileUUIDs, id)
	}

	var filesToDelete []model.File
	if err := tx.
		Where("id IN ? AND post_id = ?", fileUUIDs, post.ID).
		Find(&filesToDelete).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to find files to delete",
			Error:   err.Error(),
		})
	}

	if len(filesToDelete) == 0 {
		tx.Rollback()
		return c.Status(404).JSON(types.FailureResponse{
			Status:  "error",
			Message: "No matching files found for this post",
		})
	}

	var deletedURLs []string
	for _, file := range filesToDelete {
		s3Key := fmt.Sprintf("%s/%s/%s", h.cfg.S3ContentBucketName, postId, file.Name)

		if err := h.S3Client.DeleteFile(context.TODO(), s3Key); err != nil {
			tx.Rollback()
			return c.Status(500).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: fmt.Sprintf("Failed to delete file %s from S3", file.Name),
				Error:   err.Error(),
			})
		}

		deletedURLs = append(deletedURLs, fmt.Sprintf("https://%s/%s/%s", h.cfg.S3Endpoint, h.cfg.S3ContentBucketName, s3Key))

		if err := tx.Where("id = ? AND post_id = ?", file.ID, post.ID).Delete(&model.File{}).Error; err != nil {
			tx.Rollback()
			return c.Status(500).JSON(types.FailureErrorResponse{
				Status:  "error",
				Message: "Failed to delete file from database",
				Error:   err.Error(),
			})
		}
	}

	if err := tx.Commit().Error; err != nil {
		return c.Status(500).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to commit transaction",
			Error:   err.Error(),
		})
	}

	return c.JSON(types.SuccessResponse{
		Status:  "success",
		Message: "Files deleted successfully",
	})
}

// SubscribeToPost godoc
// @Summary Subscribe to a post
// @Description Subscribe the authenticated user to a post
// @Tags posts
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param postId path string true "Post ID"
// @Success 201 {object} types.SuccessResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 403 {object} types.FailureResponse
// @Failure 404 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /posts/{postId}/subscribe [post]
func (h *Handler) SubscribeToPost(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}
	postID := strings.TrimSpace(c.Params("postId")) // Удаляем возможные пробелы

	log.Printf("Attempting to subscribe to post with ID: %s", postID)

	postUuid, err := uuid.Parse(postID)
	if err != nil {
		log.Printf("Failed to parse post ID '%s': %v", postID, err)
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid post ID format",
		})
	}

	var post model.Post
	if err := h.db.Debug().First(&post, "id = ?", postUuid).Error; err != nil {
		log.Printf("Post lookup failed for ID %v: %v", postUuid, err)
		return c.Status(fiber.StatusNotFound).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Post not found",
		})
	}
	if post.Payment == nil {
		log.Println("Payment is NULL")
		return c.Status(fiber.StatusNotFound).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Post is free",
		})
	}

	log.Printf("Found post: %+v", post)

	if post.UserId == userPtr.ID {
		return c.Status(fiber.StatusForbidden).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Cannot subscribe to your own post",
		})
	}

	var existingSub model.Postsubscription
	if err := h.db.Where("user_id = ? AND post_id = ?", userPtr.ID, postUuid).First(&existingSub).Error; err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Already subscribed to this post",
		})
	}
	followedId := uuid.New()
	subscription := model.Postsubscription{
		UserID:     userPtr.ID,
		PostID:     postUuid,
		FollowedID: followedId,
		IsActive:   true,
	}

	if err := h.db.Create(&subscription).Error; err != nil {
		log.Printf("Subscription creation failed: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to subscribe",
			Error:   err.Error(),
		})
	}

	// create message
	userPost, _ := h.getUserById(post.UserId)
	messageData := map[string]string{
		"type":              "subscribe_post",
		"user_email":        userPost.Email,
		"data":              postUuid.String(),
		"post_title":        post.Title,
		"target_user_name":  userPtr.Username,
		"target_user_email": userPtr.Email,
	}

	queue.PushMessage(post.UserId.String(), messageData, userPtr.ID.String(), h.cfg)

	return c.Status(fiber.StatusCreated).JSON(types.SuccessResponse{
		Status:  "success",
		Message: "Subscribed successfully",
	})
}

// UnsubscribeFromPost godoc
// @Summary Unsubscribe from a post
// @Description Unsubscribe the authenticated user from a post
// @Tags posts
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param postId path string true "Post ID"
// @Success 200 {object} types.SuccessResponse
// @Failure 400 {object} types.FailureResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /posts/{postId}/unsubscribe [delete]
func (h *Handler) UnsubscribeFromPost(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*typex.SessionClaims)
	userPtr, err := h.getUserByEmail(claims.Email)
	if err != nil || userPtr == nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Internal server error (user not found)",
			Error:   fmt.Sprintf("user with email %v not found", claims.Email),
		})
	}
	postID := c.Params("postId")
	postUuid, err := uuid.Parse(postID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid post ID",
		})
	}

	var subscription model.Postsubscription
	if err := h.db.Where("user_id = ? AND post_id = ?", userPtr.ID, postUuid).First(&subscription).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Subscription not found",
		})
	}

	if err := h.db.Delete(&subscription).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to unsubscribe",
			Error:   err.Error(),
		})
	}

	return c.JSON(types.SuccessResponse{
		Status:  "success",
		Message: "Unsubscribed successfully",
	})
}

//// GetPostsByUserWithSubscriptions godoc
//// @Summary Get all posts by userId
//// @Description Returns all posts with pagination and sorting
//// @Tags posts
//// @Accept json
//// @Produce json
//// @Param userId path string true "User ID"
//// @Param page query int false "Page number (default: 1, min: 1)"
//// @Param page_size query int false "Number of items per page (default: 10, max: 1000)"
//// @Param sort_type query string false "Sort type: latest or recommended (default: latest)"
//// @Success 200 {object} types.PostsResponse "Success response with pagination"
//// @Failure 400 {object} types.FailureResponse "Invalid pagination parameters"
//// @Failure 500 {object} types.FailureErrorResponse "Server error"
//// @Router /posts/user/{userId}/with-subscription [get]
//func (h *Handler) GetPostsByUserWithSubscriptions(c *fiber.Ctx) error {
//	claims := c.Locals("claims").(*typex.SessionClaims)
//
//	authorIdText := c.Params("userId")
//	authorId, _ := uuid.Parse(authorIdText)
//
//	pagination := types.PaginationRequest{
//		Page:     1,
//		PageSize: 10,
//		SortType: "latest",
//	}
//	if err := c.QueryParser(&pagination); err != nil {
//		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
//			Status:  "error",
//			Message: "Invalid pagination parameters",
//		})
//	}
//
//	if pagination.Page < 1 {
//		pagination.Page = 1
//	}
//	if pagination.PageSize < 1 || pagination.PageSize > 1000 {
//		pagination.PageSize = 10
//	}
//	if pagination.SortType != "latest" && pagination.SortType != "recommended" {
//		pagination.SortType = "latest"
//	}
//
//	offset := (pagination.Page - 1) * pagination.PageSize
//
//	var posts []model.Post
//	query := h.db.Preload("Files").Model(&posts)
//
//	var totalRecords int64
//	if err := query.Count(&totalRecords).Error; err != nil {
//		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
//			Status:  "error",
//			Message: "Failed to count posts",
//			Error:   err.Error(),
//		})
//	}
//
//	if pagination.SortType == "recommended" {
//		query = query.Order("created_at DESC")
//	} else {
//		query = query.Order("created_at DESC")
//	}
//
//	if err := query.Offset(offset).Limit(pagination.PageSize).Find(&posts).Error; err != nil {
//		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
//			Status:  "error",
//			Message: "Failed to fetch posts",
//			Error:   err.Error(),
//		})
//	}
//
//	responsePosts := make([]types.Post, min(len(posts), pagination.PageSize))
//	for i, post := range posts[:min(len(posts), pagination.PageSize)] {
//		var responseFiles []*types.File
//		for _, f := range post.Files {
//			url := h.S3Client.GeneratePresignedURL(context.TODO(), f.Name, post.ID.String(), h.cfg.S3ContentBucketName)
//			if url == "" {
//				return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
//					Status:  "error",
//					Message: "Failed to generate presigned url",
//				})
//			}
//			responseFiles = append(responseFiles, &types.File{
//				ID:       f.ID,
//				Name:     f.Name,
//				UserName: f.UserName,
//				FileSize: f.FileSize,
//				Ext:      f.Ext,
//				Type:     f.Type,
//				Url:      url,
//			})
//		}
//		NeedPayment := false
//		if post.Payment != nil && post.UserId != authorId {
//			var subscription model.Postsubscription
//			if err := h.db.Where("user_id = ? AND post_id = ?", authorId, post.ID).First(&subscription).Error; err != nil {
//				NeedPayment = true
//			}
//		}
//
//		author, _ := h.getUserById(post.UserId)
//		likeCount, _ := h.getLikeCount(post.ID)
//		var likeAt, favoredAt *time.Time
//		if claims != nil {
//			likeAt, _ = h.getLikeAt(post.ID, claims.UserId)
//			favoredAt, _ = h.getFavoredAt(post.ID, claims.UserId)
//		}
//
//		responsePosts[i] = types.Post{
//			ID:       post.ID,
//			UserId:   post.UserId,
//			UserName: author.Username,
//			Type:     post.Type,
//			Title:    post.Title,
//			Content:  post.Content,
//			MediaURL: post.MediaURL,
//			Payment:  post.Payment,
//			Tags: utilx.Mapping(post.Tags, func(x *model.Tag) *types.Tag {
//				return &types.Tag{
//					Name: x.Name,
//				}
//			}),
//			Files:       responseFiles,
//			LikeCount:   likeCount,
//			LikeAt:      likeAt,
//			FavoredAt:   favoredAt,
//			CreatedAt:   post.CreatedAt,
//			NeedPayment: NeedPayment,
//		}
//	}
//
//	totalPages := int(math.Ceil(float64(totalRecords) / float64(pagination.PageSize)))
//
//	return c.JSON(types.PostsResponse{
//		Status: "success",
//		Data:   responsePosts,
//		Pagination: types.PaginationResponse{
//			CurrentPage:  pagination.Page,
//			PageSize:     pagination.PageSize,
//			TotalPages:   totalPages,
//			TotalRecords: totalRecords,
//		},
//	})
//}

// SearchTags godoc
// @Summary Search tags by name (autocomplete)
// @Description Returns tags that match the query (prefix or substring match)
// @Tags posts
// @Accept json
// @Produce json
// @Param q query string false "Search query"
// @Param page query int false "Page number (default: 1, min: 1)"
// @Param page_size query int false "Number of items per page (default: 10, max: 1000)"
// @Success 200 {object} types.TagSearchResponse
// @Failure 500 {object} types.FailureErrorResponse
// @Router /posts/search/tags [get]
func (h *Handler) SearchTags(c *fiber.Ctx) error {
	query := c.Query("q", "")
	page := c.QueryInt("page", 1)
	pageSize := c.QueryInt("page_size", 10)

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 1000 {
		pageSize = 10
	}
	dbQuery := h.db.Model(&model.Tag{})
	if query != "" {
		dbQuery = dbQuery.Where("name ILIKE ?", "%"+query+"%")
	}
	var totalRecords int64
	if err := dbQuery.Count(&totalRecords).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to count tags",
			Error:   err.Error(),
		})
	}

	offset := (page - 1) * pageSize
	var tags []model.Tag
	if err := dbQuery.Order("name ASC").Offset(offset).Limit(pageSize).Find(&tags).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to fetch tags",
			Error:   err.Error(),
		})
	}

	totalPages := int(math.Ceil(float64(totalRecords) / float64(pageSize)))
	responseTags := make([]*types.Tag, min(len(tags), pageSize))
	for i, tag := range tags[:min(len(tags), pageSize)] {
		responseTags[i] = &types.Tag{
			ID:   tag.ID,
			Name: tag.Name,
		}
	}

	return c.JSON(types.TagSearchResponse{
		Status: "success",
		Data:   responseTags,
		Pagination: types.PaginationResponse{
			CurrentPage:  page,
			PageSize:     pageSize,
			TotalPages:   totalPages,
			TotalRecords: totalRecords,
		},
	})
}

func addWeightsToArray(q string) []string {
	arrQ := strings.Split(q, ",")
	res := make([]string, 0, len(arrQ))

	for i, elem := range arrQ {
		weight := len(arrQ) - i
		res = append(res, fmt.Sprintf("%s^%d", strings.TrimSpace(elem), weight))
	}
	return res
}

// // SearchPosts godoc
// // @Summary Get all posts with search
// // @Description Returns all posts with pagination and sorting
// // @Tags posts
// // @Accept json
// // @Produce json
// // @Param userId query string false "User ID"
// // @Param q query string false "query for search"
// // @Param sort query string false "field for search desc: title, content, type, created, popular, popular-created, created-popular. default without q -> sort = created. default with q -> sort = "" (additional sort after relevant)."
// // @Param page query int false "Page number (default: 1, min: 1)"
// // @Param page_size query int false "Number of items per page (default: 10, max: 1000)"
// // @Param sort_type query string false "Sort order: title,content,type"
// // @Param tags query string false "Sort by tags: ex.: idea,video"
// // @Param type query string false "Filter by post type: ideas videos opinions analytics softwares"
// // @Success 200 {object} types.PostsResponse "Success response with pagination"
// // @Failure 400 {object} types.FailureResponse "Invalid pagination parameters"
// // @Failure 500 {object} types.FailureErrorResponse "Server error"
// // @Router /posts/search [get]
//
//	func (h *Handler) SearchPosts(c *fiber.Ctx) error {
//		ctx := context.Background()
//		page, limit := parsePaginationParams(c)
//		sortField := parseSortField(c)
//		sortArray := addWeightsToArray(c.Query("sort_type", "title,content"))
//		queryText := c.Query("q", "")
//		authorId := parseUserID(c.Query("userId"))
//		tagsParam := c.Query("tags", "")
//		typeParam := c.Query("type", "")
//
//		var tags []string
//		if tagsParam != "" {
//			tags = strings.Split(tagsParam, ",")
//			for i := range tags {
//				tags[i] = strings.TrimSpace(tags[i])
//			}
//		}
//
//		var postType *string
//		if typeParam != "" {
//			trimmed := strings.TrimSpace(typeParam)
//			postType = &trimmed
//		}
//
//		searchQuery := buildSearchQuery(queryText, sortArray, sortField, page, limit, tags, postType)
//		esResp, err := h.executeSearch(ctx, searchQuery)
//		if err != nil {
//			return c.Status(fiber.StatusInternalServerError).JSON(types.FailureResponse{
//				Status:  "error",
//				Message: err.Error(),
//			})
//		}
//		posts, err := h.buildPostsResponse(esResp, authorId, sortField)
//		if err != nil {
//			return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
//				Status:  "error",
//				Message: err.Error(),
//			})
//		}
//		total := esResp.Hits.Total.Value
//		totalPages := int(math.Ceil(float64(total) / float64(limit)))
//		return c.JSON(types.PostsResponse{
//			Status: "success",
//			Data:   posts,
//			Pagination: types.PaginationResponse{
//				CurrentPage:  page,
//				PageSize:     limit,
//				TotalPages:   totalPages,
//				TotalRecords: int64(total),
//			},
//		})
//	}
func parsePaginationParams(c *fiber.Ctx) (page int, limit int) {
	page, _ = strconv.Atoi(c.Query("page", "1"))
	if page < 1 {
		page = 1
	}
	limit, _ = strconv.Atoi(c.Query("page_size", "10"))
	if limit < 1 || limit > 100 {
		limit = 10
	}
	return
}

func parseSortField(c *fiber.Ctx) string {
	validSortFields := map[string]string{
		"title":           "title.keyword",
		"content":         "content.keyword",
		"type":            "type.keyword",
		"created":         "created",
		"popular":         "popular",
		"popular-created": "popular-created",
		"created-popular": "created-popular",
	}
	sortFieldRaw := c.Query("sort", "")
	if sf, ok := validSortFields[sortFieldRaw]; ok {
		return sf
	}
	return ""
}

func parseUserID(userIdText string) uuid.UUID {
	authorId, err := uuid.Parse(userIdText)
	if err != nil {
		return uuid.Nil
	}
	return authorId
}

func buildSearchQuery(queryText string, sortArray []string, sortField string, page, limit int, tags []string, postType *string) map[string]interface{} {
	from := (page - 1) * limit
	var filterClauses []map[string]interface{}

	if len(tags) > 0 {
		filterClauses = append(filterClauses, map[string]interface{}{
			"nested": map[string]interface{}{
				"path": "tags",
				"query": map[string]interface{}{
					"terms": map[string]interface{}{
						"tags.name.keyword": tags,
					},
				},
			},
		})
	}

	if postType != nil && *postType != "" {
		filterClauses = append(filterClauses, map[string]interface{}{
			"term": map[string]interface{}{
				"type.keyword": strings.ToLower(*postType),
			},
		})
	}

	if queryText != "" {
		terms := strings.Split(queryText, ",")
		for i := range terms {
			terms[i] = strings.TrimSpace(terms[i])
		}

		var shouldClauses []map[string]interface{}
		for _, term := range terms {
			if term != "" {
				postsQuery := map[string]interface{}{
					"bool": map[string]interface{}{
						"must": []map[string]interface{}{
							{"term": map[string]interface{}{"_index": "posts"}},
							{
								"multi_match": map[string]interface{}{
									"query":                term,
									"fields":               sortArray,
									"fuzziness":            "AUTO",
									"type":                 "most_fields",
									"tie_breaker":          0.3,
									"minimum_should_match": "30%",
								},
							},
						},
						"boost": 2.0,
					},
				}
				blocksQuery := map[string]interface{}{
					"bool": map[string]interface{}{
						"must": []map[string]interface{}{
							{"term": map[string]interface{}{"_index": "blocks"}},
							{
								"match": map[string]interface{}{
									"content": map[string]interface{}{
										"query":     term,
										"fuzziness": "AUTO",
										"boost":     0.8,
									},
								},
							},
						},
						"boost": 1.0,
					},
				}
				shouldClauses = append(shouldClauses, postsQuery, blocksQuery)
			}
		}

		return map[string]interface{}{
			"from": from,
			"size": limit,
			"sort": getRelevanceSort(sortField),
			"query": map[string]interface{}{
				"bool": map[string]interface{}{
					"should":               shouldClauses,
					"minimum_should_match": 1,
					"filter":               filterClauses,
				},
			},
		}
	}
	queryPart := map[string]interface{}{
		"match_all": map[string]interface{}{},
	}
	if len(filterClauses) > 0 {
		queryPart = map[string]interface{}{
			"bool": map[string]interface{}{
				"filter": filterClauses,
			},
		}
	}
	return map[string]interface{}{
		"from":  from,
		"size":  limit,
		"sort":  getCreatedAtSort(sortField),
		"query": queryPart,
	}
}

func getRelevanceSort(sortField string) []map[string]interface{} {
	if sortField != "" && sortField != "popular" && sortField != "popular-created" {
		if sortField == "created-popular" {
			sortField = "created"
		}
		return []map[string]interface{}{
			{"_score": map[string]interface{}{"order": "desc"}},
			{sortField: map[string]interface{}{"order": "desc"}},
		}
	}
	return []map[string]interface{}{
		{"_score": map[string]interface{}{"order": "desc"}},
	}

}

func getCreatedAtSort(sortField string) []map[string]interface{} {
	if sortField == "" || sortField == "created-popular" {
		sortField = "created"
	} else {
		if sortField == "popular" || sortField == "popular-created" {
			return []map[string]interface{}{}
		}
	}
	return []map[string]interface{}{
		{sortField: map[string]string{"order": "desc"}},
	}
}

func (h *Handler) executeSearch(ctx context.Context, searchQuery map[string]interface{}) (*esResponse, error) {
	body, err := json.Marshal(searchQuery)
	if err != nil {
		return nil, fmt.Errorf("failed to build search query: %w", err)
	}

	res, err := h.ES.Search(
		h.ES.Search.WithContext(ctx),
		h.ES.Search.WithIndex("posts,blocks"),
		h.ES.Search.WithBody(bytes.NewReader(body)),
		h.ES.Search.WithSort("created:desc"),
		h.ES.Search.WithTrackTotalHits(true),
	)
	if err != nil {
		return nil, fmt.Errorf("search execution failed: %w", err)
	}
	defer res.Body.Close()

	if res.IsError() {
		var buf bytes.Buffer
		_, _ = buf.ReadFrom(res.Body)
		return nil, fmt.Errorf("search execution failed: %s", buf.String())
	}

	var esResp esResponse
	rawBody, _ := io.ReadAll(res.Body)
	log.Printf("Raw Elasticsearch response: %s", string(rawBody))

	// Переиспользуем тело для парсинга
	if err := json.NewDecoder(bytes.NewReader(rawBody)).Decode(&esResp); err != nil {
		return nil, fmt.Errorf("failed to parse search result: %w", err)
	}

	return &esResp, nil
}

func (h *Handler) buildPostsResponse(esResp *esResponse, authorId uuid.UUID, sortField string) ([]types.PostV2, error) {
	var posts []types.PostV2
	var rawPosts []model.Post
	var postOrder []uuid.UUID

	for _, hit := range esResp.Hits.Hits {
		if hit.Index == "posts" {
			postId := hit.Source["id"].(string)
			postUUID, _ := uuid.Parse(postId)
			postOrder = append(postOrder, postUUID)
		} else if hit.Index == "blocks" {
			shouldAddPost := true
			postId := hit.Source["post_id"].(string)
			postUUID, _ := uuid.Parse(postId)
			for _, elem := range esResp.Hits.Hits {
				idElem, _ := uuid.Parse(elem.Source["id"].(string))
				log.Println(idElem)
				if idElem == postUUID && elem.Index == "posts" {
					shouldAddPost = false
				}
			}
			if shouldAddPost {
				postOrder = append(postOrder, postUUID)
			}
		}
	}
	postOrder = removeDuplicates(postOrder)
	log.Printf("Post Order: %v", postOrder)

	if err := h.db.Preload("Blocks").Preload("Blocks.Files").Preload("Tags").
		Where("id IN (?)", postOrder).
		Find(&rawPosts).Error; err != nil {
		return nil, err
	}

	postMap := make(map[uuid.UUID]types.PostV2)
	for _, post := range rawPosts {
		getPost, err := h.GetPostInfoByID(nil, authorId.String(), post, true)
		if err != nil {
			return nil, err
		}
		postMap[post.ID] = *getPost
	}
	for _, object := range postOrder {
		posts = append(posts, postMap[object])
	}

	switch sortField {
	case "popular": // relevant -> popular
		sort.Slice(posts, func(i, j int) bool {
			return posts[i].LikeCount > posts[j].LikeCount
		})
	case "popular-created": // relevant -> popular -> created
		sort.Slice(posts, func(i, j int) bool {
			if posts[i].LikeCount != posts[j].LikeCount {
				return posts[i].LikeCount > posts[j].LikeCount
			}
			return posts[i].CreatedAt.After(posts[j].CreatedAt)
		})
	case "created-popular": // relevant -> created -> popular
		sort.Slice(posts, func(i, j int) bool {
			return posts[i].LikeCount > posts[j].LikeCount
		})
	}
	return posts, nil
}

type esResponse struct {
	Hits struct {
		Total struct {
			Value int `json:"value"`
		} `json:"total"`
		Hits []struct {
			Source map[string]interface{} `json:"_source"`
			Index  string                 `json:"_index"`
			ID     string                 `json:"_id"`
		} `json:"hits"`
	} `json:"hits"`
}

func removeDuplicates[T comparable](slice []T) []T {
	seen := make(map[T]bool)
	result := make([]T, 0)

	for _, item := range slice {
		if !seen[item] {
			seen[item] = true
			result = append(result, item)
		}
	}
	return result
}
