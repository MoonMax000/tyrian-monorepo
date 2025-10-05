package model

import (
	"crypto/rand"

	"github.com/Capstane/stream-streamer-service/internal/encdec"
)

func UniqueRandomString(len int) string {
	token := make([]byte, len)
	rand.Reader.Read(token)
	return encdec.StreamKeyEncoding.EncodeToString(token)[:len]
}
