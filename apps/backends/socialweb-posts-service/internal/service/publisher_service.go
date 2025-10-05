package service

import "github.com/google/uuid"

type PostMakerService interface {
	GetTop100Users() []Author
	OnSubscribeTo(uuid.UUID)
	OnUnsubscribeFrom(uuid.UUID)
}
