package model

import "github.com/google/uuid"

// User notification settings struct
type UserNotificationSettings struct {
	UserID uuid.UUID `gorm:"primarykey;uniqueIndex;not null;type:uuid;column:user_id;"`

	EmailNotifications      bool `gorm:"not null" json:"email_notifications"`
	NotifyOnLiveBroadcast   bool `gorm:"not null" json:"notify_on_live_broadcast"`
	NotifyOnVOD             bool `gorm:"not null" json:"notify_on_vod"`
	NotifyOnMention         bool `gorm:"not null" json:"notify_on_mention"`
	NotifyOnNewSubscriber   bool `gorm:"not null" json:"notify_on_new_subscriber"`
	NotifyOnRecommendations bool `gorm:"not null" json:"notify_on_recommendations"`
	NotifyOnNews            bool `gorm:"not null" json:"notify_on_news"`
}
