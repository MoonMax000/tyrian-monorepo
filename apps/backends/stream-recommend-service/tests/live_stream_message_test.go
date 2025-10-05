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

func TestLiveStreamMessage(t *testing.T) {
	cfg := config.LoadConfig()

	conn, err := amqp.Dial(cfg.RMQConnUrl)
	failOnError(t, err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(t, err, "Failed to open a channel")
	defer ch.Close()

	streamName := "rabbit_send_live_stream_test.go"
	body, err := json.Marshal(dto.LiveStreamStartMessage{
		UserID:     uuid.MustParse("6662d621-8b67-486a-a0d5-2c95e72de860"),
		StreamName: streamName,
		Params: dto.LiveStreamParams{

			TranslationUrl: "http://localhost:8005/video/unique-key",
		},
	})
	failOnError(t, err, "Failed to json serialization")

	err = ch.Publish(
		cfg.RMQExchange,          // exchange
		"stream.OnLiveBroadcast", // routing key
		false,                    // mandatory
		false,                    // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        body,
			Timestamp:   time.Now(),
		})
	failOnError(t, err, "Failed to publish a message")
	log.Printf(" [x] Sent %s\n", body)
}
