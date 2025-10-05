package database

import (
	"context"

	"github.com/Capstane/stream-auth-service/internal/config"
	"github.com/go-redis/redis/v8"
	"github.com/rs/zerolog/log"
)

func InitRedis(cfg config.Config) (*redis.Client, error) {
	log.Debug().Msgf("[InitRedis] cfg.RedisUrl: %s", cfg.UserInfoRedisUrl)

	redisOptions, err := redis.ParseURL(cfg.UserInfoRedisUrl)
	if err != nil {
		return nil, err
	}
	redisClient := redis.NewClient(redisOptions)

	if _, err := redisClient.Ping(context.Background()).Result(); err != nil {
		return nil, err
	}
	return redisClient, nil
}
