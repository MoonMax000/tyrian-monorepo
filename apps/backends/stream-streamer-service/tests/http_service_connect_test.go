package tests

import (
	"context"
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/Capstane/stream-streamer-service/internal/config"
)

func TestHttpServiceConnect(t *testing.T) {
	cfg := config.LoadConfig()

	url := fmt.Sprintf("https://%v:%v/api/v1/", "localhost", cfg.HttpPort)

	// create a new context instance with a timeout of 50 milliseconds
	ctx, _ := context.WithTimeout(context.Background(), 500*time.Millisecond)

	// create a new request using the context instance
	// now the context timeout will be applied to this request as well
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	failOnError(t, err, "fail request to url: %v", url)

	resp, err := http.DefaultClient.Do(req)
	failOnError(t, err, "fail request to url: %v", url)

	if resp.StatusCode != 200 {
		t.Fatalf("fail request to url: %v", url)
	}
}
