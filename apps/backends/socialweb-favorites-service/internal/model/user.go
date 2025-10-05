package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/Capstane/AXA-socialweb-favorites/internal/pkg/url"
	uuidgen "github.com/Capstane/AXA-socialweb-favorites/internal/pkg/uuid"
)

// User struct
type User struct {
	gorm.Model
	ID             uuid.UUID `gorm:"primarykey;uniqueIndex;not null;type:uuid;"`
	Username       string    `gorm:"uniqueIndex;not null;size:50;" validate:"required,min=3,max=50" json:"username"`
	Email          string    `gorm:"uniqueIndex;not null;size:255;" validate:"required,email" json:"email"`
	EmailConfirmed bool      `gorm:"not null;column:email_confirmed;" json:"email_confirmed"`
	PasswordHash   string    `gorm:"column:password_hash;" validate:"required,min=6,max=50" json:"password"`
	Description    string    `json:"description"`
	AvatarURL      string    `json:"avatar_url"`
	CoverURL       string    `json:"cover_url"`
	DonationURL    string    `json:"donation_url"`
	Roles          []string  `gorm:"type:text; serializer:json" json:"roles"`
}

func (user *User) BeforeCreate(tx *gorm.DB) error {
	return uuidgen.BeforeCreate(tx)
}

func (user *User) GetAvatarUrl(cdnUrl string) string {
	if user.AvatarURL == "" {
		return ""
	}
	return url.Join(cdnUrl, user.AvatarURL)
}
func (User) TableName() string {
	return "auth_user"
}

func (user *User) GetCoverUrl(cdnUrl string) string {
	if user.CoverURL == "" {
		return ""
	}
	return url.Join(cdnUrl, user.CoverURL)
}
