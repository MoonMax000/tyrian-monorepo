package handler

import (
	"errors"
	"time"

	"github.com/Capstane/AXA-socialweb-profile/internal/config"
	"github.com/Capstane/AXA-socialweb-profile/internal/model"
	"github.com/Capstane/authlib/fiberx"
	"github.com/Capstane/authlib/typex"
	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type Handler struct {
	db    *gorm.DB
	cfg   *config.Config
	redis *redis.Client
}

func NewHandler(db *gorm.DB, cfg *config.Config) *Handler {
	redisClient := redis.NewClient(&redis.Options{
		Addr: cfg.RedisAddr, // Адрес Redis (например, "localhost:6379")
		DB:   cfg.RedisDB,   // Номер базы данных Redis
	})

	log.Info().Msg("Successfully connected to Redis")
	return &Handler{
		db:    db,
		cfg:   cfg,
		redis: redisClient,
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

	profileProtected := v1.Group("profile")
	profileProtected.Use(fiberx.SessionProtection(fiberx.Config{
		SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
		UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
		UserSessionMapper: h.GetSessionMapper(),
		UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
	}))
	{
		profileProtected.Get("me", h.myProfile)
		profileProtected.Put("me", h.updateMyProfile)
		profileProtected.Put("me/set-avatar", h.setProfileAvatar)
		profileProtected.Patch("me", h.updateMyProfile)
		profileProtected.Put("chat-sync", h.chatSync)
		profileProtected.Get(":username/public", h.GetPublicProfile)
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

// GetDB возвращает подключение к базе данных
func (h *Handler) GetDB() *gorm.DB {
	return h.db
}

// GetConfig возвращает конфигурацию
func (h *Handler) GetConfig() *config.Config {
	return h.cfg
}
