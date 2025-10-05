package translation

import (
	"github.com/pion/webrtc/v4"
	"github.com/rs/zerolog/log"
)

func (translation *WhipWhepTranslation) newPeerConnection() (*webrtc.PeerConnection, error) {
	// Everything below is the Pion WebRTC API ❤️.

	// Create a new RTCPeerConnection
	peerConnection, err := webrtc.NewPeerConnection(*translation.configuration)
	if err != nil {
		return nil, err
	}

	for _, track := range translation.tracks {
		switch track.Kind() {
		case webrtc.RTPCodecTypeVideo:
			// Handle RTCP, see rtcpReader for why
			rtpSender, err := peerConnection.AddTrack(track)
			if err != nil {
				return nil, err
			}
			rtcpReader(rtpSender)
		case webrtc.RTPCodecTypeAudio:
			// Handle RTCP, see rtcpReader for why
			rtpSender, err := peerConnection.AddTrack(track)
			if err != nil {
				return nil, err
			}
			rtcpReader(rtpSender)
		}
	}

	// Set the handler for Peer connection state
	// This will notify you when the peer has connected/disconnected
	peerConnection.OnConnectionStateChange(func(s webrtc.PeerConnectionState) {
		log.Debug().Msgf("Peer Connection State has changed: %s\n", s.String())

		switch s {

		case webrtc.PeerConnectionStateFailed:
			// Wait until PeerConnection has had no network activity for 30 seconds or another failure. It may be reconnected using an ICE Restart.
			// Use webrtc.PeerConnectionStateDisconnected if you are interested in detecting faster timeout.
			// Note that the PeerConnection may come back from PeerConnectionStateDisconnected.
			log.Error().Msgf("Peer connection has gone to failed exiting, state is %s\n", s.String())
			return
		}
	})

	return peerConnection, nil
}
