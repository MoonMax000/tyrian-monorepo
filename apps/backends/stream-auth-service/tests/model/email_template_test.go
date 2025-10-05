package model

import (
	"testing"

	"github.com/Capstane/stream-auth-service/internal/default_email_templates"
	"github.com/Capstane/stream-auth-service/internal/model"
)

func TestEmailTemplateCase1(t *testing.T) {
	compiledEmailTemplate := model.NewEmailTemplate(default_email_templates.EMAIL_CONFIRM)
	if compiledEmailTemplate == nil {
		t.Errorf("Bad email template for %v", default_email_templates.EMAIL_CONFIRM)
	} else {
		if compiledEmailTemplate.BodyTemplate == "" {
			t.Error("Invalid body template")
		}
		if compiledEmailTemplate.SubjectTemplate == "" {
			t.Error("Invalid subject template")
		}
	}
}
