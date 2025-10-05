package api

import (
	"net"
	"os"
	"strings"
)

func getWhiteList() []string {
	ips := os.Getenv("WHITELIST_IPS")
	if ips == "" {
		return []string{"127.0.0.1"} // Дефолтный IP если список не задан
	}
	return strings.Split(ips, ",")
}

func isIPAllowed(ipStr string) bool {
	// Получаем IP из строки
	ip := net.ParseIP(strings.Split(ipStr, ":")[0])
	if ip == nil {
		return false
	}

	// Проверяем каждую запись в белом списке
	whiteList := getWhiteList()
	for _, allowed := range whiteList {
		// Проверяем, является ли запись CIDR (подсетью)
		if strings.Contains(allowed, "/") {
			_, ipNet, err := net.ParseCIDR(allowed)
			if err == nil && ipNet.Contains(ip) {
				return true
			}
		} else {
			// Проверяем конкретный IP
			if allowed == ip.String() {
				return true
			}
		}
	}
	return false
}
