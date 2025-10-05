package main

import (
	"context"
	"embed"
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/Capstane/stream-auth-service/internal/config"
	"github.com/Capstane/stream-auth-service/internal/database"
	"github.com/Capstane/stream-auth-service/internal/handler"
	"github.com/Capstane/stream-auth-service/internal/handler/rbac"
	"github.com/Capstane/stream-auth-service/internal/model"
	"github.com/Capstane/stream-auth-service/internal/queue"
	"github.com/Capstane/stream-auth-service/internal/router"
	"github.com/gofiber/contrib/swagger"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	_ "github.com/lib/pq"
)

//go:embed admin/*
var adminWebApplicationFs embed.FS

// @title Streaming API
// @version 1.0
// @description This is an streaming API

// @securityDefinitions.apikey  CookieAuth
// 		@in                          cookie
// 		@name                        sessionid
// 		@description                 Сессионная аутентификация через куку sessionid

// @BasePath /api/v1
func main() {
	cfg := config.LoadConfig()
	db, err := database.Connect(cfg)
	if err != nil {
		return
	}

	redisClient, err := database.InitRedis(cfg)
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

	app.Use(swagger.New(swaggerCfg))
	app.Use(logger.New(logger.Config{
		Format:     "${cyan}[${time}] ${white}${pid} ${red}${status} ${blue}[${method}] ${white}${path}\n",
		TimeFormat: "02-Jan-2006",
		TimeZone:   "UTC",
	}))

	origins := []string{
		"https://profile.tyriantrade.com",
		"https://tyriantrade.com",
		"https://streaming.tyriantrade.com",
		"http://local.tyriantrade.com:3001",
		"http://local.tyriantrade.com:3002",
		"http://local.tyriantrade.com:3003",
		"http://local.tyriantrade.com:3004",
		"https://local.tyriantrade.com:3443",
		"https://local.tyriantrade.com:3444",
		"https://local.tyriantrade.com:3445",
		"https://local.tyriantrade.com:3446",
		"https://local.tyriantrade.com:3447",
		"https://auth.k8s.tyriantrade.com",
	}
	app.Use(cors.New(cors.Config{
		AllowOrigins:     strings.Join(origins, ","),
		AllowHeaders:     "Origin, X-Requested-With, Content-Type, Accept, Authorization",
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowCredentials: true,
		ExposeHeaders:    "*",
		MaxAge:           int(24 * time.Hour),
	}))

	rbac := &rbac.RBACLayer{
		DB:  db,
		Ctx: context.Background(),
	}
	err = rbac.InitSafety(map[string]string{
		model.AdminRole:    "admin:all",
		model.StreamerRole: "settings:all,plan:all",
	})
	if err != nil {
		log.Errorf("Setup roles error: %v", err)
		return
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	handlers := handler.NewHandler(db, redisClient, queue.NewMailQueueConnector(&cfg), rbac, &cfg, &adminWebApplicationFs)

	go func() {
		if err := queue.ListenStreamingQueue(ctx, cfg.GlobalRMQConnUrl, handlers.Admin()); err != nil && ctx.Err() == nil {
			log.Fatalf("Fatal error in RabbitMQ consumer: %v", err)
		}
	}()

	router.SetupRoutes(app)
	handlers.SetupRoutes(app)

	app.Use(func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusNotFound) // => 404 "Not Found"
	})

	err = app.Listen(fmt.Sprintf(":%v", cfg.HttpPort))
	if err != nil {
		log.Errorf("Unexpected error: %v", err)
		return
	}
}
