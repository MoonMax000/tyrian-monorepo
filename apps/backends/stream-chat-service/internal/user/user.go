package user

import (
	"fmt"
	"net"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/Capstane/stream-chat-service/internal"
	"github.com/Capstane/stream-chat-service/internal/cache"
	"github.com/Capstane/stream-chat-service/internal/connection"
	"github.com/Capstane/stream-chat-service/internal/database"
	"github.com/Capstane/stream-chat-service/internal/namecache"
	"github.com/Capstane/stream-chat-service/internal/storage"
	"github.com/Capstane/stream-chat-service/internal/types"
	usertools "github.com/Capstane/stream-chat-service/internal/usertools"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
	"github.com/tideland/golib/redis"
)

// interface ChatUser
type chatUser struct {
	Id              uuid.UUID
	Nick            string
	Features        uint64
	Lastmessage     []byte
	Lastmessagetime time.Time
	Delayscale      uint8
	Simplified      *types.SimplifiedUser
	Connections     int32
	sync.RWMutex
}

type sessionuser struct {
	Username string    `json:"username"`
	UserId   uuid.UUID `json:"userId"`
	Features []string  `json:"features"`
}

func InitUsers(redisdb int64, hubID string) {
	go runRefreshUser(redisdb, hubID)
}

func runRefreshUser(redisdb int64, chatID string) {
	hub, exists := connection.GetHubByID(chatID)
	if !exists {
		log.Error().Msgf("[runRefreshUser] [hub] Hub with ID %v does not exist", chatID)
		return
	}

	streamOwner := storage.StreamOwnerToChat[chatID]

	cache.SetupRedisSubscription("refreshuser", redisdb, func(result *redis.PublishedValue) {
		user := UserfromSession(result.Value.Bytes(), chatID)
		namecache.Namescaches[chatID].Refresh(user, streamOwner)
		hub.Refreshuser <- user.GetFieldId()
	})
}

func (u *chatUser) GetFieldId() uuid.UUID {
	u.RLock()
	defer u.RUnlock()
	return u.Id
}

func (u *chatUser) GetFieldNick() string {
	u.RLock()
	defer u.RUnlock()
	return u.Nick
}

func (u *chatUser) GetFieldFeatures() uint64 {
	u.RLock()
	defer u.RUnlock()
	return u.Features
}

func (u *chatUser) GetFieldLastmessage() []byte {
	u.RLock()
	defer u.RUnlock()
	return u.Lastmessage
}

func (u *chatUser) GetFieldLastmessagetime() time.Time {
	u.RLock()
	defer u.RUnlock()
	return u.Lastmessagetime
}

func (u *chatUser) GetFieldDelayscale() uint8 {
	u.RLock()
	defer u.RUnlock()
	return u.Delayscale
}

func (u *chatUser) GetFieldSimplified() *types.SimplifiedUser {
	u.RLock()
	defer u.RUnlock()
	return u.Simplified
}

func (u *chatUser) GetFieldConnections() int32 {
	u.RLock()
	defer u.RUnlock()
	return u.Connections
}

func (u *chatUser) SetFieldId(id uuid.UUID) {
	u.Lock()
	defer u.Unlock()
	u.Id = id
}

func (u *chatUser) SetFieldNick(nick string) {
	u.Lock()
	defer u.Unlock()
	u.Nick = nick
}

func (u *chatUser) SetFieldFeatures(features uint64) {
	u.Lock()
	defer u.Unlock()
	u.Features = features
}

func (u *chatUser) SetFieldLastmessage(lastMessage []byte) {
	u.Lock()
	defer u.Unlock()
	u.Lastmessage = lastMessage
}

func (u *chatUser) SetFieldLastmessagetime(lastMessageTime time.Time) {
	u.Lock()
	defer u.Unlock()
	u.Lastmessagetime = lastMessageTime
}

func (u *chatUser) SetFieldDelayscale(deleteScale uint8) {
	u.Lock()
	defer u.Unlock()
	u.Delayscale = deleteScale
}

func (u *chatUser) SetFieldSimplified(simplified *types.SimplifiedUser) {
	u.Lock()
	defer u.Unlock()
	u.Simplified = simplified
}

func (u *chatUser) SetFieldConnections(connections int32) {
	u.Lock()
	defer u.Unlock()
	u.Connections = connections
}

func UserfromSession(m []byte, chatID string) (u storage.ChatUser) {
	var su sessionuser

	err := su.UnmarshalJSON(m)
	if err != nil {
		log.Error().Msgf("[userfromSession] [user] Unable to unmarshal sessionuser string %s", string(m))
		return
	}

	u = &chatUser{
		Id:              su.UserId,
		Nick:            su.Username,
		Features:        0,
		Lastmessage:     nil,
		Lastmessagetime: time.Time{},
		Delayscale:      1,
		Simplified:      nil,
		Connections:     0,
		RWMutex:         sync.RWMutex{},
	}

	u.SetFeatures(su.Features)

	forceupdate := false
	if cu := namecache.Namescaches[chatID].Get(u.GetFieldId()); cu != nil && cu.GetFieldFeatures() == u.GetFieldFeatures() {
		forceupdate = true
	}

	u.AssembleSimplifiedUser()
	usertools.Usertools.AddUser(u, forceupdate)
	return
}

func (u *chatUser) FeatureGet(bitnum uint64) bool {
	return ((u.Features & bitnum) != 0)
}

func (u *chatUser) featureSet(bitnum uint64) {
	u.Features |= bitnum
}

func (u *chatUser) featureCount() (c uint8) {
	// Counting bits set, Brian Kernighan's way
	v := u.Features
	for c = 0; v != 0; c++ {
		v &= v - 1 // clear the least significant bit set
	}
	return
}

