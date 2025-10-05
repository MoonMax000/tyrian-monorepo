package queue

import (
	"encoding/json"
	"time"

	"github.com/Capstane/stream-streamer-service/internal/config"
	"github.com/Capstane/stream-streamer-service/internal/default_email_templates"
	"github.com/Capstane/stream-streamer-service/internal/dto"
	"github.com/Capstane/stream-streamer-service/internal/model"
	"github.com/Capstane/stream-streamer-service/internal/types"
	"github.com/google/uuid"

	"github.com/gofiber/fiber/v2/log"
	amqp "github.com/rabbitmq/amqp091-go"
)

type EmailQueueConnector struct {
	cfg *config.Config
}

func (emailQueue *EmailQueueConnector) getChannel(conn *amqp.Connection) (*amqp.Channel, error) {
	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}
	// No defer, channel will automatically closed on error

	err = ch.ExchangeDeclarePassive(
		emailQueue.cfg.RMQMailExchange, // name
		"fanout",                       // type
		true,                           // durable
		false,                          // auto-deleted
		false,                          // internal
		false,                          // no-wait
		nil,                            // arguments
	)
	if err != nil && emailQueue.cfg.RMQMailExchangeAutocreate {
		log.Warnf("Exchange %q doesn't exist, autocreate enabled, so attempting to create exchange", emailQueue.cfg.RMQMailExchange)

		autocreateExchange(conn, emailQueue.cfg.RMQMailExchange)

		ch, err = conn.Channel()
		if err != nil {
			return nil, err
		}
	}

	return ch, nil
}

func (qConn *EmailQueueConnector) PushSendBecomeStreamerEmail(
	userId uuid.UUID,
	becomeStreamerRequest *types.BecomeStreamerRequest,
) error {
	emailTemplate := model.NewEmailTemplate(default_email_templates.BECOME_STREAMER_REQUEST)
	smtpMessage, err := emailTemplate.Apply(dto.MailHtml, becomeStreamerRequest.Email, struct {
		Title string
		Text  string
		Email string
	}{
		Title: becomeStreamerRequest.Email,
		Email: becomeStreamerRequest.Email,
		Text:  becomeStreamerRequest.AdditionalText,
	})
	if err != nil {
		return err
	}

	body, err := json.Marshal(smtpMessage)
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
		qConn.cfg.RMQMailExchange,   // exchange
		qConn.cfg.RMQMailRoutingKey, // routing key
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

func NewEmailQueueConnector(cfg *config.Config) *EmailQueueConnector {
	return &EmailQueueConnector{
		cfg: cfg,
	}
}
