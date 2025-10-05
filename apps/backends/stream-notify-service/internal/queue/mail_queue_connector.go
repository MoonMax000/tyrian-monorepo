package queue

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/Capstane/stream-notify-service/internal/config"
	"github.com/Capstane/stream-notify-service/internal/default_email_templates"
	"github.com/Capstane/stream-notify-service/internal/dto"
	"github.com/Capstane/stream-notify-service/internal/model"
	"github.com/Capstane/stream-notify-service/internal/types"

	"github.com/gofiber/fiber/v2/log"
	amqp "github.com/rabbitmq/amqp091-go"
)

var (
	emailEventTypesMap = map[dto.NotifyMessageType]default_email_templates.EmailEventType{
		dto.NotifyOnLiveBroadcast:   default_email_templates.MESSAGE_ON_LIVE_BROADCAST,
		dto.NotifyOnVOD:             default_email_templates.MESSAGE_ON_VOD,
		dto.NotifyOnMention:         default_email_templates.MESSAGE_ON_MENTION,
		dto.NotifyOnNewSubscriber:   default_email_templates.MESSAGE_ON_NEW_SUBSCRIBER,
		dto.NotifyOnRecommendations: default_email_templates.MESSAGE_ON_RECOMMENDATIONS,
		dto.NotifyOnNews:            default_email_templates.MESSAGE_ON_NEWS,
	}
)

type MailQueueConnector struct {
	cfg *config.Config
}

func (qConn *MailQueueConnector) getChannel(conn *amqp.Connection) (*amqp.Channel, error) {
	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}
	// No defer, channel will automatically closed on error

	err = ch.ExchangeDeclarePassive(
		qConn.cfg.RMQMailExchange, // name
		"fanout",                  // type
		true,                      // durable
		false,                     // auto-deleted
		false,                     // internal
		false,                     // no-wait
		nil,                       // arguments
	)
	if err != nil && qConn.cfg.RMQMailExchangeAutocreate {
		log.Warnf("Exchange %q doesn't exist, autocreate enabled, so attempting to create exchange", qConn.cfg.RMQMailExchange)

		autocreateExchange(conn, qConn.cfg.RMQMailExchange)

		ch, err = conn.Channel()
		if err != nil {
			return nil, err
		}
	}

	return ch, nil
}

func (qConn *MailQueueConnector) PushEmail(notifyMessage *dto.NotifyUserMessage) error {

	emailEventType, ok := emailEventTypesMap[dto.ParseNotifyMessageType(notifyMessage.Type)]
	if !ok {
		return fmt.Errorf("can't find email template for notification event type: %v", notifyMessage.Type)
	}
	if notifyMessage.UserInfo == nil {
		return fmt.Errorf("message has nil in UserInfo field, cn't get email for message send")
	}

	emailTemplate := model.NewEmailTemplate(emailEventType)
	smtpMessage, err := emailTemplate.Apply(dto.MailHtml, notifyMessage.UserInfo.Email, struct {
		Profile *types.Profile
		Params  interface{}
	}{
		Profile: &types.Profile{
			ID:             notifyMessage.UserInfo.UserId.String(),
			Username:       notifyMessage.UserInfo.Username,
			Email:          notifyMessage.UserInfo.Email,
			EmailConfirmed: notifyMessage.UserInfo.EmailConfirmed,
			Description:    notifyMessage.UserInfo.Description,
			AvatarURL:      notifyMessage.UserInfo.AvatarURL,
			CoverURL:       notifyMessage.UserInfo.CoverURL,
			Roles:          notifyMessage.UserInfo.Roles,
		},
		Params: notifyMessage.MessageParams,
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
		qConn.cfg.RMQMailExchange, // exchange
		"mail.*",                  // routing key
		false,                     // mandatory
		false,                     // immediate
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

func NewMailQueueConnector(cfg *config.Config) *MailQueueConnector {
	return &MailQueueConnector{
		cfg: cfg,
	}
}
