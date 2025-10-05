package types

type StreamData struct {
	IsOnline       bool     `json:"is_online"`
	StreamName     string   `json:"stream_name,omitempty"`
	StreamCategory string   `json:"stream_category,omitempty"`
	StreamTags     []string `json:"stream_tags,omitempty"`
	ViewerCount    int      `json:"viewer_count,omitempty"`
	LastUpdatedAt  int64    `json:"last_updated_at,omitempty"`
	TranslationUrl string   `json:"translation_url,omitempty"`
}
