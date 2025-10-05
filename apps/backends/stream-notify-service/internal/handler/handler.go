package handler

import (
	"github.com/Capstane/authlib/fiberx"
	"github.com/Capstane/stream-notify-service/internal/config"
	"github.com/Capstane/stream-notify-service/internal/queue"
	"github.com/gofiber/fiber/v2"
	fiberSwagger "github.com/swaggo/fiber-swagger"
	"gorm.io/gorm"
)

type Handler struct {
	db    *gorm.DB
	qConn *queue.NotifyQueueConnector
	cfg   *config.Config
}

func NewHandler(db *gorm.DB, qConn *queue.NotifyQueueConnector, cfg *config.Config) *Handler {
	return &Handler{
		db:    db,
		qConn: qConn,
		cfg:   cfg,
	}
}

func (h *Handler) SetupRoutes(app *fiber.App) {

	api := app.Group("/api")
	v1 := api.Group("/v1")

	docs := v1.Group("docs")
	docs.Get("*", fiberSwagger.WrapHandler)

	profile := v1.Group("profile")
	profile.Use(fiberx.New(fiberx.Config{
		SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
		UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
	}))
	profile.Get("me/notify-settings", h.myNotifySettings)
	profile.Patch("me/notify-settings", h.myNotifySettingsChange)
	profile.Put("me/notify-settings", h.myNotifySettingsChange)

	notify := v1.Group("notify")
	notify.Put("notify-on-live-broadcast", h.notifyOnLiveBroadcast)
	notify.Put("notify-on-vod", h.notifyOnVOD)
	notify.Put("notify-on-mention", h.notifyOnMention)
	notify.Put("notify-on-new-subscriber", h.notifyOnNewSubscriber)
	notify.Put("notify-on-recommendations", h.notifyOnRecommendations)
	notify.Put("notify-on-news", h.notifyOnNews)

}
