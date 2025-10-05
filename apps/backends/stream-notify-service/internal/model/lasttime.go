package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type LastTime struct {
	gorm.Model
	ID     uuid.UUID `gorm:"primaryKey;uniqueIndex;not null;type:uuid;"`
	UserID uuid.UUID `gorm:"column:user_id;type:uuid"`
	Value  int64     `gorm:"column:value;type:bigint"`
}

func (lasttime *LastTime) BeforeCreate(tx *gorm.DB) error {
	// UUID version 4
	lasttime.ID = uuid.New()

	return nil
}

// TableName sets the table name for the LastTime model
func (LastTime) TableName() string {
	return "last_time_notifications"
}
