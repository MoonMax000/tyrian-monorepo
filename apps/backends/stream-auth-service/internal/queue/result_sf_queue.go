package queue

import (
	"context"
	"encoding/json"
	"time"

	"github.com/Capstane/stream-auth-service/internal/dto"
	"github.com/Capstane/stream-auth-service/internal/handler/admin"
	"github.com/Capstane/stream-auth-service/internal/types"
	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/rs/zerolog/log"
)

func ListenStreamingQueue(ctx context.Context, rabbitURL string, core *admin.AdminHandler) error {
	for {
		conn, err := amqp.Dial(rabbitURL)
		if err != nil {
			log.Error().Msgf("Failed to connect to RabbitMQ: %v. Retrying in 5 seconds...", err)
			time.Sleep(5 * time.Second)
			continue
		}

		ch, err := conn.Channel()
		if err != nil {
			log.Error().Msgf("Failed to open channel: %v. Reconnecting...", err)
			conn.Close()
			time.Sleep(5 * time.Second)
			continue
		}

		_ = ch.Qos(1, 0, false)

		msgs, err := ch.Consume(
			"streaming_incoming",
			"streaming_consumer",
			false, // auto-ack OFF
			false,
			false,
			false,
			nil,
		)
		if err != nil {
			log.Error().Msgf("Failed to consume: %v. Reconnecting...", err)
			ch.Close()
			conn.Close()
			time.Sleep(5 * time.Second)
			continue
		}

		log.Info().Msg("Connected to queue 'streaming_incoming', waiting for messages...")

		connected := true

		for {
			select {
			case <-ctx.Done():
				ch.Close()
				conn.Close()
				return ctx.Err()
			case msg, ok := <-msgs:
				if !ok {
					connected = false
					break
				}

				var result dto.ResultSFMessage
				if err := json.Unmarshal(msg.Body, &result); err != nil {
					log.Error().Msgf("Failed to unmarshal message: %v", err)
					_ = msg.Nack(false, false)
					continue
				}

				// uid, err := uuid.Parse(result.UserId)
				// if err != nil {
				// 	log.Error().Msgf("Invalid user ID: %s", result.UserId)
				// 	_ = msg.Nack(false, false)
				// 	continue
				// }

				switch result.Status {
				case "approved":
					req := types.UpdateUserRolesRequest{
						UserId: result.Email,
						Roles:  []string{"streamer"},
					}
					actor := uuid.Nil // system actor

					if _, err := core.CopySetUserRolesCore(ctx, req, actor); err != nil {
						log.Error().Msgf("SetUserRolesCore failed for user=%s: %v", result.UserId, err)
						_ = msg.Nack(false, false) // retry
						continue
					}

				// case "rejected":
				// 	if err := core.RejectAllRoleRequestsForUser(uid); err != nil {
				// 		log.Error().Msgf("RejectAllRoleRequestsForUser failed for user=%s: %v", result.UserId, err)
				// 		_ = msg.Nack(false, false) // retry
				// 		continue
				// 	}

				// 	log.Info().Msgf("All role requests rejected for user=%s", result.UserId)

				default:
					log.Warn().Msgf("Unknown status: %s for user=%s", result.Status, result.UserId)
				}

				_ = msg.Ack(false)
			}

			if !connected {
				log.Warn().Msg("Connection lost. Reconnecting...")
				ch.Close()
				conn.Close()
				time.Sleep(5 * time.Second)
				break
			}
		}
	}
}
