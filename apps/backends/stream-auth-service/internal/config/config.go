package config

import (
	"os"
	"strconv"
	"time"

	"github.com/Capstane/authlib/utilx"
	"github.com/gofiber/fiber/v2/log"
	"github.com/joho/godotenv"
)

type Config struct {
	LogLevel                           int    `default:"4" envconfig:"LOG_LEVEL"`
	HttpPort                           uint16 `default:"8002" envconfig:"HTTP_PORT"`
	SecretKey                          string `binding:"required" envconfig:"SECRET_KEY"`
	PublicEmailConfirmationUrl         string `binding:"required" envconfig:"PUBLIC_EMAIL_CONFIRMATION_URL"`
	PublicPasswordResetConfirmationUrl string `binding:"required" envconfig:"PUBLIC_PASSWORD_RESET_CONFIRMATION_URL"`
	PublicUrl                          string `binding:"required" envconfig:"PUBLIC_URL"`
	PublicErrorUrl                     string `binding:"required" envconfig:"PUBLIC_ERROR_URL"`

	PostgresHost            string        `binding:"required" envconfig:"POSTGRES_HOST"`
	PostgresPort            string        `binding:"required" envconfig:"POSTGRES_PORT"`
	PostgresDb              string        `binding:"required" envconfig:"POSTGRES_DB"`
	PostgresUser            string        `binding:"required" envconfig:"POSTGRES_USER"`
	PostgresPassword        string        `binding:"required" envconfig:"POSTGRES_PASSWORD"`
	PostgresMaxIdleConns    int           `default:"10" envconfig:"POSTGRES_MAX_IDLE_CONNS"`
	PostgresMaxOpenConns    int           `default:"100" envconfig:"POSTGRES_MAX_OPEN_CONNS"`
	PostgresConnMaxLifetime time.Duration `default:"1h" envconfig:"POSTGRES_CONN_MAX_LIFETIME"`

	SessionIdRedisUrl string `binding:"required" envconfig:"SESSION_ID_REDIS_URL"`
	UserInfoRedisUrl  string `binding:"required" envconfig:"USER_INFO_REDIS_URL"`
	UserInfoKeyPrefix string `binding:"required" envconfig:"USER_INFO_KEY_PREFIX"`

	UserSessionTtl time.Duration

	UserServiceBaseUrl string `binding:"required" envconfig:"USER_SERVICE_BASE_URL"`

	RMQConnUrl                  string `binding:"required" envconfig:"RMQ_CONN_URL"`
	RMQMailExchange             string `binding:"required" envconfig:"RMQ_MAIL_EXCHANGE"`
	RMQMailExchangeAutocreate   bool   `binding:"required" envconfig:"RMQ_MAIL_EXCHANGE_AUTOCREATE_ENABLED"`
	RMQNotifyExchange           string `binding:"required" envconfig:"RMQ_NOTIFY_EXCHANGE"`
	RMQNotifyExchangeAutocreate bool   `binding:"required" envconfig:"RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED"`

	RedisAddr string `binding:"required" envconfig:"REDIS_ADDR"`

	CdnPublicUrl        string `binding:"required" envconfig:"CDN_PUBLIC_URL"`
	S3AvatarsBucketName string `binding:"required" envconfig:"S3_AVATARS_BUCKET_NAME"`
	S3CoversBucketName  string `binding:"required" envconfig:"S3_COVERS_BUCKET_NAME"`
	S3Region            string `binding:"required" envconfig:"S3_REGION"`
	S3Endpoint          string `binding:"required" envconfig:"S3_ENDPOINT"`
	S3AccessKey         string `binding:"required" envconfig:"S3_ACCESS_KEY"`
	S3SecretAccessKey   string `binding:"required" envconfig:"S3_SECRET_ACCESS_KEY"`

	MaxFileUploadSizeInBytes int `default:"10485760" envconfig:"MAX_FILE_UPLOAD_SIZE"`

	GlobalRMQConnUrl             string `binding:"required" envconfig:"GLOBAL_RMQ_CONN_URL"`
	RMQStreamerRequestRoutingKey string `binding:"required" envconfig:"RMQ_STREAM_REQUEST_ROUTING_KEY"`
}

