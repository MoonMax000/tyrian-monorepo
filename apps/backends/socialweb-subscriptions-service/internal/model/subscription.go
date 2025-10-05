package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Subscription struct
type Follower struct {
	gorm.Model
	FollowedId uuid.UUID `gorm:"type:uuid;not null;" json:"followed_id"`
	FollowerId uuid.UUID `gorm:"type:uuid;not null;" json:"follower_id"`
}

// GetSubscriberCount returns the number of subscribers for a user
func (s *Follower) GetSubscriberCount(db *gorm.DB, userId uuid.UUID) (int64, error) {
	var count int64
	err := db.Model(&Follower{}).Where("follower_id = ?", userId).Count(&count).Error
	return count, err
}

// TableName sets the table name for the Subscription model
func (Follower) TableName() string {
	return "subscriptions_follower"
}
