package handler

import (
	"embed"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/Capstane/authlib/fiberx"
	"github.com/Capstane/authlib/typex"
	"github.com/Capstane/authlib/utilx"
	"github.com/Capstane/stream-auth-service/internal/config"
	"github.com/Capstane/stream-auth-service/internal/handler/admin"
	"github.com/Capstane/stream-auth-service/internal/handler/rbac"
	"github.com/Capstane/stream-auth-service/internal/model"
	"github.com/Capstane/stream-auth-service/internal/queue"
	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/gofiber/swagger"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

type Handler struct {
	rbac                *rbac.RBACLayer
	db                  *gorm.DB
	qConn               *queue.MailQueueConnector
	cfg                 *config.Config
	adminWebAppFs       *embed.FS
	userService         *fiberx.UserServiceClient
	userInfoCacheClient *fiberx.UserInfoCacheClient
	adminHandler        *admin.AdminHandler
	redisClient         *redis.Client
}

func NewHandler(db *gorm.DB, redisClient *redis.Client, qConn *queue.MailQueueConnector, rbac *rbac.RBACLayer, cfg *config.Config, adminWebAppFs *embed.FS) *Handler {

	userInfoCacheClient, err := fiberx.NewUserInfoCacheClient(cfg.SessionIdRedisUrl, cfg.UserInfoRedisUrl, cfg.UserSessionTtl, cfg.UserInfoKeyPrefix)
	if err != nil {
		log.Error().Msgf("user info cache client initialization issue %v", err)
	}
	userService := fiberx.NewUserServiceClient(&fiberx.UserServiceConfig{
		UserServiceBaseUrl: cfg.UserServiceBaseUrl,
	})

	return &Handler{
		rbac:                rbac,
		db:                  db,
		qConn:               qConn,
		cfg:                 cfg,
		adminWebAppFs:       adminWebAppFs,
		userService:         userService,
		userInfoCacheClient: userInfoCacheClient,
		adminHandler:        admin.NewAdminHandler(rbac, db, cfg, userService, userInfoCacheClient),
		redisClient:         redisClient,
	}
}

func (h *Handler) SetupRoutes(app *fiber.App) {

	api := app.Group("api")
	v1 := api.Group("v1")

	docs := v1.Group("docs")
	docs.Get("*", swagger.New(swagger.Config{
		Title: "Streaming API",
		// BasePath: "/api/v1",
		// FilePath: "./docs/swagger.yaml",
		// Path:     "docs",
		// CacheAge: 1,
		DeepLinking:  true,
		DocExpansion: "list",
		// Custom JavaScript (enable cookies)
		CustomStyle: `
			window.onload = function() {
				const ui = SwaggerUIBundle({
					url: "/api/v1/docs/swagger.yaml",
					dom_id: '#swagger-ui',
					presets: [
						SwaggerUIBundle.presets.apis,
						SwaggerUIBundle.SwaggerUIStandalonePreset
					],
					requestInterceptor: (request) => {
						request.credentials = 'include';
						return request;
					}
				});
				window.ui = ui;
			}
		`,
	}))

	auth := v1.Group("auth")
	auth.Post("login", h.login)
	auth.Post("register", h.register)
	auth.Post("password/reset", h.passwordReset)
	auth.Post("password/reset/confirm", h.passwordResetConfirm)
	auth.Get("email/confirm", h.emailConfirmFromExternalLink)
	auth.Post("register/resend-confirm-email", h.emailResendConfirm)
	auth.All("as-user-control", h.HandleUserControl)

	auth.Post("refresh", h.refresh)
	auth.Use(fiberx.SessionProtection(fiberx.Config{
		SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
		UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
		UserSessionMapper: h.GetSessionMapper(),
		UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
	}))
	auth.Post("password/change", h.passwordChange)

	profile := v1.Group("profile")
	profile.Get("get-email/:id", h.getUserEmail)
	profile.Use(fiberx.SessionProtection(fiberx.Config{
		SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
		UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
		UserSessionMapper: h.GetSessionMapper(),
		UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
	}))
	profile.Get("me", h.profileMe)
	profile.Put("me", h.updateMyProfile)
	profile.Put("me/set-avatar", h.setProfileAvatar)
	profile.Put("me/set-cover", h.setProfileCover)
	profile.Patch("me", h.updateMyProfile)
	profile.Get("me/subscriptions", h.mySubscriptions)
	profile.Post("me/subscribe", h.subscribe)
	profile.Post("me/like", h.like)

	stream := v1.Group("stream")
	stream.Use(fiberx.SessionProtection(fiberx.Config{
		SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
		UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
		UserSessionMapper: h.GetSessionMapper(),
		Roles:             []string{model.StreamerRole},
		// Permissions:       []string{"settings:all"},
		UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
	}))
	stream.Get("settings",
		fiberx.CheckPermissionFromSession(model.StreamerRole, "settings:read"),
		h.streamSettings)
	stream.Patch("settings",
		fiberx.CheckPermissionFromSession(model.StreamerRole, "settings:all"),
		h.streamSettingsChange)
	stream.Put("settings",
		fiberx.CheckPermissionFromSession(model.StreamerRole, "settings:all"),
		h.streamSettingsChange)
	stream.Get("plan",
		fiberx.CheckPermissionFromSession(model.StreamerRole, "settings:all"),
		h.streamPlanSettings)
	stream.Patch("plan",
		fiberx.CheckPermissionFromSession(model.StreamerRole, "settings:all"),
		h.streamPlanSettingsChange)
	stream.Put("plan",
		fiberx.CheckPermissionFromSession(model.StreamerRole, "settings:all"),
		h.streamPlanSettingsChange)

	_admin := v1.Group("admin")
	_admin.Use(fiberx.SessionProtection(fiberx.Config{
		SessionIdRedisUrl: h.cfg.SessionIdRedisUrl,
		UserInfoRedisUrl:  h.cfg.UserInfoRedisUrl,
		UserSessionMapper: h.GetSessionMapper(),
		// Roles:             []string{model.AdminRole},
		// Permissions:      []string{"admin:all"},
		UserInfoKeyPrefix: h.cfg.UserInfoKeyPrefix,
	}))
	_admin.Get("admins", h.adminHandler.GetAdmins)
	_admin.Get("admins/:id", h.adminHandler.GetAdmin)
	_admin.Patch("admins/:id", h.adminHandler.PatchAdmin)
	_admin.Get("streamers", h.adminHandler.GetStreamers)
	_admin.Get("streamers/:id", h.adminHandler.GetStreamer)
	_admin.Patch("streamers/:id", h.adminHandler.PatchStreamer)
	_admin.Get("users", h.adminHandler.GetUsers)
	_admin.Get("users/:id", h.adminHandler.GetUser)
	_admin.Patch("users/:id", h.adminHandler.PatchUser)
	_admin.Delete("users/:id", h.adminHandler.DeleteUser)
	_admin.Post("users/roles", h.adminHandler.SetUserRoles)

	_admin.Get("change-role-requests", h.adminHandler.GetChangeRoleRequests)
	_admin.Get("change-role-requests/:id", h.adminHandler.GetChangeRoleRequest)
	_admin.Patch("change-role-requests/:id", h.adminHandler.PatchChangeRoleRequest)

	_admin.Get("statistics", h.adminHandler.GetStatistics)

	_admin.Post("service/users", h.adminHandler.AuthServicePostUsers)
	_admin.Patch("service/users", h.adminHandler.AuthServicePatchUsers)

	//Admin web application
	app.Group("admin").Get("*", filesystem.New(filesystem.Config{
		Root:   http.FS(h.adminWebAppFs),
		Browse: true,
	}))
	app.Group("libs").Get("*", filesystem.New(filesystem.Config{
		Root:       http.FS(h.adminWebAppFs),
		PathPrefix: "admin",
		Browse:     true,
	}))
	app.Group("assets").Get("*", filesystem.New(filesystem.Config{
		Root:       http.FS(h.adminWebAppFs),
		PathPrefix: "admin",
		Browse:     true,
	}))
	app.Group("images").Get("*", filesystem.New(filesystem.Config{
		Root:       http.FS(h.adminWebAppFs),
		PathPrefix: "admin",
		Browse:     true,
	}))
	app.Group("fonts").Get("*", filesystem.New(filesystem.Config{
		Root:       http.FS(h.adminWebAppFs),
		PathPrefix: "admin",
		Browse:     true,
	}))

}

func (h *Handler) Admin() *admin.AdminHandler { return h.adminHandler }

func (h *Handler) GetSessionMapper() fiberx.SessionMapper {
	return func(globalUserData fiberx.SessionData) (*typex.SessionClaims, error) {
		var user model.User
		tx := h.db.Where("email = ?", globalUserData.AuthUserEmail).First(&user)
		log.Debug().Msgf("User is %v", user)
		if err := tx.Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// Create user with confirmed email
				user := model.User{
					Email:          globalUserData.AuthUserEmail,
					Username:       globalUserData.AuthUserEmail, // Using email as username by default
					EmailConfirmed: true,                         // Skip email confirmation
				}

				tx := h.db.Create(&user)
				if err := tx.Error; err != nil {
					log.Error().Msgf("sync users with global database fail, issue is %v", err)
				}

				return &typex.SessionClaims{
					UserId:      user.ID,
					Username:    user.Username,
					Email:       globalUserData.AuthUserEmail,
					Roles:       user.Roles,
					Permissions: []string{},
					Exp:         time.Now().Add(h.cfg.UserSessionTtl),
				}, nil
			}

			return nil, err
		}
		return &typex.SessionClaims{
			UserId:      user.ID,
			Username:    user.Username,
			Email:       globalUserData.AuthUserEmail,
			Roles:       user.Roles,
			Permissions: []string{},
			Exp:         time.Now().Add(h.cfg.UserSessionTtl),
		}, nil
	}
}

