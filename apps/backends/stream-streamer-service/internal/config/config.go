package config

import (
	"os"
	"strconv"
	"time"

	"github.com/Capstane/authlib/utilx"
	"github.com/Capstane/stream-streamer-service/internal"
)

type Config struct {
	LogLevel int8 `default:"4" envconfig:"LOG_LEVEL"`

	RMQConnUrl string `binding:"required" envconfig:"RMQ_CONN_URL"`

	GlobalRMQConnUrl string `binding:"required" envconfig:"GLOBAL_RMQ_CONN_URL"`

	HttpPort  uint16 `default:"8080" envconfig:"HTTP_PORT"`
	SecretKey string `binding:"required" envconfig:"SECRET_KEY"`

	PostgresHost            string        `binding:"required" envconfig:"POSTGRES_HOST"`
	PostgresPort            uint16        `binding:"required" envconfig:"POSTGRES_PORT"`
	PostgresDb              string        `binding:"required" envconfig:"POSTGRES_DB"`
	PostgresUser            string        `binding:"required" envconfig:"POSTGRES_USER"`
	PostgresPassword        string        `binding:"required" envconfig:"POSTGRES_PASSWORD"`
	PostgresMaxIdleConns    int           `default:"10" envconfig:"POSTGRES_MAX_IDLE_CONNS"`
	PostgresMaxOpenConns    int           `default:"100" envconfig:"POSTGRES_MAX_OPEN_CONNS"`
	PostgresConnMaxLifetime time.Duration `default:"1h" envconfig:"POSTGRES_CONN_MAX_LIFETIME"`

	SessionIdRedisUrl string `binding:"required" envconfig:"SESSION_ID_REDIS_URL"`
	UserInfoRedisUrl  string `binding:"required" envconfig:"USER_INFO_REDIS_URL"`

	UserInfoKeyPrefix string `binding:"required" envconfig:"USER_INFO_KEY_PREFIX"`

	RMQLiveStreamExchange           string `binding:"required" envconfig:"RMQ_LIVE_STREAM_EXCHANGE"`
	RMQLiveStreamRoutingKey         string `binding:"required" envconfig:"RMQ_LIVE_STREAM_ROUTING_KEY"`
	RMQLiveStreamExchangeAutocreate bool   `binding:"required" envconfig:"RMQ_LIVE_STREAM_EXCHANGE_AUTOCREATE_ENABLED"`

	RMQMailExchange           string `binding:"required" envconfig:"RMQ_MAIL_EXCHANGE"`
	RMQMailRoutingKey         string `binding:"required" envconfig:"RMQ_MAIL_ROUTING_KEY"`
	RMQMailExchangeAutocreate bool   `binding:"required" envconfig:"RMQ_MAIL_EXCHANGE_AUTOCREATE_ENABLED"`

	RMQStreamerRequestRoutingKey string `binding:"required" envconfig:"RMQ_STREAM_REQUEST_ROUTING_KEY"`

	WebRtcPublicUrl string `binding:"required" envconfig:"WEB_RTC_PUBLIC_URL"`
}

func LoadConfig() Config {
	logLevel, _ := strconv.Atoi(os.Getenv("LOG_LEVEL"))

	return Config{
		LogLevel: int8(logLevel),

		RMQConnUrl: os.Getenv("RMQ_CONN_URL"),

		GlobalRMQConnUrl: os.Getenv("GLOBAL_RMQ_CONN_URL"),

		HttpPort:  internal.ParseUint16(os.Getenv("HTTP_PORT"), 8080),
		SecretKey: os.Getenv("SECRET_KEY"),

		PostgresHost:            os.Getenv("POSTGRES_HOST"),
		PostgresPort:            internal.ParseUint16(os.Getenv("POSTGRES_PORT"), 5432),
		PostgresDb:              os.Getenv("POSTGRES_DB"),
		PostgresUser:            os.Getenv("POSTGRES_USER"),
		PostgresPassword:        os.Getenv("POSTGRES_PASSWORD"),
		PostgresMaxIdleConns:    internal.ParseInt(os.Getenv("POSTGRES_MAX_IDLE_CONNS"), 10),
		PostgresMaxOpenConns:    internal.ParseInt(os.Getenv("POSTGRES_MAX_OPEN_CONNS"), 100),
		PostgresConnMaxLifetime: internal.ParseDuration(os.Getenv("POSTGRES_CONN_MAX_LIFETIME"), 1*time.Hour),

		SessionIdRedisUrl: os.Getenv("SESSION_ID_REDIS_URL"),
		UserInfoRedisUrl:  os.Getenv("USER_INFO_REDIS_URL"),

		UserInfoKeyPrefix: utilx.GetenvDef("USER_INFO_KEY_PREFIX", "streaming:"),

		RMQLiveStreamExchange:           os.Getenv("RMQ_LIVE_STREAM_EXCHANGE"),
		RMQLiveStreamRoutingKey:         os.Getenv("RMQ_LIVE_STREAM_ROUTING_KEY"),
		RMQLiveStreamExchangeAutocreate: internal.ParseBool(os.Getenv("RMQ_LIVE_STREAM_EXCHANGE_AUTOCREATE_ENABLED")),

		RMQMailExchange:           os.Getenv("RMQ_MAIL_EXCHANGE"),
		RMQMailRoutingKey:         os.Getenv("RMQ_MAIL_ROUTING_KEY"),
		RMQMailExchangeAutocreate: internal.ParseBool(os.Getenv("RMQ_MAIL_EXCHANGE_AUTOCREATE_ENABLED")),

		RMQStreamerRequestRoutingKey: GetenvWithDefaultValue("RMQ_STREAM_REQUEST_ROUTING_KEY", "streaming_outgoing"),

		WebRtcPublicUrl: os.Getenv("WEB_RTC_PUBLIC_URL"),
	}
}

func GetenvWithDefaultValue(environmentVariableName string, environmentVariableDefaultValue string) string {
	value := os.Getenv(environmentVariableName)
	if value == "" {
		return environmentVariableDefaultValue
	}
	return value
}
