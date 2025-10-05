package types

import (
	"time"

	"github.com/google/uuid"
)

type CreatePostRequest struct {
	Type     string   `json:"type" validate:"required,oneof=ideas video script"`        // обязательно, допустимые значения
	Title    string   `json:"title" validate:"required,min=3,max=100,forbidden_titles"` // обязательно, кастомный forbidden_titles
	Content  string   `json:"content" validate:"required,min=10"`                       // обязательно
	MediaURL string   `json:"media_url" validate:"omitempty,url"`                       // опционально, но должен быть валидным URL
	Payment  *float64 `json:"payment" validate:"omitempty,gte=0,lte=1000000"`           // опционально, от 0 до 1 000 000	Tags     []*Tag   `json:"tags"`
	Tags     []*Tag   `json:"tags"`
}

type UpdatePostRequest struct {
	Type     string `json:"type" validate:"omitempty,oneof=ideas video script"`        // опционально, допустимые значения
	Title    string `json:"title" validate:"omitempty,min=3,max=100,forbidden_titles"` // опционально, кастомный forbidden_titles
	Content  string `json:"content" validate:"omitempty,min=10"`                       // опционально
	MediaURL string `json:"media_url" validate:"omitempty,url"`                        // опционально, но должен быть валидным URL
	Tags     []*Tag `json:"tags"`
}

type PostResponse struct {
	Status string `json:"status"`
	Data   Post   `json:"data"`
}

type PostCreateResponse struct {
	Status string     `json:"status"`
	Data   PostCreate `json:"data"`
}

type Post struct {
	ID           uuid.UUID  `json:"id"`
	UserId       uuid.UUID  `json:"user_id"`
	UserName     string     `json:"user_name"`
	AuthorAvatar string     `json:"author_avatar"`
	Type         string     `json:"type" validate:"omitempty,oneof=ideas video script"`
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

type PostCreate struct {
	ID        uuid.UUID     `json:"id"`
	UserId    uuid.UUID     `json:"user_id"`
	UserName  string        `json:"user_name"`
	Type      string        `json:"type" validate:"omitempty,oneof=ideas video script"`
	Title     string        `json:"title"`
	Content   string        `json:"content"`
	MediaURL  string        `json:"media_url"`
	Payment   *float64      `json:"payment"`
	Tags      []*Tag        `json:"tags"`
	Files     []*FileCreate `json:"files"`
	CreatedAt time.Time     `json:"created"`
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

type PosResponse struct {
	Status string `json:"status"`
	Data   Post   `json:"data"`
}

type PostsResponse struct {
	Status     string             `json:"status"`
	Data       []Post             `json:"data"`
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
