package amqp_service

import (
	"encoding/json"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Capstane/stream-media-service/internal"
	"github.com/Capstane/stream-media-service/internal/config"
	"github.com/Capstane/stream-media-service/internal/dto"
	"github.com/Capstane/stream-media-service/internal/queue"
	"github.com/Capstane/stream-media-service/internal/translation"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/rs/zerolog/log"
)

func printLogo() {
	fmt.Println()
	fmt.Printf("STREAMS LIFE STREAM SERVICE V1.0")
	fmt.Println()
}

func ListenRabbitQueue(translationsControl translation.TranslationControl, cfg *config.Config) error {

	signalChannel := make(chan os.Signal, 1)
	signal.Notify(
		signalChannel,
		syscall.SIGUSR1, // Use for restart listening queue
		syscall.SIGHUP,
		syscall.SIGQUIT,
		syscall.SIGTERM,
		syscall.SIGSEGV,
	)

	log.Info().Msgf("Setup listening queue %v", cfg.RMQConsumeQ)

	go processQueue(translationsControl, cfg)

	for {
		signalEvent := <-signalChannel
		switch signalEvent {
		case syscall.SIGUSR1:
			time.Sleep(5 * time.Second)
			go processQueue(translationsControl, cfg)
		case syscall.SIGQUIT,
			syscall.SIGTERM,
			syscall.SIGINT,
			syscall.SIGKILL:
			log.Error().Msgf("Signal event %q", signalEvent)
			return nil
		case syscall.SIGHUP:
			log.Error().Msgf("Signal event %q", signalEvent)
			return fmt.Errorf("signal hang up")
		case syscall.SIGSEGV:
			log.Error().Msgf("Signal event %q", signalEvent)
			return fmt.Errorf("segmentation violation")
		default:
			log.Error().Msgf("Unexpected signal %q", signalEvent)
		}
	}
}

func processQueue(translationControl translation.TranslationControl, cfg *config.Config) {

	conn, err := amqp.Dial(cfg.RMQConnUrl)

	defer func() {
		if err != nil {
			fmt.Printf("Connection to RabbitMQ fail with error: %v", err)
		} else {
			log.Warn().Msg("Exit from process queue")
		}
		syscall.Kill(syscall.Getpid(), syscall.SIGUSR1)
	}()

	if err != nil {
		log.Error().Msgf("processQueue error %v", err)
		return
	}
	defer conn.Close()

	messages, err := getMessagesChannel(conn, cfg)
	if err != nil {
		log.Error().Msgf("processQueue error %v", err)
		return
	}

	// Notification sender
	notifyQueueConnector := queue.NewNotifyQueueConnector(cfg)

	// Chat sender
	chatQueueConnector := queue.NewChatQueueConnector(cfg)

	// NotifySenders channel
	chLiveStreams := make(chan *amqp.Delivery, 11)
	go func() {
		for {
			message := <-chLiveStreams
			log.Debug().Msgf("New message with timestamp %v", message.Timestamp)

			go func(message *amqp.Delivery) {
				var liveStreamMessage dto.LiveStreamMessage

				err := json.Unmarshal(message.Body, &liveStreamMessage)
				if err != nil {
					log.Error().Msgf("Can't unmarshal body %v...: %v", string(cutBytes(message.Body, 100)), err)
					message.Ack(true)
					return
				}

				switch liveStreamMessage.Command {
				case dto.LiveStreamCommandStart:
					if liveStreamMessage.UserInfo != nil {
						log.Info().MsgFunc(func() string {
							params, _ := json.Marshal(liveStreamMessage.Params)
							return fmt.Sprintf("Live stream will start for user: %q, with params: %v",
								liveStreamMessage.UserInfo.UserId, string(params))
						})
					}

					err = translationControl.StartNewTranslation(&liveStreamMessage)
					if err != nil {
						log.Error().Msgf("Can't start translation cause error: %v", err)
						message.Ack(true)
						return
					}
					err = notifyQueueConnector.PushNotify(liveStreamMessage.UserInfo, dto.NotifyOnLiveBroadcast, struct {
						Ref string
					}{
						Ref: liveStreamMessage.Params.TranslationUrl,
					})
					if err != nil {
						log.Error().Msgf("Can't push message to notification queue cause error: %v", err)
						message.Ack(true)
						return
					}
					err = chatQueueConnector.PushChat(&dto.ChatServiceMessage{
						StreamOwner:   liveStreamMessage.UserInfo.UserId.String(),
						StreamUrl:     internal.Suffix(liveStreamMessage.Params.TranslationUrl, "/"),
						MessageParams: dto.STATUSSTART,
					})
					if err != nil {
						log.Error().Msgf("Can't push message to chat queue cause error: %v", err)
						message.Ack(true)
						return
					}

					log.Info().Msgf("Live stream started: %v, clients link is: %v",
						internal.Base64EncodeKey(liveStreamMessage.Params.Key), liveStreamMessage.Params.TranslationUrl)

				case dto.LiveStreamCommandStop:
					if liveStreamMessage.UserInfo != nil {
						log.Info().MsgFunc(func() string {
							params, _ := json.Marshal(liveStreamMessage.Params)
							return fmt.Sprintf("Live stream will stop for user: %q, with params: %v",
								liveStreamMessage.UserInfo.UserId, string(params))
						})
					}

					err = translationControl.StopTranslation(&liveStreamMessage)
					if err != nil {
						log.Error().Msgf("Can't stop translation cause error: %v", err)
						message.Ack(true)
						return
					}
					err = chatQueueConnector.PushChat(&dto.ChatServiceMessage{
						StreamOwner:   liveStreamMessage.UserInfo.UserId.String(),
						StreamUrl:     internal.Suffix(liveStreamMessage.Params.TranslationUrl, "/"),
						MessageParams: dto.STATUSSTOP,
					})
					if err != nil {
						log.Error().Msgf("Can't push message to chat queue cause error: %v", err)
						message.Ack(true)
						return
					}

					log.Info().Msgf("Live stream stop: %v",
						internal.Base64EncodeKey(liveStreamMessage.Params.Key))
				}

				err = message.Ack(true)
				if err != nil {
					log.Error().Msgf("Acknowledge of message %v fail with error %v", string(cutBytes(message.Body, 100)), err)
					message.Ack(true)
					return
				}
			}(message)
		}

	}()

	printLogo()
	circularBuffer := NewCircularBuffer(10)
	for message := range messages {
		messageId := GetMessageId(&message)
		if !circularBuffer.Has(messageId) {
			chLiveStreams <- &message
		}
		circularBuffer.Put(messageId)
	}

}

