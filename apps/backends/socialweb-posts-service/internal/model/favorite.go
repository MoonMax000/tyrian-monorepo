package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Subscription struct
type Favorite struct {
	gorm.Model
	UserId uuid.UUID `gorm:"type:uuid;not null;" json:"user_id"`
	PostId uuid.UUID `gorm:"type:uuid;not null;" json:"post_id"`
}

// GetPostsCount returns the number of subscribers for a user
func (s *Favorite) GetPostsCount(db *gorm.DB, userId uuid.UUID) (int64, error) {
	var count int64
	err := db.Model(&Favorite{}).Where("user_id = ?", userId).Count(&count).Error
	return count, err
}

// TableName sets the table name for the Subscription model
func (Favorite) TableName() string {
	return "favorites"
}
