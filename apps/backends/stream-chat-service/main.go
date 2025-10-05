package main

import (
	"embed"
	"encoding/json"
	"io/fs"
	"net/http"
	"net/url"
	"runtime"
	"strings"
	"time"

	_ "net/http/pprof"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	"github.com/Capstane/authlib/userws"
	"github.com/Capstane/stream-chat-service/internal"
	"github.com/Capstane/stream-chat-service/internal/cache"
	"github.com/Capstane/stream-chat-service/internal/config"
	"github.com/Capstane/stream-chat-service/internal/connection"
	"github.com/Capstane/stream-chat-service/internal/database"
	"github.com/Capstane/stream-chat-service/internal/dto"
	"github.com/Capstane/stream-chat-service/internal/http_service"
	"github.com/Capstane/stream-chat-service/internal/user"
	"github.com/Capstane/stream-chat-service/internal/web_logs"
	"github.com/gorilla/websocket"
)

//go:embed docs
var docsFs embed.FS

type WebLogsHandler struct{}

func (log *WebLogsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(web_logs.WebLogs.Text()))
}

var webLogsHandler = &WebLogsHandler{}

func webLogLink(evt map[string]interface{}) error {
	result, err := json.Marshal(evt)
	if err == nil {
		web_logs.WebLogs.Put(string(result))
	}
	return nil
}

// @title Streaming API
// @version 1.0
// @description This is an streaming API

// @securityDefinitions.apikey  CookieAuth
// 		@in                          cookie
// 		@name                        sessionid
// 		@description                 Сессионная аутентификация через куку sessionid

// @BasePath /api/v1
func main() {
	// Initialize Zerolog logger with output to stdout
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.NewConsoleWriter(
		func(w *zerolog.ConsoleWriter) {
			w.FormatPrepare = webLogLink
		},
	))

	cfg := config.LoadConfig()
	zerolog.SetGlobalLevel(zerolog.Level(cfg.LogLevel))

	http.HandleFunc("/debug/pprof/", func(w http.ResponseWriter, r *http.Request) {
		http.DefaultServeMux.ServeHTTP(w, r)
	})

	if cfg.Maxprocesses <= 0 {
		cfg.Maxprocesses = runtime.NumCPU()
	}
	runtime.GOMAXPROCS(cfg.Maxprocesses)

	database.InitDatabase(&cfg)
	cache.InitRedis(cfg.RedisAddress, cfg.RedisDatabase, cfg.RedisPassword)

	// lib userws
	rc, err := userws.InitRedisClients(cfg.SessionIdRedisUrl, cfg.RedisAddress)

	go dto.ListenRabbitQueue(&cfg)

	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header["Origin"]
			if len(origin) == 0 {
				return true
			}
			u, err := url.Parse(origin[0])
			if err != nil {
				return false
			}
			if cfg.Allowedoriginhost == "*" {
				return true
			}
			return cfg.Allowedoriginhost == u.Host
		},
		EnableCompression: true,
		Subprotocols:      []string{"chat"},
	}

	// debug.html handler
	embedFs, err := fs.Sub(docsFs, "docs")
	if err != nil {
		log.Error().Msgf("can't go to subfolder docs, the issue is %v", err)
		return
	}
	http.Handle("/", dto.LogRequestHandler(http.FileServer(http.FS(embedFs))))
	http.Handle("/logs", webLogsHandler)

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		_, chatID, sessionid := split3andTrim(r.Header.Get("Sec-Websocket-Protocol"), ",", " ")
		// r.Header.Del("Sec-Websocket-Protocol") // Gorilla fix

		_, exists := connection.GetHubByID(chatID)

		if !exists {
			log.Warn().Msgf("Hub with ID %v does not exist", chatID)
			return
		}

		if chatID == "" {
			log.Warn().Msg("Chat ID is missing in Sec-Websocket-Protocol header")
		}

		if sessionid == "" {
			log.Warn().Msg("Sessionid is missing in Sec-Websocket-Protocol header")
		}

		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Error().Msgf("Failed to upgrade connection: %v", err)
			return
		}

		// Получение пользователя по sessionid
		userId, username := rc.GetSessionUser(sessionid, "streaming")

		user, banned, ip := user.GetUserFromWebRequest(r, userId, username, chatID)

		if banned {
			ws.SetWriteDeadline(time.Now().Add(internal.WRITETIMEOUT))
			if err := ws.WriteMessage(websocket.TextMessage, []byte(`ERR {"description":"banned"}`)); err != nil {
				log.Error().Msgf("Failed to send ban message: %v", err)
			}
			return
		}

		connection.NewConnection(ws, user, ip, chatID)
	})

	go func() {
		if err := http_service.ListenHttpPort(&cfg); err != nil {
			log.Fatal().Msgf("HTTP API server failed: %v", err)
		}
	}()

	log.Info().Msgf("Using %v threads, and listening on: %v\n", cfg.Maxprocesses, cfg.Listenaddress)
	if err := http.ListenAndServe(cfg.Listenaddress, nil); err != nil {
		log.Fatal().Msgf("ListenAndServe fail with error: %v", err)
	}
}

func split3andTrim(text string, separator string, cutset string) (string, string, string) {
	result := strings.SplitN(text, separator, 3)
	if len(result) < 2 {
		return strings.Trim(result[0], cutset), "", ""
	}
	if len(result) < 3 {
		return strings.Trim(result[0], cutset), strings.Trim(result[1], cutset), ""
	}
	return strings.Trim(result[0], cutset), strings.Trim(result[1], cutset), strings.Trim(result[2], cutset)
}
