package http_service

import (
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/Capstane/stream-media-service/internal"
	"github.com/Capstane/stream-media-service/internal/encdec"
	"github.com/Capstane/stream-media-service/internal/translation"
	"github.com/pion/webrtc/v4"
	"github.com/rs/zerolog/log"
)

func checkError(errorTag string, err error, w http.ResponseWriter) bool {
	if err != nil {
		errMsg := fmt.Sprintf("[%v] error %v", errorTag, err)
		log.Error().Msg(errMsg)
		_, err = w.Write([]byte(errMsg))
		if err != nil {
			log.Error().Msgf("error %v", err)
		}
		return true
	}
	return false
}

func writeAnswer(translationCtl translation.TranslationControl,
	viewerId *string,
	responseWriter http.ResponseWriter,
	peerConnection *webrtc.PeerConnection,
	offer []byte,
	path string,
) {
	err := peerConnection.SetRemoteDescription(webrtc.SessionDescription{Type: webrtc.SDPTypeOffer, SDP: string(offer)})
	if checkError("SetRemoteDescription", err, responseWriter) {
		return
	}

	// Create channel that is blocked until ICE Gathering is complete
	gatherComplete := webrtc.GatheringCompletePromise(peerConnection)

	// Create answer
	answer, err := peerConnection.CreateAnswer(nil)
	if checkError("CreateAnswer", err, responseWriter) {
		return
	}
	err = peerConnection.SetLocalDescription(answer)
	if checkError("SetLocalDescription", err, responseWriter) {
		return
	}

	// Block until ICE Gathering is complete, disabling trickle ICE
	// we do this because we only can exchange one signaling message
	// in a production application you should exchange ICE Candidates via OnICECandidate
	<-gatherComplete

	// WHIP+WHEP expects a Location header and a HTTP Status Code of 201
	responseWriter.Header().Add("Location", path)

	//Set CORS Policy
	// responseWriter.Header().Add("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
	responseWriter.Header().Add("Access-Control-Allow-Headers", "*")
	responseWriter.Header().Add("Access-Control-Allow-Origin", "*")
	responseWriter.Header().Add("Access-Control-Allow-Methods", "GET, POST")

	responseWriter.WriteHeader(http.StatusCreated)

	// Write Answer with Candidates as HTTP Response
	fmt.Fprint(responseWriter, peerConnection.LocalDescription().SDP) //nolint: errcheck
}

func getStreamKeyFromAuthHeader(request *http.Request) []byte {
	authHeader, ok := request.Header["Authorization"]
	if !ok {
		return []byte{}
	}
	if len(authHeader) > 0 {
		header := authHeader[0]
		bearer := strings.Split(header, "Bearer ")
		result, err := encdec.StreamKeyEncoding.DecodeString(bearer[1])
		if err != nil {
			return []byte{}
		}
		return result
	}
	return []byte{}
}

func getStreamKeyFromUrl(translationManager translation.TranslationControl, request *http.Request) []byte {
	encodedSuffix := internal.Last(strings.Split(request.URL.Path, "/"))
	streamKey, err := translationManager.GetStreamKeyByEncodedSuffix(encodedSuffix)
	if err != nil {
		return []byte{}
	}
	return streamKey
}

func getViewerId(request *http.Request) *string {
	if request == nil {
		return nil
	}

	return &request.RemoteAddr
}

type RtpMap struct {
	MimeType    string
	ClockRate   uint32
	Channels    uint16
	PayloadType webrtc.PayloadType
}

// 111 opus/48000/2
var RTPMAP = regexp.MustCompile(`(?P<PayloadType>\d+)\s+(?P<MimeTypePart>\w+)/(?P<MimeTypeParClockRate>\d+)/(?P<Channels>\d+)`)

func parseRtpMap(streamType string, rtpmap string) *RtpMap {
	result := RTPMAP.FindStringSubmatch(rtpmap)
	return &RtpMap{
		MimeType:    fmt.Sprintf("%v/%v", streamType, result[2]),
		ClockRate:   AtoiDef(result[3], uint32(48000)),
		Channels:    AtoiDef(result[4], uint16(2)),
		PayloadType: AtoiDef(result[1], webrtc.PayloadType(111)),
	}
}

func AtoiDef[I uint |
	int |
	uint32 |
	uint16 |
	uint8 |
	webrtc.PayloadType](s string, defaultValue I) I {
	result, err := strconv.Atoi(s)
	if err != nil {
		return defaultValue
	}
	return I(result)
}
