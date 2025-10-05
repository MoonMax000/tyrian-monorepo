package usertools

import (
	"strings"
	"sync"

	"github.com/Capstane/stream-chat-service/internal/database"
	"github.com/Capstane/stream-chat-service/internal/storage"
	"github.com/google/uuid"
)

type UserTools struct {
	Nicklookup  map[string]*uidprot
	Nicklock    sync.RWMutex
	Featurelock sync.RWMutex
	Features    map[uint64][]string
}

var (
	Usertools = UserTools{
		Nicklookup:  make(map[string]*uidprot),
		Nicklock:    sync.RWMutex{},
		Featurelock: sync.RWMutex{},
		Features:    make(map[uint64][]string),
	}
)

// ffjson: skip
type uidprot struct {
	id        uuid.UUID
	protected bool
}

func (ut *UserTools) GetUseridForNick(nick string) (uuid.UUID, bool) {
	ut.Nicklock.RLock()
	d, ok := ut.Nicklookup[strings.ToLower(nick)]
	if !ok {
		uid, protected := database.DB.GetUser(nick)
		if uid != uuid.Nil {
			ut.Nicklock.RUnlock()
			ut.Nicklock.Lock()
			ut.Nicklookup[strings.ToLower(nick)] = &uidprot{uid, protected}
			ut.Nicklock.Unlock()
			return uid, protected
		}
		ut.Nicklock.RUnlock()
		return uuid.Nil, false
	}
	ut.Nicklock.RUnlock()
	return d.id, d.protected
}

func (ut *UserTools) AddUser(u storage.ChatUser, force bool) {
	lowernick := strings.ToLower(u.GetFieldNick())
	if !force {
		ut.Nicklock.RLock()
		_, ok := ut.Nicklookup[lowernick]
		ut.Nicklock.RUnlock()
		if ok {
			return
		}
	}
	ut.Nicklock.Lock()
	defer ut.Nicklock.Unlock()
	ut.Nicklookup[lowernick] = &uidprot{u.GetFieldId(), u.IsProtected()}
}
