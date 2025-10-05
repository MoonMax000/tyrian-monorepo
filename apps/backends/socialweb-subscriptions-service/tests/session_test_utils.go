package tests

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

// TestSessionUser представляет пользователя для тестирования с сессией
type TestSessionUser struct {
	ID       uuid.UUID `json:"id"`
	Username string    `json:"username"`
	Email    string    `json:"email"`
	Roles    []string  `json:"roles"`
}

// CreateTestRequest создает тестовый запрос с сессией пользователя
func CreateTestRequest(t *testing.T, app *fiber.App, method, path string, body interface{}, sessionUser *TestSessionUser) *httptest.ResponseRecorder {
	var reqBody []byte
	var err error

	if body != nil {
		reqBody, err = json.Marshal(body)
		assert.NoError(t, err)
	}

	req := httptest.NewRequest(method, path, nil)
	if reqBody != nil {
		req = httptest.NewRequest(method, path, bytes.NewReader(reqBody))
		req.Header.Set("Content-Type", "application/json")
	}

	// Добавляем заголовок сессии, если пользователь указан
	if sessionUser != nil {
		req.Header.Set("X-Session-ID", sessionUser.ID.String())
	}

	resp, err := app.Test(req)
	assert.NoError(t, err)

	// Читаем тело ответа
	bodyBytes, err := io.ReadAll(resp.Body)
	assert.NoError(t, err)
	resp.Body.Close()

	// Создаем ResponseRecorder
	recorder := httptest.NewRecorder()
	recorder.WriteHeader(resp.StatusCode)
	recorder.Write(bodyBytes)

	return recorder
}

// CreateTestRequestWithQuery создает тестовый запрос с query параметрами
func CreateTestRequestWithQuery(t *testing.T, app *fiber.App, method, path string, queryParams map[string]string, sessionUser *TestSessionUser) *httptest.ResponseRecorder {
	req := httptest.NewRequest(method, path, nil)

	// Добавляем query параметры
	if len(queryParams) > 0 {
		q := req.URL.Query()
		for key, value := range queryParams {
			q.Add(key, value)
		}
		req.URL.RawQuery = q.Encode()
	}

	// Добавляем заголовок сессии, если пользователь указан
	if sessionUser != nil {
		req.Header.Set("X-Session-ID", sessionUser.ID.String())
	}

	resp, err := app.Test(req)
	assert.NoError(t, err)

	// Читаем тело ответа
	bodyBytes, err := io.ReadAll(resp.Body)
	assert.NoError(t, err)
	resp.Body.Close()

	// Создаем ResponseRecorder
	recorder := httptest.NewRecorder()
	recorder.WriteHeader(resp.StatusCode)
	recorder.Write(bodyBytes)

	return recorder
}

// CreateTestUser создает тестового пользователя
func CreateTestUser() *TestSessionUser {
	return &TestSessionUser{
		ID:       uuid.New(),
		Username: "testuser",
		Email:    "test@example.com",
		Roles:    []string{"user"},
	}
}

// AssertJSONResponse проверяет JSON ответ
func AssertJSONResponse(t *testing.T, resp *httptest.ResponseRecorder, expectedStatus int, expectedBody interface{}) {
	assert.Equal(t, expectedStatus, resp.Code)

	if expectedBody != nil {
		var responseBody interface{}
		err := json.Unmarshal(resp.Body.Bytes(), &responseBody)
		assert.NoError(t, err)

		expectedJSON, err := json.Marshal(expectedBody)
		assert.NoError(t, err)

		var expectedBodyParsed interface{}
		err = json.Unmarshal(expectedJSON, &expectedBodyParsed)
		assert.NoError(t, err)

		assert.Equal(t, expectedBodyParsed, responseBody)
	}
}

// AssertErrorResponse проверяет ответ с ошибкой
func AssertErrorResponse(t *testing.T, resp *httptest.ResponseRecorder, expectedStatus int, expectedMessage string) {
	assert.Equal(t, expectedStatus, resp.Code)

	var errorResponse struct {
		Status  string `json:"status"`
		Message string `json:"message"`
	}

	err := json.Unmarshal(resp.Body.Bytes(), &errorResponse)
	assert.NoError(t, err)
	assert.Equal(t, "error", errorResponse.Status)
	assert.Equal(t, expectedMessage, errorResponse.Message)
}
