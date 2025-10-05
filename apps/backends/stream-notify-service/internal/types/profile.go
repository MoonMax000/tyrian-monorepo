package types

type Profile struct {
	ID             string   `json:"id"`
	Username       string   `json:"username"`
	Email          string   `json:"email"`
	EmailConfirmed bool     `json:"email_confirmed"`
	Description    string   `json:"description"`
	AvatarURL      string   `json:"avatar_url"`
	CoverURL       string   `json:"cover_url"`
	Roles          []string `json:"roles"`
}
