package model

import (
	"gorm.io/gorm"
)

// Tag struct
type Tag struct {
	gorm.Model
	Name  string  `json:"name"`
	Posts []*Post `gorm:"many2many:post_tags;"`
}

// TableName sets the table name for the Tag model
func (Tag) TableName() string {
	return "tags"
}
