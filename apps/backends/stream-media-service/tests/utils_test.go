package tests

import (
	"testing"

	"github.com/Capstane/stream-media-service/internal/translation"
)

func TestExtractUFrag(t *testing.T) {
	sdp := `
answer: v=0
o=- 9151962561418830216 1739454445 IN IP4 0.0.0.0
s=-
t=0 0
a=msid-semantic:WMS*
a=fingerprint:sha-256 2D:93:B9:0B:D4:9F:B4:AB:2F:20:C2:F3:DB:9A:DB:3C:DB:5E:86:1C:D0:54:18:FF:3A:F5:25:1F:D6:36:DF:7F
a=group:BUNDLE 0 1
m=video 9 UDP/TLS/RTP/SAVPF 120 124 121 125 126 127
c=IN IP4 0.0.0.0
a=setup:active
a=mid:0
a=ice-ufrag:HGEQPYAADfbhUBki
a=ice-pwd:hPnATTEnMSvPWwHtlnzyEnIJSNoAsCYQ
a=rtcp-mux
a=rtcp-rsize
a=rtpmap:120 VP8/90000
a=fmtp:120 max-fs=12288;max-fr=60
a=rtcp-fb:120 goog-remb 
a=rtcp-fb:120 ccm fir
a=rtcp-fb:120 nack 
a=rtcp-fb:120 nack pli
a=rtcp-fb:120 nack 
a=rtcp-fb:120 nack pli
a=rtcp-fb:120 transport-cc 
a=rtpmap:124 rtx/90000
a=fmtp:124 apt=120
a=rtpmap:121 VP9/90000
a=fmtp:121 max-fs=12288;max-fr=60
a=rtcp-fb:121 goog-remb 
a=rtcp-fb:121 ccm fir
a=rtcp-fb:121 nack 
a=rtcp-fb:121 nack pli
a=rtcp-fb:121 nack 
a=rtcp-fb:121 nack pli
a=rtcp-fb:121 transport-cc 
a=rtpmap:125 rtx/90000
a=fmtp:125 apt=121
a=rtpmap:126 H264/90000
a=fmtp:126 profile-level-id=42e01f;level-asymmetry-allowed=1;packetization-mode=1
a=rtcp-fb:126 goog-remb 
a=rtcp-fb:126 ccm fir
a=rtcp-fb:126 nack 
a=rtcp-fb:126 nack pli
a=rtcp-fb:126 nack 
a=rtcp-fb:126 nack pli
a=rtcp-fb:126 transport-cc 
a=rtpmap:127 rtx/90000
a=fmtp:127 apt=126
a=extmap:3 urn:ietf:params:rtp-hdrext:sdes:mid
a=extmap:7 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01
a=ssrc-group:FID 4143495049 1983411159
a=ssrc:4143495049 cname:pion
a=ssrc:4143495049 msid:pion video
a=ssrc:4143495049 mslabel:pion
a=ssrc:4143495049 label:video
a=ssrc:1983411159 cname:pion
a=ssrc:1983411159 msid:pion video
a=ssrc:1983411159 mslabel:pion
a=ssrc:1983411159 label:video
a=msid:pion video
a=sendonly
a=candidate:279497945 1 udp 2130706431 87.228.29.225 54455 typ host
a=candidate:279497945 2 udp 2130706431 87.228.29.225 54455 typ host
a=candidate:1810372541 1 udp 2130706431 10.1.0.1 47364 typ host
a=candidate:1810372541 2 udp 2130706431 10.1.0.1 47364 typ host
a=candidate:2207250066 1 udp 2130706431 10.166.44.1 57676 typ host
a=candidate:2207250066 2 udp 2130706431 10.166.44.1 57676 typ host
a=candidate:233762139 1 udp 2130706431 172.17.0.1 53539 typ host
a=candidate:233762139 2 udp 2130706431 172.17.0.1 53539 typ host
a=candidate:361876842 1 udp 1694498815 87.228.29.225 34297 typ srflx raddr 0.0.0.0 rport 34297
a=candidate:361876842 2 udp 1694498815 87.228.29.225 34297 typ srflx raddr 0.0.0.0 rport 34297
a=candidate:361876842 1 udp 1694498815 87.228.29.225 40689 typ srflx raddr 0.0.0.0 rport 40689
a=candidate:361876842 2 udp 1694498815 87.228.29.225 40689 typ srflx raddr 0.0.0.0 rport 40689
a=candidate:361876842 1 udp 1694498815 87.228.29.225 54261 typ srflx raddr 0.0.0.0 rport 54261
a=candidate:361876842 2 udp 1694498815 87.228.29.225 54261 typ srflx raddr 0.0.0.0 rport 54261
a=candidate:361876842 1 udp 1694498815 87.228.29.225 35400 typ srflx raddr 0.0.0.0 rport 35400
a=candidate:361876842 2 udp 1694498815 87.228.29.225 35400 typ srflx raddr 0.0.0.0 rport 35400
a=candidate:361876842 1 udp 1694498815 87.228.29.225 34694 typ srflx raddr 0.0.0.0 rport 34694
a=candidate:361876842 2 udp 1694498815 87.228.29.225 34694 typ srflx raddr 0.0.0.0 rport 34694
a=end-of-candidates
m=audio 9 UDP/TLS/RTP/SAVPF 109 9 0 8
c=IN IP4 0.0.0.0
a=setup:active
a=mid:1
a=ice-ufrag:HGEQPYAADfbhUBki
a=ice-pwd:hPnATTEnMSvPWwHtlnzyEnIJSNoAsCYQ
a=rtcp-mux
a=rtcp-rsize
a=rtpmap:109 opus/48000/2
a=fmtp:109 maxplaybackrate=48000;stereo=1;useinbandfec=1
a=rtpmap:9 G722/8000/1
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
a=ssrc:1751335073 cname:pion
a=ssrc:1751335073 msid:pion audio
a=ssrc:1751335073 mslabel:pion
a=ssrc:1751335073 label:audio
a=msid:pion audio
a=sendonly
	`

	uFrag := translation.ExtractUFragFromText(sdp)
	if uFrag != "HGEQPYAADfbhUBki" {
		t.Fail()
	}
}
