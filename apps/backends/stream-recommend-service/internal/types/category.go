package types

// CreateCategoryRequest структура для запроса создания
type CreateCategoryRequest struct {
	Name        string `json:"name" validate:"required,min=3,max=50" example:"Стратегии"`
	Description string `json:"description" validate:"max=255" example:"Стратегии торговли"`
	AvatarURL   string `json:"avatar_url" validate:"omitempty,url" example:"/trade-strategies.png"`
}

// UpdateCategoryRequest структура для запроса обновления
type UpdateCategoryRequest struct {
	Name        string `json:"name" validate:"required,min=3,max=50" example:"Стратегии"`
	Description string `json:"description" validate:"max=255" example:"Стратегии торговли"`
	AvatarURL   string `json:"avatar_url" validate:"omitempty,url" example:"/trade-strategies.png"`
}
