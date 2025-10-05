package service

import (
	"github.com/Capstane/stream-recommend-service/internal/types"
	"github.com/google/uuid"
)

type StreamService interface {
	GetStreamData(userID uuid.UUID) *types.StreamData
	GetOnlineChannels() []StreamInfo
	GetUniqueTags() []string
}
