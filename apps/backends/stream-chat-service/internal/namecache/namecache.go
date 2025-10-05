package namecache

import (
	"sync"

	"github.com/Capstane/stream-chat-service/internal"
	"github.com/Capstane/stream-chat-service/internal/cache"
	"github.com/Capstane/stream-chat-service/internal/storage"
	"github.com/Capstane/stream-chat-service/internal/types"
	"github.com/google/uuid"
)

// namescache
type namesCache struct {
	users           map[uuid.UUID]storage.ChatUser
	marshallednames []byte
	usercount       uint32
	ircnames        [][]string
	sync.RWMutex
}

// ffjson: skip
type userChan struct {
	user *storage.ChatUser
	c    chan *storage.ChatUser
}

type NamesOut struct {
	Users       []*types.SimplifiedUser `json:"users"`
	Connections uint32                  `json:"connectioncount"`
}

var Namescaches map[string]storage.NamesStorage = make(map[string]storage.NamesStorage)

func InitNamesCache(StreamUrl string) {
	Namescaches[StreamUrl] = &namesCache{
		users:   make(map[uuid.UUID]storage.ChatUser),
		RWMutex: sync.RWMutex{},
	}
}

func (nc *namesCache) getIrcNames() [][]string {
	nc.RLock()
	defer nc.RUnlock()
	return nc.ircnames
}

func (nc *namesCache) marshalNames(updateircnames bool, streamOwner uuid.UUID) {
	users := make([]*types.SimplifiedUser, 0, len(nc.users))
	var allnames []string
	if updateircnames {
		allnames = make([]string, 0, len(nc.users))
	}
	for _, u := range nc.users {
		// u.RLock()
		uconn := u.GetFieldConnections()
		if uconn <= 0 {
			continue
		}
		users = append(users, u.GetFieldSimplified())
		if updateircnames {
			prefix := ""
			switch {
			case u.FeatureGet(internal.ISADMIN):
				prefix = "~" // +q
			case u.FeatureGet(internal.ISBOT):
				prefix = "&" // +a
			case u.FeatureGet(internal.ISMODERATOR):
				prefix = "@" // +o
			case u.FeatureGet(internal.ISVIP):
				prefix = "%" // +h
			case u.FeatureGet(internal.ISSUBSCRIBER):
				prefix = "+" // +v
			}
			allnames = append(allnames, prefix+u.GetFieldNick())
		}
	}

	if updateircnames {
		l := 0
		var namelines [][]string
		var names []string
		for _, name := range allnames {
			if l+len(name) > 400 {
				namelines = append(namelines, names)
				l = 0
				names = nil
			}
			names = append(names, name)
			l += len(name)
		}
		nc.ircnames = namelines
	}

	n := NamesOut{
		Users:       users,
		Connections: nc.usercount,
	}

	nc.marshallednames, _ = n.MarshalJSON()

	cache.CacheConnectedUsers(nc.marshallednames, streamOwner)

	// for _, u := range nc.users {
	// 	u.RUnlock()
	// }
}

func (nc *namesCache) GetNames() []byte {
	nc.RLock()
	defer nc.RUnlock()
	return nc.marshallednames
}

func (nc *namesCache) Get(id uuid.UUID) storage.ChatUser {
	nc.RLock()
	defer nc.RUnlock()
	u, _ := nc.users[id]
	return u
}

func (nc *namesCache) Add(user storage.ChatUser, streamOwner uuid.UUID) storage.ChatUser {
	nc.Lock()
	defer nc.Unlock()

	nc.usercount++
	var updateircnames bool
	if u, ok := nc.users[user.GetFieldId()]; ok {
		u.SetFieldConnections(1)
	} else {
		updateircnames = true
		user.SetFieldConnections(1)
		su := &types.SimplifiedUser{
			Nick:     user.GetFieldNick(),
			Features: user.GetFieldSimplified().Features,
		}
		user.SetFieldSimplified(su)
		nc.users[user.GetFieldId()] = user
	}
	nc.marshalNames(updateircnames, streamOwner)
	return nc.users[user.GetFieldId()]
}

func (nc *namesCache) Disconnect(user storage.ChatUser, streamOwner uuid.UUID) {
	nc.Lock()
	defer nc.Unlock()
	var updateircnames bool

	if user != nil {
		nc.usercount--
		if u, ok := nc.users[user.GetFieldId()]; ok {
			u.SetFieldConnections(0)
			conncount := u.GetFieldConnections()
			if conncount <= 0 {
				// we do not delete the users so that the lastmessage is preserved for
				// anti-spam purposes, sadly this means memory usage can only go up
				updateircnames = true
			}
		}

	} else {
		nc.usercount--
	}
	nc.marshalNames(updateircnames, streamOwner)
}

func (nc *namesCache) Refresh(user storage.ChatUser, streamOwner uuid.UUID) {
	nc.RLock()
	defer nc.RUnlock()

	if u, ok := nc.users[user.GetFieldId()]; ok {
		u.GetFieldSimplified().Nick = user.GetFieldNick()
		u.GetFieldSimplified().Features = user.GetFieldSimplified().Features
		u.SetFieldNick(user.GetFieldNick())
		u.SetFieldFeatures(user.GetFieldFeatures())
		// old
		// u.Lock()
		// u.Simplified.Nick = user.GetFieldNick()
		// u.Simplified.Features = user.GetFieldSimplified().Features
		// u.Nick = user.GetFieldNick()
		// u.Features = user.GetFieldFeatures()
		// u.Unlock()
		nc.marshalNames(true, streamOwner)
	}
}

func (nc *namesCache) RefreshForConn(uid uuid.UUID, nick string, simplified types.SimplifiedUser, featuint uint64, streamOwner uuid.UUID) {
	nc.RLock()
	defer nc.RUnlock()

	if u, ok := nc.users[uid]; ok {
		u.GetFieldSimplified().Nick = nick
		u.GetFieldSimplified().Features = simplified.Features
		u.SetFieldNick(nick)
		u.SetFieldFeatures(featuint)
		nc.marshalNames(true, streamOwner)
	}
}

func (nc *namesCache) AddConnection(streamOwner uuid.UUID) {
	nc.Lock()
	defer nc.Unlock()
	nc.usercount++
	nc.marshalNames(false, streamOwner)
}
