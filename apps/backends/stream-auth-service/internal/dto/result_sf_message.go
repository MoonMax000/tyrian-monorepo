package dto

import (
	"encoding/json"
)

type ResultSFMessage struct {
	UserId string `json:"user_id"`
	Email  string `json:"email"`
	Status string `json:"status"`
}

func (resultSFMessage ResultSFMessage) MarshalBinary() ([]byte, error) {
	return json.Marshal(resultSFMessage)
}
