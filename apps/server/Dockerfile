FROM rust:1.80-alpine AS builder

WORKDIR /app
COPY . .

RUN apk add --no-cache g++

RUN cargo build --release

# --

FROM alpine:3.20 AS runner

WORKDIR /app
COPY --from=builder /app/target/release/shrimp-server .

USER nobody

EXPOSE 8080
CMD ["/app/shrimp-server"]
