package parser

import "strconv"

// ParseInt парсит строку в int с дефолтным значением при ошибке
func ParseInt(number string, defaultValue int) int {
	result, err := strconv.ParseInt(number, 0, 32)
	if err != nil {
		return defaultValue
	}
	return int(result)
}

// ParseUint16 парсит строку в uint16 с дефолтным значением при ошибке
func ParseUint16(number string, defaultValue uint16) uint16 {
	result, err := strconv.ParseUint(number, 0, 16)
	if err != nil {
		return defaultValue
	}
	return uint16(result)
}
