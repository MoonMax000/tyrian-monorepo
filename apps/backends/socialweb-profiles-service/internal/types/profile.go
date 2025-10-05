package types

import (
	"time"

	"gorm.io/datatypes"
)

// User notification settings
// @Description Настройки уведоплений для пользователя
// @Description например "Включить звук уведомления", "Когда кто-то подписался на вас" и т.д.
type ProfileNotificationSettings struct {
	// Включить/Выключить нотификации
	EnableNotifications *bool `json:"enable_notifications"`
	// Включить звук уведомления
	NotificationSound *bool `json:"notification_sound"`
	// Показывать уведомления на рабочем столе
	DesktopNotifications *bool `json:"desktop_notifications"`
	// Письма о подозрительных попытках войти в вашу учётную запись
	SuspiciousAttemptsToLogon *bool `json:"suspicious_attempts_to_logon"`

	// Когда кто-то подписался на вас (Ваш профиль) email
	WhenSomeoneFollowsYouEmail *bool `json:"when_someone_follows_you_email"`
	// Когда кто-то подписался на вас (Ваш профиль) web
	WhenSomeoneFollowsYouWs *bool `json:"when_someone_follows_you_ws"`
	// Когда кто-то упоминает вас в комментариях к идее (Ваш профиль) web
	WhenSomeoneMentionsYouInIdeaCommentsWs *bool `json:"when_someone_mentions_you_in_idea_comments_ws"`
	// Когда вас упомянули в чате, пока вы были не в сети (Ваш профиль) email
	WhenSomeoneMentionsYouWhileYouOfflineEmail *bool `json:"when_someone_mentions_you_while_you_offline_email"`
	// Когда вас упомянули в чате, пока вы были не в сети (Ваш профиль) web
	WhenSomeoneMentionsYouWhileYouOfflineWs *bool `json:"when_someone_mentions_you_while_you_offline_ws"`

	// Когда кто-то комментирует вашу идею (Ваши идеи) email
	WhenSomeoneCommentsYouIdeaEmail *bool `json:"when_someone_comments_you_idea_email"`
	// Когда кто-то комментирует вашу идею (Ваши идеи) web
	WhenSomeoneCommentsYouIdeaWs *bool `json:"when_someone_comments_you_idea_ws"`
	// Когда кому-то понравилась ваша идея (Ваши идеи) email
	WhenSomeoneLikesYouIdeaEmail *bool `json:"when_someone_likes_you_idea_email"`
	// Когда кому-то понравилась ваша идея (Ваши идеи) web
	WhenSomeoneLikesYouIdeaWs *bool `json:"when_someone_likes_you_idea_ws"`

	// Когда они опубликуют новую идею (Авторы, на которых вы подписаны) email
	WhenTheyPublishNewIdeaEmail *bool `json:"when_they_publish_new_idea_email"`
	// Когда они опубликуют новую идею (Авторы, на которых вы подписаны) web
	WhenTheyPublishNewIdeaWs *bool `json:"when_they_publish_new_idea_ws"`
	// Когда они публикуют новое мнение (Авторы, на которых вы подписаны) email
	WhenTheyPublishNewOpinionEmail *bool `json:"when_they_publish_new_opinion_email"`
	// Когда они публикуют новое мнение (Авторы, на которых вы подписаны) web
	WhenTheyPublishNewOpinionWs *bool `json:"when_they_publish_new_opinion_ws"`

	// Когда есть обновление (Идеи, на которые вы подписаны) email
	WhenIdeaUpdateEmail *bool `json:"when_idea_update_email"`
	// Когда есть обновление (Идеи, на которые вы подписаны) web
	WhenIdeaUpdateWs *bool `json:"when_idea_update_ws"`

	// Когда есть обновление (Скрипты, которые вы добавили в Избранное или оценили) email
	WhenScriptUpdateEmail *bool `json:"when_script_update_email"`
	// Когда есть обновление (Скрипты, которые вы добавили в Избранное или оценили) web
	WhenScriptUpdateWs *bool `json:"when_script_update_ws"`

	// Когда кто-то упоминает вас в мнении (Мнения) email
	WhenSomeoneMentionsYouInOpinionEmail *bool `json:"when_someone_mentions_you_in_opinion_email"`
	// Когда кто-то упоминает вас в мнении (Мнения) web
	WhenSomeoneMentionsYouInOpinionWs *bool `json:"when_someone_mentions_you_in_opinion_ws"`
	// Когда кто-то упоминает вас в комментарии к мнению (Мнения) web
	WhenSomeoneMentionsYouInIdeaCommentWs *bool `json:"when_someone_mentions_you_in_idea_comment_ws"`
}

