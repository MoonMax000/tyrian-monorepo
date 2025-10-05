package translation

import (
	"fmt"
	"time"

	"github.com/Capstane/stream-media-service/internal"
	"github.com/Capstane/stream-media-service/internal/config"
	"github.com/Capstane/stream-media-service/internal/dto"
	"github.com/Capstane/stream-media-service/internal/queue"
	"github.com/google/uuid"
	"github.com/pion/webrtc/v4"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

const STREAM_KEY_LENGTH = 16
const TRANSLATIONS_PER_NODE = 100

type TranslationManager struct {
	cfg *config.Config

	translations      map[[STREAM_KEY_LENGTH]byte]TranslationControl
	translationsIndex map[string]TranslationControl

	statistics map[[STREAM_KEY_LENGTH]byte]*TranslationStatistics

	streamQueueConnector *queue.StreamQueueConnector
}

func NewTranslationManager(cfg *config.Config) TranslationControl {
	return &TranslationManager{
		cfg: cfg,

		translations:      make(map[[STREAM_KEY_LENGTH]byte]TranslationControl, TRANSLATIONS_PER_NODE),
		translationsIndex: make(map[string]TranslationControl, TRANSLATIONS_PER_NODE),

		statistics: make(map[[STREAM_KEY_LENGTH]byte]*TranslationStatistics, TRANSLATIONS_PER_NODE),

		streamQueueConnector: queue.NewStreamQueueConnector(cfg),
	}
}

func (manager *TranslationManager) StartNewTranslation(liveStreamMessage *dto.LiveStreamMessage) error {
	streamKey := [STREAM_KEY_LENGTH]byte(internal.AlignKey(liveStreamMessage.Params.Key, STREAM_KEY_LENGTH))
	userId := uuid.Max
	if liveStreamMessage.UserInfo != nil {
		userId = liveStreamMessage.UserInfo.UserId
	}

	if userId != uuid.Max {
		currentTranslationsKeys := [][16]byte{}
		for key, translationCtl := range manager.translations {
			streamerId := translationCtl.GetStreamerId()
			if *streamerId == userId {
				currentTranslationsKeys = append(currentTranslationsKeys, key)
			}
		}
		for _, key := range currentTranslationsKeys {
			translationCtl := manager.translations[key]
			manager.StopTranslation(&dto.LiveStreamMessage{
				Command:  dto.LiveStreamCommandStop,
				UserInfo: liveStreamMessage.UserInfo,
				Params: &dto.LiveStreamParams{
					Key: translationCtl.GetStreamKey(),
				},
			})
		}

	}

	translationCtl, ok := manager.translations[streamKey]
	encodedSuffix := internal.Suffix(liveStreamMessage.Params.TranslationUrl, "/")

	streamName := ""
	if liveStreamMessage.StreamName != nil {
		streamName = *liveStreamMessage.StreamName
	}
	translationUrl := ""
	if liveStreamMessage.Params != nil {
		translationUrl = liveStreamMessage.Params.TranslationUrl
	}
	var streamTags []string
	if liveStreamMessage.StreamTags != nil && len(*liveStreamMessage.StreamTags) > 0 {
		streamTags = make([]string, len(*liveStreamMessage.StreamTags))
		copy(streamTags, *liveStreamMessage.StreamTags)
	} else {
		streamTags = []string{}
	}
	streamCategory := ""
	if liveStreamMessage.StreamCategory != nil {
		streamCategory = *liveStreamMessage.StreamCategory
	}

	if !ok {
		translationCtl = NewWhipWhepTranslation(streamKey[:], encodedSuffix, userId, manager)
		manager.translations[streamKey] = translationCtl
		manager.translationsIndex[translationCtl.GetUniqueWhepLinkSuffix()] = translationCtl
	}
	oldEncodedSuffix := translationCtl.GetUniqueWhepLinkSuffix()
	if oldEncodedSuffix != encodedSuffix {
		translationCtl.SetUniqueWhepLinkSuffix(encodedSuffix)
		delete(manager.translationsIndex, oldEncodedSuffix)
		manager.translationsIndex[encodedSuffix] = translationCtl
	}

	statisticsEntry, ok := manager.statistics[streamKey]
	if !ok {
		manager.statistics[streamKey] = &TranslationStatistics{
			UserID:         userId,
			ViewersCount:   1,    // Streamer
			IsOnline:       true, // For avoid translation vanish (@see logic in recommendation service)
			StreamName:     streamName,
			StreamCategory: streamCategory,
			StreamTags:     streamTags,
			TranslationUrl: translationUrl,
		}
	} else {
		statisticsEntry.IsOnline = true
		statisticsEntry.StreamName = streamName
		statisticsEntry.TranslationUrl = translationUrl
	}

	err := translationCtl.StartNewTranslation(liveStreamMessage)
	if err != nil {
		return err
	}

	err = manager.streamQueueConnector.Push(
		&dto.LiveStreamStartMessage{
			UserID:     userId,
			StreamName: streamName,
			Params:     *liveStreamMessage.Params,
		},
		manager.cfg.RMQStreamOnLiveBroadcastRoutingKey,
	)
	if err != nil {
		return err
	}

	return nil
}

func (manager *TranslationManager) GetTranslation(streamKey []byte, viewerId *string) (TranslationControl, error) {
	alignedStreamKey := [STREAM_KEY_LENGTH]byte(internal.AlignKey(streamKey, STREAM_KEY_LENGTH))

	translationCtl, ok := manager.translations[alignedStreamKey]
	if !ok {
		return nil, fmt.Errorf("translation didn't find for stream key %v", streamKey)
	}

	return translationCtl, nil
}

func (manager *TranslationManager) StopTranslation(liveStreamMessage *dto.LiveStreamMessage) error {
	streamKey := [STREAM_KEY_LENGTH]byte(internal.AlignKey(liveStreamMessage.Params.Key, STREAM_KEY_LENGTH))

	translationCtl, ok := manager.translations[streamKey]
	if ok {

		streamerId := translationCtl.GetStreamerId()
		if streamerId == nil {
			streamerId = &uuid.Max
		}

		streamName := ""
		translationUrl := ""

		statisticsEntry, ok := manager.statistics[streamKey]
		if ok {
			streamName = statisticsEntry.StreamName
			translationUrl = statisticsEntry.TranslationUrl
		}

		encodedSuffix := translationCtl.GetUniqueWhepLinkSuffix()
		delete(manager.translations, streamKey)
		delete(manager.statistics, streamKey)
		delete(manager.translationsIndex, encodedSuffix)

		err := translationCtl.StopTranslation(liveStreamMessage)
		if err != nil {
			return err
		}

		return manager.sendStopTranslationEvent(*streamerId, streamName, translationUrl)
	}

	return nil
}

func (manager *TranslationManager) sendStopTranslationEvent(streamerId uuid.UUID, streamName string, translationUrl string) error {
	return manager.streamQueueConnector.Push(
		&dto.StreamStatusMessage{
			UserID:         streamerId,
			ViewerCount:    0,
			StreamName:     streamName,
			TranslationUrl: translationUrl,
			IsOnline:       false,
		},
		manager.cfg.RMQStreamOnLiveBroadcastRoutingKey,
	)
}

func (manager *TranslationManager) sendTranslationStatEvent(streamerId uuid.UUID, viewersCount int, isOnline bool, streamName string, streamCategory string, streamTags []string, translationUrl string) error {
	return manager.streamQueueConnector.Push(
		&dto.StreamStatusMessage{
			UserID:         streamerId,
			ViewerCount:    viewersCount,
			IsOnline:       isOnline,
			StreamName:     streamName,
			StreamCategory: streamCategory,
			StreamTags:     streamTags,
			TranslationUrl: translationUrl,
		},
		manager.cfg.RMQStreamOnLiveBroadcastStatusRoutingKey,
	)
}

func (manager *TranslationManager) GetUniqueWhepLinkSuffix() string {
	return ""
}

func (manager *TranslationManager) SetUniqueWhepLinkSuffix(encodedSuffix string) {
}

func (manager *TranslationManager) GetStreamKeyByEncodedSuffix(encodedSuffix string) ([]byte, error) {
	translationCtl, ok := manager.translationsIndex[encodedSuffix]
	if !ok {
		return nil, fmt.Errorf("translation not found by suffix: %v", encodedSuffix)
	}
	return translationCtl.GetStreamKeyByEncodedSuffix(encodedSuffix)
}

func (manager *TranslationManager) SendStatistics() {

	if manager.cfg.LogLevel <= int8(zerolog.DebugLevel) {
		debugMessage := "Stat:\n"
		for _, translationStat := range manager.statistics {

			debugMessage += fmt.Sprintf("%v,%v,%v\n",
				translationStat.UserID,
				translationStat.ViewersCount,
				translationStat.IsOnline,
			)
		}
		log.Debug().Msg(debugMessage)
	}

	for _, translationStat := range manager.statistics {
		err := manager.sendTranslationStatEvent(
			translationStat.UserID,
			translationStat.ViewersCount,
			translationStat.IsOnline,
			translationStat.StreamName,
			translationStat.StreamCategory,
			translationStat.StreamTags,
			translationStat.TranslationUrl,
		)
		if err != nil {
			log.Error().Msgf("send statistics event fail, cause %v", err)
		}
	}
}

func (manager *TranslationManager) KillDeadTranslations() {

	for streamKey, translationStat := range manager.statistics {

		if translationStat.AutoCloseAfter != nil && (*translationStat.AutoCloseAfter).Unix() < time.Now().Unix() {
			log.Debug().Msgf("Dead translation detected: userId [%v], streamKey [%v]", translationStat.UserID, internal.Base64EncodeKey(streamKey[:]))

			manager.StopTranslation(&dto.LiveStreamMessage{
				Command: dto.LiveStreamCommandStop,
				UserInfo: &dto.NotifyUserInfo{
					UserId: translationStat.UserID,
				},
				StreamName: &translationStat.StreamName,
				Params: &dto.LiveStreamParams{
					Key:            streamKey[:],
					TranslationUrl: translationStat.TranslationUrl,
				},
			})
		}
	}
}

func (manager *TranslationManager) OnOpenClientVideoStream(streamKey []byte, viewerId *string) {

}

func (manager *TranslationManager) OnOpenClientAudioStream(streamKey []byte, viewerId *string) {

}

func (manager *TranslationManager) OnCloseClientVideoStream(streamKey []byte, viewerId *string) {

}

func (manager *TranslationManager) OnCloseClientAudioStream(streamKey []byte, viewerId *string) {

}

func (manager *TranslationManager) OnOpenClientConnection(streamKey []byte, viewerId *string) {
	if streamKey == nil {
		return
	}

	log.Debug().Msgf("[OnOpenClientConnection] %v", internal.Base64EncodeKey(streamKey))
	alignedStreamKey := [STREAM_KEY_LENGTH]byte(internal.AlignKey(streamKey, STREAM_KEY_LENGTH))
	translationStat, ok := manager.statistics[alignedStreamKey]
	if !ok {
		log.Error().Msgf("[OnOpenClientConnection] statistics didn't find for stream key %v", streamKey)
	} else {
		// translationStat.ViewersCount++
		translationStat.ViewersCount++
	}
}

func (manager *TranslationManager) OnCloseClientConnection(streamKey []byte, viewerId *string) {
	if streamKey == nil {
		return
	}

	log.Debug().Msgf("[OnCloseClientConnection] %v", internal.Base64EncodeKey(streamKey))
	alignedStreamKey := [STREAM_KEY_LENGTH]byte(internal.AlignKey(streamKey, STREAM_KEY_LENGTH))
	translationStat, ok := manager.statistics[alignedStreamKey]
	if !ok {
		log.Error().Msgf("[OnCloseClientConnection] statistics didn't find for stream key %v", streamKey)
	} else {
		if translationStat.ViewersCount > 0 {
			translationStat.ViewersCount--
		}
	}
}

func (manager *TranslationManager) OnOpenStream(streamKey []byte) {
	log.Debug().Msgf("[OnOpenStream] %v", internal.Base64EncodeKey(streamKey))
	alignedStreamKey := [STREAM_KEY_LENGTH]byte(internal.AlignKey(streamKey, STREAM_KEY_LENGTH))
	translationStat, ok := manager.statistics[alignedStreamKey]
	if !ok {
		log.Error().Msgf("[OnOpenStream] statistics didn't find for stream key %v", streamKey)
	} else {
		translationStat.IsOnline = true
		translationStat.AutoCloseAfter = nil
		err := manager.sendTranslationStatEvent(translationStat.UserID,
			translationStat.ViewersCount,
			translationStat.IsOnline,
			translationStat.StreamName,
			translationStat.StreamCategory,
			translationStat.StreamTags,
			translationStat.TranslationUrl,
		)
		if err != nil {
			log.Error().Msgf("send statistics event fail, cause %v", err)
		}
	}
}

func (manager *TranslationManager) OnCloseStream(streamKey []byte) {
	log.Debug().Msgf("[OnCloseStream] %v", internal.Base64EncodeKey(streamKey))
	alignedStreamKey := [STREAM_KEY_LENGTH]byte(internal.AlignKey(streamKey, STREAM_KEY_LENGTH))
	translationStat, ok := manager.statistics[alignedStreamKey]
	if !ok {
		log.Error().Msgf("[OnCloseStream] statistics didn't find for stream key %v", streamKey)
	} else {
		translationLiveDeadline := time.Now().Add(manager.cfg.DeadTranslationTimeout)
		// Actualize translation status
		translationStat.IsOnline = false
		translationStat.AutoCloseAfter = &translationLiveDeadline
		err := manager.sendStopTranslationEvent(translationStat.UserID, translationStat.StreamName, translationStat.TranslationUrl)
		if err != nil {
			log.Error().Msgf("send stop translation event fail, cause %v", err)
		}
	}
}

func (manager *TranslationManager) GetStreamerId() *uuid.UUID {
	return nil
}

func (manager *TranslationManager) GetStreamKey() []byte {
	return nil
}

func (manager *TranslationManager) GetPeerConnection() *webrtc.PeerConnection {
	return nil
}

func (manager *TranslationManager) GetTracks() []*webrtc.TrackLocalStaticRTP {
	return nil
}

func (manager *TranslationManager) GetConfiguration() *webrtc.Configuration {
	return nil
}

func (manager *TranslationManager) SetOriginObsOffer(offer []byte) {
}

func (manager *TranslationManager) GetOriginObsOffer() []byte {
	return nil
}
