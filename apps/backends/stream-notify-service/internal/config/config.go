package config

import (
	"os"
	"strconv"
	"time"

	"github.com/Capstane/stream-notify-service/internal"
)

type Config struct {
	LogLevel int8 `default:"4" envconfig:"LOG_LEVEL"`

	RMQConnUrl            string `binding:"required" envconfig:"RMQ_CONN_URL"`
	RMQConsumeQ           string `binding:"required" envconfig:"RMQ_QUEUE_CONSUME"`
	RMQConsumeB           string `binding:"required" envconfig:"RMQ_BINDING_CONSUME"`
	RMQExchange           string `binding:"required" envconfig:"RMQ_EXCHANGE"`
	RMQConsumeQAutocreate bool   `binding:"required" envconfig:"RMQ_QUEUE_CONSUME_AUTOCREATE_DISABLED"`

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

	RMQMailExchange             string `binding:"required" envconfig:"RMQ_MAIL_EXCHANGE"`
	RMQMailExchangeAutocreate   bool   `binding:"required" envconfig:"RMQ_MAIL_EXCHANGE_AUTOCREATE_ENABLED"`
	RMQNotifyExchange           string `binding:"required" envconfig:"RMQ_NOTIFY_EXCHANGE"`
	RMQNotifyExchangeAutocreate bool   `binding:"required" envconfig:"RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED"`

	RedisAddress  string `binding:"required" envconfig:"REDIS_ADDRESS"`
	RedisDatabase int64  `binding:"required" envconfig:"REDIS_DATABASE"`
	RedisPassword string `binding:"required" envconfig:"REDIS_PASSWORD"`

	Listenaddress string `binding:"required" envconfig:"LISTENADDRESS"`
}

func LoadConfig() Config {
	logLevel, _ := strconv.Atoi(os.Getenv("LOG_LEVEL"))

	return Config{
		LogLevel: int8(logLevel),

		RMQConnUrl:            os.Getenv("RMQ_CONN_URL"),
		RMQConsumeQ:           os.Getenv("RMQ_QUEUE_CONSUME"),
		RMQConsumeB:           internal.Getenv("RMQ_BINDING_CONSUME", "notify.*"),
		RMQExchange:           os.Getenv("RMQ_EXCHANGE"),
		RMQConsumeQAutocreate: !internal.ParseBool(os.Getenv("RMQ_QUEUE_CONSUME_AUTOCREATE_DISABLED")),

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

		RMQMailExchange:             os.Getenv("RMQ_MAIL_EXCHANGE"),
		RMQMailExchangeAutocreate:   internal.ParseBool(os.Getenv("RMQ_MAIL_EXCHANGE_AUTOCREATE_ENABLED")),
		RMQNotifyExchange:           os.Getenv("RMQ_NOTIFY_EXCHANGE"),
		RMQNotifyExchangeAutocreate: internal.ParseBool(os.Getenv("RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED")),

		RedisAddress:  GetenvWithDefaultValue("REDIS_ADDRESS", "94.26.248.225:6380"),
		RedisDatabase: internal.ParseInt64(os.Getenv("REDIS_DATABASE"), 1),
		RedisPassword: (os.Getenv("REDIS_PASSWORD")),

		Listenaddress: (os.Getenv("LISTENADDRESS")),
	}
}

func GetenvWithDefaultValue(environmentVariableName string, environmentVariableDefaultValue string) string {
	value := os.Getenv(environmentVariableName)
	if value == "" {
		return environmentVariableDefaultValue
	}
	return value
}
