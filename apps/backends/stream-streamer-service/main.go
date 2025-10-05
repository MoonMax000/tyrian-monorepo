package main

import (
	"os"
	"runtime"

	"github.com/Capstane/stream-streamer-service/internal/config"
	"github.com/Capstane/stream-streamer-service/internal/http_service"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

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
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout})

	cfg := config.LoadConfig()
	zerolog.SetGlobalLevel(zerolog.Level(cfg.LogLevel))

	// We are need >= 2 threads
	moreThenTwoThreadsRuntime()

	err := http_service.ListenHttpPort(&cfg)
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
