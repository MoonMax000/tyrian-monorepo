package connection

import (
	"bytes"
	"crypto/md5"
	"database/sql"
	"encoding/json"
	"fmt"
	"net"
	"regexp"
	"strings"
	"sync"
	"sync/atomic"
	"time"
	"unicode/utf8"

	"github.com/Capstane/go-notifylib"
	"github.com/Capstane/stream-chat-service/internal"
	"github.com/Capstane/stream-chat-service/internal/cache"
	"github.com/Capstane/stream-chat-service/internal/database"
	custom_errors "github.com/Capstane/stream-chat-service/internal/errors"
	"github.com/Capstane/stream-chat-service/internal/namecache"
	"github.com/Capstane/stream-chat-service/internal/role"
	"github.com/Capstane/stream-chat-service/internal/storage"
	"github.com/Capstane/stream-chat-service/internal/types"
	usertools "github.com/Capstane/stream-chat-service/internal/usertools"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/rs/zerolog/log"
	"github.com/tideland/golib/redis"
)

// regexp to detect three or more consecutive characters intended to be combined
// with another char (like accents, diacritics), if there are more than 5
// its most likely a zalgo pattern
// we also do not allow unicode non-breaking space/page/paragraph separators
// for an explanation on the unicode char classes used see:
// https://code.google.com/p/re2/wiki/Syntax
// cannot use the Z (separator) or Zs (space separator) because most of those
// are legitimate, we do not want non-breaking space characters tho
// http://www.fileformat.info/info/unicode/char/202f/index.htm
// http://www.fileformat.info/info/unicode/char/00a0/index.htm
var invalidmessage = regexp.MustCompile(`\p{M}{5,}|[\p{Zl}\p{Zp}\x{202f}\x{00a0}]`)

type Connection struct {
	ChatID         string
	Socket         *websocket.Conn
	Ip             string
	Send           chan *types.Message
	Sendmarshalled chan *types.Message
	Blocksend      chan *types.Message
	BannedChan     chan bool
	stop           chan bool
	User           storage.ChatUser
	PingChan       chan time.Time
	sync.RWMutex
}

// Create a new connection using the specified socket and router.
func NewConnection(s *websocket.Conn, user storage.ChatUser, ip string, chatID string) {
	c := &Connection{
		ChatID:         chatID,
		Socket:         s,
		Ip:             ip,
		Send:           make(chan *types.Message, internal.SENDCHANNELSIZE),
		Sendmarshalled: make(chan *types.Message, internal.SENDCHANNELSIZE),
		Blocksend:      make(chan *types.Message),
		BannedChan:     make(chan bool, 8),
		stop:           make(chan bool),
		User:           user,
		PingChan:       make(chan time.Time, 2),
		RWMutex:        sync.RWMutex{},
	}

	go c.writePumpText()
	c.readPumpText()
}

func (c *Connection) readPumpText() {
	defer func() {
		streamOwner := storage.StreamOwnerToChat[c.ChatID]
		namecache.Namescaches[c.ChatID].Disconnect(c.User, streamOwner)
		c.Quit()
		c.Socket.Close()
	}()

	c.Socket.SetReadLimit(internal.MAXMESSAGESIZE)
	c.Socket.SetReadDeadline(time.Now().Add(internal.READTIMEOUT))
	c.Socket.SetPongHandler(func(string) error {
		c.Socket.SetReadDeadline(time.Now().Add(internal.PINGTIMEOUT))
		return nil
	})
	c.Socket.SetPingHandler(func(string) error {
		c.Sendmarshalled <- &types.Message{
			Msgtyp: websocket.PongMessage,
			Event:  "PONG",
			Data:   []byte{},
		}
		return nil
	})

	if c.User != nil {
		c.rlockUserIfExists()
		cuserconn := c.User.GetFieldConnections()
		n := atomic.LoadInt32(&cuserconn)
		if n > 5 {
			c.runlockUserIfExists()
			c.SendError("toomanyconnections")
			c.stop <- true
			return
		}
		c.runlockUserIfExists()
	} else {
		streamOwner := storage.StreamOwnerToChat[c.ChatID]
		namecache.Namescaches[c.ChatID].AddConnection(streamOwner)
	}

	hub, exists := GetHubByID(c.ChatID)
	if !exists {
		log.Error().Msgf("[readPumpText] [hub] Hub with ID %v does not exist", c.ChatID)
		return
	}

	hub.Register <- c
	c.Names()
	c.Join() // broadcast to the chat that a user has connected

	// Check mute status.
	// muteTimeLeft := mutes.muteTimeLeft(c)
	// if muteTimeLeft > time.Duration(0) {
	// 	c.EmitBlock("ERR", NewMutedError(muteTimeLeft))
	// }

	for {
		msgtype, message, err := c.Socket.ReadMessage()
		if err != nil || msgtype == websocket.BinaryMessage {
			log.Error().Msgf("[readPumpText] [ReadMessage] error, %v", err)
			return
		}

		name, data, err := internal.Unpack(string(message))
		if err != nil {
			// invalid protocol message from the client, just ignore it,
			// disconnect the user
			log.Error().Msgf("[readPumpText] [Unpack] error, %v", err)
			return
		}

		// dispatch
		switch name {
		case "MSG":
			c.OnMsg(data)
		// case "MUTE":
		// 	c.OnMute(data)
		// case "UNMUTE":
		// 	c.OnUnmute(data)
		case "BAN":
			c.OnBan(data)
		case "UNBAN":
			c.OnUnban(data)
		case "SUBONLY":
			c.OnSubonly(data)
		case "PING":
			c.OnPing(data)
		case "PONG":
			c.OnPong(data)
		case "BROADCAST":
			c.OnBroadcast(data)
		// case "PRIVMSG":
		// 	c.OnPrivmsg(data)
		case "ROLE":
			c.OnRole(data)
		case "DELETEMSG":
			c.OnDeleteMsg(data)
		case "BANLIST":
			c.OnBanList(data)
		case "MODERATORLIST":
			c.OnModeratorList(data)
		case "UNROLE":
			c.OnUnRole(data)
		}
	}
}

