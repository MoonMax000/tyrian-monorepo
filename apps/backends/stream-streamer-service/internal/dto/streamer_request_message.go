package dto

import "encoding/json"

type StreamRequestMessage struct {
	Type string `json:"type"`
	Data UserData
}

type UserData struct {
	UserID         string `json:"user_id"`
	Email          string `json:"email"`
	Role           string `json:"role"`
	AdditionalText string `json:"additional_text"`
}

func (streamRequestMessage StreamRequestMessage) MarshalBinary() ([]byte, error) {
	return json.Marshal(streamRequestMessage)
}
