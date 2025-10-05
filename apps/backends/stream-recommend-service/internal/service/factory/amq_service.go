package factory

import (
	"encoding/json"
	"fmt"
	"os"
	"os/signal"
	"sort"
	"strings"
	"sync"
	"syscall"
	"time"

	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
	"gorm.io/gorm"

	"github.com/Capstane/stream-recommend-service/internal/config"
	"github.com/Capstane/stream-recommend-service/internal/dto"
	"github.com/Capstane/stream-recommend-service/internal/model"
	"github.com/Capstane/stream-recommend-service/internal/service"
	"github.com/Capstane/stream-recommend-service/internal/types"

	"github.com/rs/zerolog/log"
)

type AmqService struct {
	mu           sync.RWMutex
	streamStates map[uuid.UUID]*types.StreamData
	uniqueTags   map[string]struct{} // Множество уникальных тегов (set)
	rabbitMQConn *amqp.Connection
	rabbitMQChan *amqp.Channel
	cfg          *config.Config
	db           *gorm.DB
}

var (
	amqServiceInstanceLock = &sync.Mutex{}
	amqServiceInstance     *AmqService
)

func NewAmqService(db *gorm.DB, cfg *config.Config) (*AmqService, error) {
	if amqServiceInstance == nil {
		amqServiceInstanceLock.Lock()
		defer amqServiceInstanceLock.Unlock()
		if amqServiceInstance == nil {
			amqServiceInstance = &AmqService{
				streamStates: make(map[uuid.UUID]*types.StreamData),
				uniqueTags:   make(map[string]struct{}),
				cfg:          cfg,
				db:           db,
			}
		}
	}
	return amqServiceInstance, nil
}

func (amqService *AmqService) listenQueue() error {
	conn, err := amqp.Dial(amqService.cfg.RMQConnUrl)
	if err != nil {
		return err
	}

	ch, err := conn.Channel()
	if err != nil {
		conn.Close()
		return err
	}

	amqService.rabbitMQChan = ch
	amqService.rabbitMQConn = conn

	if err := amqService.setupRabbitMQ(); err != nil {
		ch.Close()
		conn.Close()
		return err
	}

	go amqService.startStreamTimeoutChecker()
	amqService.consumeMessages()
	return nil
}

