package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"

	uuidgen "github.com/Capstane/AXA-socialweb-favorites/internal/pkg/uuid"
)

// Post struct
type Post struct {
	gorm.Model
	ID           uuid.UUID  `gorm:"primaryKey;uniqueIndex;not null;type:uuid;"`
	UserId       uuid.UUID  `gorm:"type:uuid;not null;" json:"user_id"`
	Type         string     `json:"type"`
	Title        string     `json:"title"`
	Content      string     `json:"content"`
	MediaURL     string     `json:"media_url"`
	Payment      *float64   `gorm:"type:decimal(10,2);default:null" json:"payment"`
	Tags         []*Tag     `gorm:"many2many:post_tags;"`
	Blocks       []Block    `gorm:"constraint:OnDelete:CASCADE;" json:"blocks"`
	FirstBlockID *uuid.UUID `gorm:"type:uuid;index;null" json:"first_block_id"`
	FirstBlock   *Block     `gorm:"foreignKey:FirstBlockID" json:"-"`
	Subscribers  []User     `gorm:"many2many:postsubscriptions;foreignKey:ID;joinForeignKey:PostID;References:ID;joinReferences:UserID"`
}

func (post *Post) BeforeCreate(tx *gorm.DB) error {
	return uuidgen.BeforeCreate(tx)
}

// TableName sets the table name for the Post model
func (Post) TableName() string {
	return "posts"
}
