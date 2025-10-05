package handler

import (
	"errors"
	"fmt"
	"net/mail"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/Capstane/AXA-socialweb-likes/internal/model"
	"github.com/google/uuid"
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

func (h *Handler) getLikeCount(postId uuid.UUID) (int, error) {
	var likesCount int64
	if err := h.db.Table("posts").Joins("inner join likes on likes.post_id = posts.id and posts.id = ? and likes.deleted_at is null", postId).Count(&likesCount).Error; err != nil {
		return 0, err
	}
	return int(likesCount), nil
}

func (h *Handler) getLikeAt(postId uuid.UUID, userId uuid.UUID) (*time.Time, error) {
	type result struct {
		CreatedAt time.Time
	}
	rows, err := h.db.Table("likes").Where("likes.post_id = ? and likes.user_id = ? AND likes.deleted_at IS NULL", postId, userId).Select("created_at").Scan(&result{}).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var likeAt time.Time
		rows.Scan(&likeAt)
		return &likeAt, nil
	}
	return nil, nil
}

func (h *Handler) getFavoredAt(postId uuid.UUID, userId uuid.UUID) (*time.Time, error) {
	type result struct {
		CreatedAt time.Time
	}
	rows, err := h.db.Table("favorites").Where("favorites.post_id = ? and favorites.user_id = ?", postId, userId).Select("created_at").Scan(&result{}).Rows()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var favoriteAt time.Time
		rows.Scan(&favoriteAt)
		return &favoriteAt, nil
	}
	return nil, nil
}

func validateEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

type SortDirection string

const (
	SortDirectionUnsorted SortDirection = ""
	SortDirectionAsc      SortDirection = "ASC"
	SortDirectionDesc     SortDirection = "DESC"
)

type SortByField struct {
	FieldName     string
	SortDirection SortDirection
}

func parseSortString(queryParam string) []SortByField {
	result := make([]SortByField, 0, 10)
	for _, sortByField := range strings.Split(queryParam, ",") {
		if len(sortByField) == 0 {
			continue
		}
		sortDirection := SortDirectionUnsorted
		if sortByField[0] == "+"[0] {
			sortDirection = SortDirectionAsc
		}
		if sortByField[0] == "-"[0] {
			sortDirection = SortDirectionDesc
		}
		result = append(result, SortByField{
			FieldName:     sortByField[1:],
			SortDirection: sortDirection,
		})
	}
	return result
}
