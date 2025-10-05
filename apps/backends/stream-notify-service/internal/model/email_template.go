package model

import (
	"strings"
	"sync"

	"github.com/Capstane/stream-notify-service/internal/default_email_templates"
	"github.com/Capstane/stream-notify-service/internal/dto"
	"github.com/gofiber/fiber/v2/log"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"html/template"
)

// EmailTemplate struct
type EmailTemplate struct {
	gorm.Model
	ID              uuid.UUID `gorm:"primarykey;uniqueIndex;not null;type:uuid;"`
	EventType       string    `gorm:"uniqueIndex;not null;size:50;column:event_type;" validate:"required,min=3,max=50" json:"type"`
	BodyTemplate    string    `gorm:"not null;size:65535;column:body_template;" validate:"required,max=65535" json:"body"`
	SubjectTemplate string    `gorm:"not null;size:1024;column:subject_template;" validate:"required,min=6,max=1024" json:"subject"`
}

func (emailTemplate *EmailTemplate) BeforeCreate(tx *gorm.DB) error {
	// UUID version 4
	emailTemplate.ID = uuid.New()

	return nil
}

func NewEmailTemplate(eventType default_email_templates.EmailEventType) *EmailTemplate {
	return &EmailTemplate{
		EventType:       string(eventType),
		BodyTemplate:    default_email_templates.GetTemplate(eventType, default_email_templates.BODY),
		SubjectTemplate: default_email_templates.GetTemplate(eventType, default_email_templates.SUBJECT),
	}
}

type CompiledEmailTemplate struct {
	subject *template.Template
	body    *template.Template
}

var (
	htmlTemplates sync.Map = sync.Map{}
)

func getCompiledEmailTemplate(
	eventType,
	emailSubjectTemplate,
	emailBodyTemplate string,
) *CompiledEmailTemplate {
	// Get from local cache
	result, ok := htmlTemplates.Load(eventType)
	if ok {
		return result.(*CompiledEmailTemplate)
	}
	subjectTemplate, err := template.New(eventType).Parse(emailSubjectTemplate)
	if err != nil {
		log.Errorf("Bad subject template for eventType: %v", eventType)
	}
	bodyTemplate, err := template.New(eventType).Parse(emailBodyTemplate)
	if err != nil {
		log.Errorf("Bad body template for eventType: %v", eventType)
	}

	result, _ = htmlTemplates.LoadOrStore(eventType, &CompiledEmailTemplate{
		subject: subjectTemplate,
		body:    bodyTemplate,
	})
	return result.(*CompiledEmailTemplate)
}

func (emailTemplate *EmailTemplate) Apply(messageType dto.SmtpMessageType, email string, data any) (*dto.SmtpMessage, error) {
	// Get from local cache
	compiledEmailTemplate := getCompiledEmailTemplate(
		emailTemplate.EventType,
		emailTemplate.SubjectTemplate,
		emailTemplate.BodyTemplate,
	)

	bodyWriter := new(strings.Builder)
	err := compiledEmailTemplate.body.Execute(bodyWriter, data)
	if err != nil {
		return nil, err
	}

	subjectWriter := new(strings.Builder)
	err = compiledEmailTemplate.subject.Execute(subjectWriter, data)
	if err != nil {
		return nil, err
	}

	return &dto.SmtpMessage{
		Type:    messageType.String(),
		Subject: subjectWriter.String(),
		Text:    bodyWriter.String(),
		To:      email,
	}, nil
}
