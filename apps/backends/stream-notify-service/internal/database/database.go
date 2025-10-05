package database

import (
	"errors"
	"fmt"
	"strings"
	"sync"

	"github.com/Capstane/stream-notify-service/internal"
	"github.com/Capstane/stream-notify-service/internal/config"
	"github.com/Capstane/stream-notify-service/internal/model"
	"github.com/Capstane/stream-notify-service/internal/types"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

type database struct {
	gormDB *gorm.DB
	sync.Mutex
}

var DB = &database{}

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
			TablePrefix:   "notify_",                         // table name prefix, table for `user_notification_settings` would be `notify_user_notification_settings`
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
		&model.UserNotificationSettings{},
		&model.FilterNotification{},
		&model.LastTime{},
	)
	if err != nil {
		return nil, err
	}

	// Create global variable
	DB.gormDB = db

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

func (db *database) SaveFilters(userUUID string, filters *types.Filters) {
	userID, err := uuid.Parse(userUUID)
	if err != nil {
		log.Error().Msgf("[SaveFilters] error parse uuid: %v", err)
		return
	}

	filterNotification := model.FilterNotification{
		UserID:       userID,
		Subscription: filters.Subscription,
		StatusStream: filters.StatusStream,
	}

	var existing model.FilterNotification
	result := db.gormDB.Where("user_id = ?", userID).First(&existing)

	if result.Error == nil {
		db.gormDB.Model(&existing).Updates(map[string]interface{}{
			"subscription":  filters.Subscription,
			"status_stream": filters.StatusStream,
		})
		log.Info().Msgf("[SaveFilters] Filters updated for user: %s", userUUID)
		return
	} else if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		db.gormDB.Create(&filterNotification)
		log.Info().Msgf("[SaveFilters] New filters created for user: %s", userUUID)
		return
	}

	log.Error().Msgf("[SaveFilters] DB error: %v", result.Error)
}

func (db *database) SaveLastTime(userUUID string, lastime int64) {
	userID, err := uuid.Parse(userUUID)
	if err != nil {
		log.Error().Msgf("[SaveLastTime] error parse uuid: %v", err)
		return
	}

	lasttime := model.LastTime{
		UserID: userID,
		Value:  lastime,
	}

	var existing model.LastTime
	result := db.gormDB.Where("user_id = ?", userID).First(&existing)

	if result.Error == nil {
		db.gormDB.Model(&existing).Updates(map[string]interface{}{
			"value": lastime,
		})
		log.Info().Msgf("[SaveLastTime] lasttime updated for user: %s", userUUID)
		return
	} else if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		db.gormDB.Create(&lasttime)
		log.Info().Msgf("[SaveLastTime] New lasttime created for user: %s", userUUID)
		return
	}

	log.Error().Msgf("[SaveLastTime] DB error: %v", result.Error)
}

func (db *database) GetFilters(userID string) (*model.FilterNotification, error) {
	userUUID, err := uuid.Parse(userID)
	if err != nil {
		return nil, err
	}

	var filter model.FilterNotification
	result := db.gormDB.Where("user_id = ?", userUUID).First(&filter)
	if result.Error != nil {
		return nil, result.Error
	}

	log.Debug().Msgf("[GetFilters] get filters from pg: %s", userUUID)
	return &filter, nil
}
