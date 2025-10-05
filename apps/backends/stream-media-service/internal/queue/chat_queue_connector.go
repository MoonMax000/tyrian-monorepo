package queue

import (
	"encoding/json"
	"time"

	"github.com/Capstane/stream-media-service/internal/config"
	"github.com/Capstane/stream-media-service/internal/dto"
	"github.com/rs/zerolog/log"

	amqp "github.com/rabbitmq/amqp091-go"
)

type ChatQueueConnector struct {
	cfg *config.Config
}

func (qConn *ChatQueueConnector) getChannel(conn *amqp.Connection) (*amqp.Channel, error) {
	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}
	// No defer, channel will automatically closed on error

	err = ch.ExchangeDeclarePassive(
		qConn.cfg.RMQChatExchange, // name
		"fanout",                  // type
		true,                      // durable
		false,                     // auto-deleted
		false,                     // internal
		false,                     // no-wait
		nil,                       // arguments
	)
	if err != nil && qConn.cfg.RMQChatExchangeAutocreate {
		log.Warn().Msgf(
			"Exchange %q doesn't exist, autocreate enabled, so attempting to create exchange",
			qConn.cfg.RMQChatExchange,
		)

		autocreateExchange(conn, qConn.cfg.RMQChatExchange)

		ch, err = conn.Channel()
		if err != nil {
			return nil, err
		}
	}

	return ch, nil
}

func (qConn *ChatQueueConnector) PushChat(chatMessage *dto.ChatServiceMessage) error {

	body, err := json.Marshal(chatMessage)
	if err != nil {
		return err
	}

	conn, err := amqp.Dial(qConn.cfg.RMQConnUrl)
	if err != nil {
		return err
	}
	defer conn.Close()

	ch, err := qConn.getChannel(conn)
	if err != nil {
		return err
	}
	defer ch.Close()

	err = ch.Publish(
		qConn.cfg.RMQChatExchange,   // exchange
		qConn.cfg.RMQChatRoutingKey, // routing key
		false,                       // mandatory
		false,                       // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        body,
			Timestamp:   time.Now(),
		})
	if err != nil {
		return err
	}

	return nil
}

func NewChatQueueConnector(cfg *config.Config) *ChatQueueConnector {
	return &ChatQueueConnector{
		cfg: cfg,
	}
}
