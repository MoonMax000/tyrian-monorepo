package tests

import (
	"encoding/json"
	"log"
	"testing"
	"time"

	"github.com/Capstane/stream-recommend-service/internal/config"
	"github.com/Capstane/stream-recommend-service/internal/dto"
	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
)

func TestStreamStatusMessageViewerCount1(t *testing.T) {
	cfg := config.LoadConfig()

	conn, err := amqp.Dial(cfg.RMQConnUrl)
	failOnError(t, err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(t, err, "Failed to open a channel")
	defer ch.Close()

	body, err := json.Marshal(dto.StreamStatusMessage{
		UserID:         uuid.MustParse("6662d621-8b67-486a-a0d5-2c95e72de860"),
		ViewerCount:    1,
		TranslationUrl: "/0",
		StreamName:     "test stream",
		IsOnline:       true,
	})
	failOnError(t, err, "Failed to json serialization")

	err = ch.Publish(
		cfg.RMQExchange,                // exchange
		"stream.OnLiveBroadcastStatus", // routing key
		false,                          // mandatory
		false,                          // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        body,
			Timestamp:   time.Now(),
		})
	failOnError(t, err, "Failed to publish a message")
	log.Printf(" [x] Sent %s\n", body)
}

func TestStreamStatusMessageViewerCount0(t *testing.T) {
	cfg := config.LoadConfig()

	conn, err := amqp.Dial(cfg.RMQConnUrl)
	failOnError(t, err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(t, err, "Failed to open a channel")
	defer ch.Close()

	body, err := json.Marshal(dto.StreamStatusMessage{
		UserID:         uuid.MustParse("6662d621-8b67-486a-a0d5-2c95e72de860"),
		ViewerCount:    0,
		TranslationUrl: "/0",
		StreamName:     "test stream",
		IsOnline:       true, // true it's not an error
	})
	failOnError(t, err, "Failed to json serialization")

	err = ch.Publish(
		cfg.RMQExchange,                // exchange
		"stream.OnLiveBroadcastStatus", // routing key
		false,                          // mandatory
		false,                          // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        body,
			Timestamp:   time.Now(),
		})
	failOnError(t, err, "Failed to publish a message")
	log.Printf(" [x] Sent %s\n", body)
}
