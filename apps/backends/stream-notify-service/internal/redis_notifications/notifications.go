package redis_notifications

import (
	"context"
	"encoding/json"

	"github.com/Capstane/stream-notify-service/internal"
	"github.com/Capstane/stream-notify-service/internal/config"
	"github.com/Capstane/stream-notify-service/internal/model"
	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/rs/zerolog/log"
)

var rds *redis.Client
var ctx = context.Background()

// how many log lines to buffer for the scrollback
const CHATLOGLINES = 150

func InitRedis(cfg *config.Config) {
	rds = redis.NewClient(&redis.Options{
		Addr:     cfg.RedisAddress,
		Password: "",
		DB:       0,
		PoolSize: 50,
	})

	if err := rds.Ping(ctx).Err(); err != nil {
		log.Fatal().Msgf("[InitRedis] [notifications] Error initializing Redis connection: %s", err)
	}
}

// Сохраняет новое уведомление для пользователя
func SaveNotification(typeNotify string, userID string, timestamp int64, message interface{}, targetUserId string) error {
	log.Info().Msgf("[SaveNotification] Input type notification: %s", typeNotify)

	key := "user:" + userID

	value := map[string]interface{}{
		"id":           uuid.New(),
		"timestamp":    timestamp,
		"message":      message,
		"targetUserId": targetUserId,
		"status":       "unread",
	}
	jsonValue, err := json.Marshal(value)
	if err != nil {
		log.Error().Msgf("[SaveNotification] [notifications] Error marshaling notification: %v", err)
		return err
	}

	if err := rds.ZAdd(ctx, key, &redis.Z{Score: float64(timestamp), Member: jsonValue}).Err(); err != nil {
		log.Error().Msgf("[SaveNotification] [notifications] Error adding notification to Redis: %v", err)
		return err
	}

	if err := rds.ZRemRangeByRank(ctx, key, 0, -int64(CHATLOGLINES+1)).Err(); err != nil {
		log.Warn().Msgf("[SaveNotification] [notifications] Error trimming notifications: %v", err)
	}

	channel := "notifications:" + userID
	if err := rds.Publish(ctx, channel, jsonValue).Err(); err != nil {
		log.Warn().Msgf("[SaveNotification] [notifications] Error publishing notification to channel: %v", err)
	}

	return nil
}

// Получает все непрочитанные уведомления пользователя
func GetNotifications(userID string) ([]map[string]interface{}, error) {
	key := "user:" + userID

	results, err := rds.ZRange(ctx, key, 0, -1).Result()
	if err != nil {
		log.Error().Msgf("[GetNotifications] [notifications] Error fetching notifications from Redis: %v", err)
		return nil, err
	}

	var notifications []map[string]interface{}
	for _, result := range results {
		var notification map[string]interface{}
		if err := json.Unmarshal([]byte(result), &notification); err != nil {
			log.Warn().Msgf("[GetNotifications] [notifications] Error parsing notification: %v", err)
			continue
		}
		if status, _ := notification["status"].(string); status == "unread" {
			notifications = append(notifications, notification)
		}
	}

	return notifications, nil
}

// Подписываемся на канал Redis для получения новых уведомлений
func SubscribeToRedisChannel(userID string, ws *websocket.Conn) {
	channel := "notifications:" + userID
	pubSub := rds.Subscribe(ctx, channel)

	go func() {
		defer ws.Close()

		ch := pubSub.Channel()
		for msg := range ch {
			if msg.Channel != channel {
				continue
			}

			var notification map[string]interface{}
			if err := json.Unmarshal([]byte(msg.Payload), &notification); err != nil {
				log.Warn().Msgf("[SubscribeToRedisChannel] Error parsing notification: %v", err)
				continue
			}

			messageMap, ok := notification["message"].(map[string]interface{})
			if !ok {
				continue
			}

			msgType, ok := messageMap["type"].(string)
			if !ok {
				continue
			}

			// Получаем фильтр из Redis
			filter, err := GetFiltersFromRedis(userID)
			if err != nil || filter == nil {
				log.Warn().Msgf("[SubscribeToRedisChannel] No filters found in cache for user %s", userID)
				// Ниже коммент пропускает даже если в бд нет фильтров
				// continue
			}

			if !internal.IsAllowed(msgType, filter) {
				continue
			}

			if err := ws.WriteMessage(websocket.TextMessage, []byte(msg.Payload)); err != nil {
				log.Warn().Msgf("[SubscribeToRedisChannel] Error sending message to client: %v", err)
				break
			}
		}

		log.Info().Msgf("[SubscribeToRedisChannel] Stopped listening for user: %s", userID)
	}()
}

