package tests

import (
	"fmt"
	"testing"

	"github.com/Capstane/AXA-socialweb-profile/internal/config"
	"github.com/Capstane/AXA-socialweb-profile/internal/handler"
	"github.com/Capstane/AXA-socialweb-profile/internal/model"
	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

func GetTestConfig() *config.Config {
	return &config.Config{
		PostgresHost:     "localhost",
		PostgresPort:     "5432",
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
	db, err := gorm.Open(postgres.Open(GetTestDSN()), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "auth_", // table name prefix
			SingularTable: true,    // use singular table name
			NoLowerCase:   false,   // skip the snake_casing of names
		},
	})
	if err != nil {
		t.Fatalf("failed to connect database: %v", err)
	}

	// Run migrations
	err = db.AutoMigrate(
		&model.User{},
		&model.Follower{},
		&model.Post{},
	)
	if err != nil {
		t.Fatalf("failed to migrate database: %v", err)
	}

	cfg := GetTestConfig()
	h := handler.NewHandler(db, cfg)

	// Create fiber app
	app := fiber.New()
	api := app.Group("api")
	v1 := api.Group("v1")
	profile := v1.Group("profile")
	profile.Get(":username/public", h.GetPublicProfile)

	return app, h
}
