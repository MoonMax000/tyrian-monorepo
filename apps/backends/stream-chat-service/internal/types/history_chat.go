package types

import (
	"time"

	"github.com/google/uuid"
)

type MessageChat struct {
	ID               uuid.UUID `json:"id"`
	Sender           uuid.UUID `json:"sender"`
	Nick             string    `json:"nick"`
	Message          string    `json:"message"`
	TimestampMessage time.Time `json:"timestamp_message"`
}

type SuccessResponseHistory struct {
	Status  string        `json:"status"`
	Message []MessageChat `json:"message"`
}
