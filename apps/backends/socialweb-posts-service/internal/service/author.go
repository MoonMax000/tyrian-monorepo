package service

import "github.com/google/uuid"

// Author contains information about a user for sorting and filtering
type Author struct {
	UserID          uuid.UUID
	LastUpdated     int64
	SubscriberCount int
}
