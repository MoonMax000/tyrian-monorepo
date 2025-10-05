package tests

import (
	"encoding/json"
	"log"
	"testing"
	"time"

	"github.com/Capstane/stream-auth-service/internal/dto"
	amqp "github.com/rabbitmq/amqp091-go"
)

func TestSendToStreamingQueue(t *testing.T) {
	// cfg := config.LoadConfig()

	// conn, err := amqp.Dial(cfg.GlobalRMQConnUrl)
	conn, err := amqp.Dial("amqp://rabbitmq:rabbitmq@localhost:5673/")
	if err != nil {
		t.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		t.Fatalf("Failed to open a channel: %v", err)
	}
	defer ch.Close()

	// Формируем сообщение
	message := dto.ResultSFMessage{
		UserId: "7f05b95e-3e45-4a5c-877f-aa0462811b80",
		Email:  "string666@mail.ru",
		Status: "approved",
	}

	body, err := json.Marshal(message)
	if err != nil {
		t.Fatalf("Failed to marshal message: %v", err)
	}

	// Публикуем в ОБМЕННИК ПО УМОЛЧАНИЮ ("") с routing_key = имени очереди
	err = ch.Publish(
		"",                   // exchange: default (встроенный)
		"streaming_incoming", // routing key = имя очереди
		false,                // mandatory
		false,                // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
			Timestamp:   time.Now(),
		},
	)
	if err != nil {
		t.Fatalf("Failed to publish message: %v", err)
	}

	log.Printf("[TEST] Sent message to queue 'streaming_incoming': %s", body)
}
