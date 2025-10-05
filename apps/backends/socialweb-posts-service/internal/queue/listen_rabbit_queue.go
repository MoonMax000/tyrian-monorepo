package queue

import (
	"encoding/json"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Capstane/AXA-socialweb-posts/internal/config"
	"github.com/Capstane/AXA-socialweb-posts/internal/dto"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/rs/zerolog/log"
)

func printLogo() {
	fmt.Println()
	fmt.Printf("SOCIALWEB POSTS SERVICE V1.0")
	fmt.Println()
}

func ListenRabbitQueue(cfg *config.Config) error {

	signalChannel := make(chan os.Signal, 1)
	signal.Notify(
		signalChannel,
		syscall.SIGUSR1, // Use for restart listening queue
		syscall.SIGHUP,
		syscall.SIGQUIT,
		syscall.SIGTERM,
		syscall.SIGSEGV,
	)

	log.Info().Msgf("Setup listening queue %v, exchange: %v, binding: %v", cfg.RMQConsumeQ, cfg.RMQExchange, cfg.RMQConsumeB)

	go processQueue(cfg)

	for {
		signalEvent := <-signalChannel
		switch signalEvent {
		case syscall.SIGUSR1:
			time.Sleep(5 * time.Second)
			go processQueue(cfg)
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

func processQueue(cfg *config.Config) {

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

	// NotifySenders channel
	chNotifySenders := make(chan *amqp.Delivery, 11)
	go func() {
		for {
			message := <-chNotifySenders
			log.Debug().Msgf("New message with timestamp %v", message.Timestamp)

			go func(message *amqp.Delivery) {
				var notifyMessage dto.NotifyMessage

				err := json.Unmarshal(message.Body, &notifyMessage)
				if err != nil {
					log.Error().Msgf("Can't unmarshal body %v...: %v", cutBytes(message.Body, 100), err)
					return
				}

				log.Info().Msgf("Message input: UserId: %v, NotifyTimestamp: %v, MessageParams: %v, TargetUserId: %v", notifyMessage.UserId, notifyMessage.NotifyTimestamp, notifyMessage.MessageParams, notifyMessage.TargetUserId)

				err = message.Ack(true)
				if err != nil {
					log.Error().Msgf("Acknowledge of message %v fail with error %v", cutBytes(message.Body, 100), err)
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
			chNotifySenders <- &message
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
		autocreateExchange(conn, cfg.RMQExchange)
		log.Info().Msgf("Exchange %q create", cfg.RMQExchange)
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
		"AXA-socialweb-posts",
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

func autocreateExchange(conn *amqp.Connection, exchangeName string) error {
	ch, err := conn.Channel()
	if err != nil {
		return err
	}
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
