package repository

import (
	"auth-sync/internal/models"
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDB() (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	log.Printf("Connecting to database with DSN: %s", dsn)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database, got error %v", err)
	}

	log.Printf("Running migrations...")
	if err := db.AutoMigrate(&models.User{}); err != nil {
		log.Printf("Failed to migrate database: %v", err)
		return nil, err
	}
	log.Printf("Migrations completed successfully")

	return db, nil
}
