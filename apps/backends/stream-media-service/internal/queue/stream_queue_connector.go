package queue

import (
	"encoding/json"
	"time"

	"github.com/Capstane/stream-media-service/internal/config"
	"github.com/rs/zerolog/log"

	amqp "github.com/rabbitmq/amqp091-go"
)

type StreamQueueConnector struct {
	cfg *config.Config
}

func (qConn *StreamQueueConnector) getChannel(conn *amqp.Connection) (*amqp.Channel, error) {
	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}
	// No defer, channel will automatically closed on error

	err = ch.ExchangeDeclarePassive(
		qConn.cfg.RMQStreamExchange, // name
		"fanout",                    // type
		true,                        // durable
		false,                       // auto-deleted
		false,                       // internal
		false,                       // no-wait
		nil,                         // arguments
	)
	if err != nil && qConn.cfg.RMQStreamExchangeAutocreate {
		log.Warn().Msgf(
			"Exchange %q doesn't exist, autocreate enabled, so attempting to create exchange",
			qConn.cfg.RMQStreamExchange,
		)

		autocreateExchange(conn, qConn.cfg.RMQStreamExchange)

		ch, err = conn.Channel()
		if err != nil {
			return nil, err
		}
	}

	return ch, nil
}

func (qConn *StreamQueueConnector) Push(stat interface{}, routingKey string) error {

	body, err := json.Marshal(stat)
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
		qConn.cfg.RMQStreamExchange, // exchange
		routingKey,                  // routing key
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

func NewStreamQueueConnector(cfg *config.Config) *StreamQueueConnector {
	return &StreamQueueConnector{
		cfg: cfg,
	}
}
