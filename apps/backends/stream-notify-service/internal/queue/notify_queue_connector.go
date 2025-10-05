package queue

import (
	"encoding/json"
	"time"

	"github.com/Capstane/stream-notify-service/internal/config"
	"github.com/Capstane/stream-notify-service/internal/dto"

	"github.com/gofiber/fiber/v2/log"
	amqp "github.com/rabbitmq/amqp091-go"
)

type NotifyQueueConnector struct {
	cfg *config.Config
}

func (qConn *NotifyQueueConnector) getChannel(conn *amqp.Connection) (*amqp.Channel, error) {
	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}
	// No defer, channel will automatically closed on error

	err = ch.ExchangeDeclarePassive(
		qConn.cfg.RMQNotifyExchange, // name
		"fanout",                    // type
		true,                        // durable
		false,                       // auto-deleted
		false,                       // internal
		false,                       // no-wait
		nil,                         // arguments
	)
	if err != nil && qConn.cfg.RMQNotifyExchangeAutocreate {
		log.Warnf("Exchange %q doesn't exist, autocreate enabled, so attempting to create exchange", qConn.cfg.RMQNotifyExchange)

		autocreateExchange(conn, qConn.cfg.RMQNotifyExchange)

		ch, err = conn.Channel()
		if err != nil {
			return nil, err
		}
	}

	return ch, nil
}

func (qConn *NotifyQueueConnector) PushNotify(userInfo *dto.NotifyUserInfo, eventType dto.NotifyMessageType, params interface{}) error {

	body, err := json.Marshal(dto.NotifyUserMessage{
		Type:          eventType.String(),
		UserInfo:      userInfo,
		MessageParams: params,
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
		qConn.cfg.RMQNotifyExchange, // exchange
		"mail.*",                    // routing key
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

func NewNotifyQueueConnector(cfg *config.Config) *NotifyQueueConnector {
	return &NotifyQueueConnector{
		cfg: cfg,
	}
}
