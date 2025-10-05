package tests

import (
	"fmt"
	"testing"

	"github.com/Capstane/AXA-socialweb-favorites/internal/config"
	"github.com/Capstane/AXA-socialweb-favorites/internal/handler"
	"github.com/Capstane/AXA-socialweb-favorites/internal/model"
	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func GetTestConfig() *config.Config {
	return &config.Config{
		PostgresHost:     "localhost",
		PostgresPort:     "6557",
		PostgresDb:       "auth_test_db",
		PostgresUser:     "postgres",
		PostgresPassword: "postgres",
	}
}

func GetTestDSN() string {
	cfg := GetTestConfig()
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		cfg.PostgresHost,
		cfg.PostgresUser,
		cfg.PostgresPassword,
		cfg.PostgresDb,
		cfg.PostgresPort,
	)
}

func setupTestApp(t *testing.T) (*fiber.App, *handler.Handler) {
	// Setup test database connection
	db, err := gorm.Open(postgres.Open(GetTestDSN()), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to connect database: %v", err)
	}

	// Run migrations
	err = db.AutoMigrate(
		&model.User{},
	)
	if err != nil {
		t.Fatalf("failed to migrate database: %v", err)
	}

	cfg := GetTestConfig()
	h := handler.NewHandler(db, cfg)

	// Create fiber app
	app := fiber.New()
	// api := app.Group("api")
	// v1 := api.Group("v1")
	// auth := v1.Group("auth")
	// auth.All("as-user-control", h.HandleUserControl)

	return app, h
}
