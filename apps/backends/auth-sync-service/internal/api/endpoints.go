package api

type Endpoint struct {
	URL string
}

var endpoints []Endpoint

func init() {
	endpoints = []Endpoint{}
}
