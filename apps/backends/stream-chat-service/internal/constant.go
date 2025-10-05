package internal

import "time"

// time
const (
	WRITETIMEOUT         = 10 * time.Second
	READTIMEOUT          = time.Minute
	PINGINTERVAL         = 10 * time.Second
	PINGTIMEOUT          = 30 * time.Second
	MAXMESSAGESIZE       = 6144 // 512 max chars in a message, 8bytes per chars possible, plus factor in some protocol overhead
	SENDCHANNELSIZE      = 16
	BROADCASTCHANNELSIZE = 256
	DEFAULTBANDURATION   = time.Hour
	DEFAULTMUTEDURATION  = 10 * time.Minute
)

var (
	debuggingenabled = true
	DELAY            = 300 * time.Millisecond
	MAXTHROTTLETIME  = 5 * time.Minute
)

// role
const (
	ISADMIN      = 1 << iota
	ISMODERATOR  = 1 << iota
	ISVIP        = 1 << iota
	ISPROTECTED  = 1 << iota
	ISSUBSCRIBER = 1 << iota
	ISBOT        = 1 << iota
)

// status chat
const (
	STATUSSTART = "StartStream"
	STATUSSTOP  = "StopStream"
)
