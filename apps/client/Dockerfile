# this Dockerfile should be run with context set at root of this repo.

FROM oven/bun:alpine AS builder

WORKDIR /app

ENV NODE_ENV=production
ENV TURBO_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json bun.lockb ./
COPY ./apps/client/package.json ./apps/client/bun.lockb ./apps/client/

# @shrimp/server
COPY ./apps/server/bindings ./apps/server/bindings
COPY ./apps/server/package.json ./apps/server/package.json

RUN bun install

COPY ./apps/client/ ./apps/client
COPY turbo.json .

RUN bun run build:client

# --

FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

RUN rm index.html

COPY --from=builder /app/apps/client/out/ .
COPY ./apps/client/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
