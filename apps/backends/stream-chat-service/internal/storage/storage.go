package storage

import (
	"time"

	"github.com/Capstane/stream-chat-service/internal/types"
	"github.com/google/uuid"
)

type NamesStorage interface {
	Add(user ChatUser, streamOwner uuid.UUID) ChatUser
	Refresh(user ChatUser, streamOwner uuid.UUID)
	Disconnect(user ChatUser, streamOwner uuid.UUID)
	AddConnection(streamOwner uuid.UUID)
	GetNames() []byte
	Get(id uuid.UUID) ChatUser
	RefreshForConn(uid uuid.UUID, nick string, simplified types.SimplifiedUser, featuint uint64, streamOwner uuid.UUID)
}

type ChatUser interface {
	FeatureGet(bitnum uint64) bool
	GetFieldId() uuid.UUID
	GetFieldNick() string
	GetFieldDelayscale() uint8
	GetFieldFeatures() uint64
	GetFieldLastmessage() []byte
	GetFieldLastmessagetime() time.Time
	GetFieldSimplified() *types.SimplifiedUser
	GetFieldConnections() int32
	IsModerator() bool
	IsSubscriber() bool
	IsAdmin() bool
	IsBot() bool
	SetFieldNick(nick string)
	SetFieldSimplified(simplified *types.SimplifiedUser)
	SetFieldLastmessage(lastMessage []byte)
	SetFieldLastmessagetime(lastMessageTime time.Time)
	SetFieldDelayscale(deleteScale uint8)
	SetFieldFeatures(features uint64)
	SetFeatures(features []string)
	SetFieldConnections(connections int32)
	IsProtected() bool
	AssembleSimplifiedUser()
}

var StreamOwnerToChat = make(map[string]uuid.UUID)
