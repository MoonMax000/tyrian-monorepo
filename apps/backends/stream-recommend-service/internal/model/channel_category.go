package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// МкМ связь между категориями и каналами
type ChannelCategory struct {
	gorm.Model
	ID         uuid.UUID `gorm:"primarykey;uniqueIndex;not null;type:uuid;"`
	ChannelId  uuid.UUID `gorm:"type:uuid;not null;" json:"channel_id"`
	Channel    User      `json:"-"`
	CategoryId uuid.UUID `gorm:"type:uuid;not null;" json:"category_id"`
	Category   Category  `json:"-"`
}

func (channelCategory *ChannelCategory) BeforeCreate(tx *gorm.DB) error {
	if channelCategory.ID == uuid.Nil {
		channelCategory.ID = uuid.New()
	}

	return nil
}
