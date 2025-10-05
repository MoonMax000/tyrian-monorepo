package handler

import (
	"github.com/Capstane/stream-chat-service/internal/config"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
	"gorm.io/gorm"
)

type Handler struct {
	db  *gorm.DB
	cfg *config.Config
}

func NewHandler(db *gorm.DB, cfg *config.Config) *Handler {
	return &Handler{
		db:  db,
		cfg: cfg,
	}
}

func (h *Handler) SetupRoutes(app *fiber.App) {

	api := app.Group("/api")
	v1 := api.Group("/v1")

	docs := v1.Group("docs")
	docs.Get("*", swagger.New(swagger.Config{
		Title: "Stream API",
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

	history := v1.Group("/history")
	// profile.Use(fiberx.SessionProtection(fiberx.Config{
	// 	SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
	// 	UserInfoRedisUrl:  h.cfg.SessionIdRedisUrl,
	// 	// UserSessionMapper: h.GetSessionMapper(),
	// 	UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
	// }))
	history.Get("/chat", h.getHistory)

}