func (c *Connection) write(mt int, payload []byte) error {
	c.Socket.SetWriteDeadline(time.Now().Add(internal.WRITETIMEOUT))
	return c.Socket.WriteMessage(mt, payload)
}

func (c *Connection) writePumpText() {
	hub, exists := GetHubByID(c.ChatID)
	if !exists {
		log.Error().Msgf("[writePumpText] [hub] Hub with ID %v does not exist", c.ChatID)
		return
	}

	defer func() {
		hub.Unregister <- c
		c.Socket.Close() // Necessary to force reading to stop, will start the cleanup
	}()

	for {
		select {
		case _, ok := <-c.PingChan:
			if !ok {
				return
			}
			m, _ := time.Now().MarshalBinary()
			if err := c.write(websocket.PingMessage, m); err != nil {
				return
			}
		case <-c.BannedChan:
			c.write(websocket.TextMessage, []byte(`ERR {"description":"banned"}`))
			c.write(websocket.CloseMessage, []byte{})
			return
		case <-c.stop:
			return
		case m := <-c.Blocksend:
			c.rlockUserIfExists()
			if data, err := internal.Marshal(m.Data); err == nil {
				c.runlockUserIfExists()
				if data, err := internal.Pack(m.Event, data); err == nil {
					if err := c.write(websocket.TextMessage, data); err != nil {
						return
					}
				}
			} else {
				c.runlockUserIfExists()
			}
		case m := <-c.Send:
			c.rlockUserIfExists()
			if data, err := internal.Marshal(m.Data); err == nil {
				c.runlockUserIfExists()
				if data, err := internal.Pack(m.Event, data); err == nil {
					typ := m.Msgtyp
					if typ == 0 {
						typ = websocket.TextMessage
					}
					if err := c.write(typ, data); err != nil {
						return
					}
				}
			} else {
				c.runlockUserIfExists()
			}
		case message := <-c.Sendmarshalled:
			data := message.Data.([]byte)
			if data, err := internal.Pack(message.Event, data); err == nil {
				typ := message.Msgtyp
				if typ == 0 {
					typ = websocket.TextMessage
				}
				if err := c.write(typ, data); err != nil {
					return
				}
			}
		}
	}
}

func (c *Connection) rlockUserIfExists() {
	if c.User == nil {
		return
	}

	// c.User.RLock()
}

func (c *Connection) runlockUserIfExists() {
	if c.User == nil {
		return
	}

	// c.User.RUnlock()
}

func (c *Connection) Emit(event string, data interface{}) {
	c.Send <- &types.Message{
		Event: event,
		Data:  data,
	}
}

func (c *Connection) EmitBlock(event string, data interface{}) {
	c.Blocksend <- &types.Message{
		Event: event,
		Data:  data,
	}
	return
}

func (c *Connection) Broadcast(event string, data *types.EventDataOut) {
	c.rlockUserIfExists()
	marshalled, _ := internal.Marshal(data)
	c.runlockUserIfExists()

	m := &types.Message{
		Event: event,
		Data:  marshalled,
	}

	hub, exists := GetHubByID(c.ChatID)
	if !exists {
		log.Error().Msgf("[Broadcast] [hub] Hub with ID %v does not exist", c.ChatID)
		return
	}

	hub.Broadcast <- m
}

func (c *Connection) canModerateUser(nick string) (bool, uuid.UUID) {
	if c.User == nil || utf8.RuneCountInString(nick) == 0 {
		return false, uuid.Nil
	}

	uid, protected := usertools.Usertools.GetUseridForNick(nick)
	if uid == uuid.Nil || c.User.GetFieldId() == uid || protected {
		return false, uid
	}
	return true, uid
}

func (c *Connection) getEventDataOut() *types.EventDataOut {
	out := &types.EventDataOut{
		Timestamp: internal.UnixMilliTime(),
	}
	if c.User != nil {
		out.SimplifiedUser = c.User.GetFieldSimplified()
	}
	return out
}

func (c *Connection) Join() {
	if c.User != nil {
		c.rlockUserIfExists()
		defer c.runlockUserIfExists()
		cuserconn := c.User.GetFieldConnections()
		n := atomic.LoadInt32(&cuserconn)
		if n == 1 {
			c.Broadcast("JOIN", c.getEventDataOut())
		}
	}
}

