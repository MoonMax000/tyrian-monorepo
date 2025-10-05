package model

import (
	"github.com/google/uuid"
)

// Post представляет пост пользователя
type Post struct {
	ID          uuid.UUID   `gorm:"type:uuid;primaryKey"`
	UserID      uuid.UUID   `gorm:"type:uuid;not null"`
	Type        string      `gorm:"type:varchar(50);not null"` // text, image, video, etc.
	Title       string      `gorm:"type:varchar(255)"`
	Content     string      `gorm:"type:text"`
	MediaURL    string      `gorm:"type:varchar(255)"`
	Payment     bool        `gorm:"default:false"`
	Tags        []string    `gorm:"type:text[]"`
	Files       []string    `gorm:"type:text[]"`
	Subscribers []uuid.UUID `gorm:"type:uuid[]"`
}
