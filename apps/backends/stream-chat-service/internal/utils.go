package internal

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/rs/zerolog/log"
)

func ParseInt64(number string, defaultValue int64) int64 {
	result, err := strconv.ParseInt(number, 0, 64)
	if err != nil {
		return defaultValue
	}
	return result
}

func ParseInt(number string, defaultValue int) int {
	result, err := strconv.ParseInt(number, 0, 32)
	if err != nil {
		return defaultValue
	}
	return int(result)
}

func ParseUint16(number string, defaultValue uint16) uint16 {
	result, err := strconv.ParseUint(number, 0, 16)
	if err != nil {
		return defaultValue
	}
	return uint16(result)
}

func ParseBool(value string) bool {
	if value == "" {
		return false
	}
	return strings.ToUpper(value) == "TRUE" ||
		value == "1" ||
		strings.ToUpper(value) == "YES" ||
		strings.ToUpper(value) == "Y"
}

func ParseJWT(token string) (map[string]interface{}, error) {
	// split JWT
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return nil, errors.New("invalid JWT format")
	}

	// decode payload
	payload := parts[1]
	payloadBytes, err := base64.URLEncoding.DecodeString(padBase64(payload))
	if err != nil {
		log.Error().Msgf("[ParseJWT] Failed to decode JWT payload: %v", err)
		return nil, err
	}

	var claims map[string]interface{}
	err = json.Unmarshal(payloadBytes, &claims)
	if err != nil {
		return nil, err
	}

	return claims, nil
}

func padBase64(input string) string {
	switch len(input) % 4 {
	case 2:
		input += "=="
	case 3:
		input += "="
	}
	return input
}

func GetUserIdUserNameFromJWT(claims map[string]interface{}) (userID uuid.UUID, username string) {

	rawUserID, ok := claims["user_id"].(string)
	if !ok || rawUserID == "" {
		log.Info().Msgf("Invalid user_id in JWT token")
		return
	}

	parsedUUID, err := uuid.Parse(rawUserID)
	if err != nil {
		log.Info().Msgf("Invalid user_id in JWT token: %v", err)
		return
	}

	username, ok = claims["username"].(string)
	if !ok || username == "" {
		log.Info().Msgf("Invalid username in JWT token")
		return
	}

	return parsedUUID, username
}

func Unpack(data string) (string, []byte, error) {
	result := strings.SplitN(data, " ", 2)
	if len(result) != 2 {
		return "", nil, errors.New("Unable to extract event name from data.")
	}
	return result[0], []byte(result[1]), nil
}

func Unmarshal(data []byte, out interface{}) error {
	return json.Unmarshal(data, out)
}

func Marshal(out interface{}) ([]byte, error) {
	return json.Marshal(out)
}

func Pack(name string, data []byte) ([]byte, error) {
	result := fmt.Sprintf("{\"type\":\"%v\", \"data\":%v}", name, string(data))
	return []byte(result), nil
}

func UnixMilliTime() int64 {
	return time.Now().UTC().Truncate(time.Millisecond).UnixNano() / int64(time.Millisecond)
}

// expecting the argument to be in UTC
func IsExpiredUTC(t time.Time) bool {
	return t.Before(time.Now().UTC())
}

func AddDurationUTC(d time.Duration) time.Time {
	return time.Now().UTC().Add(d)
}

func GetFuturetimeUTC() time.Time {
	return time.Date(2030, time.January, 1, 0, 0, 0, 0, time.UTC)
}
