package types

import "time"

type StatisticsEntry struct {
	Id             string   `json:"id"`
	Username       string   `json:"username"`
	Email          string   `json:"email"`
	EmailConfirmed bool     `json:"email_confirmed"`
	Description    string   `json:"description"`
	AvatarURL      string   `json:"avatar"`
	CoverURL       string   `json:"cover"`
	DonationURL    string   `json:"donation"`
	Roles          []string `json:"roles"`

	Created time.Time `json:"created"`
	Updated time.Time `json:"updated"`
}

type StatisticsResponse struct {
	Status     string            `json:"status"`
	Items      []StatisticsEntry `json:"items"`
	Page       int               `json:"page"`
	PerPage    int               `json:"perPage"`
	TotalItems int               `json:"totalItems"`
	TotalPages int               `json:"totalPages"`
}
