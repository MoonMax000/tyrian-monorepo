package api

import (
	"net"
	"os"
	"strings"
)

// Получаем список разрешенных доменов из переменной окружения
func getWhiteListDomains() []string {
	domains := os.Getenv("WHITELIST_DOMAINS")
	if domains == "" {
		return []string{} // Пустой список если домены не заданы
	}
	return strings.Split(domains, ",")
}

// Проверяем, является ли запрос с разрешенного домена
func isDomainAllowed(host string) bool {
	// Убираем порт из хоста если он есть
	if strings.Contains(host, ":") {
		host = strings.Split(host, ":")[0]
	}

	// Проверяем каждый разрешенный домен
	allowedDomains := getWhiteListDomains()
	for _, domain := range allowedDomains {
		if domain == host || strings.HasSuffix(host, "."+domain) {
			return true
		}
	}

	// Если хост - IP адрес, проверяем его в белом списке IP
	if net.ParseIP(host) != nil {
		return isIPAllowed(host)
	}

	return false
}
