package tests

import (
	"testing"

	"github.com/Capstane/AXA-socialweb-posts/internal/config"
	amqp "github.com/rabbitmq/amqp091-go"
)

func TestRabbitMqConnect(t *testing.T) {
	cfg := config.LoadConfig()

	conn, err := amqp.Dial(cfg.RMQConnUrl)
	failOnError(t, err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(t, err, "Failed to open a channel")
	defer ch.Close()

	_, err = ch.QueueDeclare(
		cfg.RMQConsumeQ, // name
		true,            // durable
		false,           // delete when unused
		false,           // exclusive
		false,           // no-wait
		nil,             // arguments
	)
	failOnError(t, err, "Failed to declare a queue")

}
