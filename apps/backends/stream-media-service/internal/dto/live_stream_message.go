package dto

import (
	"encoding/json"

	"github.com/google/uuid"
)

/**

{"stream_name": "My cool stream", "user_info": {"user_id": "a08bf07f-2486-40bf-be9e-ca804b3dd841"}, "params": {"key": ""}}

**/

type LiveStreamCommand uint8

const (
	LiveStreamCommandStart LiveStreamCommand = iota
	LiveStreamCommandStop
)

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

func (liveStreamParams LiveStreamParams) MarshalBinary() ([]byte, error) {
	return json.Marshal(liveStreamParams)
}

type LiveStreamMessage struct {
	Command        LiveStreamCommand `json:"command"`
	UserInfo       *NotifyUserInfo   `json:"user_info"`
	StreamName     *string           `json:"stream_name"`
	StreamCategory *string           `json:"stream_category"`
	StreamTags     *[]string         `json:"stream_tags"`
	Params         *LiveStreamParams `json:"params"`
}

func (liveStreamMessage LiveStreamMessage) MarshalBinary() ([]byte, error) {
	return json.Marshal(liveStreamMessage)
}

type LiveStreamStartMessage struct {
	UserID     uuid.UUID        `json:"user_id"`
	StreamName string           `json:"stream_name"`
	Params     LiveStreamParams `json:"params"`
}

func (liveStreamStatMessage LiveStreamStartMessage) MarshalBinary() ([]byte, error) {
	return json.Marshal(liveStreamStatMessage)
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

func (streamStatusMessage StreamStatusMessage) MarshalBinary() ([]byte, error) {
	return json.Marshal(streamStatusMessage)
}
