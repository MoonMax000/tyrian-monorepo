package admin

import (
	"github.com/Capstane/authlib/fiberx"
	"github.com/Capstane/stream-auth-service/internal/config"
	"github.com/Capstane/stream-auth-service/internal/handler/rbac"
	"gorm.io/gorm"
)

type AdminHandler struct {
	rbac                *rbac.RBACLayer
	db                  *gorm.DB
	cfg                 *config.Config
	userService         *fiberx.UserServiceClient
	userInfoCacheClient *fiberx.UserInfoCacheClient
}

func NewAdminHandler(
	rbac *rbac.RBACLayer,
	db *gorm.DB,
	cfg *config.Config,
	userService *fiberx.UserServiceClient,
	userInfoCacheClient *fiberx.UserInfoCacheClient,
) *AdminHandler {
	return &AdminHandler{
		rbac:                rbac,
		db:                  db,
		cfg:                 cfg,
		userService:         userService,
		userInfoCacheClient: userInfoCacheClient,
	}
}
