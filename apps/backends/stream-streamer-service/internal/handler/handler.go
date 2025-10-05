package handler

import (
	"github.com/Capstane/authlib/fiberx"
	"github.com/Capstane/stream-streamer-service/internal/config"
	"github.com/Capstane/stream-streamer-service/internal/model"
	"github.com/Capstane/stream-streamer-service/internal/queue"
	"github.com/Capstane/stream-streamer-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Handler struct {
	db                 *gorm.DB
	cfg                *config.Config
	liveStreamQueue    *queue.LiveStreamQueueConnector
	emailQueue         *queue.EmailQueueConnector
	streamRequestQueue *queue.StreamerRequestQueueConnector
}

func NewHandler(
	db *gorm.DB,
	liveStreamQueue *queue.LiveStreamQueueConnector,
	emailQueue *queue.EmailQueueConnector,
	streamRequestQueue *queue.StreamerRequestQueueConnector,
	cfg *config.Config,
) *Handler {
	return &Handler{
		db:                 db,
		cfg:                cfg,
		liveStreamQueue:    liveStreamQueue,
		emailQueue:         emailQueue,
		streamRequestQueue: streamRequestQueue,
	}
}

func (h *Handler) SetupRoutes(app *fiber.App) {

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

	stream := v1.Group("stream")
	stream.Use(fiberx.SessionProtection(fiberx.Config{
		SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
		UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
		Roles:             []string{model.StreamerRole},
		UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
	}))
	stream.Get("settings", h.streamSettings)
	stream.Patch("settings", h.streamSettingsChange)
	stream.Put("settings", h.streamSettingsChange)

	stream.Get("plan", h.streamPlanSettings)
	stream.Patch("plan", h.streamPlanSettingsChange)
	stream.Put("plan", h.streamPlanSettingsChange)

	stream.Put("start", h.liveStreamStart)
	stream.Delete("stop", h.liveStreamStop)

	streamKeys := v1.Group("stream-keys")
	stream.Use(fiberx.SessionProtection(fiberx.Config{
		SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
		UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
		Roles:             []string{model.StreamerRole},
		UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
	}))
	streamKeys.Get("new", h.newStreamKey)
	streamKeys.Delete("reset", h.resetStreamKey)

	profile := v1.Group("profile")
	profile.Use(fiberx.SessionProtection(fiberx.Config{
		SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
		UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
		UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
	}))
	profile.Post("me/become-streamer-request", h.becomeStreamerRequest)
	profile.Get("me/status-streamer-request", h.statusStreamerRequest)

}

func (h *Handler) SendBecomeStreamerRequest(userId uuid.UUID, becomeStreamerRequest *types.BecomeStreamerRequest) error {
	return h.emailQueue.PushSendBecomeStreamerEmail(userId, becomeStreamerRequest)
}
