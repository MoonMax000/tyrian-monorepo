package handler

import (
	"errors"
	"time"

	"github.com/rs/zerolog/log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/Capstane/AXA-socialweb-subscriptions/internal/config"
	"github.com/Capstane/AXA-socialweb-subscriptions/internal/model"
	"github.com/Capstane/AXA-socialweb-subscriptions/internal/queue"
	"github.com/Capstane/AXA-socialweb-subscriptions/internal/service"
	"github.com/Capstane/AXA-socialweb-subscriptions/internal/web_logs"
	"github.com/Capstane/authlib/fiberx"
	"github.com/Capstane/authlib/typex"
)

type Handler struct {
	db            *gorm.DB
	cfg           *config.Config
	socialService service.PostMakerService
	notifyQueue   *queue.NotifyQueueConnector
}

func NewHandler(db *gorm.DB, cfg *config.Config, socialService service.PostMakerService) *Handler {
	return &Handler{
		db:            db,
		cfg:           cfg,
		socialService: socialService,
		notifyQueue:   queue.NewNotifyQueueConnector(cfg),
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

	users := v1.Group("/users")
	users.Use(fiberx.SessionProtection(fiberx.Config{
		SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
		UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
		UserSessionMapper: h.GetSessionMapper(),
		UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
		Optional:          true,
	}))
	{
		users.Get("/", h.GetAllUsers)              // поменял на сессию
		users.Get("/search", h.getUsersByUsername) // ок
		users.Get("/:id", h.GetUserById)           // поменял на сессию
	}

	// Защищенные маршруты - с session middleware
	usersProtected := users.Group("/")
	usersProtected.Use(fiberx.SessionProtection(fiberx.Config{
		SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
		UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
		UserSessionMapper: h.GetSessionMapper(),
		UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
	}))
	{
		usersProtected.Post("/batch", h.GetUsersByIds)          // поменял на сессию
		usersProtected.Get("/me/followed", h.GetMyFollowed)     // поменял на сессию
		usersProtected.Get("/me/followers", h.GetUserFollowers) // поменял на сессию
		usersProtected.Post("/me/follow", h.Follow)             // поменял на сессию
		usersProtected.Post("/me/unfollow", h.Unfollow)         // поменял на сессию
	}
	users.Get("/:id/followed", h.GetUserFollowed)   // ок
	users.Get("/:id/followers", h.GetFollowersUser) // ок

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

func (handler *Handler) isSubscribed(authenticatedUserId *uuid.UUID, userId uuid.UUID) *bool {
	if authenticatedUserId == nil {
		return nil
	}

	var subscribed bool

	if err := handler.db.Model(&model.Follower{}).
		Select("count(*) > 0").
		Where("followed_id = ? and follower_id = ?", userId, *authenticatedUserId).
		Find(&subscribed).
		Error; err != nil {
		return nil
	}

	return &subscribed
}

func (handler *Handler) isSubscribedOnUsers(authenticatedUserId *uuid.UUID, userIds []uuid.UUID) map[uuid.UUID]bool {
	emptyMap := make(map[uuid.UUID]bool, 0)
	if authenticatedUserId == nil {
		return emptyMap
	}

	result := make(map[uuid.UUID]bool, len(userIds))
	var subscriptions []uuid.UUID
	if err := handler.db.Model(&model.Follower{}).
		Select("followed_id").
		Where("followed_id in ? and follower_id = ?", userIds, *authenticatedUserId).
		Find(&subscriptions).
		Error; err != nil {
		return emptyMap
	}
	for _, subscription := range subscriptions {
		result[subscription] = true
	}

	return result
}
