package database

import (
	"fmt"
	"strings"

	"github.com/Capstane/AXA-socialweb-likes/internal"
	"github.com/Capstane/AXA-socialweb-likes/internal/config"
	"github.com/Capstane/AXA-socialweb-likes/internal/model"
	"github.com/rs/zerolog/log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

// Connect function
func Connect(cfg config.Config) (*gorm.DB, error) {
	postgresPort := cfg.PostgresPort
	// because our config function returns a string, we are parsing our      str to int here
	port := internal.ParseInt(postgresPort, 5432)

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=disable TimeZone=UTC",
		cfg.PostgresHost,
		cfg.PostgresUser,
		cfg.PostgresPassword,
		cfg.PostgresDb,
		port,
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		// Logger: logger.Default.LogMode(logger.Info),
		Logger: &internal.GormZeroLogAdapter{
			Level: cfg.LogLevel,
		},
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "auth_",                           // table name prefix, table for `User` would be `t_users`
			SingularTable: true,                              // use singular table name, table for `User` would be `user` with this option enabled
			NoLowerCase:   false,                             // skip the snake_casing of names
			NameReplacer:  strings.NewReplacer("CID", "Cid"), // use name replacer to change struct/field name before convert it to db name
		},
	})

	if err != nil {
		log.Error().Msgf("failed to connect to database. %v\n", err)
		return nil, err
	}

	log.Info().Msg("Connected")
	log.Info().Msg("running migrations")
	err = db.AutoMigrate(
		&model.Like{},
	)
	if err != nil {
		log.Error().Msgf("failed run auto-migrations. %v\n", err)
		return nil, err
	}

	// Apply connection pool settings
	sqlDB, err := db.DB()
	if err != nil {
		log.Error().Msgf("failed to create database connection pool. %v\n", err)
		return nil, err
	}
	sqlDB.SetMaxIdleConns(cfg.PostgresMaxIdleConns)
	sqlDB.SetMaxOpenConns(cfg.PostgresMaxOpenConns)
	sqlDB.SetConnMaxLifetime(cfg.PostgresConnMaxLifetime)

	return db, nil
}
