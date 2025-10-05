package config

import (
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/Capstane/AXA-socialweb-profile/internal"
	"github.com/Capstane/authlib/utilx"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog/log"
)

type Config struct {
	LogLevel    int      `default:"4" envconfig:"LOG_LEVEL"`
	HttpPort    uint16   `default:"8003" envconfig:"HTTP_PORT"`
	CorsOrigins []string `binding:"required" envconfig:"CORS_ORIGINS"`
	SecretKey   string   `binding:"required" envconfig:"SECRET_KEY"`

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

	RedisAddr string `binding:"required" envconfig:"REDIS_ADDR"`
	RedisDB   int    `binding:"required" envconfig:"REDIS_DB"`

	CdnPublicUrl        string `binding:"required" envconfig:"CDN_PUBLIC_URL"`
	S3AvatarsBucketName string `binding:"required" envconfig:"S3_AVATARS_BUCKET_NAME"`
	S3CoversBucketName  string `binding:"required" envconfig:"S3_COVERS_BUCKET_NAME"`
	S3Region            string `binding:"required" envconfig:"S3_REGION"`
	S3Endpoint          string `binding:"required" envconfig:"S3_ENDPOINT"`
	S3AccessKey         string `binding:"required" envconfig:"S3_ACCESS_KEY"`
	S3SecretAccessKey   string `binding:"required" envconfig:"S3_SECRET_ACCESS_KEY"`

	MaxFileUploadSizeInBytes int `default:"10485760" envconfig:"MAX_FILE_UPLOAD_SIZE"`

	RMQConnUrl            string `binding:"required" envconfig:"RMQ_CONN_URL"`
	RMQConsumeQ           string `binding:"required" envconfig:"RMQ_QUEUE_CONSUME"`
	RMQConsumeB           string `binding:"required" envconfig:"RMQ_BINDING_CONSUME"`
	RMQExchange           string `binding:"required" envconfig:"RMQ_EXCHANGE"`
	RMQConsumeQAutocreate bool   `binding:"required" envconfig:"RMQ_QUEUE_CONSUME_AUTOCREATE_DISABLED"`

	ChatServiceApiUrl string `binding:"required" envconfig:"CHAT_SERVICE_API_URL"`
}

func LoadConfig() Config {
	err := godotenv.Load()
	if err != nil {
		log.Debug().Msg("use process environment variables (i.e. not from .env)")
	}

	logLevel, _ := strconv.Atoi(os.Getenv("LOG_LEVEL"))

	return Config{
		LogLevel:    logLevel,
		HttpPort:    internal.ParseUint16(os.Getenv("HTTP_PORT"), 8003),
		CorsOrigins: strings.Split(os.Getenv("CORS_ORIGINS"), ","),
		SecretKey:   os.Getenv("SECRET_KEY"),

		PostgresHost:            os.Getenv("POSTGRES_HOST"),
		PostgresPort:            os.Getenv("POSTGRES_PORT"),
		PostgresDb:              os.Getenv("POSTGRES_DB"),
		PostgresUser:            os.Getenv("POSTGRES_USER"),
		PostgresPassword:        os.Getenv("POSTGRES_PASSWORD"),
		PostgresMaxIdleConns:    internal.ParseInt(os.Getenv("POSTGRES_MAX_IDLE_CONNS"), 10),
		PostgresMaxOpenConns:    internal.ParseInt(os.Getenv("POSTGRES_MAX_OPEN_CONNS"), 100),
		PostgresConnMaxLifetime: internal.ParseDuration(os.Getenv("POSTGRES_CONN_MAX_LIFETIME"), 1*time.Hour),

		SessionIdRedisUrl: os.Getenv("SESSION_ID_REDIS_URL"),
		UserInfoRedisUrl:  os.Getenv("USER_INFO_REDIS_URL"),

		UserInfoKeyPrefix: utilx.GetenvDef("USER_INFO_KEY_PREFIX", "axasocweb:"),

		UserSessionTtl: time.Hour * 24,

		RedisAddr: os.Getenv("REDIS_ADDR"),
		RedisDB:   internal.ParseInt(os.Getenv("REDIS_DB"), 0),

		CdnPublicUrl:        os.Getenv("CDN_PUBLIC_URL"),
		S3AvatarsBucketName: os.Getenv("S3_AVATARS_BUCKET_NAME"),
		S3CoversBucketName:  os.Getenv("S3_COVERS_BUCKET_NAME"),
		S3Region:            os.Getenv("S3_REGION"),
		S3Endpoint:          os.Getenv("S3_ENDPOINT"),
		S3AccessKey:         os.Getenv("S3_ACCESS_KEY"),
		S3SecretAccessKey:   os.Getenv("S3_SECRET_ACCESS_KEY"),

		MaxFileUploadSizeInBytes: internal.ParseInt(os.Getenv("MAX_FILE_UPLOAD_SIZE"), 10485760),

		RMQConnUrl:            os.Getenv("RMQ_CONN_URL"),
		RMQConsumeQ:           os.Getenv("RMQ_QUEUE_CONSUME"),
		RMQConsumeB:           internal.Getenv("RMQ_BINDING_CONSUME", "notify.*"),
		RMQExchange:           internal.Getenv("RMQ_EXCHANGE", "notify"),
		RMQConsumeQAutocreate: !internal.ParseBool(os.Getenv("RMQ_QUEUE_CONSUME_AUTOCREATE_DISABLED")),

		ChatServiceApiUrl: os.Getenv("CHAT_SERVICE_API_URL"),
	}
}
