package types

import (
	"time"

	"github.com/google/uuid"
)

type CreatePostRequest struct {
	Type     string   `json:"type" validate:"required,oneof=ideas videos opinions analytics softwares"` // обязательно, допустимые значения
	Title    string   `json:"title" validate:"required,min=3,max=100,forbidden_titles"`                 // обязательно, кастомный forbidden_titles
	Content  string   `json:"content" validate:"required,min=5"`                                        // обязательно
	MediaURL string   `json:"media_url" validate:"omitempty,url"`                                       // опционально, но должен быть валидным URL
	Payment  *float64 `json:"payment" validate:"omitempty,gte=0,lte=1000000"`                           // опционально, от 0 до 1 000 000
	Tags     []*Tag   `json:"tags"`
}

type CreateBlockRequest struct {
	Content  string `json:"content" validate:"required,min=5"`  // обязательно
	MediaURL string `json:"media_url" validate:"omitempty,url"` // опционально, но должен быть валидным URL
	Name     string `json:"name" validate:"required"`
}
type GetBlocks struct {
	Blocks []CreateBlockRequest `json:"blocks"`
}

type UpdatePostRequest struct {
	Type     string `json:"type" validate:"omitempty,oneof=ideas videos opinions analytics softwares"` // опционально, допустимые значения
	Title    string `json:"title" validate:"omitempty,min=3,max=100,forbidden_titles"`                 // опционально, кастомный forbidden_titles
	Content  string `json:"content" validate:"omitempty,min=5"`                                        // опционально
	MediaURL string `json:"media_url" validate:"omitempty,url"`                                        // опционально, но должен быть валидным URL
	Tags     []*Tag `json:"tags"`
}

type UpdateBlockRequest struct {
	Content     string `json:"content" validate:"omitempty,min=5"` // опционально
	MediaURL    string `json:"media_url" validate:"omitempty,url"` // опционально, но должен быть валидным URL
	NextBlockID string `json:"next_block_id" validate:"omitempty,uuid"`
}

type PostResponse struct {
	Status string `json:"status"`
	Data   Post   `json:"data"`
}

type BlockResponse struct {
	Status string `json:"status"`
	Data   Block  `json:"data"`
}

type PostCreateResponse struct {
	Status string       `json:"status"`
	Data   PostCreateV2 `json:"data"`
}

type BlockCreateResponse struct {
	Status string      `json:"status"`
	Data   BlockCreate `json:"data"`
}

type Post struct {
	ID           uuid.UUID  `json:"id"`
	UserId       uuid.UUID  `json:"user_id"`
	UserEmail    string     `json:"user_email"`
	AuthorAvatar string     `json:"author_avatar"`
	Type         string     `json:"type" validate:"omitempty,oneof=ideas videos opinions analytics softwares"`
	Title        string     `json:"title"`
	Content      string     `json:"content"`
	MediaURL     string     `json:"media_url"`
	Tags         []*Tag     `json:"tags"`
	Files        []*File    `json:"files"`
	LikeCount    int        `json:"like_count"`
	LikeAt       *time.Time `json:"liked"`
	FavoredAt    *time.Time `json:"favorite"`
	CreatedAt    time.Time  `json:"created"`
	Payment      *float64   `json:"payment"`
	NeedPayment  bool       `json:"need_payment"`
}

type PostV2 struct {
	ID           uuid.UUID  `json:"id"`
	UserId       uuid.UUID  `json:"user_id"`
	UserEmail    string     `json:"user_email"`
	AuthorAvatar string     `json:"author_avatar"`
	Type         string     `json:"type" validate:"omitempty,oneof=ideas videos opinions analytics softwares"`
	Title        string     `json:"title"`
	Content      string     `json:"content"`
	MediaURL     string     `json:"media_url"`
	Tags         []*Tag     `json:"tags"`
	Blocks       []*Block   `json:"blocks"`
	LikeCount    int        `json:"like_count"`
	LikeAt       *time.Time `json:"liked"`
	FavoredAt    *time.Time `json:"favorite"`
	CreatedAt    time.Time  `json:"created"`
	Payment      *float64   `json:"payment"`
	NeedPayment  bool       `json:"need_payment"`
	FirstBlockID uuid.UUID  `json:"first_block_id"`
}

type Block struct {
	ID          uuid.UUID `json:"id"`
	Content     string    `json:"content"`
	MediaURL    string    `json:"media_url"`
	Files       []*File   `json:"files"`
	PostID      uuid.UUID `json:"post_id"`
	NextBlockID string    `json:"next_block_id"`
}