func LoadConfig() Config {
	err := godotenv.Load()
	if err != nil {
		log.Debug("use process environment variables (i.e. not from .env)")
	}

	logLevel, _ := strconv.Atoi(os.Getenv("LOG_LEVEL"))

	return Config{
		LogLevel:                           logLevel,
		HttpPort:                           utilx.ParseUint16(os.Getenv("HTTP_PORT"), 8002),
		SecretKey:                          os.Getenv("SECRET_KEY"),
		PublicEmailConfirmationUrl:         os.Getenv("PUBLIC_EMAIL_CONFIRMATION_URL"),
		PublicPasswordResetConfirmationUrl: os.Getenv("PUBLIC_PASSWORD_RESET_CONFIRMATION_URL"),
		PublicUrl:                          os.Getenv("PUBLIC_URL"),
		PublicErrorUrl:                     os.Getenv("PUBLIC_ERROR_URL"),

		PostgresHost:            os.Getenv("POSTGRES_HOST"),
		PostgresPort:            os.Getenv("POSTGRES_PORT"),
		PostgresDb:              os.Getenv("POSTGRES_DB"),
		PostgresUser:            os.Getenv("POSTGRES_USER"),
		PostgresPassword:        os.Getenv("POSTGRES_PASSWORD"),
		PostgresMaxIdleConns:    utilx.ParseInt(os.Getenv("POSTGRES_MAX_IDLE_CONNS"), 10),
		PostgresMaxOpenConns:    utilx.ParseInt(os.Getenv("POSTGRES_MAX_OPEN_CONNS"), 100),
		PostgresConnMaxLifetime: utilx.ParseDuration(os.Getenv("POSTGRES_CONN_MAX_LIFETIME"), 1*time.Hour),

		SessionIdRedisUrl: os.Getenv("SESSION_ID_REDIS_URL"),
		UserInfoRedisUrl:  os.Getenv("USER_INFO_REDIS_URL"),
		UserInfoKeyPrefix: utilx.GetenvDef("USER_INFO_KEY_PREFIX", "streaming:"),

		UserSessionTtl: time.Hour * 24,

		UserServiceBaseUrl: utilx.GetenvDef("USER_SERVICE_BASE_URL", "http://31.131.255.218:8080/api"),

		RMQConnUrl:                  os.Getenv("RMQ_CONN_URL"),
		RMQMailExchange:             os.Getenv("RMQ_MAIL_EXCHANGE"),
		RMQMailExchangeAutocreate:   utilx.ParseBool(os.Getenv("RMQ_MAIL_EXCHANGE_AUTOCREATE_ENABLED")),
		RMQNotifyExchange:           os.Getenv("RMQ_NOTIFY_EXCHANGE"),
		RMQNotifyExchangeAutocreate: utilx.ParseBool(os.Getenv("RMQ_NOTIFY_EXCHANGE_AUTOCREATE_ENABLED")),

		RedisAddr: os.Getenv("REDIS_ADDR"),

		CdnPublicUrl:        os.Getenv("CDN_PUBLIC_URL"),
		S3AvatarsBucketName: os.Getenv("S3_AVATARS_BUCKET_NAME"),
		S3CoversBucketName:  os.Getenv("S3_COVERS_BUCKET_NAME"),
		S3Region:            os.Getenv("S3_REGION"),
		S3Endpoint:          os.Getenv("S3_ENDPOINT"),
		S3AccessKey:         os.Getenv("S3_ACCESS_KEY"),
		S3SecretAccessKey:   os.Getenv("S3_SECRET_ACCESS_KEY"),

		MaxFileUploadSizeInBytes: utilx.ParseInt(os.Getenv("MAX_FILE_UPLOAD_SIZE"), 10485760),

		GlobalRMQConnUrl:             os.Getenv("GLOBAL_RMQ_CONN_URL"),
		RMQStreamerRequestRoutingKey: GetenvWithDefaultValue("RMQ_STREAM_REQUEST_ROUTING_KEY", "streaming_incoming"),
	}
}

func GetenvWithDefaultValue(environmentVariableName string, environmentVariableDefaultValue string) string {
	value := os.Getenv(environmentVariableName)
	if value == "" {
		return environmentVariableDefaultValue
	}
	return value
}
