package translation

import (
	"time"

	"github.com/google/uuid"
)

type TranslationStatistics struct {
	UserID uuid.UUID

	ViewersCount int

	StreamName     string
	StreamCategory string
	StreamTags     []string
	TranslationUrl string

	IsOnline       bool
	AutoCloseAfter *time.Time
}
