package config

import (
	"os"
	"time"

	"github.com/Capstane/stream-media-service/internal"
)

type Config struct {
	LogLevel int8 `default:"4" envconfig:"LOG_LEVEL"`

	PublicIp string `default:"" envconfig:"PUBLIC_IP"`
	HttpPort uint16 `default:"8080" envconfig:"HTTP_PORT"`
	UdpPort  uint16 `default:"8081" envconfig:"UDP_PORT"`

	RMQConnUrl            string `binding:"required" envconfig:"RMQ_CONN_URL"`
	RMQConsumeQ           string `binding:"required" envconfig:"RMQ_QUEUE_CONSUME"`
	RMQConsumeB           string `binding:"required" envconfig:"RMQ_BINDING_CONSUME"`
	RMQExchange           string `binding:"required" envconfig:"RMQ_EXCHANGE"`
	RMQConsumeQAutocreate bool   `binding:"required" envconfig:"RMQ_QUEUE_CONSUME_AUTOCREATE_DISABLED"`

	RMQNotifyExchange           string `binding:"required" envconfig:"RMQ_NOTIFY_EXCHANGE"`
	RMQNotifyRoutingKey         string `binding:"required" envconfig:"RMQ_NOTIFY_ROUTING_KEY"`
	RMQNotifyExchangeAutocreate bool   `binding:"required" envconfig:"RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED"`

	RMQStreamExchange                        string `binding:"required" envconfig:"RMQ_STREAM_EXCHANGE"`
	RMQStreamOnLiveBroadcastRoutingKey       string `binding:"required" envconfig:"RMQ_STREAM_ON_LIVE_BROADCAST_ROUTING_KEY"`
	RMQStreamOnLiveBroadcastStatusRoutingKey string `binding:"required" envconfig:"RMQ_STREAM_ON_LIVE_BROADCAST_STATUS_ROUTING_KEY"`
	RMQStreamExchangeAutocreate              bool   `binding:"required" envconfig:"RMQ_STREAM_EXCHANGE_AUTOCREATE_ENABLED"`

	RMQChatExchange           string `binding:"required" envconfig:"RMQ_CHAT_EXCHANGE"`
	RMQChatRoutingKey         string `binding:"required" envconfig:"RMQ_CHAT_ROUTING_KEY"`
	RMQChatExchangeAutocreate bool   `binding:"required" envconfig:"RMQ_CHAT_EXCHANGE_AUTOCREATE_ENABLED"`

	SendStatisticsMessageInterval time.Duration `binding:"required" envconfig:"SEND_STATISTICS_MESSAGE_INTERVAL"`

	DeadTranslationTimeout time.Duration `binding:"required" envconfig:"DEAD_TRANSLATION_TIMEOUT"`

	SecretKey string `binding:"required" envconfig:"SECRET_KEY"`
}

func LoadConfig() Config {
	logLevel, _ := -1, 0 // strconv.Atoi(os.Getenv("LOG_LEVEL"))

	return Config{
		LogLevel: int8(logLevel),

		PublicIp: os.Getenv("PUBLIC_IP"),
		HttpPort: internal.ParseUint16(os.Getenv("HTTP_PORT"), 8080),
		UdpPort:  internal.ParseUint16(os.Getenv("UDP_PORT"), 8081),

		RMQConnUrl:            os.Getenv("RMQ_CONN_URL"),
		RMQConsumeQ:           GetenvDef("RMQ_QUEUE_CONSUME", "LIVE_STREAM_QUEUE"),
		RMQConsumeB:           GetenvDef("RMQ_BINDING_CONSUME", "live-stream.*"),
		RMQExchange:           GetenvDef("RMQ_EXCHANGE", "live-stream"),
		RMQConsumeQAutocreate: !internal.ParseBool(os.Getenv("RMQ_QUEUE_CONSUME_AUTOCREATE_DISABLED")),

		RMQNotifyExchange:           GetenvDef("RMQ_NOTIFY_EXCHANGE", "notify"),
		RMQNotifyRoutingKey:         GetenvDef("RMQ_NOTIFY_ROUTING_KEY", "notify.*"),
		RMQNotifyExchangeAutocreate: internal.ParseBoolDef(os.Getenv("RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED"), true),

		RMQStreamExchange:                        GetenvDef("RMQ_STREAM_EXCHANGE", "stream"),
		RMQStreamOnLiveBroadcastRoutingKey:       GetenvDef("RMQ_STREAM_ON_LIVE_BROADCAST_ROUTING_KEY", "stream.OnLiveBroadcast"),
		RMQStreamOnLiveBroadcastStatusRoutingKey: GetenvDef("RMQ_STREAM_ON_LIVE_BROADCAST_STATUS_ROUTING_KEY", "stream.OnLiveBroadcastStatus"),
		RMQStreamExchangeAutocreate:              internal.ParseBoolDef(os.Getenv("RMQ_STREAM_EXCHANGE_AUTOCREATE_ENABLED"), true),

		RMQChatExchange:           GetenvDef("RMQ_CHAT_EXCHANGE", "status-chat"),
		RMQChatRoutingKey:         GetenvDef("RMQ_CHAT_ROUTING_KEY", "status-chat.*"),
		RMQChatExchangeAutocreate: internal.ParseBool(os.Getenv("RMQ_CHAT_EXCHANGE_AUTOCREATE_ENABLED")),

		SendStatisticsMessageInterval: internal.ParseDuration(os.Getenv("SEND_STATISTICS_MESSAGE_INTERVAL"), 1*time.Second),

		DeadTranslationTimeout: internal.ParseDuration(os.Getenv("DEAD_TRANSLATION_TIMEOUT"), 30*time.Second),

		SecretKey: os.Getenv("SECRET_KEY"),
	}
}

func GetenvDef(envVariable string, defaultValue string) string {
	result := os.Getenv(envVariable)
	if result != "" {
		return result
	}
	return defaultValue
}
