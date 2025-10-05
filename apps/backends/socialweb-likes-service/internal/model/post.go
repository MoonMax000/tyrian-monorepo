package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Post struct
type Post struct {
	gorm.Model
	ID          uuid.UUID `gorm:"primaryKey;uniqueIndex;not null;type:uuid;"`
	UserId      uuid.UUID `gorm:"type:uuid;not null;" json:"user_id"`
	Type        string    `json:"type"`
	Title       string    `json:"title"`
	Content     string    `json:"content"`
	MediaURL    string    `json:"media_url"`
	Payment     *float64  `gorm:"type:decimal(10,2);default:null" json:"payment"`
	Tags        []*Tag    `gorm:"many2many:post_tags;"`
	Files       []File    `gorm:"constraint:OnDelete:CASCADE;" json:"files"`
	Subscribers []User    `gorm:"many2many:postsubscriptions;foreignKey:ID;joinForeignKey:PostID;References:ID;joinReferences:UserID"`
}

func (user *Post) BeforeCreate(tx *gorm.DB) error {
	// UUID version 4
	user.ID = uuid.New()

	return nil
}

// TableName sets the table name for the Post model
func (Post) TableName() string {
	return "posts"
}
