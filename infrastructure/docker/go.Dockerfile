# Multi-stage Dockerfile for Go services

FROM golang:1.21-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git make gcc musl-dev

# Set working directory
WORKDIR /build

# Copy go mod files
ARG SERVICE_PATH
COPY ${SERVICE_PATH}/go.mod ${SERVICE_PATH}/go.sum* ./

# Download dependencies
RUN go mod download

# Copy source code
COPY ${SERVICE_PATH}/ ./

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app ./cmd/app || \
    CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app ./main.go || \
    CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

# Final stage
FROM alpine:latest

# Install ca-certificates for HTTPS
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Copy binary from builder
COPY --from=builder /build/app .

# Create non-root user
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser && \
    chown -R appuser:appuser /app

USER appuser

# Expose port
EXPOSE 8080

# Run the application
CMD ["./app"]

