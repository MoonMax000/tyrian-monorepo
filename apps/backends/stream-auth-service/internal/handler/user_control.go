package handler

import (
	"github.com/Capstane/stream-auth-service/internal/model"
	"github.com/Capstane/stream-auth-service/internal/types"
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
	"golang.org/x/crypto/bcrypt"
)

// UserControlRequest represents request body for user control endpoints
type UserControlRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// @Summary Create or update user
// @Description Create new user or update existing user's password without email confirmation
// @Tags auth
// @Accept json
// @Produce json
// @Param request body UserControlRequest true "User credentials"
// @Success 201 {object} types.SuccessResponse "User created"
// @Success 200 {object} types.SuccessResponse "Password updated"
// @Failure 400 {object} types.FailureResponse "Validation error"
// @Failure 404 {object} types.FailureResponse "User not found"
// @Router /auth/as-user-control [post]
// @Router /auth/as-user-control [patch]
func (h *Handler) HandleUserControl(c *fiber.Ctx) error {
	log.Debug().
		Str("method", c.Method()).
		Str("path", c.Path()).
		Msg("Handling user control request")

	input := new(UserControlRequest)
	if err := c.BodyParser(input); err != nil {
		log.Error().
			Err(err).
			Msg("Failed to parse request body")
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Invalid request body",
			Error:   err.Error(),
		})
	}

	// Validate email
	if !validateEmail(input.Email) {
		log.Warn().
			Str("email", input.Email).
			Msg("Invalid email format")
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Invalid email address",
		})
	}

	switch c.Method() {
	case "POST":
		log.Info().
			Str("email", input.Email).
			Msg("Creating new user without confirmation")
		return h.createUserWithoutConfirmation(c, input)
	case "PATCH":
		log.Info().
			Str("email", input.Email).
			Msg("Updating user password")
		return h.updateUserPassword(c, input)
	default:
		log.Warn().
			Str("method", c.Method()).
			Msg("Method not allowed")
		return c.Status(fiber.StatusMethodNotAllowed).JSON(types.FailureResponse{
			Status:  "error",
			Message: "Method not allowed",
		})
	}
}

func (h *Handler) createUserWithoutConfirmation(c *fiber.Ctx, input *UserControlRequest) error {
	// Check if user exists
	existingUser, err := h.getUserByEmail(input.Email)
	if err != nil {
		log.Error().
			Err(err).
			Str("email", input.Email).
			Msg("Database error while checking existing user")
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Database error",
			Error:   err.Error(),
		})
	}
	if existingUser != nil {
		log.Warn().
			Str("email", input.Email).
			Msg("Attempt to create existing user")
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureResponse{
			Status:  "error",
			Message: "User already exists",
		})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Password hashing failed",
			Error:   err.Error(),
		})
	}

	// Create user with confirmed email
	user := model.User{
		Email:          input.Email,
		Username:       input.Email, // Using email as username by default
		PasswordHash:   string(hashedPassword),
		EmailConfirmed: true, // Skip email confirmation
	}

	tx := h.db.Create(&user)
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to create user",
			Error:   err.Error(),
		})
	}

	log.Info().
		Str("email", input.Email).
		Msg("User created successfully")

	return c.Status(fiber.StatusCreated).JSON(types.SuccessResponse{
		Status:  "ok",
		Message: "User created successfully",
	})
}

func (h *Handler) updateUserPassword(c *fiber.Ctx, input *UserControlRequest) error {
	// Find user
	user, err := h.getUserByEmail(input.Email)
	if err != nil {
		log.Error().
			Err(err).
			Str("email", input.Email).
			Msg("Database error while finding user")
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Database error",
			Error:   err.Error(),
		})
	}
	if user == nil {
		log.Warn().
			Str("email", input.Email).
			Msg("User not found for password update")
		return c.Status(fiber.StatusNotFound).JSON(types.FailureResponse{
			Status:  "error",
			Message: "User not found",
		})
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Password hashing failed",
			Error:   err.Error(),
		})
	}

	// Update password
	tx := h.db.Model(user).Update("PasswordHash", string(hashedPassword))
	if err := tx.Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(types.FailureErrorResponse{
			Status:  "error",
			Message: "Failed to update password",
			Error:   err.Error(),
		})
	}

	log.Info().
		Str("email", input.Email).
		Msg("User password updated successfully")
	return c.Status(fiber.StatusOK).JSON(types.SuccessResponse{
		Status:  "ok",
		Message: "Password updated successfully",
	})
}
