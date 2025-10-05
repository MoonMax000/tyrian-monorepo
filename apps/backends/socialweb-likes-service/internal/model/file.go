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
	PostID    uuid.UUID `gorm:"gorm:type:uuid;not null;index" json:"post_id"` // внешний ключ
	Post      Post      `gorm:"foreignKey:PostID;"`
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
