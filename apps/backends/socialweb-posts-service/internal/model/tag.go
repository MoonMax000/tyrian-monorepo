package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Tag struct
type Tag struct {
	gorm.Model
	ID    uuid.UUID `gorm:"primaryKey;uniqueIndex;not null;type:uuid;"`
	Name  string    `json:"name"`
	Posts []*Post   `gorm:"many2many:post_tags;"`
}

// TableName sets the table name for the Tag model
func (Tag) TableName() string {
	return "tags"
}
