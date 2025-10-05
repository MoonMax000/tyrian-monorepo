package admin

import (
	"auth-sync/internal/models"

	"log"
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupAdmin(r *gin.Engine, db *gorm.DB) {
	// Загрузка шаблонов
	r.LoadHTMLGlob("templates/admin/*.tmpl")

	// Setup session middleware
	store := cookie.NewStore([]byte("secret"))
	r.Use(sessions.Sessions("admin", store))

	// Admin routes
	admin := r.Group("/admin")
	{
		// Редирект с /admin на /admin/
		admin.GET("", func(c *gin.Context) {
			c.Redirect(302, "/admin/")
		})

		admin.GET("/login", handleLogin)
		admin.POST("/login", handleLoginPost)
		admin.POST("/logout", handleLogout)

		// Protected routes
		authorized := admin.Group("/")
		authorized.Use(authMiddleware())
		{
			authorized.GET("/", handleDashboard)
			authorized.GET("/users", handleUsers(db))
			authorized.POST("/users/:id/delete", handleDeleteUser(db))
		}
	}
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		if session.Get("admin") == nil {
			c.Redirect(302, "/admin/login")
			c.Abort()
			return
		}
		c.Next()
	}
}

func handleLogin(c *gin.Context) {
	c.HTML(200, "base.tmpl", gin.H{
		"title":    "Admin Login",
		"template": "login",
	})
}

func handleLoginPost(c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	log.Printf("Login attempt: username=%s", username)

	adminUser := os.Getenv("ADMIN_USER")
	adminPassword := os.Getenv("ADMIN_PASSWORD")

	if adminUser == "" || adminPassword == "" {
		log.Printf("Error: ADMIN_USER or ADMIN_PASSWORD not set")
		c.HTML(500, "base.tmpl", gin.H{
			"title":    "Admin Login",
			"error":    "Server configuration error",
			"template": "login",
		})
		return
	}

	if username == adminUser && password == adminPassword {
		session := sessions.Default(c)
		session.Set("admin", true)
		session.Save()
		log.Printf("Login successful")
		c.Redirect(302, "/admin")
		return
	}

	log.Printf("Login failed")
	c.HTML(200, "base.tmpl", gin.H{
		"title":    "Admin Login",
		"error":    "Invalid credentials",
		"template": "login",
	})
}

func handleDashboard(c *gin.Context) {
	c.HTML(200, "base.tmpl", gin.H{
		"title":    "Dashboard",
		"admin":    true,
		"template": "dashboard",
	})
}

func handleUsers(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var users []models.User
		log.Printf("Fetching users from database")
		result := db.Find(&users)
		if result.Error != nil {
			log.Printf("Error fetching users: %v", result.Error)
		}
		log.Printf("Found %d users", len(users))

		c.HTML(200, "base.tmpl", gin.H{
			"title":    "Users",
			"users":    users,
			"admin":    true,
			"template": "users",
		})
	}
}

func handleLogout(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()
	session.Save()
	c.Redirect(302, "/admin/login")
}

func handleDeleteUser(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.Param("id")

		// Удаляем пользователя
		result := db.Delete(&models.User{}, userID)
		if result.Error != nil {
			log.Printf("Error deleting user %s: %v", userID, result.Error)
			c.HTML(500, "base.tmpl", gin.H{
				"title":    "Error",
				"error":    "Failed to delete user",
				"template": "users",
				"admin":    true,
			})
			return
		}

		log.Printf("User %s deleted successfully", userID)

		// Перенаправляем обратно на страницу пользователей
		c.Redirect(302, "/admin/users")
	}
}
