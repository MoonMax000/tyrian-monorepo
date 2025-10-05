package handler

import (
	"golang.org/x/crypto/bcrypt"
)

// CheckPasswordHash compare password with hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// Map applies a function to each element of the input slice
func Map[A any, B any](input []A, mapper func(A) B) []B {
	result := make([]B, len(input))
	for i, v := range input {
		result[i] = mapper(v)
	}
	return result
}