func (c *Connection) Quit() {
	if c.User != nil {
		c.rlockUserIfExists()
		defer c.runlockUserIfExists()
		cuserconn := c.User.GetFieldConnections()
		n := atomic.LoadInt32(&cuserconn)
		if n <= 0 {
			c.Broadcast("QUIT", c.getEventDataOut())
		}
	}
}

func (c *Connection) OnBroadcast(data []byte) {
	m := &types.EventDataIn{}
	if err := internal.Unmarshal(data, m); err != nil {
		c.SendError("protocolerror")
		return
	}

	if c.User == nil {
		c.SendError("needlogin")
		return
	}

	if !c.User.FeatureGet(internal.ISADMIN) {
		c.SendError("nopermission")
		return
	}

	msg := strings.TrimSpace(m.Data)
	msglen := utf8.RuneCountInString(msg)
	if !utf8.ValidString(msg) || msglen == 0 || msglen > 512 || invalidmessage.MatchString(msg) {
		c.SendError("invalidmsg")
		return
	}

	out := c.getEventDataOut()
	out.Data = msg
	c.Broadcast("BROADCAST", out)

}

func (c *Connection) canMsg(msg string, ignoresilence bool) bool {

	msglen := utf8.RuneCountInString(msg)
	if !utf8.ValidString(msg) || msglen == 0 || msglen > 512 || invalidmessage.MatchString(msg) {
		c.SendError("invalidmsg")
		return false
	}

	if !ignoresilence {
		// muteTimeLeft := mutes.muteTimeLeft(c)
		// if muteTimeLeft > time.Duration(0) {
		// 	c.EmitBlock("ERR", NewMutedError(muteTimeLeft))
		// 	return false
		// }

		hub, exists := GetHubByID(c.ChatID)
		if !exists {
			log.Info().Msgf("[canMsg] [hub] Hub with ID %s does not exist", c.ChatID)
		}

		if !hub.CanUserSpeak(c) {
			c.SendError("submode")
			return false
		}
	}

	if c.User != nil && !c.User.IsBot() {

		// very simple heuristics of "punishing" the flooding user
		// if the user keeps spamming, the delay between messages increases
		// this delay resets after a fixed amount of time
		now := time.Now()
		difference := now.Sub(c.User.GetFieldLastmessagetime())
		switch {
		case difference <= internal.DELAY:
			c.User.SetFieldDelayscale(c.User.GetFieldDelayscale() * 2)
		case difference > internal.MAXTHROTTLETIME:
			c.User.SetFieldDelayscale(1)
		}
		sendtime := c.User.GetFieldLastmessagetime().Add(time.Duration(c.User.GetFieldDelayscale()) * internal.DELAY)
		if sendtime.After(now) {
			c.SendError("throttled")
			return false
		}
		c.User.SetFieldLastmessagetime(now)

	}

	return true
}

func (c *Connection) OnMsg(data []byte) {
	m := &types.EventDataIn{}
	if err := internal.Unmarshal(data, m); err != nil {
		c.SendError("protocolerror")
		return
	}

	if c.User == nil {
		c.SendError("needlogin")
		return
	}

	msg := strings.TrimSpace(m.Data)
	if !c.canMsg(msg, false) {
		return
	}

	// strip off /me for anti-spam purposes
	var bmsg []byte
	if len(msg) > 4 && msg[:4] == "/me " {
		bmsg = []byte(strings.TrimSpace(msg[4:]))
	} else {
		bmsg = []byte(msg)
	}

	tsum := md5.Sum(bmsg)
	sum := tsum[:]
	if !c.User.IsBot() && bytes.Equal(sum, c.User.GetFieldLastmessage()) {
		c.User.SetFieldDelayscale(c.User.GetFieldDelayscale() + 1)
		c.SendError("duplicate")
		return
	}
	c.User.SetFieldLastmessage(sum)

	out := c.getEventDataOut()
	out.Id = uuid.New()
	out.Data = msg
	c.Broadcast("MSG", out)

	hub, exists := GetHubByID(c.ChatID)
	if !exists {
		c.SendError("protocolerror")
		return
	}

	// Формируем сообщение
	message := map[string]string{
		"type": "chat_message",
		"data": msg,
	}

	// Автор сообщения
	author := c.User.GetFieldId()

	// Админ стрима
	adminID := storage.StreamOwnerToChat[hub.HubID]

	// Уведомление только для админа стрима, только не свои
	if author != adminID {
		notifylib.PushMessage("system", adminID.String(), message, author.String())
	}

	database.DB.InsertMessage(out.Id, adminID, author, out.Nick, msg, out.Timestamp)
	// // Отправляем уведомления всем подключённым пользователям через notifylib
	// for conn := range hub.Connections {
	// 	if conn.User != nil {
	// 		userID := conn.User.GetFieldId()
	// 		notifylib.PushMessage("system", userID.String(), message, author.String())
	// 	}
	// }
}

func (c *Connection) Names() {
	c.Sendmarshalled <- &types.Message{
		Event: "NAMES",
		Data:  namecache.Namescaches[c.ChatID].GetNames(),
	}
}

