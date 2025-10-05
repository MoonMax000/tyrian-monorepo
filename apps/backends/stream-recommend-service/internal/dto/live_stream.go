package dto

import "github.com/google/uuid"

type LiveStreamParams struct {
	Key            []byte `json:"key"`
	TranslationUrl string `json:"translation_url"`
	Resolution     string `json:"resolution"`
	Bitrate        int    `json:"bitrate"`
	FrameRate      int    `json:"frame_rate"`
	AudioQuality   string `json:"audio_quality"`
	VideoCodec     string `json:"video_codec"`
	AudioCodec     string `json:"audio_codec"`
}

type LiveStreamStartMessage struct {
	UserID         uuid.UUID        `json:"user_id"`
	StreamName     string           `json:"stream_name"`
	StreamCategory string           `json:"stream_category"`
	StreamTags     []string         `json:"stream_tags"`
	Params         LiveStreamParams `json:"params"`
}

type StreamStatusMessage struct {
	UserID         uuid.UUID `json:"user_id"`
	ViewerCount    int       `json:"viewer_count"`
	IsOnline       bool      `json:"is_online"`
	StreamName     string    `json:"stream_name"`
	StreamCategory string    `json:"stream_category"`
	StreamTags     []string  `json:"stream_tags"`
	TranslationUrl string    `json:"translation_url"`
}
