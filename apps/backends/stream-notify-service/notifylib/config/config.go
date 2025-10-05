package config

import (
	"os"
)

type Config struct {
	RMQConnUrl          string `binding:"required" envconfig:"RMQ_CONN_URL"`
	RMQNotifyRoutingKey string `binding:"required" envconfig:"RMQ_NOTIFY_ROUTING_KEY"`
	RMQNotifyExchange   string `binding:"required" envconfig:"RMQ_NOTIFY_EXCHANGE"`
}

func LoadConfig() Config {

	return Config{
		RMQConnUrl:          os.Getenv("RMQ_CONN_URL"),
		RMQNotifyExchange:   os.Getenv("RMQ_NOTIFY_EXCHANGE"),
		RMQNotifyRoutingKey: os.Getenv("RMQ_NOTIFY_ROUTING_KEY"),
	}
}
