package model

import (
	uuidgen "github.com/Capstane/AXA-socialweb-favorites/internal/pkg/uuid"
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
	return uuidgen.BeforeCreate(tx)
}

// TableName sets the table name for the Post model
func (Block) TableName() string {
	return "blocks"
}
