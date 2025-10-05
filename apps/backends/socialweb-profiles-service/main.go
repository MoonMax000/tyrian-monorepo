package main

import (
	"fmt"
	"os"
	"strings"
	"time"

	_ "github.com/Capstane/AXA-socialweb-profile/docs" // swagger docs
	"github.com/Capstane/AXA-socialweb-profile/internal/config"
	"github.com/Capstane/AXA-socialweb-profile/internal/database"
	"github.com/Capstane/AXA-socialweb-profile/internal/handler"
	"github.com/Capstane/AXA-socialweb-profile/internal/queue"
	"github.com/Capstane/AXA-socialweb-profile/internal/router"
	"github.com/gofiber/contrib/fiberzerolog"
	"github.com/gofiber/contrib/swagger"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/lib/pq"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// @title AXA-socialweb-service API (profiles)
// @version 1.0
// @description This is an API of profiles-service
// @schemes http https

// @securityDefinitions.apikey  CookieAuth
// 		@in                          cookie
// 		@name                        sessionid
// 		@description                 Сессионная аутентификация через куку sessionid

// @BasePath /api/v1
func main() {
	// Initialize Zerolog logger with output to stdout
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})

	cfg := config.LoadConfig()
	zerolog.SetGlobalLevel(zerolog.Level(cfg.LogLevel))

	go queue.ListenRabbitQueue(&cfg)

	db, err := database.Connect(cfg)
	if err != nil {
		return
	}

	app := fiber.New(fiber.Config{
		BodyLimit:         cfg.MaxFileUploadSizeInBytes,
		StreamRequestBody: true,
	})

	swaggerCfg := swagger.Config{
		BasePath: "/api/v1",
		FilePath: "./docs/swagger.yaml",
		Path:     "docs",
		CacheAge: 1,
	}

	logger := zerolog.New(os.Stderr).With().Timestamp().Logger()

	app.Use(swagger.New(swaggerCfg))
	app.Use(fiberzerolog.New(fiberzerolog.Config{
		Logger: &logger,
	}))

	app.Use(func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Methods", "GET,POST,HEAD,PUT,DELETE,PATCH")
		c.Set("Access-Control-Allow-Headers", "*")
		c.Set("Access-Control-Expose-Headers", "*")

		// Handle preflight requests
		if c.Method() == "OPTIONS" {
			return c.SendStatus(fiber.StatusNoContent)
		}

		return c.Next()
	})

	origins := []string{
		"https://tyriantrade.com",
		"https://socialweb.tyriantrade.com",
		"https://socialweb-api.tyriantrade.com",
		"http://local.tyriantrade.com:3001",
		"http://local.tyriantrade.com:3002",
		"http://local.tyriantrade.com:3003",
		"http://local.tyriantrade.com:3004",
		"https://local.tyriantrade.com:3443",
		"https://local.tyriantrade.com:3444",
		"https://local.tyriantrade.com:3445",
		"https://local.tyriantrade.com:3446",
		"https://local.tyriantrade.com:3447",
	}
	app.Use(cors.New(cors.Config{
		AllowOrigins:     strings.Join(origins, ","),
		AllowHeaders:     "Origin, X-Requested-With, Content-Type, Accept, Authorization",
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowCredentials: true,
		ExposeHeaders:    "*",
		MaxAge:           int(24 * time.Hour),
	}))

	handlers := handler.NewHandler(db, &cfg)

	router.SetupRoutes(app)
	handlers.SetupRoutes(app)

	app.Use(func(c *fiber.Ctx) error {
		return c.SendStatus(404) // => 404 "Not Found"
	})

	err = app.Listen(fmt.Sprintf(":%v", cfg.HttpPort))
	if err != nil {
		log.Error().Msgf("Unexpected error: %v", err)
		return
	}
}
