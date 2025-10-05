package queue

import (
	"encoding/json"
	"strconv"
	"strings"

	"github.com/Capstane/stream-notify-service/internal/dto"
	amqp "github.com/rabbitmq/amqp091-go"
)

const MAX_MESSAGE_ID_LENGTH = 100

func GetMessageId(message *amqp.Delivery) string {
	var notifyMessage dto.NotifyMessage
	err := json.Unmarshal(message.Body, &notifyMessage)
	prefix := strconv.FormatInt(message.Timestamp.Unix(), 16)
	if err != nil {
		body := string(cutBytes(message.Body, MAX_MESSAGE_ID_LENGTH))
		return composeId(MAX_MESSAGE_ID_LENGTH, &prefix, &body)
	}
	uuid := notifyMessage.UserId
	return composeId(MAX_MESSAGE_ID_LENGTH, &prefix, &uuid)
}

func composeId(maxLength int, vals ...*string) string {
	limit := maxLength
	result := strings.Builder{}
	for _, val := range vals {
		component := cutString(*val, limit)
		result.WriteString(component)
		limit -= len(component)
		if limit <= 0 {
			break
		}
	}
	return result.String()
}

func cutString(text string, limit int) string {
	if len(text) < limit {
		return text
	}
	return text[:limit]
}

func cutBytes(bytes []byte, limit int) []byte {
	if len(bytes) < limit {
		return bytes
	}
	return bytes[:limit]
}
