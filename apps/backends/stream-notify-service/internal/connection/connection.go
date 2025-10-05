package connection

import (
	"encoding/json"

	"github.com/Capstane/stream-notify-service/internal"
	"github.com/Capstane/stream-notify-service/internal/config"
	"github.com/Capstane/stream-notify-service/internal/database"
	"github.com/Capstane/stream-notify-service/internal/model"
	"github.com/Capstane/stream-notify-service/internal/redis_notifications"
	"github.com/Capstane/stream-notify-service/internal/types"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/rs/zerolog/log"
)

func NewConnection(ws *websocket.Conn, userID string, cfg *config.Config) {
	filter, _ := redis_notifications.GetFiltersFromRedis(userID)

	// Если в Redis нет — получаем из БД и сохраняем в Redis
	if filter == nil {
		dbFilter, err := database.DB.GetFilters(userID)
		if err != nil {
			log.Warn().Msgf("[NewConnection] Failed to get filters for user %s: %v", userID, err)
		} else {
			redis_notifications.SaveFiltersToRedis(userID, dbFilter)
			filter = dbFilter
		}
	}

	data, err := redis_notifications.GetNotifications(userID)
	if err != nil {
		log.Error().Msgf("[NewConnection] Error getting notifications: %v", err)
		return
	}

	notifyClients(data, ws, filter)

	redis_notifications.SubscribeToRedisChannel(userID, ws)

	go handleIncomingMessages(ws, userID)
}

func notifyClients(data []map[string]interface{}, ws *websocket.Conn, filter *model.FilterNotification) {
	for _, notification := range data {
		messageMap, ok := notification["message"].(map[string]interface{})
		if !ok {
			continue
		}

		msgType, ok := messageMap["type"].(string)
		if !ok {
			continue
		}

		if !internal.IsAllowed(msgType, filter) {
			continue
		}

		jsonData, _ := json.Marshal(notification)
		if err := ws.WriteMessage(websocket.TextMessage, jsonData); err != nil {
			log.Warn().Msgf("[notifyClients] Error sending historical message: %v", err)
			break
		}
	}
}

func handleIncomingMessages(ws *websocket.Conn, userUUID string) {
	defer ws.Close()

	for {
		messageType, message, err := ws.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Error().Msgf("WebSocket read error: %v", err)
			}
			break
		}

		if messageType == websocket.TextMessage {

			log.Info().Msgf("[handleIncomingMessages] Received message from: %s: %s", userUUID, string(message))

			var rawMsg map[string]interface{}
			if err := json.Unmarshal(message, &rawMsg); err != nil {
				log.Error().Msgf("[handleIncomingMessages] error unmarshalling to map: %v", err)
				return
			}

			msgType, ok := rawMsg["type"].(string)
			if !ok {
				log.Error().Msg("[handleIncomingMessages] missing or invalid 'type' field")
				return
			}

			switch msgType {
			case "filters":
				filters := &types.Filters{}
				if err := json.Unmarshal(message, filters); err != nil {
					log.Error().Msgf("[handleIncomingMessages] error unmarshal Filters: %v", err)
					continue
				}
				database.DB.SaveFilters(userUUID, filters)

				dbFilter, err := database.DB.GetFilters(userUUID)
				if err != nil {
					log.Warn().Msgf("[handleIncomingMessages] Failed to reload filters for user %s: %v", userUUID, err)
				} else {
					redis_notifications.SaveFiltersToRedis(userUUID, dbFilter)
				}

			case "lasttime":
				lasttime := &types.LastTime{}
				if err := json.Unmarshal(message, lasttime); err != nil {
					log.Error().Msgf("[handleIncomingMessages] error unmarshal LastTime: %v", err)
					return
				}
				database.DB.SaveLastTime(userUUID, lasttime.Value)

			case "markread":

				// Помечаем уведомление прочитанным
				notifilist := &types.NotifyList{}
				if err := json.Unmarshal(message, &notifilist); err == nil && len(notifilist.Notifi) > 0 {
					valid := make([]string, 0, len(notifilist.Notifi))
					for _, id := range notifilist.Notifi {
						if _, err := uuid.Parse(id); err == nil {
							valid = append(valid, id)
						}
					}

					if len(valid) > 0 {
						n, updErr := redis_notifications.MarkNotificationsRead(userUUID, valid)
						if updErr != nil {
							log.Warn().Msgf("[handleIncomingMessages] Bulk mark read error for %s: %v", userUUID, updErr)
						} else {
							log.Info().Msgf("[handleIncomingMessages] Marked %d notifications as read for %s", n, userUUID)
						}
						continue
					}
				}
			default:
				log.Warn().Msgf("[handleIncomingMessages] unknown message type: %s", msgType)
			}
		}
	}
}
