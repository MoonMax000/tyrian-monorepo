package types

import (
	"github.com/google/uuid"
	"time"
)

type FollowRequest struct {
	UserId uuid.UUID `json:"user_id"`
}

type UnfollowRequest struct {
	UserId uuid.UUID `json:"user_id"`
}

type LikeRequest struct {
	UserId uuid.UUID `json:"user_id"`
}

type FollowedResponse struct {
	Status     string             `json:"status"`
	Data       []Followed         `json:"data"`
	Pagination PaginationResponse `json:"pagination"`
}

type Follower struct {
	ID            uuid.UUID `json:"id"`
	Username      string    `json:"username"`
	Description   string    `json:"description"`
	AvatarURL     string    `json:"avatar_url"`
	CoverURL      string    `json:"cover_url"`
	DonationURL   string    `json:"donation_url,omitempty"`
	Subscribed    *bool     `json:"is_subscribed"`
	FollowerCount int64     `json:"follower_count"`
}

type UserResponse struct {
	ID          uuid.UUID `json:"id"`
	Username    string    `json:"username"`
	AvatarURL   string    `json:"avatar_url"`
	CoverURL    string    `json:"cover_url"`
	DonationURL string    `json:"donation_url,omitempty"`
	//LastOnline    int64     `json:"last_online"`
}

type UserIdsRequest struct {
	UserIds []string `json:"user_ids"`
}

type FollowerResponse struct {
	Status string   `json:"status"`
	Data   Follower `json:"data"`
}

type GetUserByIdResponse struct {
	Status string          `json:"status"`
	Data   GetUserByIdData `json:"data"`
}

type GetUserByIdData struct {
	ID            uuid.UUID `json:"id"`
	Email         string    `json:"email"`
	Username      string    `json:"username"`
	Description   string    `json:"description"`
	AvatarURL     string    `json:"avatar_url"`
	CoverURL      string    `json:"cover_url"`
	DonationURL   string    `json:"donation_url,omitempty"`
	Subscribed    *bool     `json:"is_subscribed"`
	FollowedCount int64     `json:"followed_count"`
	FollowerCount int64     `json:"follower_count"`
	PostCount     int64     `json:"post_count"`
	CreatedAt     time.Time `json:"created"`
}

type PaginationRequest struct {
	Page     int    `query:"page" json:"page"`
	PageSize int    `query:"page_size" json:"page_size"`
	SortType string `query:"sort_type" json:"sort_type" enums:"normal,recommended"`
}

type PaginationResponse struct {
	CurrentPage  int   `json:"current_page"`
	PageSize     int   `json:"page_size"`
	TotalPages   int   `json:"total_pages"`
	TotalRecords int64 `json:"total_records"`
}

type FollowersResponse struct {
	Status     string             `json:"status"`
	Data       []Follower         `json:"data"`
	Pagination PaginationResponse `json:"pagination,omitempty"`
}
type UsersResponse struct {
	Status     string             `json:"status"`
	Data       []UserResponse     `json:"data"`
	Pagination PaginationResponse `json:"pagination,omitempty"`
}

type Followers struct {
	ID            uuid.UUID `json:"id"`
	Username      string    `json:"username"`
	Email         string    `json:"email"`
	AvatarURL     string    `json:"avatar_url"`
	FollowerCount int64     `json:"follower_count"`
	IsSubscribed  bool      `json:"is_subscribed"`
}

// type SubscriberListRequest struct {
// 	Page     int    `query:"page" json:"page"`
// 	PageSize int    `query:"page_size" json:"page_size"`
// 	SortBy   string `query:"sort_by" json:"sort_by" enums:"username,subscriber_count"`
// 	SortDir  string `query:"sort_dir" json:"sort_dir" enums:"asc,desc"`
// }

type FollowersListResponse struct {
	Status     string             `json:"status"`
	Data       []Followers        `json:"data"`
	Pagination PaginationResponse `json:"pagination"`
}

type Followed struct {
	ID            uuid.UUID `json:"id"`
	Username      string    `json:"username"`
	Email         string    `json:"email"`
	Description   string    `json:"description"`
	AvatarURL     string    `json:"avatar_url"`
	CoverURL      string    `json:"cover_url"`
	DonationURL   string    `json:"donation_url,omitempty"`
	FollowerCount int64     `json:"follower_count"`
}
