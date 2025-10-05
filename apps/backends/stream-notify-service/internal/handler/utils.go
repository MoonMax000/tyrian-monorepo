package handler

import (
	"time"

	"github.com/google/uuid"
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

type JwtClaims struct {
	userId   uuid.UUID
	username string
	email    string
	roles    []string
	exp      time.Time
}

const nsInSecond int64 = 1e9

// func ParseJwtClaims(claims jwt.MapClaims) (*JwtClaims, error) {
// 	if claims == nil {
// 		return nil, fmt.Errorf("no JWT")
// 	}

// 	_, ok := claims["user_id"]
// 	if !ok {
// 		return nil, fmt.Errorf("not streaming JWT")
// 	}

// 	userId, err := uuid.Parse(claims["user_id"].(string))
// 	if err != nil {
// 		return nil, err
// 	}

// 	sec, secFrac := math.Modf(claims["exp"].(float64))
// 	exp := time.Unix(int64(math.Floor(sec)), int64(secFrac*float64(nsInSecond)))

// 	roles := make([]string, 0)
// 	if claims["roles"] != nil {
// 		roles = Map(claims["roles"].([]interface{}), func(a interface{}) string { return a.(string) })
// 	}

// 	return &JwtClaims{
// 		userId:   userId,
// 		username: claims["username"].(string),
// 		email:    claims["email"].(string),
// 		roles:    roles,
// 		exp:      exp,
// 	}, err
// }
