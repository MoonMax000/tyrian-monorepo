package tests

import (
	"encoding/json"
	"log"
	"testing"
	"time"

	"github.com/Capstane/stream-notify-service/internal"
	"github.com/Capstane/stream-notify-service/internal/config"
	"github.com/Capstane/stream-notify-service/internal/dto"
	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
)

func TestRabbitSendNotifyOnRecommendations(t *testing.T) {
	cfg := config.LoadConfig()

	conn, err := amqp.Dial(cfg.RMQConnUrl)
	failOnError(t, err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(t, err, "Failed to open a channel")
	defer ch.Close()

	userId, err := uuid.Parse(internal.Getenv("TEST_UUID", "99f52bde-6d34-4a9e-ba1c-f6377581aa8b"))
	failOnError(t, err, "Failed to parse uuid")

	body, err := json.Marshal(dto.NotifyUserMessage{
		Type: dto.NotifyOnRecommendations.String(),
		UserInfo: &dto.NotifyUserInfo{
			UserId: userId,
		},
		MessageParams: struct {
			Ref string
		}{
			Ref: "https://obs-service/translation-path",
		},
	})
	failOnError(t, err, "Failed to json serialization")

	err = ch.Publish(
		"",              // exchange
		cfg.RMQConsumeQ, // routing key
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
