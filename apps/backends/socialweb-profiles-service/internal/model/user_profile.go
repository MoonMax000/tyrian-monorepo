package model

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User profile struct
type UserProfile struct {
	gorm.Model
	ID uuid.UUID `gorm:"primarykey;uniqueIndex;not null;type:uuid;"`

	EnableNotifications bool `json:"enable_notifications"`

	NotificationSound         bool `json:"notification_sound"`
	DesktopNotifications      bool `json:"desktop_notifications"`
	SuspiciousAttemptsToLogon bool `json:"suspicious_attempts_to_logon"`

	WhenSomeoneFollowsYouEmail                 bool `json:"when_someone_follows_you_email"`
	WhenSomeoneFollowsYouWs                    bool `json:"when_someone_follows_you_ws"`
	WhenSomeoneMentionsYouInIdeaCommentsWs     bool `json:"when_someone_mentions_you_in_idea_comments_ws"`
	WhenSomeoneMentionsYouWhileYouOfflineEmail bool `json:"when_someone_mentions_you_while_you_offline_email"`
	WhenSomeoneMentionsYouWhileYouOfflineWs    bool `json:"when_someone_mentions_you_while_you_offline_ws"`

	WhenSomeoneCommentsYouIdeaEmail bool `json:"when_someone_comments_you_idea_email"`
	WhenSomeoneCommentsYouIdeaWs    bool `json:"when_someone_comments_you_idea_ws"`
	WhenSomeoneLikesYouIdeaEmail    bool `json:"when_someone_likes_you_idea_email"`
	WhenSomeoneLikesYouIdeaWs       bool `json:"when_someone_likes_you_idea_ws"`

	WhenTheyPublishNewIdeaEmail    bool `json:"when_they_publish_new_idea_email"`
	WhenTheyPublishNewIdeaWs       bool `json:"when_they_publish_new_idea_ws"`
	WhenTheyPublishNewOpinionEmail bool `json:"when_they_publish_new_opinion_email"`
	WhenTheyPublishNewOpinionWs    bool `json:"when_they_publish_new_opinion_ws"`

	WhenIdeaUpdateEmail bool `json:"when_idea_update_email"`
	WhenIdeaUpdateWs    bool `json:"when_idea_update_ws"`

	WhenScriptUpdateEmail bool `json:"when_script_update_email"`
	WhenScriptUpdateWs    bool `json:"when_script_update_ws"`

	WhenSomeoneMentionsYouInOpinionEmail  bool `json:"when_someone_mentions_you_in_opinion_email"`
	WhenSomeoneMentionsYouInOpinionWs     bool `json:"when_someone_mentions_you_in_opinion_ws"`
	WhenSomeoneMentionsYouInIdeaCommentWs bool `json:"when_someone_mentions_you_in_idea_comment_ws"`
}