// isModerator checks if the user can use mod commands
func (u *chatUser) IsModerator() bool {
	return u.FeatureGet(internal.ISMODERATOR | internal.ISADMIN | internal.ISBOT)
}

// isSubscriber checks if the user can speak when the chat is in submode
func (u *chatUser) IsSubscriber() bool {
	return u.FeatureGet(internal.ISSUBSCRIBER | internal.ISADMIN | internal.ISMODERATOR | internal.ISVIP | internal.ISBOT)
}

// isBot checks if the user is exempt from ratelimiting
func (u *chatUser) IsBot() bool {
	return u.FeatureGet(internal.ISBOT)
}

func (u *chatUser) IsAdmin() bool {
	return u.FeatureGet(internal.ISADMIN)
}

// isProtected checks if the user can be moderated or not
func (u *chatUser) IsProtected() bool {
	return u.FeatureGet(internal.ISADMIN | internal.ISPROTECTED)
}

func (u *chatUser) SetFeatures(features []string) {
	for _, feature := range features {
		switch feature {
		case "admin":
			u.featureSet(internal.ISADMIN)
		case "moderator":
			u.featureSet(internal.ISMODERATOR)
		case "protected":
			u.featureSet(internal.ISPROTECTED)
		case "subscriber":
			u.featureSet(internal.ISSUBSCRIBER)
		case "vip":
			u.featureSet(internal.ISVIP)
		case "bot":
			u.featureSet(internal.ISBOT)
		default:
			if feature[:5] == "flair" {
				flair, err := strconv.Atoi(feature[5:])
				if err != nil {
					log.Error().Msgf("[isProtected] [user] Could not parse unknown feature %s, %s", feature, err)
					continue
				}
				// six proper features, all others are just useless flairs
				u.featureSet(1 << (5 + uint8(flair)))
			}
		}
	}
}

func (u *chatUser) AssembleSimplifiedUser() {
	usertools.Usertools.Featurelock.RLock()
	f, ok := usertools.Usertools.Features[u.Features]
	usertools.Usertools.Featurelock.RUnlock()

	if !ok {
		usertools.Usertools.Featurelock.Lock()
		defer usertools.Usertools.Featurelock.Unlock()

		numfeatures := u.featureCount()
		f = make([]string, 0, numfeatures)
		if u.FeatureGet(internal.ISPROTECTED) {
			f = append(f, "protected")
		}
		if u.FeatureGet(internal.ISSUBSCRIBER) {
			f = append(f, "subscriber")
		}
		if u.FeatureGet(internal.ISVIP) {
			f = append(f, "vip")
		}
		if u.FeatureGet(internal.ISMODERATOR) {
			f = append(f, "moderator")
		}
		if u.FeatureGet(internal.ISADMIN) {
			f = append(f, "admin")
		}
		if u.FeatureGet(internal.ISBOT) {
			f = append(f, "bot")
		}

		for i := uint8(6); i < 64; i++ {
			if u.FeatureGet(1 << i) {
				flair := fmt.Sprintf("flair%d", i-5)
				f = append(f, flair)
			}
		}

		usertools.Usertools.Features[u.Features] = f
	}

	u.Simplified = &types.SimplifiedUser{
		u.Nick,
		&f,
	}
}

func newFuncUserfromSession(iser_id uuid.UUID, useername string, list_feateres []string, chatID string) (u storage.ChatUser) {

	u = &chatUser{
		Id:              iser_id,
		Nick:            useername,
		Features:        0,
		Lastmessage:     nil,
		Lastmessagetime: time.Time{},
		Delayscale:      1,
		Simplified:      nil,
		Connections:     0,
		RWMutex:         sync.RWMutex{},
	}

	u.SetFeatures(list_feateres)

	forceupdate := false
	if cu := namecache.Namescaches[chatID].Get(u.GetFieldId()); cu != nil && cu.GetFieldFeatures() == u.GetFieldFeatures() {
		forceupdate = true
	}

	u.AssembleSimplifiedUser()
	usertools.Usertools.AddUser(u, forceupdate)
	return
}

func GetUserFromWebRequest(r *http.Request, userID uuid.UUID, username string, chatID string) (user storage.ChatUser, banned bool, ip string) {
	// Получаем IP-адрес пользователя mapcache map[string]storage.NamesStorage
	ip = r.Header.Get("X-Real-Ip")
	if ip == "" {
		ip, _, _ = net.SplitHostPort(r.RemoteAddr)
	}
	ip = connection.GetMaskedIP(ip)

	// Check streamOwner
	streamOwner, exists := storage.StreamOwnerToChat[chatID]
	if !exists {
		log.Info().Msgf("[getUserFromWebRequest] ChatID '%s' does not exist", chatID)
	}

	// logic get bans to chat
	bans := connection.ChatBansMap.GetBans(streamOwner)

	// Проверяем, забанен ли IP
	banned = bans.IsIPBanned(ip)
	if banned {
		return
	}

	// create, update name
	database.DB.CreateUpdateNameChatUser(userID, username, streamOwner)

	// get user features
	list_feateres, _ := database.DB.GetFeaturesByChatUserAndChatID(userID, streamOwner)

	// Измененная клон функция, которая работает только при коннекте, игнарируя работу с bytes
	user = newFuncUserfromSession(userID, username, list_feateres, chatID)
	if user == nil {
		return
	}

	// Check if user is banned
	banned = bans.IsUseridBanned(user.GetFieldId())
	if banned {
		return
	}

	cache.CacheIPForUser(user.GetFieldId(), ip)

	// there is only ever one single "user" struct, the namescache makes sure of that
	user = namecache.Namescaches[chatID].Add(user, streamOwner)
	return
}
