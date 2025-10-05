package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Role represents the database model of roles
type UserRole struct {
	ID   uuid.UUID `gorm:"primaryKey;type:uuid"`
	Name string    `gorm:"unique;not null"`
}

func (userRole *UserRole) BeforeCreate(tx *gorm.DB) error {
	// UUID version 4
	userRole.ID = uuid.New()

	return nil
}
