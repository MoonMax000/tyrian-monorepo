package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User struct
type Subscription struct {
	gorm.Model
	ID        uuid.UUID `gorm:"primarykey;uniqueIndex;not null;type:uuid;"`
	ChannelId uuid.UUID `gorm:"type:uuid;not null;" json:"channel_id"`
	UserId    uuid.UUID `gorm:"type:uuid;not null;" json:"user_id"`
}

func (subscription *Subscription) BeforeCreate(tx *gorm.DB) error {
	// UUID version 4
	subscription.ID = uuid.New()

	return nil
}

// GetSubscriberCount returns the number of subscribers for a channel
func (s *Subscription) GetSubscriberCount(db *gorm.DB, channelId uuid.UUID) (int64, error) {
	var count int64
	err := db.Model(&Subscription{}).Where("channel_id = ?", channelId).Count(&count).Error
	return count, err
}

// TableName sets the table name for the Subscription model
func (Subscription) TableName() string {
	return "subscription"
}
