package model

import (
	"github.com/google/uuid"
)

// Follower представляет связь между пользователями (подписки)
type Follower struct {
	FollowedID uuid.UUID `gorm:"type:uuid;primaryKey"` // ID пользователя, на которого подписались
	FollowerID uuid.UUID `gorm:"type:uuid;primaryKey"` // ID пользователя-подписчика
}