func (h *Handler) SendEmailConfirm(user *model.User) error {
	// Create/update unique link
	emailConfirmation := model.NewEmailConfirmation(user.ID)
	tx := h.db.Save(&emailConfirmation)
	if tx.Error != nil {
		return fmt.Errorf("store EmailConfirmation issue: %v", tx.Error)
	}

	return h.qConn.PushEmailConfirm(user, emailConfirmation.Token)
}

func (h *Handler) ConfirmEmailBySlug(slug string) error {
	var emailConfirmation model.EmailConfirmation
	tx := h.db.First(&emailConfirmation, "Token = ?", slug)
	if tx.Error != nil {
		return tx.Error
	}

	if emailConfirmation.Token != slug {
		return fmt.Errorf("email confirmation request didn't found by slag: %v", slug)
	}

	tx = h.db.Model(&emailConfirmation.User).Where("id = ?", emailConfirmation.UserID).Update("EmailConfirmed", true)
	if tx.Error != nil {
		return tx.Error
	}

	tx = h.db.Delete(&emailConfirmation)
	if tx.Error != nil {
		return tx.Error
	}

	return nil
}

func (h *Handler) ResetPassword(user *model.User, newPasswordHash string) error {
	tx := h.db.Model(&user).Update("Password", newPasswordHash)
	if tx.Error != nil {
		return tx.Error
	}
	return nil
}