func SaveFiltersToRedis(userID string, filter *model.FilterNotification) error {
	key := "filters:" + userID

	data, err := json.Marshal(filter)
	if err != nil {
		log.Error().Msgf("[SaveFiltersToRedis] Error marshaling filter: %v", err)
		return err
	}

	err = rds.Set(ctx, key, data, 0).Err()
	if err != nil {
		log.Error().Msgf("[SaveFiltersToRedis] Error saving filter to Redis: %v", err)
	}

	log.Info().Msgf("[SaveFiltersToRedis] save filters to redis: %s", userID)

	return err
}

func GetFiltersFromRedis(userID string) (*model.FilterNotification, error) {
	key := "filters:" + userID

	data, err := rds.Get(ctx, key).Bytes()
	if err == redis.Nil {
		return nil, nil // Кэша нет
	} else if err != nil {
		log.Warn().Msgf("[GetFiltersFromRedis] Error fetching filters from Redis: %v", err)
		return nil, err
	}

	var filter model.FilterNotification
	if err := json.Unmarshal(data, &filter); err != nil {
		log.Warn().Msgf("[GetFiltersFromRedis] Error unmarshalling filters: %v", err)
		return nil, err
	}

	log.Info().Msgf("[GetFiltersFromRedis] get filters from redis: %s", userID)

	return &filter, nil
}

// Пометить как прочитанное
func MarkNotificationsRead(userID string, notificationIDs []string) (int, error) {
	key := "user:" + userID

	// дедупликация входных id
	idSet := make(map[string]struct{}, len(notificationIDs))
	for _, s := range notificationIDs {
		if s == "" {
			continue
		}
		idSet[s] = struct{}{}
	}
	if len(idSet) == 0 {
		return 0, nil
	}

	var updatedCount int
	var payloads [][]byte

	err := rds.Watch(ctx, func(tx *redis.Tx) error {
		items, err := tx.ZRangeWithScores(ctx, key, 0, -1).Result()
		if err != nil {
			return err
		}

		oldMembers := make([]interface{}, 0, len(idSet))
		newEntries := make([]*redis.Z, 0, len(idSet))

		for _, z := range items {
			memberStr, ok := z.Member.(string)
			if !ok {
				if b, ok2 := z.Member.([]byte); ok2 {
					memberStr = string(b)
				} else {
					continue
				}
			}

			var notif map[string]interface{}
			if err := json.Unmarshal([]byte(memberStr), &notif); err != nil {
				continue
			}

			idStr, _ := notif["id"].(string)
			if _, need := idSet[idStr]; !need {
				continue
			}

			if statusStr, _ := notif["status"].(string); statusStr == "read" {
				// уже прочитано — пропускаем
				delete(idSet, idStr)
				continue
			}

			notif["status"] = "read"

			b, err := json.Marshal(notif)
			if err != nil {
				return err
			}

			oldMembers = append(oldMembers, memberStr)
			newEntries = append(newEntries, &redis.Z{Score: z.Score, Member: b})
			payloads = append(payloads, b)
			updatedCount++
			delete(idSet, idStr)
			if len(idSet) == 0 {
				break
			}
		}

		if updatedCount == 0 {
			return nil
		}

		pipe := tx.TxPipeline()
		pipe.ZRem(ctx, key, oldMembers...)
		pipe.ZAdd(ctx, key, newEntries...)
		_, err = pipe.Exec(ctx)
		if err != nil {
			return err
		}

		return nil
	}, key)

	if err != nil {
		return 0, err
	}

	// оповестим подписчиков о каждом обновлении
	if updatedCount > 0 {
		channel := "notifications:" + userID
		for _, p := range payloads {
			_ = rds.Publish(ctx, channel, p).Err()
		}
	}

	return updatedCount, nil
}