func (c *Connection) OnBan(data []byte) {
	ban := &types.BanIn{}
	if err := internal.Unmarshal(data, ban); err != nil {
		c.SendError("protocolerror")
		return
	}

	if c.User == nil {
		c.SendError("nopermission")
		return
	}

	if !c.User.IsModerator() {
		c.SendError("nopermission")
		return
	}

	ok, uid := c.canModerateUser(ban.Nick)
	if uid == uuid.Nil {
		c.SendError("notfound")
		return
	} else if !ok {
		c.SendError("nopermission")
		return
	}

	reason := strings.TrimSpace(ban.Reason)
	if utf8.RuneCountInString(reason) == 0 || !utf8.ValidString(reason) {
		c.SendError("needbanreason")
		return
	}

	if ban.Duration == 0 {
		ban.Duration = int64(internal.DEFAULTBANDURATION)
	}

	streamOwner := storage.StreamOwnerToChat[c.ChatID]
	bans := ChatBansMap.GetBans(streamOwner)

	bans.BanUser(c.User.GetFieldId(), uid, ban, c.ChatID, streamOwner)

	out := c.getEventDataOut()
	out.Data = ban.Nick
	out.Targetuserid = uid
	c.Broadcast("BAN", out)
}

func (c *Connection) OnUnban(data []byte) {
	userED := &types.EventDataIn{}
	if err := internal.Unmarshal(data, userED); err != nil {
		c.SendError("protocolerror")
		return
	}

	if c.User == nil || !c.User.IsModerator() {
		c.SendError("nopermission")
		return
	}

	uid, _ := usertools.Usertools.GetUseridForNick(userED.Data)
	if uid == uuid.Nil {
		c.SendError("notfound")
		return
	}

	// logic get bans to chat
	streamOwner := storage.StreamOwnerToChat[c.ChatID]
	bans := ChatBansMap.GetBans(streamOwner)

	bans.UnbanUserid(uid)
	// mutes.unmuteUserid(uid)
	out := c.getEventDataOut()
	out.Data = userED.Data
	out.Targetuserid = uid
	c.Broadcast("UNBAN", out)
}

func (c *Connection) Banned() {
	c.BannedChan <- true
}

func (c *Connection) OnSubonly(data []byte) {
	m := &types.EventDataIn{} // Data is on/off
	if err := internal.Unmarshal(data, m); err != nil {
		c.SendError("protocolerror")
		return
	}

	if c.User == nil || !c.User.IsModerator() {
		c.SendError("nopermission")
		return
	}

	hub, exists := GetHubByID(c.ChatID)
	if !exists {
		log.Error().Msgf("[OnSubonly] [hub] Hub with ID %v does not exist", c.ChatID)
	}

	switch {
	case m.Data == "on":
		hub.ToggleSubmode(true)
	case m.Data == "off":
		hub.ToggleSubmode(false)
	default:
		c.SendError("protocolerror")
		return
	}

	out := c.getEventDataOut()
	out.Data = m.Data
	c.Broadcast("SUBONLY", out)
}

func (c *Connection) Ping() {
	d := &types.PingOut{
		time.Now().UnixNano(),
	}

	c.Emit("PING", d)
}

func (c *Connection) OnPing(data []byte) {
	c.Emit("PONG", data)
}

func (c *Connection) OnPong(data []byte) {
}

func (c *Connection) OnRole(data []byte) {
	roleuser := &role.Role{}

	if err := internal.Unmarshal(data, roleuser); err != nil {
		c.SendError("protocolerror")
		return
	}

	if !c.User.IsAdmin() {
		c.SendError("nopermission, not admin")
		return
	}

	uid, _ := usertools.Usertools.GetUseridForNick(roleuser.Nick)
	if uid == uuid.Nil {
		c.SendError("notfound")
		return
	}

	if c.User.GetFieldId() == uid {
		c.SendError("notfound")
		return
	}

	roleuser.SetRole(uid, c.User.GetFieldId(), roleuser.Role)

	// create user to refresh
	features := []string{roleuser.Role}

	simplified := types.SimplifiedUser{
		Nick:     roleuser.Nick,
		Features: &features,
	}
	featuint := role.GetRoleNum(features)

	namecache.Namescaches[c.ChatID].RefreshForConn(uid, roleuser.Nick, simplified, featuint, storage.StreamOwnerToChat[c.ChatID])

	out := c.getEventDataOut()
	out.Data = roleuser.Nick
	out.Extradata = roleuser.Role
	c.Broadcast("ROLE", out)
}

func (c *Connection) OnDeleteMsg(data []byte) {
	delete_msg := &types.DeleteMsg{}

	if err := internal.Unmarshal(data, delete_msg); err != nil {
		c.SendError("protocolerror")
		return
	}

	if c.User == nil {
		c.SendError("nopermission")
		return
	}

	if !c.User.IsModerator() {
		c.SendError("nopermission")
		return
	}

	streamOwner := storage.StreamOwnerToChat[c.ChatID]

	redisKey := "CHAT:chatlog:" + streamOwner.String()

	err := cache.RemoveElementFromList(redisKey, delete_msg.Msg)
	if err != nil {
		log.Error().Msgf("[deleteMsh] error delete msg from redis: '%s'", err)
	}

	// Админ стрима
	adminID := storage.StreamOwnerToChat[c.ChatID]
	// delete db
	database.DB.DeleteMessage(delete_msg.Id, fmt.Sprintf("%s_%s", "history", strings.ReplaceAll(adminID.String(), "-", "_")))

	// notify clients to ws
	NotifyClients(c.ChatID, delete_msg.Msg)

	out := c.getEventDataOut()
	out.Data = delete_msg.Msg
	c.Broadcast("DELETEMSG", out)
}

