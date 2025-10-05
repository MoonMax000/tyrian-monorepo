package model

import "github.com/google/uuid"

// UserStreamKey represents the database that stores the stream key for user
type UserStreamKey struct {
	StreamKey []byte    `json:"-" gorm:"primaryKey;type:bytea"`
	UserID    uuid.UUID `gorm:"not null;type:uuid;column:user_id;"`
}

func (*UserStreamKey) TableName() string {
	return "stream_key"
}
