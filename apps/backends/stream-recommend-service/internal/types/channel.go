package types

import "github.com/google/uuid"

type Channel struct {
	ID              uuid.UUID `json:"id"`
	Username        string    `json:"username"`
	Description     string    `json:"description"`
	AvatarURL       string    `json:"avatar_url"`
	CoverURL        string    `json:"cover_url"`
	DonationURL     string    `json:"donation_url,omitempty"`
	Subscribed      *bool     `json:"subscribed"`
	SubscriberCount int64     `json:"subscriber_count"`
	// Categories      []string    `json:"categories"`
	Stream *StreamData `json:"stream,omitempty"`
}

type ChannelIdsRequest struct {
	ChannelIds []string `json:"channel_ids"`
}

type GetAllChannelsRequest struct {
	PaginationRequest
	Category string `json:"category"`
	Tag      string `json:"tag"`
}

type ChannelResponse struct {
	Status string  `json:"status"`
	Data   Channel `json:"data"`
}

type ChannelsResponse struct {
	Status     string             `json:"status"`
	Data       []Channel          `json:"data"`
	Pagination PaginationResponse `json:"pagination,omitempty"`
}