func (c *Connection) OnBanList(data []byte) {
	banlist := &BanList{}

	streamOwner := storage.StreamOwnerToChat[c.ChatID]

	out := c.getEventDataOut()
	out.BanList = banlist.GetBanList(streamOwner)
	c.Broadcast("BANLIST", out)
}

func (c *Connection) OnModeratorList(data []byte) {
	moderlist := &role.ModeratorList{}

	streamOwner := storage.StreamOwnerToChat[c.ChatID]

	out := c.getEventDataOut()
	out.ModeratorList = moderlist.GetModeratorList(streamOwner)
	c.Broadcast("MODERATORLIST", out)
}

func (c *Connection) OnUnRole(data []byte) {
	role := &role.Role{}

	if err := internal.Unmarshal(data, role); err != nil {
		c.SendError("protocolerror")
		return
	}

	if !c.User.IsAdmin() {
		c.SendError("nopermission, not admin")
		return
	}

	if role.Role == "admin" {
		c.SendError("The administrator role cannot be deleted.")
		return
	}

	uid, _ := usertools.Usertools.GetUseridForNick(role.Nick)
	if uid == uuid.Nil {
		c.SendError("notfound")
		return
	}

	role.DeleteRole(uid, c.User.GetFieldId(), role.Role)

	// create user to refresh
	features := []string{}

	simplified := types.SimplifiedUser{
		Nick:     role.Nick,
		Features: &features,
	}
	featuint := uint64(0)

	namecache.Namescaches[c.ChatID].RefreshForConn(uid, role.Nick, simplified, featuint, storage.StreamOwnerToChat[c.ChatID])

	out := c.getEventDataOut()
	out.Data = role.Nick
	out.Extradata = role.Role
	c.Broadcast("UNROLE", out)
}

func (c *Connection) SendError(identifier string) {
	c.EmitBlock("ERR", custom_errors.GenericError{identifier})
}

func (c *Connection) Refresh() {
	c.EmitBlock("REFRESH", c.getEventDataOut())
	c.stop <- true
}

func NotifyClients(chatID string, msg string) {
	// get hub
	hub, exists := GetHubByID(chatID)
	if !exists {
		log.Error().Msgf("[notifyClients] [delete_msg] Hub with ID %v does not exist", chatID)
		return
	}

	event := map[string]string{
		"type":      "delete",
		"chatID":    chatID,
		"messageID": msg,
	}

	payload, err := json.Marshal(event)
	if err != nil {
		log.Printf("Error marshaling delete event: %v", err)
		return
	}

	for conn := range hub.Connections {
		go func(c *Connection) {
			if err := c.Socket.WriteMessage(websocket.TextMessage, payload); err != nil {
				log.Printf("Error sending delete event to client: %v", err)

				hub.Unregister <- c
			}
		}(conn)
	}
	log.Info().Msgf("[notifyClients] run notifyClients")
}

// func (c *Connection) OnPrivmsg(data []byte) {
// 	p := &types.PrivmsgIn{}
// 	if err := internal.Unmarshal(data, p); err != nil {
// 		c.SendError("protocolerror")
// 		return
// 	}

// 	if c.User == nil {
// 		c.SendError("needlogin")
// 		return
// 	}

// 	msg := strings.TrimSpace(p.Data)
// 	if !c.canMsg(msg, true) {
// 		return
// 	}

// 	uid, _ := Usertools.GetUseridForNick(p.Nick)
// 	if uid == uuid.Nil || uid == c.User.GetFieldId() {
// 		c.SendError("notfound")
// 		return
// 	}

// 	if err := api.sendPrivmsg(c.User.id, uid, msg); err != nil {
// 		D("send error from", c.User.nick, err)
// 		c.SendError(err.Error())
// 	} else {
// 		c.EmitBlock("PRIVMSGSENT", "")
// 	}

// }

// func (c *Connection) OnMute(data []byte) {
// 	mute := &EventDataIn{} // Data is the nick
// 	if err := internal.Unmarshal(data, mute); err != nil {
// 		c.SendError("protocolerror")
// 		return
// 	}

// 	if c.User == nil || !c.User.isModerator() {
// 		c.SendError("nopermission")
// 		return
// 	}

// 	ok, uid := c.canModerateUser(mute.Data)
// 	if !ok || uid == uuid.Nil {
// 		c.SendError("nopermission")
// 		return
// 	}

// 	if mute.Duration == 0 {
// 		mute.Duration = int64(DEFAULTMUTEDURATION)
// 	}

// 	if time.Duration(mute.Duration) > 7*24*time.Hour {
// 		c.SendError("protocolerror") // too long mute
// 		return
// 	}

