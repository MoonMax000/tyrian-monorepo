package http_service

import (
	"io"
	"net/http"

	"github.com/Capstane/stream-media-service/internal/translation"
	"github.com/pion/webrtc/v4"
	"github.com/rs/zerolog/log"
)

type WhepHandler struct {
	translationManager translation.TranslationControl
}

func NewWhepHandler(translationManager translation.TranslationControl) http.Handler {
	return &WhepHandler{
		translationManager: translationManager,
	}
}

func (whepHandler *WhepHandler) ServeHTTP(responseWriter http.ResponseWriter, request *http.Request) {

	streamKey := getStreamKeyFromUrl(whepHandler.translationManager, request)
	viewerId := getViewerId(request)

	translation, err := whepHandler.translationManager.GetTranslation(streamKey, viewerId)
	if checkError("GetTranslation", err, responseWriter) {
		return
	}

	// Read the offer from HTTP Request
	offer, err := io.ReadAll(request.Body)
	if checkError("ReadAll", err, responseWriter) {
		return
	}

	// TODO: remove below logging
	encodedOffer := string(offer)
	log.Warn().Msgf("[DEBUG WHEP] headers: %v", request.Header)
	log.Warn().Msgf("[DEBUG WHEP] client offer: %v", encodedOffer)

	peerConnection, err := webrtc.NewPeerConnection(*translation.GetConfiguration())
	if checkError("NewPeerConnection", err, responseWriter) {
		return
	}

	for _, track := range translation.GetTracks() {
		// Add tracks that is being written to from WHIP Session
		rtpSender, err := peerConnection.AddTrack(track)
		if checkError("AddTrack", err, responseWriter) {
			return
		}

		// Read incoming RTCP packets
		// Before these packets are returned they are processed by interceptors. For things
		// like NACK this needs to be called.
		go func() {
			switch track.Kind() {
			case webrtc.RTPCodecTypeVideo:
				whepHandler.translationManager.OnOpenClientVideoStream(streamKey, viewerId)
			case webrtc.RTPCodecTypeAudio:
				whepHandler.translationManager.OnOpenClientAudioStream(streamKey, viewerId)
			}

			rtcpBuf := make([]byte, 1500)
			for {
				if _, _, rtcpErr := rtpSender.Read(rtcpBuf); rtcpErr != nil {
					switch track.Kind() {
					case webrtc.RTPCodecTypeVideo:
						whepHandler.translationManager.OnCloseClientVideoStream(streamKey, viewerId)
					case webrtc.RTPCodecTypeAudio:
						whepHandler.translationManager.OnCloseClientAudioStream(streamKey, viewerId)
					}
					return
				}
			}
		}()
	}

	// Set the handler for ICE connection state
	// This will notify you when the peer has connected/disconnected
	peerConnection.OnICEConnectionStateChange(func(connectionState webrtc.ICEConnectionState) {
		log.Info().Msgf("ICE Connection [%v] state has changed to: %s\n", request.URL.Path, connectionState.String())

		switch connectionState {
		case webrtc.ICEConnectionStateConnected:
			translation.OnOpenClientConnection(translation.GetStreamKey(), viewerId)
		case webrtc.ICEConnectionStateClosed:
			translation.OnCloseClientConnection(translation.GetStreamKey(), viewerId)

		case webrtc.ICEConnectionStateFailed:
			// Peer connection must still active
			// _ = peerConnection.Close()
			translation.OnCloseClientConnection(translation.GetStreamKey(), viewerId)
		}
	})

	// Send answer via HTTP Response
	writeAnswer(translation, viewerId, responseWriter, peerConnection, offer, request.URL.Path)
}
