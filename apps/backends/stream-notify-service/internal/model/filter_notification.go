package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FilterNotification struct {
	gorm.Model
	ID           uuid.UUID `gorm:"primaryKey;uniqueIndex;not null;type:uuid;"`
	UserID       uuid.UUID `gorm:"column:user_id;type:uuid"`
	Subscription bool      `gorm:"column:subscription;type:bool"`
	StatusStream bool      `gorm:"column:status_stream;type:bool"`
}

func (filternotification *FilterNotification) BeforeCreate(tx *gorm.DB) error {
	// UUID version 4
	filternotification.ID = uuid.New()

	return nil
}

// TableName sets the table name for the FilterNotification model
func (FilterNotification) TableName() string {
	return "filter_notifications"
}
