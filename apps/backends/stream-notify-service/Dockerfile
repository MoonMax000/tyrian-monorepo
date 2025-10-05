# ============================================== BUILD STAGE: Building the binary of the App
FROM golang:1.24.6 AS build

# Build folder
WORKDIR /go/src/build

# Copy all the Code and stuff to compile everything
COPY . .

ARG GITHUB_TOKEN
RUN if [ "x$GITHUB_TOKEN" == "x" ]; then \
        mkdir /root/.ssh; \
        ssh-keyscan github.com >> ~/.ssh/known_hosts; \
        cp ./id_rsa /root/.ssh/id_rsa; \
        git config --global url."git@github.com:".insteadOf "https://github.com/"; \
    else \
        git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"; \
    fi


# Downloads all the dependencies in advance (could be left out, but it's more clear this way)
RUN go mod download

# Builds the application as a static linked one, to allow it to run on alpine
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o app ./main.go

# ==================== FINAL STAGE: Moving the binary to the 'final Image' to make it smaller
FROM alpine:latest AS release

WORKDIR /app

# `boilerplate` should be replaced here as well
COPY --from=build /go/src/build/app /usr/bin/app
COPY docs ./docs

# Add packages
RUN apk -U upgrade \
    && apk add --no-cache ca-certificates \
    && chmod +x /usr/bin/app

ENTRYPOINT ["/usr/bin/app"]
