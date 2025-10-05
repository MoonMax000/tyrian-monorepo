package queue

import (
	"encoding/json"
	"time"

	"github.com/Capstane/stream-streamer-service/internal/config"
	"github.com/Capstane/stream-streamer-service/internal/dto"
	"github.com/rs/zerolog/log"

	amqp "github.com/rabbitmq/amqp091-go"
)

type LiveStreamQueueConnector struct {
	cfg *config.Config
}

func (qConn *LiveStreamQueueConnector) getChannel(conn *amqp.Connection) (*amqp.Channel, error) {
	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}
	// No defer, channel will automatically closed on error

	err = ch.ExchangeDeclarePassive(
		qConn.cfg.RMQLiveStreamExchange, // name
		"fanout",                        // type
		true,                            // durable
		false,                           // auto-deleted
		false,                           // internal
		false,                           // no-wait
		nil,                             // arguments
	)
	if err != nil && qConn.cfg.RMQLiveStreamExchangeAutocreate {
		log.Warn().Msgf(
			"Exchange %q doesn't exist, autocreate enabled, so attempting to create exchange",
			qConn.cfg.RMQLiveStreamExchange,
		)

		autocreateExchange(conn, qConn.cfg.RMQLiveStreamExchange)

		ch, err = conn.Channel()
		if err != nil {
			return nil, err
		}
	}

	return ch, nil
}

func (qConn *LiveStreamQueueConnector) PushLiveStream(command dto.LiveStreamCommand, streamName string, streamCategory string, streamTags *[]string, userInfo *dto.NotifyUserInfo, params *dto.LiveStreamParams) error {

	body, err := json.Marshal(dto.LiveStreamMessage{
		Command:        command,
		UserInfo:       userInfo,
		StreamName:     &streamName,
		StreamCategory: &streamCategory,
		StreamTags:     streamTags,
		Params:         params,
	})
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
		qConn.cfg.RMQLiveStreamExchange,   // exchange
		qConn.cfg.RMQLiveStreamRoutingKey, // routing key
		false,                             // mandatory
		false,                             // immediate
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

func NewLiveStreamQueueConnector(cfg *config.Config) *LiveStreamQueueConnector {
	return &LiveStreamQueueConnector{
		cfg: cfg,
	}
}
