package handler

import (
	"errors"
	"fmt"
	"time"

	"github.com/Capstane/AXA-socialweb-posts/internal/model"
	"github.com/Capstane/AXA-socialweb-posts/internal/s3"
	"github.com/Capstane/authlib/fiberx"
	"github.com/Capstane/authlib/typex"
	"github.com/elastic/go-elasticsearch/v8"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"

	"github.com/Capstane/AXA-socialweb-posts/internal/config"
	"github.com/Capstane/AXA-socialweb-posts/internal/web_logs"
)

type Handler struct {
	db       *gorm.DB
	cfg      *config.Config
	S3Client *s3.S3Client
	ES       *elasticsearch.Client
}

func NewHandler(db *gorm.DB, cfg *config.Config, s3Client *s3.S3Client, elastic *elasticsearch.Client) *Handler {
	return &Handler{
		db:       db,
		cfg:      cfg,
		S3Client: s3Client,
		ES:       elastic,
	}
}

func webLogsHandler(c *fiber.Ctx) error {
	return c.Send([]byte(web_logs.WebLogs.Text(true)))
}

func (h *Handler) SetupRoutes(app *fiber.App) {

	logs := app.Group("/logs")
	logs.Get("/", webLogsHandler)

	api := app.Group("/api")
	v1 := api.Group("/v1")

	docs := v1.Group("docs")
	docs.Get("*", swagger.New(swagger.Config{
		Title: "Socialweb API",
		// BasePath: "/api/v1",
		// FilePath: "./docs/swagger.yaml",
		// Path:     "docs",
		// CacheAge: 1,
		DeepLinking:  true,
		DocExpansion: "list",
		// Custom JavaScript (enable cookies)
		CustomStyle: `
			window.onload = function() {
				const ui = SwaggerUIBundle({
					url: "/api/v1/docs/swagger.yaml",
					dom_id: '#swagger-ui',
					presets: [
						SwaggerUIBundle.presets.apis,
						SwaggerUIBundle.SwaggerUIStandalonePreset
					],
					requestInterceptor: (request) => {
						request.credentials = 'include';
						return request;
					}
				});
				window.ui = ui;
			}
		`,
	}))

	posts := v1.Group("/posts")
	posts.Use(fiberx.SessionProtection(fiberx.Config{
		SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
		UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
		UserSessionMapper: h.GetSessionMapper(),
		UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
		Optional:          true,
	}))
	{
		posts.Get("/search/tags", h.SearchTags)
		posts.Get("/search", h.SearchPosts)
		//posts.Get("/user/:userId/with-subscription", h.GetPostsByUserWithSubscriptions)
		posts.Get("/user/:userId", h.GetPostsByUserEmail)
		posts.Get("/:id", h.GetPostByIdV2)
	}

	// Защищенные маршруты - с session middleware
	postsProtected := posts.Group("/")
	postsProtected.Use(fiberx.SessionProtection(fiberx.Config{
		SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
		UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
		UserSessionMapper: h.GetSessionMapper(),
		UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
	}))
	{
		postsProtected.Get("/", h.GetAllPostsV2)
		postsProtected.Post("/create", h.CreatePostV2) // поменял на сессию
		postsProtected.Put("/block/:id", h.UpdateBlock)
		postsProtected.Delete("/block/:id", h.DeleteBlock)
		postsProtected.Put("/:id", h.UpdatePost)    // поменял на сессию
		postsProtected.Delete("/:id", h.DeletePost) // поменял на сессию
		//postsProtected.Post("/:id/files", h.PostUploadFiles)                 // ок
		postsProtected.Delete("/:id/files", h.DeletePostFiles)               // ок
		postsProtected.Post("/:postId/subscribe", h.SubscribeToPost)         // поменял на сессию
		postsProtected.Delete("/:postId/unsubscribe", h.UnsubscribeFromPost) // поменял на сессию
	}
}

func (h *Handler) GetSessionMapper() fiberx.SessionMapper {
	return func(globalUserData fiberx.SessionData) (*typex.SessionClaims, error) {
		var user model.User
		tx := h.db.Where("email = ?", globalUserData.AuthUserEmail).First(&user)
		if err := tx.Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// Create user with confirmed email
				user := model.User{
					Email:          globalUserData.AuthUserEmail,
					Username:       globalUserData.AuthUserEmail, // Using email as username by default
					EmailConfirmed: true,                         // Skip email confirmation
				}

				tx := h.db.Create(&user)
				if err := tx.Error; err != nil {
					log.Error().Msgf("sync users with global database fail, issue is %v", err)
				}

				return &typex.SessionClaims{
					UserId:      user.ID,
					Username:    user.Username,
					Email:       globalUserData.AuthUserEmail,
					Roles:       user.Roles,
					Permissions: []string{},
					Exp:         time.Now().Add(h.cfg.UserSessionTtl),
				}, nil
			}

			return nil, err
		}
		return &typex.SessionClaims{
			UserId:      user.ID,
			Username:    user.Username,
			Email:       globalUserData.AuthUserEmail,
			Roles:       user.Roles,
			Permissions: []string{},
			Exp:         time.Now().Add(h.cfg.UserSessionTtl),
		}, nil
	}
}

func (h *Handler) getUserByEmail(e string) (*model.User, error) {
	var user model.User
	if err := h.db.Where(&model.User{Email: e}).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("User not found")
		}
		return nil, err
	}
	return &user, nil
}
