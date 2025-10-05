package handler

import (
	"errors"
	"fmt"
	"github.com/google/uuid"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/Capstane/AXA-socialweb-subscriptions/internal/model"
)

// CheckPasswordHash compare password with hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func (h *Handler) getUserByEmail(e string) (*model.User, error) {
	var user model.User
	if err := h.db.Where(&model.User{Email: e}).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("User not found")
		}
		return nil, err
	}
	return &user, nil
}

func (h *Handler) getUserById(userId uuid.UUID) (*model.User, error) {
	var user model.User
	if err := h.db.Where(&model.User{ID: userId}).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return &user, nil
		}
		return &user, err
	}
	return &user, nil
}

func (h *Handler) getUserByUsername(u string) (*model.User, error) {
	var user model.User
	if err := h.db.Where(&model.User{Username: u}).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

// Map applies a function to each element of the input slice
func Map[A any, B any](input []A, mapper func(A) B) []B {
	result := make([]B, len(input))
	for i, v := range input {
		result[i] = mapper(v)
	}
	return result
}
