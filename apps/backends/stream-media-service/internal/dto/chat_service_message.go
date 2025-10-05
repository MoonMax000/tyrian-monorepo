package dto

import (
	"encoding/json"
)

const (
	STATUSSTART = "StartStream"
	STATUSSTOP  = "StopStream"
)

type ChatServiceMessage struct {
	StreamOwner   string `json:"stream_owner"`
	StreamUrl     string `json:"stream_url"`
	MessageParams string `json:"params"`
}

func (chatServiceMessage ChatServiceMessage) MarshalBinary() ([]byte, error) {
	return json.Marshal(chatServiceMessage)
}
