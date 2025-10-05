package types

import "github.com/google/uuid"

type LikeRequest struct {
	ChannelId uuid.UUID `json:"channel_id"`
}