func getMessagesChannel(conn *amqp.Connection, cfg *config.Config) (<-chan amqp.Delivery, error) {

	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}
	// No defer, channel will automatically closed on error

	_, err = ch.QueueDeclarePassive(
		cfg.RMQConsumeQ, //name
		false,           // durable
		false,           // autoDelete
		false,           // exclusive
		false,           // noWait
		nil,             // arguments
	)
	if err != nil && cfg.RMQConsumeQAutocreate {
		log.Warn().Msgf("Queue %q doesn't exist, autocreate enabled, so attempting to create queue", cfg.RMQConsumeQ)

		err = autocreateQueue(conn, cfg)
		if err != nil {
			return nil, err
		}
		ch, err = conn.Channel()
		if err != nil {
			return nil, err
		}
	}

	// Check does exchange exists
	err = ch.ExchangeDeclarePassive(
		cfg.RMQExchange, // name
		"fanout",        // type
		true,            // durable
		false,           // auto-deleted
		false,           // internal
		false,           // no-wait
		nil,             // arguments
	)
	if err != nil {
		log.Warn().Msgf("Exchange %q doesn't exist (%v)", cfg.RMQExchange, err)
	}

	err = ch.QueueBind(
		cfg.RMQConsumeQ,
		cfg.RMQConsumeB,
		cfg.RMQExchange,
		false,
		nil,
	)
	if err != nil {
		return nil, err
	}

	return ch.Consume(
		cfg.RMQConsumeQ,
		"stream-media-service",
		false,
		false,
		false,
		false,
		nil,
	)
}

func autocreateQueue(conn *amqp.Connection, cfg *config.Config) error {
	ch, err := conn.Channel()
	if err != nil {
		return err
	}
	// Always close channel after queue redeclare (otherwise first call delivery/consume fail)
	defer ch.Close()

	_, err = ch.QueueDeclare(
		cfg.RMQConsumeQ, // name
		true,            // durable
		false,           // delete when unused
		false,           // exclusive
		false,           // no-wait
		nil,             // arguments
	)
	return err
}
