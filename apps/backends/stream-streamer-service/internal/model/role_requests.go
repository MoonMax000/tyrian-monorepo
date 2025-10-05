package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// RoleRequest struct
type RoleRequest struct {
	gorm.Model
	ID      uuid.UUID `gorm:"type:uuid;primaryKey;uniqueIndex;not null"`
	UserId  uuid.UUID `gorm:"type:uuid;not null;" json:"user_id"`
	Email   string    `gorm:"type:text;" json:"email"`
	Role    string    `gorm:"not null" json:"role"`
	Comment string    `gorm:"type:text;" json:"сomment"`
	Status  string    `gorm:"type:text;" json:"status"`
}

func (roleRequest *RoleRequest) BeforeCreate(tx *gorm.DB) error {
	roleRequest.ID = uuid.New()
	return nil
}

func (RoleRequest) TableName() string {
	return "role_requests"
}