// 	mutes.muteUserid(uid, mute.Duration)
// 	out := c.getEventDataOut()
// 	out.Data = mute.Data
// 	out.Duration = mute.Duration / int64(time.Second)
// 	out.Targetuserid = uid
// 	c.Broadcast("MUTE", out)
// }

// func (c *Connection) OnUnmute(data []byte) {
// 	user := &EventDataIn{} // Data is the nick
// 	if err := internal.Unmarshal(data, user); err != nil || utf8.RuneCountInString(user.Data) == 0 {
// 		c.SendError("protocolerror")
// 		return
// 	}

// 	if c.User == nil || !c.User.isModerator() {
// 		c.SendError("nopermission")
// 		return
// 	}

// 	uid, _ := usertools.getUseridForNick(user.Data)
// 	if uid == uuid.Nil {
// 		c.SendError("notfound")
// 		return
// 	}

// 	mutes.unmuteUserid(uid)
// 	out := c.getEventDataOut()
// 	out.Data = user.Data
// 	out.Targetuserid = uid
// 	c.Broadcast("UNMUTE", out)
// }

// func (c *Connection) Muted() {
// }

// logic hub
type Hub struct {
	HubID       string // Уникальный идентификатор хаба
	Connections map[*Connection]bool
	Broadcast   chan *types.Message
	Privmsg     chan *types.PrivmsgOut
	Register    chan *Connection
	Unregister  chan *Connection
	Bans        chan uuid.UUID
	Ipbans      chan string
	Getips      chan useridips
	Users       map[uuid.UUID]*storage.ChatUser
	Refreshuser chan uuid.UUID
	Shutdown    chan bool
}

type useridips struct {
	userid uuid.UUID
	c      chan []string
}

// Мапа для хранения всех хабов по их ID
var hubs = make(map[string]*Hub)
var hubMutex sync.Mutex

func InitHub(chatID string) {
	hubMutex.Lock()
	defer hubMutex.Unlock()

	if _, exists := hubs[chatID]; exists {
		log.Fatal().Msgf("[initHub] [hub] Hub with ID %v, chatID, already exists", chatID)
		return
	}

	newHub := &Hub{
		HubID:       chatID,
		Connections: make(map[*Connection]bool),
		Broadcast:   make(chan *types.Message, internal.BROADCASTCHANNELSIZE),
		Privmsg:     make(chan *types.PrivmsgOut, internal.BROADCASTCHANNELSIZE),
		Register:    make(chan *Connection, 256),
		Unregister:  make(chan *Connection),
		Bans:        make(chan uuid.UUID, 4),
		Ipbans:      make(chan string, 4),
		Getips:      make(chan useridips),
		Users:       make(map[uuid.UUID]*storage.ChatUser),
		Refreshuser: make(chan uuid.UUID, 4),
		Shutdown:    make(chan bool),
	}

	hubs[chatID] = newHub
	go newHub.run()
}

func (hub *Hub) run() {
	pinger := time.NewTicker(internal.PINGINTERVAL)
	for {
		select {
		case c := <-hub.Register:
			hub.Connections[c] = true
		case c := <-hub.Unregister:
			delete(hub.Connections, c)
		case userid := <-hub.Refreshuser:
			for c, _ := range hub.Connections {
				if c.User != nil && c.User.GetFieldId() == userid {
					go c.Refresh()
				}
			}
		case userid := <-hub.Bans:
			for c, _ := range hub.Connections {
				if c.User != nil && c.User.GetFieldId() == userid {
					go c.Banned()
				}
			}
		case stringip := <-hub.Ipbans:
			for c := range hub.Connections {
				if c.Ip == stringip {
					log.Info().Msgf("[run] [connection] Found connection to ban with ip %s user %v", stringip, c.User)
					go c.Banned()
				}
			}
		case d := <-hub.Getips:
			ips := make([]string, 0, 3)
			for c, _ := range hub.Connections {
				if c.User != nil && c.User.GetFieldId() == d.userid {
					ips = append(ips, c.Ip)
				}
			}
			d.c <- ips
		case message := <-hub.Broadcast:
			if message.Event != "JOIN" && message.Event != "QUIT" {
				streamOwner := storage.StreamOwnerToChat[hub.HubID]
				cache.CacheChatEvent(message, streamOwner)
			}
			for c := range hub.Connections {
				if len(c.Sendmarshalled) < internal.SENDCHANNELSIZE {
					c.Sendmarshalled <- message
				}
			}
		case p := <-hub.Privmsg:
			for c, _ := range hub.Connections {
				if c.User != nil && c.User.GetFieldId() == p.Targetuid {
					if len(c.Sendmarshalled) < internal.SENDCHANNELSIZE {
						c.Sendmarshalled <- &p.Message
					}
				}
			}
		case t := <-pinger.C:
			for c := range hub.Connections {
				if c.PingChan != nil && len(c.PingChan) < 2 {
					c.PingChan <- t
				} else if c.PingChan != nil {
					close(c.PingChan)
					c.PingChan = nil
				}
			}
		case shutdownSignal := <-hub.Shutdown:
			if shutdownSignal {
				log.Info().Msgf("[run] [delete hub] Shutdown signal received for hub %v", hub.HubID)
				delete(hubs, hub.HubID)
				return
			}
		}
	}
}

