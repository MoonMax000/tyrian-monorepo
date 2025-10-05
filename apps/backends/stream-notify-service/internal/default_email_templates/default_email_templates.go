package default_email_templates

import "embed"

//go:embed *
var templatesFolder embed.FS

type EmailEventType string

const (
	MESSAGE_ON_LIVE_BROADCAST  = "message_on_live_broadcast"  // Когда на отслеживаемом канале начинается прямая трансляция
	MESSAGE_ON_VOD             = "message_on_vod"             // Когда на отслеживаемом канале начинается повтор (VOD'ы)
	MESSAGE_ON_MENTION         = "message_on_mention"         // Когда кто-то упоминает вас в чате
	MESSAGE_ON_NEW_SUBSCRIBER  = "message_on_new_subscriber"  // Когда на вас подписывается другой пользователь
	MESSAGE_ON_RECOMMENDATIONS = "message_on_recommendations" // Когда проводятся трансляции, которые мне могут понравиться, исходя из того, что я смотрю
	MESSAGE_ON_NEWS            = "message_on_news"            // Когда появляются новости о каналах, на которые вы подписаны
)

type EmailPart string

const (
	BODY    EmailPart = "body.html"
	SUBJECT EmailPart = "subject.tmpl"
)

func GetTemplate(eventType EmailEventType, emailPart EmailPart) string {
	result, err := templatesFolder.ReadFile(string(eventType) + "_" + string(emailPart))
	if err != nil {
		return ""
	}
	return string(result)
}
