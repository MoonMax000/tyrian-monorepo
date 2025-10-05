package api

import (
	_ "auth-sync/docs"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetupRoutes(r *gin.Engine, h *Handler) {
	// Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	api := r.Group("/api")
	api.Use(IPWhitelistMiddleware())
	{
		api.POST("/users", h.CreateUser)
		api.POST("/users/check", h.CheckUser)
		api.PATCH("/users", h.UpdateUser)
	}
}
