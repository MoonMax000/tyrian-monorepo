package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"

	uuidgen "github.com/Capstane/AXA-socialweb-favorites/internal/pkg/uuid"
)

// File struct
type File struct {
	ID        uuid.UUID `gorm:"primaryKey;uniqueIndex;not null;type:uuid;"`
	Name      string    `json:"name"`
	UserName  string    `json:"user_name"`
	FileSize  int64     `json:"file_size"`
	Ext       string    `json:"ext"`
	Type      string    `json:"type"`
	BlockID   uuid.UUID `gorm:"gorm:type:uuid;index" json:"block_id"` // внешний ключ
	Block     Block     `gorm:"foreignKey:BlockID;"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (file *File) BeforeCreate(tx *gorm.DB) error {
	return uuidgen.BeforeCreate(tx)
}

// TableName sets the table name for the File model
func (File) TableName() string {
	return "files"
}
