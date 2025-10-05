package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

// Subscription struct
type Postsubscription struct {
	FollowedID uuid.UUID `gorm:"type:uuid;"`
	UserID     uuid.UUID `gorm:"primaryKey;type:uuid"`
	PostID     uuid.UUID `gorm:"primaryKey;type:uuid"`
	CreatedAt  time.Time `gorm:"autoCreateTime"`
	IsActive   bool      `gorm:"default:true" json:"is_active"`
	//FollowedID uuid.UUID `gorm:"type:uuid;not null;default:uuid_generate_v4()"`

	// Связи
	User User `gorm:"foreignKey:UserID;references:ID;constraint:OnDelete:CASCADE"`
	Post Post `gorm:"foreignKey:PostID;references:ID;constraint:OnDelete:CASCADE"`
}

func (s *Postsubscription) BeforeCreate(tx *gorm.DB) error {
	if s.FollowedID == uuid.Nil {
		s.FollowedID = uuid.New()
	}
	return nil
}

// TableName sets the table name for the File model
func (Postsubscription) TableName() string {
	return "postsubscriptions"
}
