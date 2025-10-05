package api

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func IPWhitelistMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		clientIP := c.ClientIP()
		host := c.Request.Host
		log.Printf("Incoming request from IP: %s, Host: %s", clientIP, host)

		if !isIPAllowed(clientIP) && !isDomainAllowed(host) {
			log.Printf("Access denied for IP: %s, Host: %s", clientIP, host)
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Access denied: Origin not in whitelist",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
