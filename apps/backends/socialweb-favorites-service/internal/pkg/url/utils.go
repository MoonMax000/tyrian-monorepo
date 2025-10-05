package url

import "net/url"

// Join объединяет базовый URL с частями пути
func Join(base string, parts ...string) string {
	result, err := url.JoinPath(base, parts...)
	if err != nil {
		return base
	}
	return result
} 