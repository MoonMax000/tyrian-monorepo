package http_service

import "net/http"

func corsHandler(h http.Handler) http.Handler {
	fn := func(responseWriter http.ResponseWriter, request *http.Request) {

		if request.Method == "OPTIONS" {
			//handle preflight in here
			responseWriter.Header().Add("Connection", "keep-alive")
			//Set CORS Policy
			responseWriter.Header().Add("Access-Control-Allow-Origin", "*")
			responseWriter.Header().Add("Access-Control-Allow-Methods", "POST, OPTIONS, GET, DELETE, PUT")
			// responseWriter.Header().Add("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
			responseWriter.Header().Add("Access-Control-Allow-Headers", "*")
			responseWriter.Header().Add("Access-Control-Max-Age", "86400")
			responseWriter.WriteHeader(http.StatusCreated)
		} else {
			// call the original http.Handler we're wrapping
			h.ServeHTTP(responseWriter, request)
		}
	}

	// http.HandlerFunc wraps a function so that it
	// implements http.Handler interface
	return http.HandlerFunc(fn)
}