func (amqService *AmqService) setupRabbitMQ() error {
	err := amqService.rabbitMQChan.ExchangeDeclare(
		amqService.cfg.RMQExchange,
		"fanout",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	_, err = amqService.rabbitMQChan.QueueDeclare(
		amqService.cfg.RMQConsumeQ,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	// Bind to stream start events
	err = amqService.rabbitMQChan.QueueBind(
		amqService.cfg.RMQConsumeQ,
		"stream.OnLiveBroadcast",
		amqService.cfg.RMQExchange,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	// Bind to stream status events
	return amqService.rabbitMQChan.QueueBind(
		amqService.cfg.RMQConsumeQ,
		"stream.OnLiveBroadcastStatus",
		amqService.cfg.RMQExchange,
		false,
		nil,
	)
}

func (amqService *AmqService) consumeMessages() {
	msgs, err := amqService.rabbitMQChan.Consume(
		amqService.cfg.RMQConsumeQ,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		// Log error and return
		return
	}

	for msg := range msgs {
		switch msg.RoutingKey {
		case "stream.OnLiveBroadcast":
			var liveStream dto.LiveStreamStartMessage
			if err := json.Unmarshal(msg.Body, &liveStream); err == nil {
				amqService.handleLiveStreamMessage(&liveStream)
			} else {
				log.Error().Msgf("LiveStreamMessage body unmarshal error: %v", err)
			}
		case "stream.OnLiveBroadcastStatus":
			var statusMsg dto.StreamStatusMessage
			if err := json.Unmarshal(msg.Body, &statusMsg); err == nil {
				amqService.handleStreamStatusMessage(&statusMsg)
			} else {
				log.Error().Msgf("StreamStatusMessage body unmarshal error: %v", err)
			}
		}
	}
}

func (amqService *AmqService) handleLiveStreamMessage(msg *dto.LiveStreamStartMessage) {
	amqService.mu.Lock()
	defer amqService.mu.Unlock()
	fmt.Println("handleLiveStreamMessage", msg)
	streamName := msg.StreamName
	if streamName == "" {
		// If stream name is not provided, use username as fallback
		var user model.User
		if err := amqService.db.Select("username").Where("id = ?", msg.UserID).First(&user).Error; err == nil {
			streamName = user.Username + "'s Stream"
		} else {
			streamName = "Live Stream"
		}
	}

	fmt.Println("streamName", streamName)
	fmt.Println("streamTags", msg.StreamTags)

	// Check if we already have a stream state (in case status message came first)
	if existingStream, ok := amqService.streamStates[msg.UserID]; ok {
		existingStream.StreamName = streamName
		existingStream.LastUpdatedAt = time.Now().Unix()
		existingStream.TranslationUrl = msg.Params.TranslationUrl
		fmt.Println("existingStream", existingStream)
	} else {
		amqService.streamStates[msg.UserID] = &types.StreamData{
			IsOnline:       true,
			StreamName:     streamName,
			ViewerCount:    1,
			LastUpdatedAt:  time.Now().Unix(),
			TranslationUrl: msg.Params.TranslationUrl,
		}
		fmt.Println("newStream", amqService.streamStates[msg.UserID])
	}
	fmt.Println("streamStates", amqService.streamStates)
}

func (amqService *AmqService) handleStreamStatusMessage(msg *dto.StreamStatusMessage) {
	amqService.mu.Lock()
	defer amqService.mu.Unlock()
	stream, ok := amqService.streamStates[msg.UserID]
	if ok {
		stream.StreamCategory = msg.StreamCategory
		stream.StreamTags = msg.StreamTags
		stream.IsOnline = msg.IsOnline
		stream.ViewerCount = msg.ViewerCount
		stream.LastUpdatedAt = time.Now().Unix()

		if msg.ViewerCount <= 0 {
			delete(amqService.streamStates, msg.UserID)
		}
	} else {
		amqService.streamStates[msg.UserID] = &types.StreamData{
			IsOnline:       msg.IsOnline,
			StreamName:     msg.StreamName,
			StreamCategory: msg.StreamCategory,
			StreamTags:     msg.StreamTags,
			TranslationUrl: msg.TranslationUrl,
			ViewerCount:    msg.ViewerCount,
			LastUpdatedAt:  time.Now().Unix(),
		}
	}

	// Добавляем новые теги в список
	for _, tag := range msg.StreamTags {
		tag = strings.TrimSpace(tag)
		if tag != "" {
			amqService.uniqueTags[tag] = struct{}{}
		}
	}
}

// GetUniqueTags возвращает список всех уникальных тегов
func (amqService *AmqService) GetUniqueTags() []string {
	amqService.mu.RLock()
	defer amqService.mu.RUnlock()

	tags := make([]string, 0, len(amqService.uniqueTags))
	for tag := range amqService.uniqueTags {
		tags = append(tags, tag)
	}

	// отсортировать
	sort.Strings(tags)
	return tags
}

// GetOnlineChannels returns a list of online channel IDs sorted by viewer count
func (amqService *AmqService) GetOnlineChannels() []service.StreamInfo {
	amqService.mu.RLock()
	defer amqService.mu.RUnlock()

	now := time.Now().Unix()
	onlineStreams := make([]service.StreamInfo, 0, len(amqService.streamStates))

	for userID, stream := range amqService.streamStates {
		// Skip offline or timed out streams
		if stream.ViewerCount <= 0 || now-stream.LastUpdatedAt > int64(amqService.cfg.ReceiveStatisticsMessageInterval.Seconds()) {
			continue
		}

		onlineStreams = append(onlineStreams, service.StreamInfo{
			UserID:      userID,
			ViewerCount: stream.ViewerCount,
			LastUpdated: stream.LastUpdatedAt,
		})
	}

	// Sort by viewer count in descending order
	sort.SliceStable(onlineStreams, func(i, j int) bool {
		return onlineStreams[i].ViewerCount > onlineStreams[j].ViewerCount ||
			(onlineStreams[i].ViewerCount == onlineStreams[j].ViewerCount && onlineStreams[i].UserID.String() > onlineStreams[j].UserID.String())
	})

	return onlineStreams
}

// GetStreamData returns stream data for a specific user
func (amqService *AmqService) GetStreamData(userID uuid.UUID) *types.StreamData {
	amqService.mu.RLock()
	defer amqService.mu.RUnlock()

	if stream, exists := amqService.streamStates[userID]; exists {
		// Filter dead streams
		if time.Now().Unix()-stream.LastUpdatedAt > int64(amqService.cfg.ReceiveStatisticsMessageInterval.Seconds()) {
			return nil
		}
		return stream
	}
	return nil
}

func (amqService *AmqService) startStreamTimeoutChecker() {
	ticker := time.NewTicker(amqService.cfg.ReceiveStatisticsMessageInterval)
	for range ticker.C {
		amqService.mu.Lock()
		now := time.Now().Unix()
		for userID, stream := range amqService.streamStates {
			if now-stream.LastUpdatedAt > 3*int64(amqService.cfg.ReceiveStatisticsMessageInterval.Seconds()) {
				delete(amqService.streamStates, userID)
			}
		}
		amqService.mu.Unlock()
	}
}

func (amqService *AmqService) Close() {
	if amqService.rabbitMQChan != nil {
		amqService.rabbitMQChan.Close()
	}
	if amqService.rabbitMQConn != nil {
		amqService.rabbitMQConn.Close()
	}
}

func amqService(cfg *config.Config) error {
	db, err := NewDBService(cfg)
	if err != nil {
		log.Error().Msgf("NewDBService(cfg) issue: %v", err)
		return err
	}

	service, err := NewAmqService(db, cfg)
	if err != nil {
		log.Error().Msgf("NewAmqService(db, cfg) issue: %v", err)
		return err
	}
	err = service.listenQueue()
	if err != nil {
		log.Error().Msgf("service.listenQueue() issue: %v", err)
		return err
	}
	return nil
}

func StartAmqService(cfg *config.Config) error {
	signalChannel := make(chan os.Signal, 1)
	signal.Notify(
		signalChannel,
		syscall.SIGUSR1, // Use for restart listening queue
		syscall.SIGHUP,
		syscall.SIGQUIT,
		syscall.SIGTERM,
		syscall.SIGSEGV,
	)

	log.Info().Msgf("Setup listening queue %v", cfg.RMQConsumeQ)

	go amqService(cfg)

	for {
		signalEvent := <-signalChannel
		switch signalEvent {
		case syscall.SIGUSR1:
			time.Sleep(5 * time.Second)
			go amqService(cfg)
		case syscall.SIGQUIT,
			syscall.SIGTERM,
			syscall.SIGINT,
			syscall.SIGKILL:
			log.Error().Msgf("Signal event %q", signalEvent)
			return nil
		case syscall.SIGHUP:
			log.Error().Msgf("Signal event %q", signalEvent)
			return fmt.Errorf("signal hang up")
		case syscall.SIGSEGV:
			log.Error().Msgf("Signal event %q", signalEvent)
			return fmt.Errorf("segmentation violation")
		default:
			log.Error().Msgf("Unexpected signal %q", signalEvent)
		}
	}
}
