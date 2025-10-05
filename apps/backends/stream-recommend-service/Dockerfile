# Building the binary of the App
FROM golang:1.24.4 AS build

# `boilerplate` should be replaced with your project name
WORKDIR /go/src/server

# Copy all the Code and stuff to compile everything
COPY . .

# Setup private package downloads
ENV GO111MODULE=on
ENV GOPRIVATE=github.com/Capstane
ARG GITHUB_TOKEN
RUN git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"

# Downloads all the dependencies in advance
RUN go get

# Builds the application as a staticly linked one, to allow it to run on alpine
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o app ./main.go


# Bake the release image
FROM alpine:latest AS release

WORKDIR /app

# `boilerplate` should be replaced here as well
COPY --from=build /go/src/server/app /usr/bin/app
COPY docs ./docs

# Add packages
RUN apk -U upgrade \
    && apk add --no-cache ca-certificates \
    && chmod +x /usr/bin/app

ENTRYPOINT ["/usr/bin/app"]