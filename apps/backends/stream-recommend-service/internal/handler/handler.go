package handler

import (
	"errors"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"

	"github.com/Capstane/authlib/fiberx"
	"github.com/Capstane/authlib/typex"
	"github.com/Capstane/stream-recommend-service/internal/config"
	"github.com/Capstane/stream-recommend-service/internal/model"
	"github.com/Capstane/stream-recommend-service/internal/service"
	"github.com/Capstane/stream-recommend-service/internal/web_logs"
)

type Handler struct {
	db                  *gorm.DB
	cfg                 *config.Config
	streamService       service.StreamService
	userInfoCacheClient *fiberx.UserInfoCacheClient
}

func NewHandler(db *gorm.DB, cfg *config.Config, streamService service.StreamService) *Handler {
	userInfoCacheClient, err := fiberx.NewUserInfoCacheClient(cfg.SessionIdRedisUrl, cfg.UserInfoRedisUrl, time.Hour*24, cfg.UserInfoKeyPrefix)
	if err != nil {
		log.Error().Msgf("user info cache client initialization issue %v", err)
	}

	return &Handler{
		db:                  db,
		cfg:                 cfg,
		streamService:       streamService,
		userInfoCacheClient: userInfoCacheClient,
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
		Title: "Streaming API",
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

	channels := v1.Group("/channels")
	channels.Get("/", h.GetAllChannels)
	channels.Get("/search", h.getChannelsSearch)
	channels.Get("/:id", h.GetChannelById)
	channels.Post("/batch", h.GetChannelsByIds)
	channels.Use(fiberx.SessionProtection(fiberx.Config{
		SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
		UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
		UserSessionMapper: h.GetSessionMapper(),
		UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
	}))
	channels.Get("/me/subscriptions", h.GetMySubscriptions)
	channels.Get("/me/subscribers", h.GetChannelSubscribers)
	channels.Post("/me/subscribe", h.Subscribe)
	channels.Post("/me/unsubscribe", h.Unsubscribe)

	categories := v1.Group("/categories")
	categories.Get("/", h.getAllCategories)
	// categories.Get("/:id", h.getCategoryById)
	// categories.Use(fiberx.SessionProtection(fiberx.Config{
	// 	SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
	// 	UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
	// 	UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
	// }))
	// categories.Post("/", h.createCategory)
	// categories.Put("/:id", h.updateCategory)
	// categories.Delete("/:id", h.deleteCategory)
	// categories.Put("/:id/:channel_id", h.assignCategory)
	// categories.Delete("/:id/:channel_id", h.unassignCategory)

	tags := v1.Group("/tags")
	tags.Get("/", h.getAllTags)
	// tags.Get("/:id", h.getTagById)
	// tags.Use(fiberx.SessionProtection(fiberx.Config{
	// 	SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
	// 	UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
	// 	UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
	// }))
	// tags.Post("/", h.createTag)

}

func (handler *Handler) isSubscribed(authenticatedUserId *uuid.UUID, channelId uuid.UUID) *bool {
	if authenticatedUserId == nil {
		return nil
	}

	var subscribed bool

	if err := handler.db.Model(&model.Subscription{}).
		Select("count(*) > 0").
		Where("channel_id = ? and user_id = ?", channelId, *authenticatedUserId).
		Find(&subscribed).
		Error; err != nil {
		return nil
	}

	return &subscribed
}

func (handler *Handler) isSubscribedOnChannels(authenticatedUserId *uuid.UUID, channelIds []uuid.UUID) map[uuid.UUID]bool {
	emptyMap := make(map[uuid.UUID]bool, 0)
	if authenticatedUserId == nil {
		return emptyMap
	}

	result := make(map[uuid.UUID]bool, len(channelIds))
	var subscriptions []uuid.UUID
	if err := handler.db.Model(&model.Subscription{}).
		Select("channel_id").
		Where("channel_id in ? and user_id = ?", channelIds, *authenticatedUserId).
		Find(&subscriptions).
		Error; err != nil {
		return emptyMap
	}
	for _, subscription := range subscriptions {
		result[subscription] = true
	}

	return result
}

func (h *Handler) GetSessionMapper() fiberx.SessionMapper {
	return func(globalUserData fiberx.SessionData) (*typex.SessionClaims, error) {
		var user model.User
		tx := h.db.Where("email = ?", globalUserData.AuthUserEmail).First(&user)
		log.Debug().Msgf("User is %v", user)
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
					Exp:         time.Now().Add(time.Hour * 24),
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
			Exp:         time.Now().Add(time.Hour * 24),
		}, nil
	}
}
