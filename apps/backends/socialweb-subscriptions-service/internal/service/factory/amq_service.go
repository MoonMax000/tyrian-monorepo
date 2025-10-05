package factory

import (
	"fmt"
	"os"
	"os/signal"
	"sort"
	"sync"
	"syscall"
	"time"

	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
	"gorm.io/gorm"

	"github.com/Capstane/AXA-socialweb-subscriptions/internal/config"
	"github.com/Capstane/AXA-socialweb-subscriptions/internal/service"

	"github.com/rs/zerolog/log"
)

type AmqService struct {
	mu           sync.RWMutex
	rabbitMQConn *amqp.Connection
	rabbitMQChan *amqp.Channel
	cfg          *config.Config
	db           *gorm.DB
	topAuthors   map[uuid.UUID]*service.Author
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
				cfg: cfg,
				db:  db,
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

	// Bind to social web subscriptions events
	err = amqService.rabbitMQChan.QueueBind(
		amqService.cfg.RMQConsumeQ,
		amqService.cfg.RMQConsumeB,
		amqService.cfg.RMQExchange,
		false,
		nil,
	)
	if err != nil {
		return err
	}
	return nil
}

func (amqService *AmqService) consumeMessages() {
	msgs, err := amqService.rabbitMQChan.Consume(
		amqService.cfg.RMQConsumeQ,
		"AXA-socialweb-subscriptions",
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
		default:
			log.Debug().Msgf("routing key: %v", msg.RoutingKey)
		}
	}
}

// GetTop1000Users returns a list of online channel IDs sorted by viewer count
func (amqService *AmqService) GetTop1000Users() []service.Author {
	amqService.mu.RLock()
	defer amqService.mu.RUnlock()

	top1000Users := make([]service.Author, 0, 1000)

	for userID, author := range amqService.topAuthors {
		top1000Users = append(top1000Users, service.Author{
			UserID:          userID,
			SubscriberCount: author.SubscriberCount,
			LastUpdated:     author.LastUpdated,
		})
	}

	// Sort by viewer count in descending order
	sort.SliceStable(top1000Users, func(i, j int) bool {
		return top1000Users[i].SubscriberCount > top1000Users[j].SubscriberCount ||
			(top1000Users[i].SubscriberCount == top1000Users[j].SubscriberCount && top1000Users[i].UserID.String() > top1000Users[j].UserID.String())
	})

	return top1000Users
}

func (amqService *AmqService) Close() {
	if amqService.rabbitMQChan != nil {
		amqService.rabbitMQChan.Close()
	}
	if amqService.rabbitMQConn != nil {
		amqService.rabbitMQConn.Close()
	}
}

func (amqService *AmqService) OnSubscribeTo(userId uuid.UUID) {
	author, ok := amqService.topAuthors[userId]
	if !ok {
		author = &service.Author{
			UserID:          userId,
			LastUpdated:     time.Now().Unix(),
			SubscriberCount: 0,
		}
	}
	author.SubscriberCount++
}

func (amqService *AmqService) OnUnsubscribeFrom(userId uuid.UUID) {
	author, ok := amqService.topAuthors[userId]
	if ok {
		author.SubscriberCount--
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