// logic close chat
func RemoveHub(chatID string) {
	hub, _ := GetHubByID(chatID)
	hub.Shutdown <- true
}

func GetHubByID(chatID string) (*Hub, bool) {
	hubMutex.Lock()
	defer hubMutex.Unlock()

	hub, exists := hubs[chatID]
	return hub, exists
}

func (hub *Hub) GetIPsForUserid(userid uuid.UUID) []string {
	c := make(chan []string, 1)
	hub.Getips <- useridips{userid, c}
	return <-c
}

func (hub *Hub) CanUserSpeak(c *Connection) bool {
	internal.StateMut.RLock()
	defer internal.StateMut.RUnlock()
	if !internal.StateMut.Submode || c.User.IsSubscriber() {
		return true
	}
	return false
}

func (hub *Hub) ToggleSubmode(enabled bool) {
	internal.StateMut.Lock()
	defer internal.StateMut.Unlock()
	internal.StateMut.Submode = enabled
	internal.StateMut.Save()
}

func InitBroadcast(redisdb int64, chatID string) {
	go setupBroadcast(redisdb, chatID)
	// go setupPrivmsg(redisdb, chatID)
}

func setupBroadcast(redisdb int64, chatID string) {
	cache.SetupRedisSubscription("broadcast:"+chatID, redisdb, func(result *redis.PublishedValue) {
		var bc types.EventDataIn
		err := json.Unmarshal(result.Value.Bytes(), &bc)
		if err != nil {
			log.Error().Msgf("[canMsg] [hub] unable to unmarshal broadcast message %s", result.Value.String())
			return
		}
		data := &types.EventDataOut{}
		data.Timestamp = internal.UnixMilliTime()
		data.Data = bc.Data
		m, _ := internal.Marshal(data)

		hub, exists := GetHubByID(chatID)
		if !exists {
			log.Error().Msgf("[setupBroadcast] [hub] Hub with ID %v does not exist", chatID)
			return
		}

		hub.Broadcast <- &types.Message{
			Event: "BROADCAST",
			Data:  m,
		}
	})
}

// bans
type Bans struct {
	users    map[uuid.UUID]time.Time
	userlock sync.RWMutex
	ips      map[string]time.Time
	userips  map[uuid.UUID][]string
	iplock   sync.RWMutex // protects both ips/userips
}

type BanList struct {
	banlist []string
}

var (
	ipv6mask = net.CIDRMask(64, 128)
)

type ChatBans struct {
	sync.RWMutex
	bans map[uuid.UUID]*Bans // Ключ: ID owner чата, Значение: Bans для этого чата
}

var ChatBansMap = &ChatBans{
	bans: make(map[uuid.UUID]*Bans),
}

func (cb *ChatBans) GetBans(chatID uuid.UUID) *Bans {
	cb.Lock()
	defer cb.Unlock()

	if bans, exists := cb.bans[chatID]; exists {
		return bans
	}

	// Если список банов для чата еще не создан, создаем новый
	newBans := &Bans{
		users:   make(map[uuid.UUID]time.Time),
		ips:     make(map[string]time.Time),
		userips: make(map[uuid.UUID][]string),
	}
	cb.bans[chatID] = newBans
	return newBans
}

func GetMaskedIP(s string) string {
	ip := net.ParseIP(s)
	if ip.To4() == nil {
		return ip.Mask(ipv6mask).String()
	} else {
		return s
	}
}

func InitBans(redisdb int64, chatID string, adminid uuid.UUID) {
	bans := ChatBansMap.GetBans(adminid)
	go bans.run(redisdb, chatID)
}

func (b *Bans) run(redisdb int64, chatID string) {
	b.loadActive(chatID)

	go b.runRefresh(redisdb, chatID)
	go b.runUnban(redisdb)

	t := time.NewTicker(time.Minute)

	for {
		select {
		case <-t.C:
			b.clean()
		}
	}
}

func (b *Bans) runRefresh(redisdb int64, chatID string) {
	cache.SetupRedisSubscription("refreshbans", redisdb, func(result *redis.PublishedValue) {
		log.Info().Msg("[runRefresh] [bans.go] Refreshing bans")
		b.loadActive(chatID)
	})
}

func (b *Bans) runUnban(redisdb int64) {
	cache.SetupRedisSubscription("unbanuserid", redisdb, func(result *redis.PublishedValue) {
		useridStr := result.Value.String()
		userid, err := uuid.Parse(useridStr)
		if err != nil {
			log.Error().Msg("[runUnban] [bans.go] Invalid parsedUUID: " + err.Error())
		}

		b.UnbanUserid(userid)
	})
}

func (b *Bans) clean() {
	b.userlock.Lock()
	defer b.userlock.Unlock()
	b.iplock.Lock()
	defer b.iplock.Unlock()

	for uid, unbantime := range b.users {
		if internal.IsExpiredUTC(unbantime) {
			delete(b.users, uid)
			b.userips[uid] = nil
		}
	}

	for ip, unbantime := range b.ips {
		if internal.IsExpiredUTC(unbantime) {
			delete(b.ips, ip)
		}
	}
}

