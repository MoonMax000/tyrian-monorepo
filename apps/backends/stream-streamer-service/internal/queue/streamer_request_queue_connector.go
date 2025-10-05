package queue

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/Capstane/stream-streamer-service/internal/config"
	"github.com/Capstane/stream-streamer-service/internal/dto"
	"github.com/rs/zerolog/log"

	amqp "github.com/rabbitmq/amqp091-go"
)

type StreamerRequestQueueConnector struct {
	cfg *config.Config
}

func (qConn *StreamerRequestQueueConnector) getChannel(conn *amqp.Connection) (*amqp.Channel, error) {
	ch, err := conn.Channel()
	if err != nil {
		return nil, fmt.Errorf("failed to open channel: %w", err)
	}
	return ch, nil
}

func (qConn *StreamerRequestQueueConnector) PushStreamerRequest(userID string, email string, additionalText string) error {
	body, err := json.Marshal(dto.StreamRequestMessage{
		Type: "stream_request",
		Data: dto.UserData{
			UserID:         userID,
			Email:          email,
			Role:           "streamer",
			AdditionalText: additionalText,
		},
	})
	if err != nil {
		return fmt.Errorf("failed to marshal message: %w", err)
	}

	conn, err := amqp.Dial(qConn.cfg.GlobalRMQConnUrl)
	if err != nil {
		return fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}
	defer conn.Close()

	ch, err := qConn.getChannel(conn)
	if err != nil {
		return err
	}
	defer ch.Close()

	// Публикуем в ОБМЕННИК ПО УМОЛЧАНИЮ ("") с routing_key = имени очереди
	err = ch.Publish(
		"",                                     // exchange: default (встроенный)
		qConn.cfg.RMQStreamerRequestRoutingKey, // routing key = имя очереди (например, "streaming_outgoing")
		false,                                  // mandatory
		false,                                  // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
			Timestamp:   time.Now(),
		},
	)
	if err != nil {
		return fmt.Errorf("failed to publish message: %w", err)
	}

	log.Printf("Published message to queue '%s' via default exchange", qConn.cfg.RMQStreamerRequestRoutingKey)
	return nil
}

func NewStreamerRequestQueueConnector(cfg *config.Config) *StreamerRequestQueueConnector {
	return &StreamerRequestQueueConnector{
		cfg: cfg,
	}
}
