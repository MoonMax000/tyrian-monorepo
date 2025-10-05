package translation

import (
	"regexp"

	"github.com/pion/webrtc/v4"
)

var uFragRegexp = regexp.MustCompile(`a=ice-ufrag:(\w+)`)

func ExtractUFrag(sd *webrtc.SessionDescription) string {
	if sd == nil {
		return "nil"
	}
	return ExtractUFragFromText(sd.SDP)
}

func ExtractUFragFromText(sdp string) string {
	result := uFragRegexp.FindAllStringSubmatch(sdp, 1)
	if result != nil {
		return result[0][1]
	}
	return ""
}
