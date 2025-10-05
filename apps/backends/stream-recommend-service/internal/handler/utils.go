package handler

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/Capstane/authlib/utilx"
	"github.com/Capstane/stream-recommend-service/internal/model"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
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
			return nil, nil
		}
		return nil, err
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

func (h *Handler) hasCategory(channelId uuid.UUID, category string) bool {
	var categories []model.ChannelCategory
	result := h.db.Model(&model.ChannelCategory{}).Joins("JOIN category ON category.id = channel_category.category_id ").Where("category.name ILIKE ? and channel_category.channel_id = ?", category+"%", channelId).Find(&categories)
	if result.Error != nil {
		log.Warn().Msgf("has category issue %v", result.Error)
		return false
	}
	return result.RowsAffected > 0
}

func (h *Handler) getCategoriesByChannelId(channelId uuid.UUID) ([]string, error) {
	var channelCategories []model.ChannelCategory
	if result := h.db.Preload("Category").Where("channel_id = ?", channelId).Find(&channelCategories); result.Error != nil {
		return nil, result.Error
	}
	return utilx.Mapping(channelCategories, func(channelCategory model.ChannelCategory) string {
		return channelCategory.Category.Name
	}), nil
}

func (h *Handler) getAuthenticatedUserId(c *fiber.Ctx) *uuid.UUID {
	claims, err := h.userInfoCacheClient.GetUserInfo(c)
	if err != nil {
		return &uuid.Nil
	}

	return &claims.UserId
}
