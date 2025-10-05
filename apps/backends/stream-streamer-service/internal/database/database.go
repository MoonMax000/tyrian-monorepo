package database

import (
	"fmt"
	"strings"

	"github.com/Capstane/stream-streamer-service/internal"
	"github.com/Capstane/stream-streamer-service/internal/config"
	"github.com/Capstane/stream-streamer-service/internal/model"
	"github.com/rs/zerolog/log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

// Connect function
func Connect(cfg *config.Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=disable TimeZone=UTC",
		cfg.PostgresHost,
		cfg.PostgresUser,
		cfg.PostgresPassword,
		cfg.PostgresDb,
		cfg.PostgresPort,
	)

	err := createDatabaseIfNotExists(cfg)
	if err != nil {
		return nil, err
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: &internal.GormZeroLogAdapter{},
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "stream_",                         // table name prefix, table for `user_notification_settings` would be `notify_user_notification_settings`
			SingularTable: true,                              // use singular table name, table for `User` would be `user` with this option enabled
			NoLowerCase:   false,                             // skip the snake_casing of names
			NameReplacer:  strings.NewReplacer("CID", "Cid"), // use name replacer to change struct/field name before convert it to db name
		},
	})

	if err != nil {
		return nil, err
	}

	log.Info().Msg("Connected")
	log.Info().Msg("running migrations")
	err = db.AutoMigrate(
		&model.UserStreamKey{},
		&model.RoleRequest{},
	)
	if err != nil {
		return nil, err
	}

	// Apply connection pool settings
	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	sqlDB.SetMaxIdleConns(cfg.PostgresMaxIdleConns)
	sqlDB.SetMaxOpenConns(cfg.PostgresMaxOpenConns)
	sqlDB.SetConnMaxLifetime(cfg.PostgresConnMaxLifetime)

	return db, nil
}

func createDatabaseIfNotExists(cfg *config.Config) error {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s port=%d sslmode=disable TimeZone=UTC",
		cfg.PostgresHost,
		cfg.PostgresUser,
		cfg.PostgresPassword,
		cfg.PostgresPort,
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	tx := db.Raw(fmt.Sprintf("SELECT * FROM pg_database WHERE datname = '%s';", cfg.PostgresDb))
	if tx.Error != nil {
		return tx.Error
	}

	// if not create it
	var records = make(map[string]interface{})
	if tx.Find(records); len(records) == 0 {
		tx := db.Exec(fmt.Sprintf("CREATE DATABASE \"%s\"", cfg.PostgresDb))
		if tx.Error != nil {
			return tx.Error
		}
	}

	return nil
}
