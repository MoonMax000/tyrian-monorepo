package internal

import (
	"bytes"
	"net/url"
	"os"
	"regexp"
	"slices"
	"strconv"
	"strings"
	"time"

	"github.com/Capstane/stream-media-service/internal/encdec"
)

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

func FormatAddr(host string, port uint16) string {
	return host + ":" + strconv.FormatUint(uint64(port), 10)
}

func Last[E any](slice []E) E {
	if len(slice) == 0 {
		var zero E
		return zero
	}
	return slice[len(slice)-1]
}

func GetenvInt(key string, fallback int) int {
	keyValue, err := strconv.Atoi(os.Getenv(key))
	if err != nil {
		return fallback
	}
	return keyValue
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

func ParseBoolDef(value string, defaultValue bool) bool {
	if value == "" {
		return defaultValue
	}
	return strings.ToUpper(value) == "TRUE" ||
		value == "1" ||
		strings.ToUpper(value) == "YES" ||
		strings.ToUpper(value) == "Y"
}

func ParseUnitDuration(durationUnit string) time.Duration {
	switch strings.ToUpper(durationUnit) {
	case "H":
		return time.Hour
	case "M":
		return time.Minute
	case "S":
		return time.Second
	}
	return 0
}

var durationPattern = regexp.MustCompile(`(\d+)\s*([HhMmSs])`)

func ParseDuration(duration string, defaultValue time.Duration) time.Duration {
	var result time.Duration = 0
	for _, g := range durationPattern.FindAllStringSubmatch(duration, -1) {
		d := time.Duration(ParseInt(g[1], 1)) * ParseUnitDuration(g[2])
		result += d
	}

	return result
}

func JoinUrl(base string, parts ...string) string {
	result, err := url.JoinPath(base, parts...)
	if err != nil {
		return base
	}
	return result
}

func Getenv(environmentVariableName string, environmentVariableDefaultValue string) string {
	value := os.Getenv(environmentVariableName)
	if value == "" {
		return environmentVariableDefaultValue
	}
	return value
}

func AlignKey(key []byte, length int) []byte {
	result := slices.Grow(key, length)
	if len(result) < length {
		result = append(result, bytes.Repeat([]byte{0x00}, length-len(result))...)
	} else if len(result) > length {
		result = slices.Clone(key[:length])
	} else {
		result = slices.Clone(key)
	}
	return result
}

func Suffix(text string, separator string) string {
	lastSegmentStartPos := strings.LastIndex(text, separator)
	if lastSegmentStartPos < 0 {
		return ""
	}
	return text[lastSegmentStartPos+1:]
}

func Base64EncodeKey(key []byte) string {
	return encdec.StreamKeyEncoding.EncodeToString([]byte(key))
}
