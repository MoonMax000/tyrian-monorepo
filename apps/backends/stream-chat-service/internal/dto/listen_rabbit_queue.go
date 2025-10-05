package dto

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/Capstane/stream-chat-service/internal/chatmanagement"
	"github.com/Capstane/stream-chat-service/internal/config"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/rs/zerolog/log"
)

func printLogo() {
	fmt.Println()
	fmt.Printf("STREAMS CHAT SERVICE V1.0")
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

	log.Info().Msgf("Setup listening queue %v", cfg.RMQConsumeQ)

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

	chStatusStream := make(chan *amqp.Delivery, 11)
	go func() {
		for {
			message := <-chStatusStream
			log.Debug().Msgf("New message with timestamp %v", message.Timestamp)

			go func(message *amqp.Delivery) {
				var notifyMessage StreamStatusMessage

				err := json.Unmarshal(message.Body, &notifyMessage)
				if err != nil {
					log.Error().Msgf("Can't unmarshal body %v...: %v", cutBytes(message.Body, 100), err)
					message.Nack(false, false)
					return
				}

				// log message
				log.Info().Msgf("Message admin: %v, stream: %v will send to notify user: %v", notifyMessage.StreamOwner, notifyMessage.StreamUrl, notifyMessage.MessageParams)
				chatmanagement.ChatManagement(notifyMessage.StreamOwner, notifyMessage.StreamUrl, notifyMessage.MessageParams, cfg)

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
			chStatusStream <- &message
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
		log.Warn().Msgf("Exchange %q doesn't exist, autocreate enabled, so attempting to create exchange", cfg.RMQExchange)

		autocreateExchange(conn, cfg.RMQExchange)

		ch, err = conn.Channel()
		if err != nil {
			return nil, err
		}
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
		"stream-chat-service",
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

// log_request_handler.go
func LogRequestHandler(h http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {

		// call the original http.Handler we're wrapping
		h.ServeHTTP(w, r)

		// gather information about request and log it
		uri := r.URL.String()
		method := r.Method
		// ... more information
		log.Info().Msgf("HTTP [%v] %v", method, uri)
	}

	// http.HandlerFunc wraps a function so that it
	// implements http.Handler interface
	return http.HandlerFunc(fn)
}

// utils.go
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

// rabbit_tools.go
const MAX_MESSAGE_ID_LENGTH = 100

func GetMessageId(message *amqp.Delivery) string {
	var notifyMessage StreamStatusMessage
	err := json.Unmarshal(message.Body, &notifyMessage)
	prefix := strconv.FormatInt(message.Timestamp.Unix(), 16)
	if err != nil {
		body := string(cutBytes(message.Body, MAX_MESSAGE_ID_LENGTH))
		return composeId(MAX_MESSAGE_ID_LENGTH, &prefix, &body)
	}

	return composeId(MAX_MESSAGE_ID_LENGTH, &prefix)
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

// circular_buffer.go
type CircularBuffer struct {
	buffer       []string
	size         int
	readPointer  int
	writePointer int
	count        int
}

func NewCircularBuffer(size int) *CircularBuffer {
	return &CircularBuffer{
		buffer:       make([]string, size),
		size:         size,
		readPointer:  0,
		writePointer: 0,
		count:        0,
	}
}

func (c *CircularBuffer) String() string {
	items := make([]string, 0, 10)
	items = append(items, c.buffer[c.readPointer:]...)
	items = append(items, c.buffer[:c.readPointer]...)
	content := strings.Join(items, ",")
	if len(content) > 10 {
		return content[:10] + "..."
	}
	return content
}

func (c *CircularBuffer) Put(data ...string) string {
	for _, r := range data {
		c.push(r)
	}
	return data[0]
}

func (c *CircularBuffer) push(data string) {
	if c.count == c.size {
		c.readPointer = (c.readPointer + 1) % c.size
	} else if c.count < c.size {
		c.count++
	}
	c.buffer[c.writePointer] = data
	c.writePointer = (c.writePointer + 1) % c.size
}

func (c *CircularBuffer) Has(element string) bool {
	for _, item := range c.buffer[c.readPointer:] {
		if item == element {
			return true
		}
	}
	for _, item := range c.buffer[:c.readPointer] {
		if item == element {
			return true
		}
	}
	return false
}
