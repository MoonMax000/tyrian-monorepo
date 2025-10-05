package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/Capstane/stream-recommend-service/internal"
)

// модель данных категорий каналов
// @Description Информация о категории канала
type Category struct {
	gorm.Model  `json:"-"`
	ID          uuid.UUID `gorm:"primarykey;uniqueIndex;not null;type:uuid;" json:"id"`
	Name        string    `gorm:"uniqueIndex;not null;size:50;" validate:"required,min=3,max=50" json:"name"`
	Description string    `json:"description"`
	AvatarURL   string    `json:"avatar_url"`
	CreatedAt   time.Time `json:"created"`
	UpdatedAt   time.Time `json:"updated"`
}

func (category *Category) BeforeCreate(tx *gorm.DB) error {
	if category.ID == uuid.Nil {
		category.ID = uuid.New()
	}

	return nil
}

func (category *Category) GetAvatarUrl(cdnUrl string) string {
	if category.AvatarURL == "" {
		return ""
	}
	return internal.JoinUrl(cdnUrl, category.AvatarURL)
}
