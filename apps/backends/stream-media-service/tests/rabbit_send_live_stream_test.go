package tests

import (
	"encoding/json"
	"log"
	"testing"
	"time"

	"github.com/Capstane/stream-media-service/internal"
	"github.com/Capstane/stream-media-service/internal/config"
	"github.com/Capstane/stream-media-service/internal/dto"
	"github.com/Capstane/stream-media-service/internal/encdec"
	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
)

func TestStartLiveStream(t *testing.T) {
	cfg := config.LoadConfig()

	conn, err := amqp.Dial(cfg.RMQConnUrl)
	failOnError(t, err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(t, err, "Failed to open a channel")
	defer ch.Close()

	userId, err := uuid.Parse(internal.Getenv("TEST_USER_ID", "c796e41b-584d-4a3a-8969-57130eac1bfc"))
	failOnError(t, err, "Failed to parse uuid")
	keyBase64Encoded := internal.Getenv("TEST_STREAM_KEY", "AQMip3B5Rpn66ajW1WgwSw")
	key, err := encdec.StreamKeyEncoding.DecodeString(keyBase64Encoded)
	failOnError(t, err, "Failed to parse stream key")

	streamName := "rabbit_send_live_stream_test.go"
	body, err := json.Marshal(dto.LiveStreamMessage{
		Command:    dto.LiveStreamCommandStart,
		StreamName: &streamName,
		UserInfo: &dto.NotifyUserInfo{
			UserId: userId,
		},
		Params: &dto.LiveStreamParams{
			Key:            key,
			TranslationUrl: "https://localhost:8005/video/1",
		},
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
	failOnError(t, err, "Failed to publish a message")
	log.Printf(" [x] Sent %s\n", body)
}

func TestStopLiveStream(t *testing.T) {
	cfg := config.LoadConfig()

	conn, err := amqp.Dial(cfg.RMQConnUrl)
	failOnError(t, err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(t, err, "Failed to open a channel")
	defer ch.Close()

	userId, err := uuid.Parse(internal.Getenv("TEST_USER_ID", "c796e41b-584d-4a3a-8969-57130eac1bfc"))
	failOnError(t, err, "Failed to parse uuid")
	keyBase64Encoded := internal.Getenv("TEST_STREAM_KEY", "AQMip3B5Rpn66ajW1WgwSw")
	key, err := encdec.StreamKeyEncoding.DecodeString(keyBase64Encoded)
	failOnError(t, err, "Failed to parse stream key")

	body, err := json.Marshal(dto.LiveStreamMessage{
		Command: dto.LiveStreamCommandStop,
		UserInfo: &dto.NotifyUserInfo{
			UserId: userId,
		},
		Params: &dto.LiveStreamParams{
			Key: key,
		},
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
	failOnError(t, err, "Failed to publish a message")
	log.Printf(" [x] Sent %s\n", body)
}
