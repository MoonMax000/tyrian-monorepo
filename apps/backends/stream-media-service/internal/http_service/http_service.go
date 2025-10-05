//go:build !js
// +build !js

// whip-whep exchange SPD descriptions and stream media to a WebRTC client in the browser or OBS
package http_service

import (
	"embed"
	"fmt"
	"io/fs"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Capstane/stream-media-service/internal/config"
	"github.com/Capstane/stream-media-service/internal/dto"
	"github.com/Capstane/stream-media-service/internal/encdec"
	"github.com/Capstane/stream-media-service/internal/translation"
	"github.com/Capstane/stream-media-service/internal/web_logs"
	"github.com/google/uuid"
	"github.com/pion/ice/v4"
	"github.com/pion/webrtc/v4"
	"github.com/rs/zerolog/log"
)

//go:embed static
var staticFs embed.FS

type WebLogsHandler struct{}

func (log *WebLogsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(web_logs.WebLogs.Text(true)))
}

var webLogsHandler = &WebLogsHandler{}

func ListenHttpPort(translationManager translation.TranslationControl, cfg *config.Config) error {

	// Setup global handlers
	embedFs, err := fs.Sub(staticFs, "static")
	if err != nil {
		log.Error().Msgf("can't go to subfolder static, the issue is %v", err)
		return err
	}

	// Create a SettingEngine, this allows non-standard WebRTC behavior
	settingEngine := webrtc.SettingEngine{}

	http.Handle("/", logRequestHandler(http.FileServer(http.FS(embedFs))))
	http.Handle("/logs", webLogsHandler)

	http.Handle("/video/{encodedSuffix}", corsHandler(NewWhepHandler(translationManager)))
	http.Handle("/whip", corsHandler(NewWhipHandler(translationManager, &settingEngine)))

	// Start listening
	signalChannel := make(chan os.Signal, 1)
	signal.Notify(
		signalChannel,
		syscall.SIGUSR2, // Use for restart listening http port
		syscall.SIGHUP,
		syscall.SIGQUIT,
		syscall.SIGTERM,
		syscall.SIGSEGV,
	)

	go listenPorts(translationManager, &settingEngine, cfg)

	for {
		signalEvent := <-signalChannel
		switch signalEvent {
		case syscall.SIGUSR2:
			time.Sleep(5 * time.Second)
			go listenPorts(translationManager, &settingEngine, cfg)
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

type UdpLogger struct{}

func (u *UdpLogger) Trace(msg string) {
	log.Trace().Msg(msg)
}
func (u *UdpLogger) Tracef(format string, args ...interface{}) {
	log.Trace().Msgf(format, args...)
}
func (u *UdpLogger) Debug(msg string) {
	log.Debug().Msg(msg)
}
func (u *UdpLogger) Debugf(format string, args ...interface{}) {
	log.Debug().Msgf(format, args...)
}
func (u *UdpLogger) Info(msg string) {
	log.Info().Msg(msg)
}
func (u *UdpLogger) Infof(format string, args ...interface{}) {
	log.Info().Msgf(format, args...)
}
func (u *UdpLogger) Warn(msg string) {
	log.Warn().Msg(msg)
}
func (u *UdpLogger) Warnf(format string, args ...interface{}) {
	log.Warn().Msgf(format, args...)
}
func (u *UdpLogger) Error(msg string) {
	log.Error().Msg(msg)
}
func (u *UdpLogger) Errorf(format string, args ...interface{}) {
	log.Error().Msgf(format, args...)
}

// IP Logger
func ipLogger(ip net.IP) (keep bool) {
	web_logs.WebLogs.Put(fmt.Sprintf("ip: %v", ip))
	return true
}

type MuxLogger struct {
	mux *ice.MultiUDPMuxDefault
}

func (m *MuxLogger) GetConn(ufrag string, addr net.Addr) (net.PacketConn, error) {
	web_logs.WebLogs.Put(fmt.Sprintf("GetConn %v, %v", ufrag, addr))
	return m.mux.GetConn(ufrag, addr)
}

func (m *MuxLogger) RemoveConnByUfrag(ufrag string) {
	web_logs.WebLogs.Put(fmt.Sprintf("RemoveConnByUfrag %v", ufrag))
	m.mux.RemoveConnByUfrag(ufrag)
}

func (m *MuxLogger) Close() error {
	web_logs.WebLogs.Put("Close")
	return m.mux.Close()
}

func (m *MuxLogger) GetListenAddresses() []net.Addr {
	web_logs.WebLogs.Put("GetListenAddresses")
	return m.mux.GetListenAddresses()
}

func NewMuxLogger(mux *ice.MultiUDPMuxDefault) *MuxLogger {
	return &MuxLogger{
		mux: mux,
	}
}

func listenPorts(translationManager translation.TranslationControl, settingEngine *webrtc.SettingEngine, cfg *config.Config) error {
	defer func() {
		log.Warn().Msg("Exit from listen port function")
		syscall.Kill(syscall.Getpid(), syscall.SIGUSR2)
	}()

	// Configure our SettingEngine to use our UDPMux. By default a PeerConnection has
	// no global state. The API+SettingEngine allows the user to share state between them.
	// In this case we are sharing our listening port across many.
	// Listen on UDP Port udpPort, will be used for all WebRTC traffic
	mux, err := ice.NewMultiUDPMuxFromPort(int(cfg.UdpPort),
		ice.UDPMuxFromPortWithNetworks(ice.NetworkTypeUDP4),
		ice.UDPMuxFromPortWithLogger(&UdpLogger{}),
		ice.UDPMuxFromPortWithIPFilter(ipLogger),
	)
	if err != nil {
		log.Error().Msgf("can't listen udp port %v, the issue is %v", cfg.UdpPort, err)
		return err
	}

	log.Info().Msgf("Listening for WebRTC traffic %d/udp\n", cfg.UdpPort)
	settingEngine.SetICEUDPMux(NewMuxLogger(mux))

	if cfg.PublicIp != "" {
		settingEngine.SetNAT1To1IPs([]string{cfg.PublicIp}, webrtc.ICECandidateTypeHost)
	}

	// Zero key translation (for /video/0 reference)
	userId, _ := uuid.Parse("c796e41b-584d-4a3a-8969-57130eac1bfc")
	key, _ := encdec.StreamKeyEncoding.DecodeString("AQMip3B5Rpn66ajW1WgwSw")

	err = translationManager.StartNewTranslation(&dto.LiveStreamMessage{
		Command: dto.LiveStreamCommandStart,
		UserInfo: &dto.NotifyUserInfo{
			UserId: userId,
		},
		Params: &dto.LiveStreamParams{
			Key:            key,
			TranslationUrl: "/0",
		},
	})
	if err != nil {
		log.Error().Msgf("can't start zero translation, the issue is %v", err)
		return err
	}

	hostname, err := os.Hostname()
	if err != nil {
		log.Info().Msgf("can't get hostname, the issue is %v", err)
		hostname = "localhost"
	}
	log.Info().Msgf("Listen http://%v:%v", hostname, cfg.HttpPort)
	return http.ListenAndServe(fmt.Sprintf(":%v", cfg.HttpPort), nil) // nolint: gosec
}
