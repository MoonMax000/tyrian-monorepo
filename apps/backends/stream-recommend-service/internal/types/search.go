package types

type SearchChannelsResponse struct {
	Status string         `json:"status"`
	Data   []SearchResult `json:"data"`
}

type SearchResult struct {
	Channel   Channel `json:"channel"`
	MatchedOn string  `json:"matched_on"` // "category", "tag", "stream_name", "username"
	Score     int     `json:"score"`      // опционально: для ранжирования
}