type Profile struct {
	ID                   string                       `json:"id"`
	Username             string                       `json:"username"`
	Email                string                       `json:"email"`
	EmailConfirmed       bool                         `json:"email_confirmed"`
	Description          string                       `json:"description"`
	AvatarURL            string                       `json:"avatar_url"`
	CoverURL             string                       `json:"cover_url"`
	DonationURL          string                       `json:"donation_url"`
	Roles                []string                     `json:"roles"`
	Permits              datatypes.JSON               `json:"permits" swaggertype:"array,string"`
	NotificationSettings *ProfileNotificationSettings `json:"notification_settings"`
}

type ProfileUpdateRequest struct {
	Username             string                       `json:"username"`
	Description          string                       `json:"description"`
	DonationURL          string                       `json:"donation_url"`
	NotificationSettings *ProfileNotificationSettings `json:"notification_settings"`
}

type UserInfo struct {
	Id             string   `json:"id"`
	Username       string   `json:"username"`
	Email          string   `json:"email"`
	EmailConfirmed bool     `json:"email_confirmed"`
	Description    string   `json:"description"`
	AvatarURL      string   `json:"avatar"`
	CoverURL       string   `json:"cover"`
	DonationURL    string   `json:"donation"`
	Roles          []string `json:"roles"`

	Created time.Time `json:"created"`
	Updated time.Time `json:"updated"`
}

type ListedUserInfo struct {
	UserInfo

	CollectionId   string `json:"collectionId"`
	CollectionName string `json:"collectionName"`
}

type UserListResponse struct {
	Status     string           `json:"status"`
	Items      []ListedUserInfo `json:"items"`
	Page       int              `json:"page"`
	PerPage    int              `json:"perPage"`
	TotalItems int              `json:"totalItems"`
	TotalPages int              `json:"totalPages"`
}

type UserUpdateRequest struct {
	Username       string   `json:"username" form:"username"`
	Description    string   `json:"description" form:"description"`
	Email          string   `json:"email" form:"email"`
	EmailConfirmed *bool    `json:"email_confirmed" form:"email_confirmed"`
	AvatarURL      string   `json:"avatar" form:"avatar"`
	CoverURL       string   `json:"cover" form:"cover"`
	DonationURL    string   `json:"donation" form:"donation"`
	Roles          []string `json:"roles" form:"roles"`
}

type ChatUserProfile struct {
	ID             string         `json:"id"`
	Username       string         `json:"username"`
	Email          string         `json:"email"`
	EmailConfirmed bool           `json:"email_confirmed"`
	Description    string         `json:"description"`
	AvatarURL      string         `json:"avatar_url"`
	CoverURL       string         `json:"cover_url"`
	DonationURL    string         `json:"donation_url"`
	Roles          []string       `json:"roles"`
	Permits        datatypes.JSON `json:"permits" swaggertype:"array,string"`
	PasswordHash   []byte         `json:"password_hash"`
}

type PublicProfile struct {
	ID          string     `json:"id"`
	Username    string     `json:"username"`
	AvatarURL   string     `json:"avatar_url"`
	Bio         struct{}   `json:"bio"`
	MemberSince string     `json:"member_since"`
	Followers   []UserInfo `json:"followers"`
	Followings  []UserInfo `json:"followings"`
	Posts       []Post     `json:"posts"`
}

type Post struct {
	ID          string   `json:"id"`
	UserId      string   `json:"user_id"`
	Type        string   `json:"type"`
	Title       string   `json:"title"`
	Content     string   `json:"content"`
	MediaURL    string   `json:"media_url"`
	Payment     bool     `json:"payment"`
	Tags        []string `json:"tags"`
	Files       []string `json:"files"`
	Subscribers []string `json:"subscribers"`
}

type Tag struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type File struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	URL  string `json:"url"`
}
