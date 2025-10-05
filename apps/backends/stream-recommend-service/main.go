package main

import (
	"encoding/json"
	"runtime"

	_ "github.com/lib/pq"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	"github.com/Capstane/stream-recommend-service/internal/config"
	"github.com/Capstane/stream-recommend-service/internal/service/factory"
	"github.com/Capstane/stream-recommend-service/internal/web_logs"
)

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

	// We are need >= 2 threads
	moreThenTwoThreadsRuntime()

	go factory.StartHttpService(&cfg)

	err := factory.StartAmqService(&cfg)
	if err != nil {
		log.Error().Msgf("Attempt to start application fail with error %v", err)
	}
}

func moreThenTwoThreadsRuntime() {
	currentThreadsCount := runtime.GOMAXPROCS(2)
	if currentThreadsCount > 2 {
		runtime.GOMAXPROCS(currentThreadsCount)
	}
}
