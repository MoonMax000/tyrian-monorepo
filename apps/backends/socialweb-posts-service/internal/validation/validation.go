package validation

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func InitCustomValidate() {
	validate = getValidater()

	validate.RegisterValidation("forbidden_titles", func(fl validator.FieldLevel) bool {
		forbiddenTitles := map[string]bool{
			"Плохая статья":    true,
			"Запретная статья": true,
		}

		title := fl.Field().String()
		return !forbiddenTitles[title]
	})
}

func ValidateStruct(input interface{}) (map[string]string, error) {
	err := validate.Struct(input)
	if err == nil {
		return nil, nil
	}

	errors := make(map[string]string)
	for _, err := range err.(validator.ValidationErrors) {
		field := err.Field() // Имя поля
		tag := err.Tag()     // Тег валидации (например, required, min)
		errors[field] = fmt.Sprintf("Field '%s' failed validation (%s)", field, tag)
	}

	return errors, err
}

func getValidater() *validator.Validate {
	return validator.New(validator.WithRequiredStructEnabled())
}
