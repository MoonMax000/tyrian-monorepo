package tests

import (
	"fmt"
	"testing"

	"github.com/Capstane/authlib/fiberx"
	"github.com/Capstane/stream-auth-service/internal/config"
	"github.com/gofiber/fiber/v2"
)

func TestCreateUser(t *testing.T) {
	cfg := config.LoadConfig()

	authService := fiberx.NewUserServiceClient(&fiberx.UserServiceConfig{
		UserServiceBaseUrl: cfg.UserServiceBaseUrl,
	})

	err := authService.OnCreateUser(&fiberx.UserCredentials{
		Email:    "test1@test1.org",
		Password: "string123",
	})
	if err != nil {
		t.Errorf("auth service integration fail with issue %v", err)
	}

}

func TestSample(t *testing.T) {
	a := fiber.AcquireAgent()
	req := a.Request()
	req.Header.SetMethod(fiber.MethodGet)
	req.SetRequestURI("http://www.ru")

	if err := a.Parse(); err != nil {
		t.Error(err)
	}

	code, body, errs := a.Bytes()
	fmt.Printf("%v, %v, %v", code, string(body), errs)
}
