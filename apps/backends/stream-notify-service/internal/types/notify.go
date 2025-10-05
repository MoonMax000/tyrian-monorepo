package types

import "github.com/google/uuid"

type NotifyUpdateRequest struct {
	EmailNotifications      bool `json:"email_notifications"`
	NotifyOnLiveBroadcast   bool `json:"notify_on_live_broadcast"`
	NotifyOnVOD             bool `json:"notify_on_vod"`
	NotifyOnMention         bool `json:"notify_on_mention"`
	NotifyOnNewSubscriber   bool `json:"notify_on_new_subscriber"`
	NotifyOnRecommendations bool `json:"notify_on_recommendations"`
	NotifyOnNews            bool `json:"notify_on_news"`
}

type NotifyResponse struct {
	EmailNotifications      bool `json:"email_notifications"`
	NotifyOnLiveBroadcast   bool `json:"notify_on_live_broadcast"`
	NotifyOnVOD             bool `json:"notify_on_vod"`
	NotifyOnMention         bool `json:"notify_on_mention"`
	NotifyOnNewSubscriber   bool `json:"notify_on_new_subscriber"`
	NotifyOnRecommendations bool `json:"notify_on_recommendations"`
	NotifyOnNews            bool `json:"notify_on_news"`
}

type NotifyOnLiveBroadcast struct {
	UserID uuid.UUID `json:"user_id"`
	Email  string    `json:"email"`
	Ref    string    `json:"ref"`
}

type NotifyOnVOD struct {
	UserID uuid.UUID `json:"user_id"`
	Email  string    `json:"email"`
	Ref    string    `json:"ref"`
}

type NotifyOnMention struct {
	UserID uuid.UUID `json:"user_id"`
	Email  string    `json:"email"`
	Ref    string    `json:"ref"`
}

type NotifyOnNewSubscriber struct {
	UserID uuid.UUID `json:"user_id"`
	Email  string    `json:"email"`
	Ref    string    `json:"ref"`
}

type NotifyOnRecommendations struct {
	UserID uuid.UUID `json:"user_id"`
	Email  string    `json:"email"`
	Ref    string    `json:"ref"`
}

type NotifyOnNews struct {
	UserID uuid.UUID `json:"user_id"`
	Email  string    `json:"email"`
	Ref    string    `json:"ref"`
}
