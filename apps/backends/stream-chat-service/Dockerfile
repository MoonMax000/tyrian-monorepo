# Building the binary of the App
FROM golang:1.24.6 AS build

# `boilerplate` should be replaced with your project name
WORKDIR /go/src/server

# Copy all the Code and stuff to compile everything
COPY . .

RUN --mount=type=secret,id=GIT_AUTH_TOKEN \
        GIT_AUTH_TOKEN=$(cat /run/secrets/GIT_AUTH_TOKEN) \
        && git config --global "url.https://${GIT_AUTH_TOKEN}@github.com.insteadof" "https://github.com"

# Downloads all the dependencies in advance (could be left out, but it's more clear this way)
RUN go mod download

# Builds the application as a staticly linked one, to allow it to run on alpine
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o app


# Moving the binary to the 'final Image' to make it smaller
FROM alpine:latest AS release

WORKDIR /app

# `boilerplate` should be replaced here as well
COPY --from=build /go/src/server/app /usr/bin/app

COPY docs ./docs

# Add packages
RUN apk -U upgrade \
    && apk add --no-cache ca-certificates \
    && chmod +x /usr/bin/app

# Exposes port 8000 because our program listens on that port
EXPOSE 1118 1119

ENTRYPOINT ["/usr/bin/app"]
