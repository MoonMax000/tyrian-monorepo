package notifylib

import (
	"encoding/json"
	"log"
	"time"

	"github.com/Capstane/stream-notify-service/notifylib/config"
	amqp "github.com/rabbitmq/amqp091-go"
)

type NotifyMessage struct {
	// push, internal, system
	Type string `json:"type"`
	// uuid in string representation
	UserId string `json:"user_id"`
	// milliseconds since zero unix time (1970-01-01)
	NotifyTimestamp int64 `json:"notify_timestamp"`
	// message payload
	MessageParams interface{} `json:"params"`
	// uuid in string representation
	TargetUserId string `json:"target_user_id"`
}

func (notifyMessage NotifyMessage) MarshalBinary() ([]byte, error) {
	return json.Marshal(notifyMessage)
}

func PushMessage(typeNotify string, userId string, message interface{}, targetUserId string) error {
	cfg := config.LoadConfig()

	body, err := json.Marshal(NotifyMessage{
		Type:            typeNotify,
		UserId:          userId,
		NotifyTimestamp: time.Now().UnixNano() / 1e6,
		MessageParams:   message,
		TargetUserId:    targetUserId,
	})
	if err != nil {
		return err
	}

	conn, err := amqp.Dial(cfg.RMQConnUrl)
	if err != nil {
		return err
	}
	defer conn.Close()

	ch, err := getChannel(conn, cfg)
	if err != nil {
		return err
	}
	defer ch.Close()

	err = ch.Publish(
		cfg.RMQNotifyExchange,   // exchange
		cfg.RMQNotifyRoutingKey, // routing key
		false,                   // mandatory
		false,                   // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        body,
			Timestamp:   time.Now(),
		})
	if err != nil {
		return err
	}
	log.Printf("Message output to: %s", cfg.RMQNotifyExchange)

	return nil
}

func getChannel(conn *amqp.Connection, cfg config.Config) (*amqp.Channel, error) {
	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	err = ch.ExchangeDeclarePassive(
		cfg.RMQNotifyExchange, // name
		"fanout",              // type
		true,                  // durable
		false,                 // auto-deleted
		false,                 // internal
		false,                 // no-wait
		nil,                   // arguments
	)
	if err != nil {
		log.Printf("Exchange %q doesn't exist, autocreate enabled, so attempting to create exchange", cfg.RMQNotifyExchange)
		autocreateExchange(conn, cfg.RMQNotifyExchange)

		ch, err = conn.Channel()
		if err != nil {
			return nil, err
		}
	}

	return ch, nil
}

func autocreateExchange(conn *amqp.Connection, exchangeName string) error {
	ch, err := conn.Channel()
	if err != nil {
		return err
	}
	// Always close channel after queue redeclare (otherwise first call delivery/consume fail)
	defer ch.Close()

	err = ch.ExchangeDeclare(
		exchangeName, // name
		"fanout",     // type
		true,         // durable
		false,        // auto-deleted
		false,        // internal
		false,        // no-wait
		nil,          // arguments
	)
	return err
}
