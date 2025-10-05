package tests

import (
	"encoding/json"
	"log"
	"testing"
	"time"

	"github.com/Capstane/stream-chat-service/internal/config"
	"github.com/Capstane/stream-chat-service/internal/dto"
	amqp "github.com/rabbitmq/amqp091-go"
)

func TestRabbitSendStatusStream(t *testing.T) {
	cfg := config.LoadConfig()

	// conn, err := amqp.Dial(cfg.RMQConnUrl)
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	failOnError(t, err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(t, err, "Failed to open a channel")
	defer ch.Close()

	body, err := json.Marshal(dto.StreamStatusMessage{
		StreamOwner:   "feb331cd-1ff4-4119-9bd1-df1abd7e0c77",
		StreamUrl:     "Stream1",
		MessageParams: "StartStream",
	})
	failOnError(t, err, "Failed to json serialization")

	err = ch.Publish(
		cfg.RMQExchange, // exchange
		cfg.RMQConsumeB, // routing key
		false,           // mandatory
		false,           // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        body,
			Timestamp:   time.Now(),
		})

	// Create exchange
	err = ch.ExchangeDeclare(
		cfg.RMQExchange, // name
		"fanout",        // type
		true,            // durable
		false,           // auto-deleted
		false,           // internal
		false,           // no-wait
		nil,             // arguments
	)
	failOnError(t, err, "Failed to publish a message")
	log.Printf(" [x] Sent %s\n", body)
}
