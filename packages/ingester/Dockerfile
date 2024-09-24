FROM golang:latest AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY ./ ./

RUN CGO_ENABLED=0 GOOS=linux go build -o ingester ./cli

# --
FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/ingester /app/ingester

EXPOSE 8047
CMD ["/app/ingester"]