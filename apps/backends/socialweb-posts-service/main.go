package main

import (
	"encoding/json"
	"runtime"

	_ "github.com/lib/pq"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"

	"github.com/Capstane/AXA-socialweb-posts/internal/config"
	"github.com/Capstane/AXA-socialweb-posts/internal/queue"
	"github.com/Capstane/AXA-socialweb-posts/internal/service/factory"
	"github.com/Capstane/AXA-socialweb-posts/internal/validation"
	"github.com/Capstane/AXA-socialweb-posts/internal/web_logs"
)

func webLogLink(evt map[string]interface{}) error {
	result, err := json.Marshal(evt)
	if err == nil {
		web_logs.WebLogs.Put(string(result))
	}
	return nil
}

// @title AXA-socialweb-service Swagger
// @version 1.0
// @description This is an API of posts-service for Socialweb application

// @securityDefinitions.apikey  CookieAuth
// 		@in                          cookie
// 		@name                        sessionid
// 		@description                 Сессионная аутентификация через куку sessionid

// @BasePath /api/v1
func main() {
	// Init customValidater
	validation.InitCustomValidate()

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

	go queue.ListenRabbitQueue(&cfg)

	factory.StartHttpService(&cfg)
}

func moreThenTwoThreadsRuntime() {
	currentThreadsCount := runtime.GOMAXPROCS(2)
	if currentThreadsCount > 2 {
		runtime.GOMAXPROCS(currentThreadsCount)
	}
}
