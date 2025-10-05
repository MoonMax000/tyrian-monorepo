package config

import (
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2/log"
	"github.com/joho/godotenv"

	"github.com/Capstane/authlib/utilx"
	"github.com/Capstane/stream-recommend-service/internal"
)

type Config struct {
	LogLevel  int    `default:"4" envconfig:"LOG_LEVEL"`
	HttpPort  uint16 `default:"8007" envconfig:"HTTP_PORT"`
	SecretKey string `binding:"required" envconfig:"SECRET_KEY"`

	PostgresHost            string        `binding:"required" envconfig:"POSTGRES_HOST"`
	PostgresPort            string        `binding:"required" envconfig:"POSTGRES_PORT"`
	PostgresDb              string        `binding:"required" envconfig:"POSTGRES_DB"`
	PostgresUser            string        `binding:"required" envconfig:"POSTGRES_USER"`
	PostgresPassword        string        `binding:"required" envconfig:"POSTGRES_PASSWORD"`
	PostgresMaxIdleConns    int           `default:"10" envconfig:"POSTGRES_MAX_IDLE_CONNS"`
	PostgresMaxOpenConns    int           `default:"100" envconfig:"POSTGRES_MAX_OPEN_CONNS"`
	PostgresConnMaxLifetime time.Duration `default:"1h" envconfig:"POSTGRES_CONN_MAX_LIFETIME"`

	CdnPublicUrl string `binding:"required" envconfig:"CDN_PUBLIC_URL"`

	RMQConnUrl                  string `binding:"required" envconfig:"RMQ_CONN_URL"`
	RMQMailExchange             string `binding:"required" envconfig:"RMQ_MAIL_EXCHANGE"`
	RMQMailExchangeAutocreate   bool   `binding:"required" envconfig:"RMQ_MAIL_EXCHANGE_AUTOCREATE_ENABLED"`
	RMQNotifyExchange           string `binding:"required" envconfig:"RMQ_NOTIFY_EXCHANGE"`
	RMQNotifyExchangeAutocreate bool   `binding:"required" envconfig:"RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED"`

	RMQExchange string `binding:"required" envconfig:"RMQ_STREAM_EXCHANGE"`
	RMQConsumeQ string `binding:"required" envconfig:"RMQ_STREAM_QUEUE"`

	ReceiveStatisticsMessageInterval time.Duration `binding:"required" envconfig:"RECEIVE_STATISTICS_MESSAGE_INTERVAL"`

	RedisAddr string `binding:"required" envconfig:"REDIS_ADDR"`

	SessionIdRedisUrl string `binding:"required" envconfig:"SESSION_ID_REDIS_URL"`
	UserInfoRedisUrl  string `binding:"required" envconfig:"USER_INFO_REDIS_URL"`

	UserInfoKeyPrefix string `binding:"required" envconfig:"USER_INFO_KEY_PREFIX"`
}

func LoadConfig() Config {
	err := godotenv.Load()
	if err != nil {
		log.Debug("Error loading .env file")
	}

	logLevel, _ := strconv.Atoi(os.Getenv("LOG_LEVEL"))

	return Config{
		LogLevel:  logLevel,
		HttpPort:  internal.ParseUint16(os.Getenv("HTTP_PORT"), 8007),
		SecretKey: os.Getenv("SECRET_KEY"),

		PostgresHost:            os.Getenv("POSTGRES_HOST"),
		PostgresPort:            os.Getenv("POSTGRES_PORT"),
		PostgresDb:              os.Getenv("POSTGRES_DB"),
		PostgresUser:            os.Getenv("POSTGRES_USER"),
		PostgresPassword:        os.Getenv("POSTGRES_PASSWORD"),
		PostgresMaxIdleConns:    internal.ParseInt(os.Getenv("POSTGRES_MAX_IDLE_CONNS"), 10),
		PostgresMaxOpenConns:    internal.ParseInt(os.Getenv("POSTGRES_MAX_OPEN_CONNS"), 100),
		PostgresConnMaxLifetime: internal.ParseDuration(os.Getenv("POSTGRES_CONN_MAX_LIFETIME"), 1*time.Hour),

		CdnPublicUrl: os.Getenv("CDN_PUBLIC_URL"),

		RMQConnUrl:                  os.Getenv("RMQ_CONN_URL"),
		RMQMailExchange:             GetenvDef("RMQ_MAIL_EXCHANGE", "mail"),
		RMQMailExchangeAutocreate:   internal.ParseBool(os.Getenv("RMQ_MAIL_EXCHANGE_AUTOCREATE_ENABLED")),
		RMQNotifyExchange:           GetenvDef("RMQ_NOTIFY_EXCHANGE", "notify"),
		RMQNotifyExchangeAutocreate: internal.ParseBool(os.Getenv("RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED")),

		RMQExchange: GetenvDef("RMQ_STREAM_EXCHANGE", "stream"),
		RMQConsumeQ: GetenvDef("RMQ_STREAM_QUEUE", "stream_events"),

		ReceiveStatisticsMessageInterval: internal.ParseDuration(os.Getenv("RECEIVE_STATISTICS_MESSAGE_INTERVAL"), 10*time.Second),

		RedisAddr: os.Getenv("REDIS_ADDR"),

		SessionIdRedisUrl: os.Getenv("SESSION_ID_REDIS_URL"),
		UserInfoRedisUrl:  os.Getenv("USER_INFO_REDIS_URL"),

		UserInfoKeyPrefix: utilx.GetenvDef("USER_INFO_KEY_PREFIX", "streaming:"),
	}
}

func GetenvDef(envVariable string, defaultValue string) string {
	result := os.Getenv(envVariable)
	if result != "" {
		return result
	}
	return defaultValue
}
