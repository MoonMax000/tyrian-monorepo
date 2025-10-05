package translation

import (
	"github.com/Capstane/stream-media-service/internal/dto"
	"github.com/google/uuid"
	"github.com/pion/webrtc/v4"
)

const SUFFIX_LENGTH = 16

type TranslationControl interface {
	StartNewTranslation(liveStreamMessage *dto.LiveStreamMessage) error
	GetTranslation(streamKey []byte, viewerId *string) (TranslationControl, error)
	StopTranslation(liveStreamMessage *dto.LiveStreamMessage) error

	OnOpenClientVideoStream(streamKey []byte, viewerId *string)
	OnOpenClientAudioStream(streamKey []byte, viewerId *string)
	OnCloseClientVideoStream(streamKey []byte, viewerId *string)
	OnCloseClientAudioStream(streamKey []byte, viewerId *string)

	OnOpenClientConnection(streamKey []byte, viewerId *string)
	OnCloseClientConnection(streamKey []byte, viewerId *string)

	OnOpenStream(streamKey []byte)
	OnCloseStream(streamKey []byte)

	GetUniqueWhepLinkSuffix() string
	SetUniqueWhepLinkSuffix(encodedSuffix string)
	GetStreamKeyByEncodedSuffix(encodedSuffix string) ([]byte, error)

	// If not available return nil
	GetStreamerId() *uuid.UUID
	// If not available return nil
	GetStreamKey() []byte

	SetOriginObsOffer(offer []byte)
	GetOriginObsOffer() []byte

	GetPeerConnection() *webrtc.PeerConnection
	GetTracks() []*webrtc.TrackLocalStaticRTP
	GetConfiguration() *webrtc.Configuration

	// Connector to stream-recommends-service
	SendStatistics()

	// Maintenance functions
	KillDeadTranslations()
}
