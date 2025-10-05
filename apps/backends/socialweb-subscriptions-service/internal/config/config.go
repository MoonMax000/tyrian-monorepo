package config

import (
	"os"
	"strconv"
	"time"

	"github.com/Capstane/AXA-socialweb-subscriptions/internal"
	"github.com/Capstane/authlib/utilx"
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

	SessionIdRedisUrl string `binding:"required" envconfig:"SESSION_ID_REDIS_URL"`
	UserInfoRedisUrl  string `binding:"required" envconfig:"USER_INFO_REDIS_URL"`

	UserInfoKeyPrefix string `binding:"required" envconfig:"USER_INFO_KEY_PREFIX"`

	UserSessionTtl time.Duration

	RMQConnUrl            string `binding:"required" envconfig:"RMQ_CONN_URL"`
	RMQConsumeQ           string `binding:"required" envconfig:"RMQ_QUEUE_CONSUME"`
	RMQConsumeB           string `binding:"required" envconfig:"RMQ_BINDING_CONSUME"`
	RMQExchange           string `binding:"required" envconfig:"RMQ_EXCHANGE"`
	RMQConsumeQAutocreate bool   `binding:"required" envconfig:"RMQ_QUEUE_CONSUME_AUTOCREATE_DISABLED"`

	RMQNotifyExchange           string `binding:"required" envconfig:"RMQ_NOTIFY_EXCHANGE"`
	RMQNotifyRoutingKey         string `binding:"required" envconfig:"RMQ_NOTIFY_ROUTING_KEY"`
	RMQNotifyExchangeAutocreate bool   `binding:"required" envconfig:"RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED"`

	RedisAddr string `binding:"required" envconfig:"REDIS_ADDR"`

	GlobalRedisAddr string `binding:"required" envconfig:"GLOBAL_REDIS_ADDR"`
	GlobalRedisDB   int    `binding:"required" envconfig:"GLOBAL_REDIS_DB"`
}

func LoadConfig() Config {
	logLevel, _ := strconv.Atoi(os.Getenv("LOG_LEVEL"))

	return Config{
		LogLevel:  logLevel,
		HttpPort:  internal.ParseUint16(os.Getenv("HTTP_PORT"), 8080),
		SecretKey: utilx.GetenvDef("SECRET_KEY", "your-secret-key-here"),

		PostgresHost:            utilx.GetenvDef("POSTGRES_HOST", "host.docker.internal"),
		PostgresPort:            utilx.GetenvDef("POSTGRES_PORT", "5432"),
		PostgresDb:              utilx.GetenvDef("POSTGRES_DB", "axa_socialweb"),
		PostgresUser:            utilx.GetenvDef("POSTGRES_USER", "postgres"),
		PostgresPassword:        utilx.GetenvDef("POSTGRES_PASSWORD", "postgres"),
		PostgresMaxIdleConns:    internal.ParseInt(os.Getenv("POSTGRES_MAX_IDLE_CONNS"), 10),
		PostgresMaxOpenConns:    internal.ParseInt(os.Getenv("POSTGRES_MAX_OPEN_CONNS"), 100),
		PostgresConnMaxLifetime: internal.ParseDuration(os.Getenv("POSTGRES_CONN_MAX_LIFETIME"), 1*time.Hour),

		CdnPublicUrl: utilx.GetenvDef("CDN_PUBLIC_URL", "http://localhost:8080"),

		SessionIdRedisUrl: os.Getenv("SESSION_ID_REDIS_URL"),
		UserInfoRedisUrl:  os.Getenv("USER_INFO_REDIS_URL"),

		UserInfoKeyPrefix: utilx.GetenvDef("USER_INFO_KEY_PREFIX", "axasocweb:"),

		UserSessionTtl: time.Hour * 24,

		RMQConnUrl:            utilx.GetenvDef("RMQ_CONN_URL", "amqp://guest:guest@host.docker.internal:5672/"),
		RMQExchange:           GetenvDef("RMQ_EXCHANGE", "subscriptions"),
		RMQConsumeQ:           GetenvDef("RMQ_QUEUE_CONSUME", "SUBSCRIPTIONS_EVENTS_QUEUE"),
		RMQConsumeB:           GetenvDef("RMQ_BINDING_CONSUME", "subscriptions.*"),
		RMQConsumeQAutocreate: !internal.ParseBool(os.Getenv("RMQ_QUEUE_CONSUME_AUTOCREATE_DISABLED")),

		RMQNotifyExchange:           internal.Getenv("RMQ_NOTIFY_EXCHANGE", "notify"),
		RMQNotifyRoutingKey:         internal.Getenv("RMQ_NOTIFY_ROUTING_KEY", "notify.*"),
		RMQNotifyExchangeAutocreate: internal.ParseBool(internal.Getenv("RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED", "Y")),

		RedisAddr: utilx.GetenvDef("REDIS_ADDR", "host.docker.internal:6376"),
	}
}

func GetenvDef(envVariable string, defaultValue string) string {
	result := os.Getenv(envVariable)
	if result != "" {
		return result
	}
	return defaultValue
}
