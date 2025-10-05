package api

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func sendRequest(email, password, method string) {
	data := gin.H{"email": email, "password": password}
	jsonData, _ := json.Marshal(data)

	for _, endpoint := range endpoints {
		var resp *http.Response
		var err error

		if method == "CREATE" {
			resp, err = http.Post(endpoint.URL, "application/json", bytes.NewBuffer(jsonData))
		} else if method == "UPDATE" {
			client := &http.Client{}
			req, _ := http.NewRequest("PATCH", endpoint.URL, bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")
			resp, err = client.Do(req)
		}

		if err != nil {
			log.Printf("Failed to send request to %s: %v", endpoint.URL, err)
			continue
		}
		defer resp.Body.Close()
		log.Printf("Response from %s: %s", endpoint.URL, resp.Status)
	}
}
