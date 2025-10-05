package tests

import (
	"encoding/json"
	"log"
	"testing"
	"time"

	"github.com/Capstane/AXA-socialweb-posts/internal/config"
	"github.com/Capstane/AXA-socialweb-posts/internal/dto"
	amqp "github.com/rabbitmq/amqp091-go"
)

func TestRabbitSend(t *testing.T) {
	cfg := config.LoadConfig()

	conn, err := amqp.Dial(cfg.RMQConnUrl)
	failOnError(t, err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(t, err, "Failed to open a channel")
	defer ch.Close()

	messageData := map[string]string{
		"type": "like_post",
		"data": "7ac9109c-9af1-4bc7-9d4c-11d56ff67a00",
	}

	body, err := json.Marshal(dto.NotifyMessage{
		UserId:          "99f52bde-6d34-4a9e-ba1c-f6377581aa8b",
		NotifyTimestamp: 1740486750900,
		MessageParams:   messageData,
		TargetUserId:    "fdbd5c96-8343-4b21-8de9-8dbb3ef0bb12",
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
