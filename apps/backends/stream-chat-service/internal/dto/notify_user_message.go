package dto

import (
	"encoding/json"
)

type StreamStatusMessage struct {
	StreamOwner   string `json:"stream_owner"`
	StreamUrl     string `json:"stream_url"`
	MessageParams string `json:"params"`
}

func (notifyMessage StreamStatusMessage) MarshalBinary() ([]byte, error) {
	return json.Marshal(notifyMessage)
}
