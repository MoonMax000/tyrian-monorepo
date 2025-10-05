package types

import (
	"github.com/google/uuid"
)

type SubscribeRequest struct {
	ChannelId uuid.UUID `json:"channel_id"`
}

type UnsubscribeRequest struct {
	ChannelId uuid.UUID `json:"channel_id"`
}

type SubscriptionsResponse struct {
	Status string      `json:"status"`
	Data   []uuid.UUID `json:"data"`
}

type Subscriber struct {
	ID              uuid.UUID   `json:"id"`
	Username        string      `json:"username"`
	AvatarURL       string      `json:"avatar_url"`
	IsStreamer      bool        `json:"is_streamer"`
	Stream          *StreamData `json:"stream,omitempty"`
	SubscriberCount int64       `json:"subscriber_count"`
	IsSubscribed    bool        `json:"is_subscribed"`
}

type SubscriberListRequest struct {
	Page     int    `query:"page" json:"page"`
	PageSize int    `query:"page_size" json:"page_size"`
	SortBy   string `query:"sort_by" json:"sort_by" enums:"username,subscriber_count"`
	SortDir  string `query:"sort_dir" json:"sort_dir" enums:"asc,desc"`
}

type SubscriberListResponse struct {
	Status     string             `json:"status"`
	Data       []Subscriber       `json:"data"`
	Pagination PaginationResponse `json:"pagination"`
}
