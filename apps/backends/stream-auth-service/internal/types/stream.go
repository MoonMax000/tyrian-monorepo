package types

import "time"

type StreamSettingsUpdateRequest struct {
	Resolution   string `json:"resolution"`
	Bitrate      int    `json:"bitrate"`
	FrameRate    int    `json:"frame_rate"`
	AudioQuality string `json:"audio_quality"`
	VideoCodec   string `json:"video_codec"`
	AudioCodec   string `json:"audio_codec"`
}

type StreamSettingsResponse struct {
	Resolution   string `json:"resolution"`
	Bitrate      int    `json:"bitrate"`
	FrameRate    int    `json:"frame_rate"`
	AudioQuality string `json:"audio_quality"`
	VideoCodec   string `json:"video_codec"`
	AudioCodec   string `json:"audio_codec"`
}

type StreamPlanSettingsUpdateRequest struct {
	Game        string    `json:"game"`
	Description string    `json:"description"`
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
}

type StreamPlanSettingsResponse struct {
	Game        string    `json:"game"`
	Description string    `json:"description"`
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
}
