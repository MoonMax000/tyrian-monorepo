package factory

import (
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/Capstane/AXA-socialweb-posts/internal/config"
	"github.com/Capstane/AXA-socialweb-posts/internal/elastic"
	"github.com/Capstane/AXA-socialweb-posts/internal/handler"
	"github.com/Capstane/AXA-socialweb-posts/internal/router"
	"github.com/Capstane/AXA-socialweb-posts/internal/s3"
	"github.com/gofiber/contrib/fiberzerolog"
	"github.com/gofiber/contrib/swagger"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func httpService(cfg *config.Config) error {

	db, err := NewDBService(cfg)
	if err != nil {
		return err
	}
	s3Client, err := s3.NewS3Client(cfg.S3Region, cfg.S3AccessKey, cfg.S3SecretAccessKey, cfg.S3Endpoint)
	if err != nil {
		log.Printf("S3 client init failed: %s", err)
	}
	es, err := elastic.NewElasticClient(cfg.EsCONTAINER, cfg.EsPORT, cfg.EsUSER, cfg.EsPASSWORD)
	if err != nil {
		log.Printf("Error creating ES client: %v", err)
	}

	app := fiber.New(fiber.Config{
		BodyLimit: 500 * 1024 * 1024,
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

	handlers := handler.NewHandler(db, cfg, s3Client, es)

	router.SetupRoutes(app)
	handlers.SetupRoutes(app)

	app.Use(func(c *fiber.Ctx) error {
		return c.SendStatus(404) // => 404 "Not Found"
	})
	app.Use(func(c *fiber.Ctx) error {
		c.Locals("s3Client", s3Client)
		return c.Next()
	})

	err = app.Listen(fmt.Sprintf(":%v", cfg.HttpPort))
	if err != nil {
		log.Error().Msgf("Unexpected error: %v", err)
		return err
	}
	return nil
}

func StartHttpService(cfg *config.Config) error {
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

	go httpService(cfg)

	for {
		signalEvent := <-signalChannel
		switch signalEvent {
		case syscall.SIGUSR2:
			time.Sleep(5 * time.Second)
			go httpService(cfg)
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
