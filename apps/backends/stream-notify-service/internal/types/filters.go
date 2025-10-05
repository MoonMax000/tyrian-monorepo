package types

type Filters struct {
	Type         string `json:"type"`
	Subscription bool   `json:"subscription"`
	StatusStream bool   `json:"status_stream"`
}
