package types

import (
	"github.com/google/uuid"
	"time"
)

type SubscribeRequest struct {
	ChannelId uuid.UUID `json:"channel_id"`
}

type LikeRequest struct {
	ChannelId uuid.UUID `json:"channel_id"`
}

type Subscription struct {
	ChannelId    uuid.UUID `json:"channel_id"`
	ChannelName  string    `json:"channel_name"`
	SubscribedAt time.Time `json:"subscribed_at"`
}

type SubscriptionsResponse struct {
	Status string         `json:"status"`
	Data   []Subscription `json:"data"`
}
