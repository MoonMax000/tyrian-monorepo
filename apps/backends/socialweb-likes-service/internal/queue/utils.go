package queue

import (
	amqp "github.com/rabbitmq/amqp091-go"
)

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

func autocreateQueue(conn *amqp.Connection, queueName string) error {
	ch, err := conn.Channel()
	if err != nil {
		return err
	}
	// Always close channel after queue redeclare (otherwise first call delivery/consume fail)
	defer ch.Close()

	_, err = ch.QueueDeclare(
		queueName, // name
		true,      // durable
		false,     // delete when unused
		false,     // exclusive
		false,     // no-wait
		nil,       // arguments
	)
	return err
}
