package service

import (
	"auth-sync/internal/models"
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"errors"
	"fmt"
	"log"
	"os"
)

type UserRepository interface {
	Create(user *models.User) error
	UserExists(email string) (bool, error)
	FindByEmail(email string) (*models.User, error)
	Update(user *models.User) error
}

type UserService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) CreateUser(email, password string) error {
	log.Printf("CreateUser called with email: %s", email)

	// Проверяем существование пользователя
	exists, err := s.repo.UserExists(email)
	if err != nil {
		log.Printf("Error checking user existence: %v", err)
		return err
	}
	if exists {
		log.Printf("User already exists with email: %s", email)
		return fmt.Errorf("user already exists")
	}

	encryptedPassword, err := encryptPassword(password)
	if err != nil {
		log.Printf("Error encrypting password: %v", err)
		return err
	}

	user := &models.User{
		Email:    email,
		Password: encryptedPassword,
	}

	log.Printf("Attempting to create user in repository")
	return s.repo.Create(user)
}

func (s *UserService) CheckUser(email, password string) (string, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return "unregistered", nil
	}

	decryptedPassword, err := decryptPassword(user.Password)
	if err != nil {
		return "", err
	}

	if decryptedPassword == password {
		return "registered", nil
	}
	return "email_exists", nil
}

func (s *UserService) UpdateUser(email, password string) error {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return errors.New("user not found")
	}

	encryptedPassword, err := encryptPassword(password)
	if err != nil {
		return err
	}

	user.Password = encryptedPassword
	return s.repo.Update(user)
}

func encryptPassword(password string) (string, error) {
	key := []byte(os.Getenv("SECRET_KEY"))
	if len(key) != 32 {
		return "", fmt.Errorf("invalid key size: key must be exactly 32 bytes")
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, gcm.NonceSize())
	ciphertext := gcm.Seal(nonce, nonce, []byte(password), nil)

	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

func decryptPassword(encryptedPassword string) (string, error) {
	key := []byte(os.Getenv("SECRET_KEY"))
	ciphertext, err := base64.StdEncoding.DecodeString(encryptedPassword)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonceSize := gcm.NonceSize()
	if len(ciphertext) < nonceSize {
		return "", errors.New("ciphertext too short")
	}

	nonce, ciphertext := ciphertext[:nonceSize], ciphertext[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}
