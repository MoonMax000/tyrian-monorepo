package types

type StreamSettings struct {
	Resolution   string `json:"resolution"`
	Bitrate      int    `json:"bitrate"`
	FrameRate    int    `json:"frame_rate"`
	AudioQuality string `json:"audio_quality"`
	VideoCodec   string `json:"video_codec"`
	AudioCodec   string `json:"audio_codec"`
	Key          string `json:"key"`
}
