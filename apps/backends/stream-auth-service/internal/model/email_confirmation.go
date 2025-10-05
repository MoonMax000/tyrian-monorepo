package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// EmailTemplate struct
type EmailConfirmation struct {
	UserID    uuid.UUID `gorm:"primarykey;type:uuid;column:user_id;"`
	User      User      `gorm:"foreignKey:UserID;references:ID;"`
	Token     string    `gorm:"uniqueIndex;not null;"`
	Timestamp time.Time
}

func NewEmailConfirmation(userId uuid.UUID) *EmailConfirmation {
	return &EmailConfirmation{
		UserID:    userId,
		Token:     UniqueRandomString(100),
		Timestamp: time.Now(),
	}
}

func (emailConfirmation *EmailConfirmation) BeforeCreate(tx *gorm.DB) error {
	// Unique link part (it's security safe)
	emailConfirmation.Token = UniqueRandomString(100)
	emailConfirmation.Timestamp = time.Now()

	return nil
}

func (*EmailConfirmation) TableName() string {
	return "auth_email_confirmation_request"
}

func (*EmailConfirmation) AfterInsertTrigger() string {
	return `
DROP TRIGGER IF EXISTS auth_email_confirmation_request_delete_old_rows_trigger ON auth_email_confirmation_request;
DROP FUNCTION IF EXISTS auth_email_confirmation_request_delete_old_rows;

CREATE FUNCTION auth_email_confirmation_request_delete_old_rows() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM auth_email_confirmation_request WHERE timestamp < NOW() - INTERVAL '1 day';
  RETURN NEW;
END;
$$;

CREATE TRIGGER auth_email_confirmation_request_delete_old_rows_trigger
    AFTER INSERT ON auth_email_confirmation_request
    EXECUTE PROCEDURE auth_email_confirmation_request_delete_old_rows();
	`
}
