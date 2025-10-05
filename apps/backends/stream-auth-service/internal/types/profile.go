package types

import (
	"time"

	"gorm.io/datatypes"
)

type Profile struct {
	ID             string         `json:"id"`
	Username       string         `json:"username"`
	Email          string         `json:"email"`
	EmailConfirmed bool           `json:"email_confirmed"`
	Description    string         `json:"description"`
	AvatarURL      string         `json:"avatar_url"`
	CoverURL       string         `json:"cover_url"`
	DonationURL    string         `json:"donation_url"`
	Roles          []string       `json:"roles"`
	Permits        datatypes.JSON `json:"permits" swaggertype:"array,string"`
}

type ProfileUpdateRequest struct {
	Username    string `json:"username"`
	Description string `json:"description"`
	DonationURL string `json:"donation_url"`
}

type UserInfo struct {
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

type ListedUserInfo struct {
	UserInfo

	CollectionId   string `json:"collectionId"`
	CollectionName string `json:"collectionName"`
}

type AuthServiceUserInfo struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserListResponse struct {
	Status     string           `json:"status"`
	Items      []ListedUserInfo `json:"items"`
	Page       int              `json:"page"`
	PerPage    int              `json:"perPage"`
	TotalItems int              `json:"totalItems"`
	TotalPages int              `json:"totalPages"`
}

type UserUpdateRequest struct {
	Username       string   `json:"username" form:"username"`
	Description    string   `json:"description" form:"description"`
	Email          string   `json:"email" form:"email"`
	EmailConfirmed *bool    `json:"email_confirmed" form:"email_confirmed"`
	AvatarURL      string   `json:"avatar" form:"avatar"`
	CoverURL       string   `json:"cover" form:"cover"`
	DonationURL    string   `json:"donation" form:"donation"`
	Roles          []string `json:"roles" form:"roles"`
}
