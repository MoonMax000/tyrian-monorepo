package models

import "time"

// User represents the user model
// @Description User account information
type User struct {
	Email     string    `json:"email" example:"user@example.com" binding:"required"`
	Password  string    `json:"password" example:"password123" binding:"required"`
	CreatedAt time.Time `json:"-" swaggerignore:"true"`
	UpdatedAt time.Time `json:"-" swaggerignore:"true"`
	ID        uint      `json:"-" swaggerignore:"true"`
}

// UserResponse represents the response for user check
// @Description Response containing user status
type UserResponse struct {
	// Status of the user check
	// @Example registered
	Status string `json:"status" example:"registered" enums:"registered,email_exists,unregistered"`
}

// UserCredentials represents user authentication credentials
type UserCredentials struct {
	Email    string `json:"email" binding:"required" example:"user@example.com"`
	Password string `json:"password" binding:"required" example:"password123"`
}
