package translation

import (
	"fmt"

	"github.com/Capstane/stream-media-service/internal/dto"
	"github.com/Capstane/stream-media-service/internal/web_logs"
	"github.com/google/uuid"
	"github.com/pion/webrtc/v4"
	"github.com/rs/zerolog/log"
)

type WhipWhepTranslation struct {
	key []byte

	uniqueLinkSuffix string

	streamerId uuid.UUID

	peerConnection *webrtc.PeerConnection

	// Connection configuration
	configuration *webrtc.Configuration

	// Actual sender tracks
	tracks []*webrtc.TrackLocalStaticRTP

	// Origin offer from obs studio
	obsOffer []byte

	manager TranslationControl
}

func NewWhipWhepTranslation(key []byte, encodedSuffix string, streamerId uuid.UUID, manager TranslationControl) *WhipWhepTranslation {
	return &WhipWhepTranslation{
		key:              key,
		uniqueLinkSuffix: encodedSuffix,
		streamerId:       streamerId,
		manager:          manager,
	}
}

func (translation *WhipWhepTranslation) GetTranslation(streamKey []byte, viewerId *string) (TranslationControl, error) {
	return translation, nil
}

func (translation *WhipWhepTranslation) StopTranslation(liveStreamMessage *dto.LiveStreamMessage) error {
	if translation.peerConnection != nil {
		web_logs.WebLogs.Put(fmt.Sprintf("Close peer connection ice-ufrag: %v", ExtractUFrag(translation.peerConnection.CurrentLocalDescription())))
		return translation.peerConnection.Close()
	}
	return fmt.Errorf("nil peerConnection, can't stop translation for request %v", liveStreamMessage)
}

func (translation *WhipWhepTranslation) GetUniqueWhepLinkSuffix() string {
	return translation.uniqueLinkSuffix
}

func (translation *WhipWhepTranslation) SetUniqueWhepLinkSuffix(encodedSuffix string) {
	translation.uniqueLinkSuffix = encodedSuffix
}

func (translation *WhipWhepTranslation) GetStreamKeyByEncodedSuffix(encodedSuffix string) ([]byte, error) {
	return translation.key, nil
}

func (translation *WhipWhepTranslation) SendStatistics() {
}

func (translation *WhipWhepTranslation) OnOpenClientVideoStream(streamKey []byte, viewerId *string) {
	translation.manager.OnOpenClientVideoStream(streamKey, viewerId)
}

func (translation *WhipWhepTranslation) OnOpenClientAudioStream(streamKey []byte, viewerId *string) {
	translation.manager.OnOpenClientAudioStream(streamKey, viewerId)
}

func (translation *WhipWhepTranslation) OnCloseClientVideoStream(streamKey []byte, viewerId *string) {
	translation.manager.OnCloseClientVideoStream(streamKey, viewerId)
}

func (translation *WhipWhepTranslation) OnCloseClientAudioStream(streamKey []byte, viewerId *string) {
	translation.manager.OnCloseClientAudioStream(streamKey, viewerId)
}

func (translation *WhipWhepTranslation) OnOpenClientConnection(streamKey []byte, viewerId *string) {
	translation.manager.OnOpenClientConnection(streamKey, viewerId)
}

func (translation *WhipWhepTranslation) OnCloseClientConnection(streamKey []byte, viewerId *string) {
	translation.manager.OnCloseClientConnection(streamKey, viewerId)
}

func (translation *WhipWhepTranslation) OnOpenStream(streamKey []byte) {
	translation.manager.OnOpenStream(streamKey)
}

func (translation *WhipWhepTranslation) OnCloseStream(streamKey []byte) {
	translation.manager.OnCloseStream(streamKey)
}

func (translation *WhipWhepTranslation) GetStreamerId() *uuid.UUID {
	return &translation.streamerId
}

func (translation *WhipWhepTranslation) GetStreamKey() []byte {
	return translation.key
}

func (translation *WhipWhepTranslation) GetPeerConnection() *webrtc.PeerConnection {
	// Reopen connection if closed
	if translation.peerConnection == nil ||
		translation.peerConnection.ConnectionState() == webrtc.PeerConnectionStateClosed {
		peerConnection, err := translation.newPeerConnection()
		if err != nil {
			log.Error().Msgf("GetPeerConnection error: %v", err)
		} else {
			translation.peerConnection = peerConnection
		}
	}
	return translation.peerConnection
}

func (translation *WhipWhepTranslation) GetTracks() []*webrtc.TrackLocalStaticRTP {
	return translation.tracks
}

func (translation *WhipWhepTranslation) GetConfiguration() *webrtc.Configuration {
	return translation.configuration
}

func (translation *WhipWhepTranslation) SetOriginObsOffer(offer []byte) {
	translation.obsOffer = offer
}

func (translation *WhipWhepTranslation) GetOriginObsOffer() []byte {
	return translation.obsOffer
}

func (translation *WhipWhepTranslation) KillDeadTranslations() {
}
