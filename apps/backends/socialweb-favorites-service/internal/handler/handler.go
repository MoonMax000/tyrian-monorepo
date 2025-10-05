package handler

import (
	"errors"
	"github.com/Capstane/AXA-socialweb-favorites/internal/s3"
	"time"

	"github.com/rs/zerolog/log"

	"github.com/Capstane/AXA-socialweb-favorites/internal/config"
	"github.com/Capstane/AXA-socialweb-favorites/internal/model"
	"github.com/Capstane/authlib/fiberx"
	"github.com/Capstane/authlib/typex"
	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
	"gorm.io/gorm"
)

type Handler struct {
	db       *gorm.DB
	cfg      *config.Config
	redis    *redis.Client
	S3Client *s3.S3Client
}

func NewHandler(db *gorm.DB, cfg *config.Config, s3Client *s3.S3Client) *Handler {
	redisClient := redis.NewClient(&redis.Options{
		Addr: cfg.RedisAddr, // Адрес Redis (например, "localhost:6379")
		DB:   cfg.RedisDB,   // Номер базы данных Redis
	})

	log.Info().Msg("Successfully connected to Redis")
	return &Handler{
		db:       db,
		cfg:      cfg,
		redis:    redisClient,
		S3Client: s3Client,
	}
}

func (h *Handler) SetupRoutes(app *fiber.App) {

	api := app.Group("api")
	v1 := api.Group("v1")

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

	favorite := v1.Group("favorite")
	favorite.Use(fiberx.SessionProtection(fiberx.Config{
		SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
		UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
		UserSessionMapper: h.GetSessionMapper(),
		UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
	}))
	{
		favorite.Get("/", h.getList)
		favorite.Put("/:postId", h.markFavorite)
		favorite.Delete("/:postId", h.unfavorite)
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
