FROM oven/bun:alpine AS builder

WORKDIR /app
COPY ./apps/client/bun.lockb ./apps/client/package.json ./
COPY ./apps/server/bindings ./node_modules/@shrimp/server/bindings

RUN bun install

COPY ./apps/client/ .

RUN bun run build

# --

FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

RUN rm index.html

COPY --from=builder /app/out/ .
COPY ./apps/client/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
