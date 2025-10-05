package utils

import "os"

// Getenv получает значение переменной окружения с дефолтным значением
func Getenv(environmentVariableName string, environmentVariableDefaultValue string) string {
	value := os.Getenv(environmentVariableName)
	if value == "" {
		return environmentVariableDefaultValue
	}
	return value
}
