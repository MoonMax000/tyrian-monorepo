package main

import (
	"auth-sync/docs"
	_ "auth-sync/docs"
	"auth-sync/internal/admin"
	"auth-sync/internal/api"
	"auth-sync/internal/repository"
	"auth-sync/internal/service"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// @title User Service API
// @version 1.0
// @description This is a user service server.
// @host ${API_HOST}
// @BasePath /api
func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	apiHost := os.Getenv("API_HOST")
	apiPort := os.Getenv("API_PORT")

	if apiHost == "" {
		docs.SwaggerInfo.Host = "localhost:8080"
	} else {
		docs.SwaggerInfo.Host = apiHost
	}

	db, err := repository.InitDB()
	if err != nil {
		log.Fatal(err)
	}

	userRepo := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepo)
	handler := api.NewHandler(userService)

	r := gin.Default()

	// Setup Admin with DB
	admin.SetupAdmin(r, db)

	// Routes
	api.SetupRoutes(r, handler)

	if err := r.Run(":" + apiPort); err != nil {
		log.Fatal(err)
	}
}
