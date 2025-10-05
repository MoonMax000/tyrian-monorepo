package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Block struct
type Block struct {
	gorm.Model
	ID          uuid.UUID  `gorm:"primaryKey;uniqueIndex;not null;type:uuid;"`
	Content     string     `json:"content"`
	MediaURL    string     `json:"media_url"`
	Files       []File     `gorm:"constraint:OnDelete:CASCADE;" json:"files"`
	PostID      uuid.UUID  `gorm:"type:uuid;not null;index" json:"post_id"`
	Post        Post       `gorm:"foreignKey:PostID;" json:"-"`
	NextBlock   *Block     `gorm:"foreignKey:NextBlockID" json:"-"`
	NextBlockID *uuid.UUID `gorm:"type:uuid;index;null" json:"next_block_id"`
}

func (block *Block) BeforeCreate(tx *gorm.DB) error {
	block.ID = uuid.New()

	return nil
}

// TableName sets the table name for the Post model
func (Block) TableName() string {
	return "blocks"
}
