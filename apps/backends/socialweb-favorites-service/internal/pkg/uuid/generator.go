package uuid

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// UUIDGenerator интерфейс для генерации UUID
type UUIDGenerator interface {
	Generate() uuid.UUID
}

// DefaultGenerator реализация генератора UUID
type DefaultGenerator struct{}

// Generate генерирует новый UUID версии 4
func (g DefaultGenerator) Generate() uuid.UUID {
	return uuid.New()
}

// BeforeCreate хук для GORM, который генерирует UUID перед созданием записи
func BeforeCreate(tx *gorm.DB) error {
	field := tx.Statement.Schema.FieldsByDBName["id"]
	if field == nil {
		return nil
	}

	if field.FieldType.String() == "uuid.UUID" {
		field.Set(tx.Statement.Context, tx.Statement.ReflectValue, uuid.New())
	}

	return nil
}
