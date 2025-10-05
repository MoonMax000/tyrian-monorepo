package main

import (
	"embed"
	"io/fs"
	"net/http"
	"os"
	"runtime"
	"strings"

	"github.com/Capstane/authlib/userws"
	"github.com/Capstane/stream-notify-service/internal/config"
	"github.com/Capstane/stream-notify-service/internal/connection"
	"github.com/Capstane/stream-notify-service/internal/database"
	"github.com/Capstane/stream-notify-service/internal/queue"
	"github.com/Capstane/stream-notify-service/internal/redis_notifications"
	"github.com/gorilla/websocket"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

//go:embed docs
var docsFs embed.FS

// @title Streaming notify-service Swagger
// @version 1.0
// @description This is an API of notify-service for Streaming application

// @securityDefinitions.apikey  CookieAuth
// 		@in                          cookie
// 		@name                        sessionid
// 		@description                 Сессионная аутентификация через куку sessionid

// @BasePath /api/v1
func main() {
	// Initialize Zerolog logger with output to stdout
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout})

	cfg := config.LoadConfig()
	zerolog.SetGlobalLevel(zerolog.Level(cfg.LogLevel))

	// We are need >= 2 threads
	moreThenTwoThreadsRuntime()

	redis_notifications.InitRedis(&cfg)

	// lib userws
	rc, err := userws.InitRedisClients("redis://94.26.248.225:6380/0", "10.166.44.41:6379")
	// rc, err := userws.InitRedisClients(cfg.SessionIdRedisUrl, cfg.RedisAddress)

	database.Connect(&cfg)

	// debug.html handler
	embedFs, err := fs.Sub(docsFs, "docs")
	if err != nil {
		log.Error().Msgf("can't go to subfolder docs, the issue is %v", err)
		return
	}

	http.Handle("/", logRequestHandler(http.FileServer(http.FS(embedFs))))
	// http.Handle("/logs", webLogsHandler)

	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header["Origin"]
			if len(origin) == 0 {
				return true
			}
			return true
		},
		EnableCompression: true,
		Subprotocols:      []string{"chat"},
	}

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		_, sessionid := split2andTrim(r.Header.Get("Sec-Websocket-Protocol"), ",", " ")

		if sessionid == "" {
			log.Warn().Msg("Authorization bearer is missing in Sec-Websocket-Protocol header")
		}

		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Error().Msgf("Failed to upgrade connection: %v", err)
			return
		}

		// Получение пользователя по sessionid
		userId, _ := rc.GetSessionUser(sessionid, "streaming")

		log.Debug().Msgf("New connection from: %v", ws)
		connection.NewConnection(ws, userId.String(), &cfg)
	})

	go queue.ListenRabbitQueue(&cfg)

	log.Info().Msg("Starting HTTP server on " + cfg.Listenaddress)
	if err := http.ListenAndServe(cfg.Listenaddress, nil); err != nil {
		log.Fatal().Msgf("ListenAndServe fail with error: %v", err)
	}
}

func moreThenTwoThreadsRuntime() {
	currentThreadsCount := runtime.GOMAXPROCS(2)
	if currentThreadsCount > 2 {
		runtime.GOMAXPROCS(currentThreadsCount)
	}
}

func split2andTrim(text string, separator string, cutset string) (string, string) {
	result := strings.SplitN(text, separator, 2)
	if len(result) < 1 {
		return strings.Trim(result[0], cutset), ""
	}
	if len(result) < 2 {
		return strings.Trim(result[0], cutset), strings.Trim(result[1], cutset)
	}
	return strings.Trim(result[0], cutset), strings.Trim(result[1], cutset)
}

func logRequestHandler(h http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {

		// call the original http.Handler we're wrapping
		h.ServeHTTP(w, r)

		// gather information about request and log it
		uri := r.URL.String()
		method := r.Method
		// ... more information
		log.Info().Msgf("HTTP [%v] %v", method, uri)
	}

	return http.HandlerFunc(fn)
}
