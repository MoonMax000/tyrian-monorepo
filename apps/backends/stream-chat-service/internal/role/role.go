package role

import (
	"github.com/Capstane/stream-chat-service/internal"
	"github.com/Capstane/stream-chat-service/internal/database"
	"github.com/google/uuid"
)

type Role struct {
	Nick string `json:"nick"`
	Role string `json:"role"`
}

type ModeratorList struct {
	moderatorlist []string
}

func (r *Role) SetRole(uid uuid.UUID, chatid uuid.UUID, role string) {
	database.DB.RequestSetRole(uid, chatid, role)
}

func (r *Role) DeleteRole(uid uuid.UUID, chatid uuid.UUID, role string) {
	database.DB.RequestDeleteRole(uid, chatid, role)
}

func (ml *ModeratorList) GetModeratorList(streamOwner uuid.UUID) []string {
	ml.moderatorlist = database.DB.RequestModerator(streamOwner)

	return ml.moderatorlist
}

func GetRoleNum(features []string) uint64 {
	for _, feature := range features {
		switch feature {
		case "admin":
			return internal.ISADMIN
		case "moderator":
			return internal.ISMODERATOR
		case "protected":
			return internal.ISPROTECTED
		case "subscriber":
			return internal.ISSUBSCRIBER
		case "vip":
			return internal.ISVIP
		case "bot":
			return internal.ISBOT
		default:
			return internal.ISBOT
		}
	}
	return internal.ISBOT
}