type IndexPost struct {
	ID        uuid.UUID `json:"id"`
	UserId    uuid.UUID `json:"user_id"`
	UserEmail string    `json:"user_email"`
	Type      string    `json:"type" validate:"omitempty,oneof=ideas videos opinions analytics softwares"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	MediaURL  string    `json:"media_url"`
	Payment   *float64  `json:"payment"`
	Tags      []*Tag    `json:"tags"`
	CreatedAt time.Time `json:"created"`
}

type IndexBlock struct {
	ID        uuid.UUID     `json:"id"`
	PostId    uuid.UUID     `json:"post_id"`
	Content   string        `json:"content"`
	MediaURL  string        `json:"media_url"`
	Files     []*FileCreate `json:"files"`
	CreatedAt time.Time     `json:"created"`
}

type PostCreate struct {
	ID           uuid.UUID `json:"id"`
	UserId       uuid.UUID `json:"user_id"`
	UserName     string    `json:"user_name"`
	Type         string    `json:"type" validate:"omitempty,oneof=ideas videos opinions analytics softwares"`
	Title        string    `json:"title"`
	Content      string    `json:"content"`
	MediaURL     string    `json:"media_url"`
	Payment      *float64  `json:"payment"`
	Tags         []*Tag    `json:"tags"`
	FirstBlockID uuid.UUID `json:"first_block_id"`
	CreatedAt    time.Time `json:"created"`
}

type PostCreateV2 struct {
	ID           uuid.UUID     `json:"id"`
	UserId       uuid.UUID     `json:"user_id"`
	UserEmail    string        `json:"user_email"`
	Type         string        `json:"type" validate:"omitempty,oneof=ideas videos opinions analytics softwares"`
	Title        string        `json:"title"`
	Content      string        `json:"content"`
	MediaURL     string        `json:"media_url"`
	Payment      *float64      `json:"payment"`
	Tags         []*Tag        `json:"tags"`
	FirstBlockID uuid.UUID     `json:"first_block_id"`
	CreatedAt    time.Time     `json:"created"`
	Blocks       []BlockCreate `json:"blocks"`
}

type BlockCreate struct {
	ID        uuid.UUID     `json:"id"`
	PostId    uuid.UUID     `json:"post_id"`
	Content   string        `json:"content"`
	MediaURL  string        `json:"media_url"`
	Files     []*FileCreate `json:"files"`
	CreatedAt time.Time     `json:"created"`
	PrevBlock uuid.UUID     `json:"prev_block"`
	NextBlock *uuid.UUID    `json:"next_block"`
}

type File struct {
	ID       uuid.UUID `json:"id"`
	Name     string    `json:"name"`
	UserName string    `json:"user_name"`
	FileSize int64     `json:"file_size"`
	Ext      string    `json:"ext"`
	Type     string    `json:"type"`
	Url      string    `json:"url"`
}

type FileCreate struct {
	ID       uuid.UUID `json:"id"`
	Name     string    `json:"name"`
	UserName string    `json:"user_name"`
	FileSize int64     `json:"file_size"`
	Ext      string    `json:"ext"`
	Type     string    `json:"type"`
	Url      string    `json:"url"`
}

type Tag struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

type TagSearchResponse struct {
	Status     string             `json:"status"`
	Data       []*Tag             `json:"data"`
	Pagination PaginationResponse `json:"pagination,omitempty"`
}

type PosResponse struct {
	Status string `json:"status"`
	Data   Post   `json:"data"`
}

type PosResponseV2 struct {
	Status string `json:"status"`
	Data   PostV2 `json:"data"`
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

type PostsResponse struct {
	Status     string             `json:"status"`
	Data       []Post             `json:"data"`
	Pagination PaginationResponse `json:"pagination,omitempty"`
}

type PostsResponseV2 struct {
	Status     string             `json:"status"`
	Data       []PostV2           `json:"data"`
	Pagination PaginationResponse `json:"pagination,omitempty"`
}

type DeleteFilesRequest struct {
	FileIDs []string `json:"file_ids"`
}

type FileResponse struct {
	ID  uuid.UUID `json:"file_id"`
	Url string    `json:"s3_url"`
}

type UploadFilesResponse struct {
	ID    uuid.UUID      `json:"post_id"`
	Files []FileResponse `json:"file_ids"`
}
type StatusFilesResponse struct {
	Status string              `json:"status"`
	Data   UploadFilesResponse `json:"data"`
}
