package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Favorite представляет избранный пост пользователя
type Favorite struct {
	gorm.Model
	UserId uuid.UUID `gorm:"type:uuid;not null;" json:"user_id"`
	PostId uuid.UUID `gorm:"type:uuid;not null;" json:"post_id"`
}

// GetPostsCount возвращает количество избранных постов пользователя
func (f *Favorite) GetPostsCount(db *gorm.DB, userId uuid.UUID) (int64, error) {
	var count int64
	err := db.Model(&Favorite{}).Where("user_id = ?", userId).Count(&count).Error
	return count, err
}

// TableName устанавливает имя таблицы для модели Favorite
func (Favorite) TableName() string {
	return "favorites"
}