func (b *Bans) BanUser(uid uuid.UUID, targetuid uuid.UUID, ban *types.BanIn, chatID string, streamOwner uuid.UUID) {
	var expiretime time.Time

	if ban.Ispermanent {
		expiretime = internal.GetFuturetimeUTC()
	} else {
		expiretime = internal.AddDurationUTC(time.Duration(ban.Duration))
	}

	b.userlock.Lock()
	b.users[targetuid] = expiretime
	b.userlock.Unlock()
	b.log(uid, targetuid, ban, "", streamOwner)

	hub, exists := GetHubByID(chatID)
	if !exists {
		log.Error().Msgf("[banUser] [hub] Hub with ID %v does not exist", chatID)
		return
	}

	if ban.BanIP {
		ips := cache.GetIPCacheForUser(targetuid)
		if len(ips) == 0 {
			log.Info().Str("user_id", targetuid.String()).Msg("[banUser] [bans.go] No ips found in cache for user")
			ips = hub.GetIPsForUserid(targetuid)
			if len(ips) == 0 {
				log.Info().Str("user_id", targetuid.String()).Msg("[banUser] [bans.go] No ips found for user (offline)")
			}
		}

		b.iplock.Lock()
		defer b.iplock.Unlock()
		for _, ip := range ips {
			b.banIP(targetuid, ip, expiretime, true)
			hub.Ipbans <- ip
			b.log(uid, targetuid, ban, ip, streamOwner)
			log.Info().Msgf("[banUser] [hub] IPBanned user %s", ban.Nick)
		}

	}

	hub.Bans <- targetuid
	log.Info().Msgf("[banUser] [hub] IPBanned user %s", ban.Nick)
}

func (b *Bans) banIP(uid uuid.UUID, ip string, t time.Time, skiplock bool) {
	if !skiplock { // because the caller holds the locks
		b.iplock.Lock()
		defer b.iplock.Unlock()
	}

	b.ips[ip] = t
	if _, ok := b.userips[uid]; !ok {
		b.userips[uid] = make([]string, 0, 1)
	}
	b.userips[uid] = append(b.userips[uid], ip)
}

func (b *Bans) UnbanUserid(uid uuid.UUID) {
	b.logUnban(uid)
	b.userlock.Lock()
	defer b.userlock.Unlock()
	b.iplock.Lock()
	defer b.iplock.Unlock()

	delete(b.users, uid)
	for _, ip := range b.userips[uid] {
		delete(b.ips, ip)
		log.Info().Msgf("[banUser] [hub] Unbanned IP %s", ip)
	}
	b.userips[uid] = nil
	log.Info().Msgf("[banUser] [hub] Unbanned uid %s", uid)
}

func isStillBanned(t time.Time, ok bool) bool {
	if !ok {
		return false
	}
	return !internal.IsExpiredUTC(t)
}

func (b *Bans) IsUseridBanned(uid uuid.UUID) bool {
	if uid == uuid.Nil {
		return false
	}
	b.userlock.RLock()
	defer b.userlock.RUnlock()
	t, ok := b.users[uid]
	return isStillBanned(t, ok)
}

func (b *Bans) IsIPBanned(ip string) bool {
	b.iplock.RLock()
	defer b.iplock.RUnlock()
	t, ok := b.ips[ip]
	return isStillBanned(t, ok)
}

func (b *Bans) loadActive(chatID string) {
	b.userlock.Lock()
	defer b.userlock.Unlock()
	b.iplock.Lock()
	defer b.iplock.Unlock()

	// purge all the bans
	b.users = make(map[uuid.UUID]time.Time)
	b.ips = make(map[string]time.Time)
	b.userips = make(map[uuid.UUID][]string)

	database.DB.GetBans(func(uid uuid.UUID, ipaddress sql.NullString, endtimestamp sql.NullTime) {
		if !endtimestamp.Valid {
			endtimestamp.Time = internal.GetFuturetimeUTC()
		}

		if ipaddress.Valid {
			b.ips[ipaddress.String] = endtimestamp.Time
			if _, ok := b.userips[uid]; !ok {
				b.userips[uid] = make([]string, 0, 1)
			}

			hub, exists := GetHubByID(chatID)
			if !exists {
				log.Error().Msgf("[loadActive] [hub] Hub with ID %v does not exist", chatID)
				return
			}

			b.userips[uid] = append(b.userips[uid], ipaddress.String)
			hub.Ipbans <- ipaddress.String
		} else {
			b.users[uid] = endtimestamp.Time
		}
	})
}

func (b *BanList) GetBanList(streamOwner uuid.UUID) []string {
	listUUID := database.DB.RequestBans(streamOwner)

	for _, uid := range listUUID {
		b.banlist = append(b.banlist, database.DB.GetChatUserById(uid))
	}

	return b.banlist
}

func (b *Bans) log(uid uuid.UUID, targetuid uuid.UUID, ban *types.BanIn, ip string, streamOwner uuid.UUID) {
	database.DB.InsertBan(uid, targetuid, ban, ip, streamOwner)
}

func (b *Bans) logUnban(targetuid uuid.UUID) {
	database.DB.DeleteBan(targetuid)
}
