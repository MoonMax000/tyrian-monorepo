package dto

import (
	"encoding/json"
)

type TimestampMessage struct {
	// uuid in string representation
	UserId string `json:"user_id"`
	// milliseconds since zero unix time (1970-01-01)
	LastTimestamp string `json:"last_timestamp"`
}

func (timestampMessage TimestampMessage) MarshalBinary() ([]byte, error) {
	return json.Marshal(timestampMessage)
}
