package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// @Description Информация о теге
type Tag struct {
	gorm.Model `json:"-"`
	ID         uuid.UUID `gorm:"primarykey;uniqueIndex;not null;type:uuid;" json:"id"`
	Name       string    `gorm:"uniqueIndex;not null;size:25;" validate:"required,min=1,max=25" json:"name"`
}

func (tag *Tag) BeforeCreate(tx *gorm.DB) error {
	if tag.ID == uuid.Nil {
		tag.ID = uuid.New()
	}

	return nil
}
