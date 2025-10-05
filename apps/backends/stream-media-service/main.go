package main

import (
	"encoding/json"
	"os"
	"os/signal"
	"runtime"
	"syscall"
	"time"

	"github.com/Capstane/stream-media-service/internal/amqp_service"
	"github.com/Capstane/stream-media-service/internal/config"
	"github.com/Capstane/stream-media-service/internal/http_service"
	"github.com/Capstane/stream-media-service/internal/translation"
	"github.com/Capstane/stream-media-service/internal/web_logs"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func webLogLink(evt map[string]interface{}) error {
	result, err := json.Marshal(evt)
	if err == nil {
		web_logs.WebLogs.Put(string(result))
	}
	return nil
}

// nolint:gocognit
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

	translationsCtrl := translation.NewTranslationManager(&cfg)

	go http_service.ListenHttpPort(translationsCtrl, &cfg)

	go amqp_service.ListenRabbitQueue(translationsCtrl, &cfg)

	signalChannel := make(chan os.Signal, 1)
	signal.Notify(
		signalChannel,
		syscall.SIGHUP,
		syscall.SIGQUIT,
		syscall.SIGTERM,
		syscall.SIGSEGV,
	)

	uptimeTicker := time.NewTicker(cfg.SendStatisticsMessageInterval)
	utilityTimer := time.NewTicker(time.Second)

	for {
		select {
		case <-uptimeTicker.C:
			// Send statistics every $SEND_STATISTICS_MESSAGE_INTERVAL
			translationsCtrl.SendStatistics()
		case <-utilityTimer.C:
			// Maintenance functions
			translationsCtrl.KillDeadTranslations()
		case <-signalChannel:
			return
		}
	}
}

func moreThenTwoThreadsRuntime() {
	currentThreadsCount := runtime.GOMAXPROCS(2)
	if currentThreadsCount > 2 {
		runtime.GOMAXPROCS(currentThreadsCount)
	}
}
