package database

import (
	"fmt"
	"strings"

	"github.com/Capstane/authlib/utilx"
	"github.com/Capstane/stream-auth-service/internal/config"
	"github.com/Capstane/stream-auth-service/internal/model"
	"github.com/gofiber/fiber/v2/log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"gorm.io/gorm/schema"
)

// Connect function
func Connect(cfg config.Config) (*gorm.DB, error) {
	postgresPort := cfg.PostgresPort
	// because our config function returns a string, we are parsing our      str to int here
	port := utilx.ParseInt(postgresPort, 5432)

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=disable TimeZone=UTC",
		cfg.PostgresHost,
		cfg.PostgresUser,
		cfg.PostgresPassword,
		cfg.PostgresDb,
		port,
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(mapZeroLogLevelsToGormLogLevels(cfg.LogLevel)),
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "auth_",                           // table name prefix, table for `User` would be `t_users`
			SingularTable: true,                              // use singular table name, table for `User` would be `user` with this option enabled
			NoLowerCase:   false,                             // skip the snake_casing of names
			NameReplacer:  strings.NewReplacer("CID", "Cid"), // use name replacer to change struct/field name before convert it to db name
		},
	})

	if err != nil {
		log.Errorf("failed to connect to database. %v\n", err)
		return nil, err
	}

	log.Info("Connected")
	log.Info("running migrations")
	err = db.AutoMigrate(
		&model.User{},
		&model.UserRole{},
		&model.UserPermission{},
		&model.UserRolePermission{},
		&model.EmailTemplate{},
		&model.EmailConfirmation{},
	)
	if err != nil {
		log.Errorf("failed run auto-migrations. %v\n", err)
		return nil, err
	}
	// Apply custom migrations (should be idempotent)
	tx := db.Exec((*model.EmailConfirmation).AfterInsertTrigger(nil))
	if tx.Error != nil {
		log.Errorf("failed run custom migrations for model.EmailConfirmation. %v\n", err)
		return nil, tx.Error
	}
	// Update deleted user emails
	tx = db.Exec("UPDATE auth_user set email = CONCAT('@', to_char(deleted_at, 'YYYY-MM-DD\"T\"HH24:MI:SS.USOF'), '@', email) WHERE deleted_at IS NOT NULL AND NOT(email LIKE '@%')")
	if tx.Error != nil {
		log.Errorf("failed run Update deleted user emails. %v\n", err)
		return nil, tx.Error
	}
	// Update deleted user usernames
	tx = db.Exec("UPDATE auth_user set username = CONCAT('@', to_char(deleted_at, 'YYYY-MM-DD\"T\"HH24:MI:SS.USOF'), '@', username) WHERE deleted_at IS NOT NULL AND NOT(username LIKE '@%')")
	if tx.Error != nil {
		log.Errorf("failed run Update deleted user names. %v\n", err)
		return nil, tx.Error
	}

	// Apply connection pool settings
	sqlDB, err := db.DB()
	if err != nil {
		log.Errorf("failed to create database connection pool. %v\n", err)
		return nil, err
	}
	sqlDB.SetMaxIdleConns(cfg.PostgresMaxIdleConns)
	sqlDB.SetMaxOpenConns(cfg.PostgresMaxOpenConns)
	sqlDB.SetConnMaxLifetime(cfg.PostgresConnMaxLifetime)

	return db, nil
}

func mapZeroLogLevelsToGormLogLevels(zeroLogLevel int) logger.LogLevel {
	if zeroLogLevel == int(log.LevelDebug) || zeroLogLevel == int(log.LevelTrace) {
		return logger.Info
	}
	if zeroLogLevel == int(log.LevelInfo) {
		return logger.Warn
	}
	return logger.Error
}
