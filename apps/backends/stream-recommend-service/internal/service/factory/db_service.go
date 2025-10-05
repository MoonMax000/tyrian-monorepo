package factory

import (
	"sync"

	"github.com/Capstane/stream-recommend-service/internal/config"
	"github.com/Capstane/stream-recommend-service/internal/database"
	"gorm.io/gorm"
)

var (
	databaseServiceInstanceLock = &sync.Mutex{}
	databaseServiceInstance     *gorm.DB
)

func NewDBService(cfg *config.Config) (*gorm.DB, error) {
	if databaseServiceInstance == nil {
		databaseServiceInstanceLock.Lock()
		defer databaseServiceInstanceLock.Unlock()
		if amqServiceInstance == nil {
			db, err := database.Connect(cfg)
			if err != nil {
				return nil, err
			}
			databaseServiceInstance = db
		}
	}
	return databaseServiceInstance, nil
}
