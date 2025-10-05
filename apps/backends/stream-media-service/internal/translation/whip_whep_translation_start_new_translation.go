package translation

import (
	"bufio"
	"embed"
	"encoding/binary"
	"errors"
	"fmt"
	"io"
	"os"
	"strings"
	"time"

	"github.com/Capstane/stream-media-service/internal/dto"
	"github.com/at-wat/ebml-go"
	"github.com/at-wat/ebml-go/webm"
	"github.com/pion/webrtc/v4"
	"github.com/pion/webrtc/v4/pkg/media"
)

//go:embed static
var staticFs embed.FS

const (
	spsCountOffset = 5

	naluTypeBitmask = 0x1F
	spsID           = 0x67
	ppsID           = 0x68
)

// nolint: gochecknoglobals
var annexBPrefix = []byte{0x00, 0x00, 0x01}

func (translation *WhipWhepTranslation) StartNewTranslation(liveStreamMessage *dto.LiveStreamMessage) error {
	// Everything below is the Pion WebRTC API ❤️.

	configuration := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{
				URLs: []string{
					"stun:stun.l.google.com:19302",
					// "stun:stun.l.google.com:5349",
					// "stun:stun1.l.google.com:3478",
					// "stun:stun1.l.google.com:5349",
					// "stun:stun2.l.google.com:19302",
					// "stun:stun2.l.google.com:5349",
					// "stun:stun3.l.google.com:3478",
					// "stun:stun3.l.google.com:5349",
					// "stun:stun4.l.google.com:19302",
					// "stun:stun4.l.google.com:5349",
				},
			},
		},
	}
	translation.configuration = &configuration
	// Create a Audio Track
	audioTrack, err := webrtc.NewTrackLocalStaticRTP(webrtc.RTPCodecCapability{MimeType: webrtc.MimeTypeOpus}, "audio", "pion",
		func(tlsr *webrtc.TrackLocalStaticRTP) {
		})
	if err != nil {
		return err
	}
	translation.tracks = append(translation.tracks, audioTrack)

	// Create a Video Track
	videoTrack, err := webrtc.NewTrackLocalStaticRTP(webrtc.RTPCodecCapability{MimeType: webrtc.MimeTypeH264}, "video", "pion",
		func(tlsr *webrtc.TrackLocalStaticRTP) {
		})
	if err != nil {
		return err
	}
	translation.tracks = append(translation.tracks, videoTrack)

	peerConnection, err := translation.newPeerConnection()
	if err != nil {
		return err
	}
	translation.peerConnection = peerConnection

	// TODO: global cache
	_, err = staticFs.ReadFile("static/translation-coming-soon.mkv")
	if err != nil {
		return err
	}

	// go func() {
	// 	// Wait for the offer to be pasted
	// 	offer := webrtc.SessionDescription{}
	// 	decode(readUntilNewline(), &offer)

	// 	// Set the remote SessionDescription
	// 	if err = peerConnection.SetRemoteDescription(offer); err != nil {
	// 		log.Error().Msgf("can't set the remote SessionDescription, the issue is %v", err)
	// 		return
	// 	}

	// 	// Create answer
	// 	answer, err := peerConnection.CreateAnswer(nil)
	// 	if err != nil {
	// 		log.Error().Msgf("can't create answer, the issue is %v", err)
	// 		return
	// 	}

	// 	// Create channel that is blocked until ICE Gathering is complete
	// 	gatherComplete := webrtc.GatheringCompletePromise(peerConnection)

	// 	// Sets the LocalDescription, and starts our UDP listeners
	// 	if err = peerConnection.SetLocalDescription(answer); err != nil {
	// 		log.Error().Msgf("can't sets the LocalDescription, and starts our UDP listeners, the issue is %v", err)
	// 		return
	// 	}

	// 	// Block until ICE Gathering is complete, disabling trickle ICE
	// 	// we do this because we only can exchange one signaling message
	// 	// in a production application you should exchange ICE Candidates via OnICECandidate
	// 	<-gatherComplete

	// 	// Output the answer in base64 so we can paste it in browser
	// 	fmt.Println(encode(peerConnection.LocalDescription()))

	// 	// Read from the MKV and write the Audio and Video tracks
	// 	sendMkv(NewCyclicBytesReader(mkvData), audioTrack, videoTrack)

	// }()

	return nil
}

// Write the audio samples to the video and audio track. Record how long we have been sleeping
// time.Sleep may sleep longer then expected
func chanToTrack(sampleChan chan media.Sample, track *webrtc.TrackLocalStaticSample) error {
	var (
		sleepWanted time.Duration
		sleepStart  time.Time
	)

	for s := range sampleChan {
		if err := track.WriteSample(s); err != nil {
			return err
		}

		sleepDebt := sleepWanted - time.Since(sleepStart)
		sleepStart, sleepWanted = time.Now(), s.Duration
		time.Sleep(s.Duration + sleepDebt)
	}
	return nil
}

