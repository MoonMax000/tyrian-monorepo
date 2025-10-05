package service

import "github.com/google/uuid"

// StreamInfo contains information about a stream for sorting and filtering
type StreamInfo struct {
	UserID      uuid.UUID
	ViewerCount int
	LastUpdated int64
}
