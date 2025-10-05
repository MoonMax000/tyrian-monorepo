package types

// CreateTagRequest структура для запроса создания
type CreateTagRequest struct {
	Name string `json:"name" validate:"required,min=1,max=25" example:"крипта"`
}
