package chatmanagement

import (
	"github.com/Capstane/stream-chat-service/internal"
	"github.com/Capstane/stream-chat-service/internal/config"
	"github.com/Capstane/stream-chat-service/internal/connection"
	"github.com/Capstane/stream-chat-service/internal/database"
	"github.com/Capstane/stream-chat-service/internal/namecache"
	"github.com/Capstane/stream-chat-service/internal/storage"
	"github.com/Capstane/stream-chat-service/internal/user"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

func ChatManagement(StreamOwner string, StreamUrl string, stateChat string, cfg *config.Config) {
	adminid, err := uuid.Parse(StreamOwner)
	if err != nil {
		log.Error().Msgf("[chatManagement] [chat_management] Invalid parsedUUID: %v", err)
	}

	// init admin
	database.DB.InitAdminStream(adminid)

	_, exists := connection.GetHubByID(StreamUrl)
	switch stateChat {
	case internal.STATUSSTART:
		if !exists {
			log.Info().Msgf("Starting chat with ID: %s", StreamUrl)

			// init streamOwnerToChat
			storage.StreamOwnerToChat[StreamUrl] = adminid

			database.DB.CreateHistoryTable(StreamOwner)

			// init hub
			connection.InitHub(StreamUrl)
			connection.InitBroadcast(cfg.RedisDatabase, StreamUrl)
			connection.InitBans(cfg.RedisDatabase, StreamUrl, adminid)
			user.InitUsers(cfg.RedisDatabase, StreamUrl)
			namecache.InitNamesCache(StreamUrl)
		}
	case internal.STATUSSTOP:
		if exists {
			log.Info().Msgf("Stopping chat with ID: %s", StreamUrl)

			// remove streamOwnerToChat
			delete(storage.StreamOwnerToChat, StreamUrl)

			// remove hub
			connection.RemoveHub(StreamUrl)
		}
	default:
		log.Warn().Msgf("[chatManagement] Unknown command: %s", stateChat)
	}
}
