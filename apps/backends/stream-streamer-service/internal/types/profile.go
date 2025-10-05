package types

import "github.com/google/uuid"

type BecomeStreamerRequest struct {
	Email          string `json:"email"`
	AdditionalText string `json:"additional_text"`
}

type StreamerRequestStatusResponse struct {
	ID     uuid.UUID `json:"id"`
	Status string    `json:"status"`
}