func sendMkv(mkvReader *CyclicBytesReader, audioTrack, videoTrack *webrtc.TrackLocalStaticSample) error {
	var unmarshaled struct {
		Header  webm.EBMLHeader `ebml:"EBML"`
		Segment webm.Segment    `ebml:"Segment"`
	}

	// Parse the MKV file into memory
	if err := ebml.Unmarshal(mkvReader, &unmarshaled); err != nil {
		return err
	}

	var (
		audioTrackNumber, videoTrackNumber   uint64
		lastAudioTimeCode, lastVideoTimeCode uint64
		oldTimeCode                          uint64
		spsAndPPS                            []byte
	)

	audioQueue, videoQueue := make(chan media.Sample, 10), make(chan media.Sample, 10)
	go chanToTrack(audioQueue, audioTrack)
	go chanToTrack(videoQueue, videoTrack)

	// Get the ID associated with the Audio+Video track. This is used latter when
	// actually processing the media packets
	for _, t := range unmarshaled.Segment.Tracks.TrackEntry {
		switch t.CodecID {
		case "V_MPEG4/ISO/AVC":
			videoTrackNumber = t.TrackNumber
			spsAndPPS = extractMetadata(t.CodecPrivate)
		case "A_OPUS":
			audioTrackNumber = t.TrackNumber
		}
	}

	if audioTrackNumber == 0 || videoTrackNumber == 0 {
		panic("MKV file must contain one H264 and one Opus Track")
	}

	// Loop the entire file and convert nanosecond timestamps to Durations
	// and push onto channels. These channels pace the send of audio and video
	for _, cluster := range unmarshaled.Segment.Cluster {
		for _, block := range cluster.SimpleBlock {
			timecode := (cluster.Timecode + uint64(block.Timecode)) * unmarshaled.Segment.Info.TimecodeScale

			if block.TrackNumber == videoTrackNumber {
				// Convert H264 from AVC bitstream to Annex-B
				annexBSlice := []byte{}

				// Metadata around the stream is stored in Matroska Header
				if block.Keyframe {
					annexBSlice = append(annexBSlice, spsAndPPS...)
				}

				for {
					if len(block.Data[0]) == 0 {
						break
					}

					naluSize := binary.BigEndian.Uint32(block.Data[0])
					block.Data[0] = block.Data[0][4:]

					annexBSlice = append(annexBSlice, annexBPrefix...)
					annexBSlice = append(annexBSlice, block.Data[0][:naluSize]...)

					block.Data[0] = block.Data[0][naluSize:]
				}

				// Send to video goroutine for paced sending
				lastVideoTimeCode, oldTimeCode = timecode, lastVideoTimeCode
				videoQueue <- media.Sample{Data: annexBSlice, Duration: time.Duration(timecode - oldTimeCode)}
			} else {
				// Send to audio goroutine for paced sending
				lastAudioTimeCode, oldTimeCode = timecode, lastAudioTimeCode
				audioQueue <- media.Sample{Data: block.Data[0], Duration: time.Duration(timecode - oldTimeCode)}
			}
		}
	}
	return nil
}

// Convert AVC Extradata to Annex-B SPS and PPS
func extractMetadata(codecData []byte) (out []byte) {
	spsCount := codecData[spsCountOffset] & naluTypeBitmask
	offset := 6
	for i := 0; i < int(spsCount); i++ {
		spsLen := binary.BigEndian.Uint16(codecData[offset : offset+2])
		offset += 2
		if codecData[offset] != spsID {
			panic("Failed to parse SPS")
		}

		out = append(out, annexBPrefix...)
		out = append(out, codecData[offset:offset+int(spsLen)]...)
		offset += int(spsLen)
	}

	ppsCount := codecData[offset]
	offset++
	for i := 0; i < int(ppsCount); i++ {
		ppsLen := binary.BigEndian.Uint16(codecData[offset : offset+2])
		offset += 2
		if codecData[offset] != ppsID {
			panic("Failed to parse PPS")
		}

		out = append(out, annexBPrefix...)
		out = append(out, codecData[offset:offset+int(ppsLen)]...)
		offset += int(ppsLen)
	}

	return
}

// Read incoming RTCP packets
// Before these packets are returned they are processed by interceptors. For things
// like NACK this needs to be called.
func rtcpReader(rtpSender *webrtc.RTPSender) {
	go func() {
		rtcpBuf := make([]byte, 1500)
		for {
			if _, _, rtcpErr := rtpSender.Read(rtcpBuf); rtcpErr != nil {
				return
			}
		}
	}()
}

// Read from stdin until we get a newline
func readUntilNewline() (in string) {
	var err error

	r := bufio.NewReader(os.Stdin)
	for {
		in, err = r.ReadString('\n')
		if err != nil && !errors.Is(err, io.EOF) {
			panic(err)
		}

		if in = strings.TrimSpace(in); len(in) > 0 {
			break
		}
	}

	fmt.Println("")
	return
}

// // JSON encode + base64 a SessionDescription
// func encode(obj *webrtc.SessionDescription) string {
// 	b, err := json.Marshal(obj)
// 	if err != nil {
// 		panic(err)
// 	}

// 	return base64.StdEncoding.EncodeToString(b)
// }

// // Decode a base64 and unmarshal JSON into a SessionDescription
// func decode(in string, obj *webrtc.SessionDescription) error {
// 	b, err := base64.StdEncoding.DecodeString(in)
// 	if err != nil {
// 		return err
// 	}

// 	if err = json.Unmarshal(b, obj); err != nil {
// 		return err
// 	}
// 	return nil
// }
