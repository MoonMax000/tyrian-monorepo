package model

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type Ban struct {
	ID             int            `gorm:"primaryKey;autoIncrement;column:id;not null;"`
	UserID         uuid.UUID      `gorm:"column:userid;type:uuid"`
	TargetUserID   uuid.UUID      `gorm:"column:targetuserid;type:uuid"`
	IPAddress      sql.NullString `gorm:"column:ipaddress"`
	Reason         string         `gorm:"column:reason"`
	StartTimestamp time.Time      `gorm:"column:starttimestamp"`
	EndTimestamp   sql.NullTime   `gorm:"column:endtimestamp"`
	StreamOwner    uuid.UUID      `gorm:"column:stream_owner;type:uuid"`
}
