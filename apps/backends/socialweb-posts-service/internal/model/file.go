package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
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
	// UUID version 4
	file.ID = uuid.New()

	return nil
}

// TableName sets the table name for the File model
func (File) TableName() string {
	return "files"
}
