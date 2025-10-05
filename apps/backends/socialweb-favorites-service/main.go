package main

import (
	"fmt"
	"github.com/Capstane/AXA-socialweb-favorites/internal/s3"
	"os"
	"strings"
	"time"

	_ "github.com/Capstane/AXA-socialweb-favorites/docs" // swagger docs
	"github.com/Capstane/AXA-socialweb-favorites/internal/config"
	"github.com/Capstane/AXA-socialweb-favorites/internal/database"
	"github.com/Capstane/AXA-socialweb-favorites/internal/handler"
	"github.com/Capstane/AXA-socialweb-favorites/internal/queue"
	"github.com/Capstane/AXA-socialweb-favorites/internal/router"
	"github.com/gofiber/contrib/fiberzerolog"
	"github.com/gofiber/contrib/swagger"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/lib/pq"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// @title AXA-socialweb API
// @version 1.0
// @description This is an API for Socialweb application
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

	s3Client, err := s3.NewS3Client(cfg.S3Region, cfg.S3AccessKey, cfg.S3SecretAccessKey, cfg.S3Endpoint)
	if err != nil {
		log.Printf("S3 client init failed: %s", err)
	}

	handlers := handler.NewHandler(db, &cfg, s3Client)

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
