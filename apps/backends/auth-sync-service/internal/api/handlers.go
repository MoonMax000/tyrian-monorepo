package api

import (
	"auth-sync/internal/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserService interface {
	CreateUser(email, password string) error
	CheckUser(email, password string) (string, error)
	UpdateUser(email, password string) error
}

type Handler struct {
	userService UserService
}

func NewHandler(userService UserService) *Handler {
	return &Handler{userService: userService}
}

// @Summary Create user
// @Description Create a new user
// @Description Creates a new user account with email and password
// @Tags Authentication
// @Accept json
// @Produce json
// @Param user body models.User true "User credentials"
// @Success 201 {string} string "User created successfully"
// @Failure 400 {object} ErrorResponse "Validation error or user already exists"
// @Example {json} Request Example:
//
//	{
//	  "email": "user@example.com",
//	  "password": "securepassword123"
//	}
//
// @Router /users [post]
func (h *Handler) CreateUser(c *gin.Context) {
	log.Printf("CreateUser request received from %s", c.ClientIP())

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		log.Printf("Failed to bind JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Attempting to create user with email: %s", user.Email)
	err := h.userService.CreateUser(user.Email, user.Password)
	if err != nil {
		log.Printf("Failed to create user: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Рассылка запросов по микросервисам для создания пользователя
	go sendRequest(user.Email, user.Password, "CREATE")

	log.Printf("User created successfully with email: %s", user.Email)
	c.Status(http.StatusCreated)
}

// @Summary Check user
// @Description Check user credentials.Да, POST-запрос) Это сделано намеренно.
// @Description Validates user credentials and returns authentication status
// @Tags Authentication
// @Accept json
// @Produce json
// @Param credentials body models.UserCredentials true "User email and password"
// @Success 200 {object} models.UserResponse "Status can be: registered, email_exists, or unregistered"
// @Failure 400 {object} ErrorResponse "Invalid request format"
// @Failure 500 {object} ErrorResponse "Internal server error"
// @Example {json} Request Example:
//
//	{
//	  "email": "user@example.com",
//	  "password": "securepassword123"
//	}
//
// @Example {json} Success Response:
//
//	{
//	  "status": "registered"
//	}
//
// @Router /users/check [post]
func (h *Handler) CheckUser(c *gin.Context) {
	log.Printf("CheckUser request received from %s", c.ClientIP())

	var credentials models.UserCredentials
	if err := c.ShouldBindJSON(&credentials); err != nil {
		log.Printf("Failed to bind JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Checking credentials for email: %s", credentials.Email)
	status, err := h.userService.CheckUser(credentials.Email, credentials.Password)
	if err != nil {
		log.Printf("Error checking user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("User check completed for email: %s, status: %s", credentials.Email, status)
	c.JSON(http.StatusOK, models.UserResponse{Status: status})
}

// @Summary Update user
// @Description Update user password
// @Description Updates the password for an existing user
// @Tags Authentication
// @Accept json
// @Produce json
// @Param user body models.User true "User email and new password"
// @Success 200 {string} string "Password updated successfully"
// @Failure 400 {object} ErrorResponse "Invalid request format"
// @Failure 404 {object} ErrorResponse "Invalid credentials"
// @Example {json} Request Example:
//
//	{
//	  "email": "user@example.com",
//	  "password": "newpassword123"
//	}
//
// @Router /users [patch]
func (h *Handler) UpdateUser(c *gin.Context) {
	log.Printf("UpdateUser request received from %s", c.ClientIP())

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		log.Printf("Failed to bind JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Attempting to update password for email: %s", user.Email)
	err := h.userService.UpdateUser(user.Email, user.Password)
	if err != nil {
		log.Printf("Failed to update user: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Invalid credentials"})
		return
	}

	// Рассылка запросов по микросервисам для обновления пароля пользователя
	go sendRequest(user.Email, user.Password, "UPDATE")

	log.Printf("Password updated successfully for email: %s", user.Email)
	c.Status(http.StatusOK)
}

type ErrorResponse struct {
	Error string `json:"error"`
}
