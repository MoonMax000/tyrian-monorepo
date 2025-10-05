package model

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

// Ban struct
type Mut struct {
	UserID         uuid.UUID      `gorm:"column:userid"`
	TargetUserID   uuid.UUID      `gorm:"column:targetuserid"`
	IPAddress      sql.NullString `gorm:"column:ipaddress"`
	Reason         string         `gorm:"column:reason"`
	StartTimestamp time.Time      `gorm:"column:starttimestamp"`
	EndTimestamp   *time.Time     `gorm:"column:endtimestamp"`
}
