package config

import (
	"os"
	"strconv"

	"github.com/Capstane/stream-chat-service/internal"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog/log"
)

type Config struct {
	LogLevel int    `default:"4" envconfig:"LOG_LEVEL"`
	HttpPort uint16 `default:"1119" envconfig:"HTTP_PORT"`

	RMQConnUrl            string `binding:"required" envconfig:"RMQ_CONN_URL"`
	RMQConsumeQ           string `binding:"required" envconfig:"RMQ_QUEUE_CONSUME"`
	RMQConsumeB           string `binding:"required" envconfig:"RMQ_BINDING_CONSUME"`
	RMQExchange           string `binding:"required" envconfig:"RMQ_EXCHANGE"`
	RMQConsumeQAutocreate bool   `binding:"required" envconfig:"RMQ_QUEUE_CONSUME_AUTOCREATE_DISABLED"`

	PostgresHost     string `binding:"required" envconfig:"POSTGRES_HOST"`
	PostgresPort     uint16 `binding:"required" envconfig:"POSTGRES_PORT"`
	PostgresDb       string `binding:"required" envconfig:"POSTGRES_DB"`
	PostgresUser     string `binding:"required" envconfig:"POSTGRES_USER"`
	PostgresPassword string `binding:"required" envconfig:"POSTGRES_PASSWORD"`

	Debug             string `binding:"required" envconfig:"DEBUG"`
	Listenaddress     string `binding:"required" envconfig:"LISTENADDRESS"`
	Maxprocesses      int    `binding:"required" envconfig:"MAXPROCESSES"`
	Chatdelay         string `binding:"required" envconfig:"CHATDELAY"`
	Maxthrottletime   string `binding:"required" envconfig:"MAXTHROTTLETIME"`
	Allowedoriginhost string `binding:"required" envconfig:"ALLOWEDORIGINHOST"`

	ApiUrl string `binding:"required" envconfig:"API_URL"`
	ApiKey string `binding:"required" envconfig:"API_KEY"`

	RedisAddress  string `binding:"required" envconfig:"REDIS_ADDRESS"`
	RedisDatabase int64  `binding:"required" envconfig:"REDIS_DATABASE"`
	RedisPassword string `binding:"required" envconfig:"REDIS_PASSWORD"`

	SessionIdRedisUrl string `binding:"required" envconfig:"GLOBAL_REDIS_URL"`

	RMQNotifyExchange string `binding:"required" envconfig:"RMQ_NOTIFY_EXCHANGE"`

	UserInfoKeyPrefix string `binding:"required" envconfig:"USER_INFO_KEY_PREFIX"`
}

func LoadConfig() Config {
	err := godotenv.Load()
	if err != nil {
		log.Error().Msgf("Error loading .env file")
	}

	logLevel, _ := strconv.Atoi(os.Getenv("LOG_LEVEL"))

	return Config{
		LogLevel: logLevel,
		HttpPort: internal.ParseUint16(os.Getenv("HTTP_PORT"), 1119),

		RMQConnUrl:            os.Getenv("RMQ_CONN_URL"),
		RMQConsumeQ:           os.Getenv("RMQ_QUEUE_CONSUME"),
		RMQConsumeB:           os.Getenv("RMQ_BINDING_CONSUME"),
		RMQExchange:           os.Getenv("RMQ_EXCHANGE"),
		RMQConsumeQAutocreate: !internal.ParseBool(os.Getenv("RMQ_QUEUE_CONSUME_AUTOCREATE_DISABLED")),

		PostgresHost:     os.Getenv("POSTGRES_HOST"),
		PostgresPort:     internal.ParseUint16(os.Getenv("POSTGRES_PORT"), 5433),
		PostgresDb:       os.Getenv("POSTGRES_DB"),
		PostgresUser:     os.Getenv("POSTGRES_USER"),
		PostgresPassword: os.Getenv("POSTGRES_PASSWORD"),

		Debug:             (os.Getenv("DEBUG")),
		Listenaddress:     (os.Getenv("LISTENADDRESS")),
		Maxprocesses:      internal.ParseInt(os.Getenv("MAXPROCESSES"), 0),
		Chatdelay:         (os.Getenv("CHATDELAY")),
		Maxthrottletime:   (os.Getenv("MAXTHROTTLETIME")),
		Allowedoriginhost: GetenvWithDefaultValue("ALLOWEDORIGINHOST", "*"),

		ApiUrl: (os.Getenv("API_URL")),
		ApiKey: (os.Getenv("API_KEY")),

		RedisAddress:  GetenvWithDefaultValue("REDIS_ADDRESS", "10.166.44.41:6379"),
		RedisDatabase: internal.ParseInt64(os.Getenv("REDIS_DATABASE"), 1),
		RedisPassword: (os.Getenv("REDIS_PASSWORD")),

		SessionIdRedisUrl: GetenvWithDefaultValue("GLOBAL_REDIS_URL", "redis://94.26.248.225:6380"),

		RMQNotifyExchange: GetenvWithDefaultValue("RMQ_NOTIFY_EXCHANGE", "notify"),

		UserInfoKeyPrefix: GetenvWithDefaultValue("USER_INFO_KEY_PREFIX", "streaming:"),
	}
}

func GetenvWithDefaultValue(environmentVariableName string, environmentVariableDefaultValue string) string {
	value := os.Getenv(environmentVariableName)
	if value == "" {
		return environmentVariableDefaultValue
	}
	return value
}

func GetenvWithDefaultValueConst(environmentVariableName string, environmentVariableDefaultValue string) string {
	value := os.Getenv(environmentVariableName)
	log.Debug().Msgf("[GetenvWithDefaultValueConst] REDIS_ADDRESS: %s", value)
	if value == "" {
		return environmentVariableDefaultValue
	}
	return environmentVariableDefaultValue
}