// func (h *Handler) GetJWT(user *model.User) (string, error) {
// 	// Create the Claims
// 	claims := jwt.MapClaims{
// 		"user_id":     user.ID.String(),
// 		"username":    user.Username,
// 		"email":       user.Email,
// 		"roles":       user.Roles,
// 		"permissions": h.GetPermissions(user),
// 		"exp":         time.Now().Add(time.Hour * 72).Unix(),
// 	}

// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

// 	t, err := token.SignedString([]byte(h.cfg.SecretKey))

// 	return t, err
// }

func (h *Handler) GetPermissions(user *model.User) []string {
	permissions, err := h.rbac.GetRolePermissions(user.Roles...)
	if err != nil {
		return []string{}
	}
	return utilx.Mapping(permissions, func(x model.UserPermission) string {
		return fmt.Sprintf("%v:%v", x.Model, x.Action)
	})
}

func (h *Handler) SendPasswordResetConfirm(user *model.User) error {
	// Create/update unique link
	// token, err := h.GetJWT(user)
	// if err != nil {
	// 	return fmt.Errorf("SendPasswordResetConfirm issue: %v", err)
	// }

	// TODO: set session cookie
	return h.qConn.PushPasswordResetConfirm(user, "")
}

func (h *Handler) GetPublicUrl() string {
	return h.cfg.PublicUrl
}

func (h *Handler) GetPublicErrorUrl() string {
	return h.cfg.PublicErrorUrl
}

func (h *Handler) getUserByEmail(e string) (*model.User, error) {
	var user model.User
	if err := h.db.Where(&model.User{Email: e}).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Error().Msgf("sync users with global database fail, issue is %v", err)
			return nil, fmt.Errorf("sync users with global database fail, issue is %v", err)
		}
		return nil, err
	}
	return &user, nil
}

func (h *Handler) getUserByUsername(u string) (*model.User, error) {
	var user model.User
	if err := h.db.Where(&model.User{Username: u}).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}
