package types

import "github.com/google/uuid"

type SimplifiedUser struct {
	Nick     string    `json:"nick,omitempty"`
	Features *[]string `json:"features,omitempty"`
}

type BanIn struct {
	Nick        string `json:"nick"`
	BanIP       bool   `json:"banip"`
	Duration    int64  `json:"duration"`
	Ispermanent bool   `json:"ispermanent"`
	Reason      string `json:"reason"`
}

type Message struct {
	Msgtyp int
	Event  string
	Data   interface{}
}

type PrivmsgIn struct {
	Nick string `json:"nick"`
	Data string `json:"data"`
}

type EventDataIn struct {
	Data      string `json:"data"`
	Extradata string `json:"extradata"`
	Duration  int64  `json:"duration"`
}

type EventDataOut struct {
	*SimplifiedUser
	Id            uuid.UUID `json:"id"`
	Targetuserid  uuid.UUID `json:"-"`
	Timestamp     int64     `json:"timestamp"`
	Data          string    `json:"data,omitempty"`
	Extradata     string    `json:"extradata,omitempty"`
	Duration      int64     `json:"duration,omitempty"`
	BanList       []string  `json:"banlist,omitempty"`
	ModeratorList []string  `json:"moderatorlist,omitempty"`
}

type PingOut struct {
	Timestamp int64 `json:"data"`
}

type PrivmsgOut struct {
	Message
	Targetuid uuid.UUID
	Messageid int64  `json:"messageid"`
	Timestamp int64  `json:"timestamp"`
	Nick      string `json:"nick,omitempty"`
	Data      string `json:"data,omitempty"`
}

type DeleteMsg struct {
	Id  string `json:"id_mgs"`
	Msg string `json:"delete_mgs"`
}
