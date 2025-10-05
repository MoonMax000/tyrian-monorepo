package default_email_templates

import "embed"

//go:embed *
var templatesFolder embed.FS

type EventType string

const (
	BECOME_STREAMER_REQUEST = "become_streamer_request"
)

type EmailPart string

const (
	BODY    EmailPart = "body.html"
	SUBJECT EmailPart = "subject.tmpl"
)

func GetTemplate(eventType EventType, emailPart EmailPart) string {
	result, err := templatesFolder.ReadFile(string(eventType) + "_" + string(emailPart))
	if err != nil {
		return ""
	}
	return string(result)
}
