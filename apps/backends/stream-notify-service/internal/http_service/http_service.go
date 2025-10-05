package http_service

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Capstane/stream-notify-service/internal/config"
	"github.com/Capstane/stream-notify-service/internal/database"
	"github.com/Capstane/stream-notify-service/internal/handler"
	"github.com/Capstane/stream-notify-service/internal/queue"
	"github.com/Capstane/stream-notify-service/internal/router"
	"github.com/gofiber/contrib/fiberzerolog"
	"github.com/gofiber/contrib/swagger"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func startHttpService(cfg *config.Config) {
	db, err := database.Connect(cfg)

	defer func() {
		if err != nil {
			fmt.Printf("Connection to Database fail with error: %v", err)
		} else {
			log.Warn().Msg("Exit from process queue")
		}
		syscall.Kill(syscall.Getpid(), syscall.SIGUSR2)
	}()

	if err != nil {
		log.Error().Msgf("Failed connect to the database %v. Error: %v \n", cfg.PostgresDb, err)
		return
	}

	app := fiber.New(fiber.Config{
		AppName: "stream-notify-service",
	})

	swaggerCfg := swagger.Config{
		BasePath: "/api/v1",
		FilePath: "./docs/swagger.json",
		Path:     "docs",
		CacheAge: 1,
	}

	logger := zerolog.New(os.Stderr).With().Timestamp().Logger()

	app.Use(swagger.New(swaggerCfg))
	app.Use(fiberzerolog.New(fiberzerolog.Config{
		Logger: &logger,
	}))
	app.Use(cors.New())

	handlers := handler.NewHandler(db, queue.NewNotifyQueueConnector(cfg), cfg)

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

func ListenHttpPort(cfg *config.Config) error {
	signalChannel := make(chan os.Signal, 1)
	signal.Notify(
		signalChannel,
		syscall.SIGUSR2, // Use for restart listening port
		syscall.SIGHUP,
		syscall.SIGQUIT,
		syscall.SIGTERM,
		syscall.SIGSEGV,
	)

	log.Info().Msgf("Setup http port %v", cfg.HttpPort)

	go startHttpService(cfg)

	for {
		signalEvent := <-signalChannel
		switch signalEvent {
		case syscall.SIGUSR2:
			time.Sleep(5 * time.Second)
			go startHttpService(cfg)
		case syscall.SIGQUIT,
			syscall.SIGTERM,
			syscall.SIGINT,
			syscall.SIGKILL:
			log.Error().Msgf("Signal event %q", signalEvent)
			return nil
		case syscall.SIGHUP:
			log.Error().Msgf("Signal event %q", signalEvent)
			return fmt.Errorf("signal hang up")
		case syscall.SIGSEGV:
			log.Error().Msgf("Signal event %q", signalEvent)
			return fmt.Errorf("segmentation violation")
		default:
			log.Error().Msgf("Unexpected signal %q", signalEvent)
		}
	}
}
