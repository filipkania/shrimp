FROM oven/bun:1.0-alpine as builder
WORKDIR /app

COPY package.json bun.lockb . 

# weird bug with bun install (https://github.com/oven-sh/bun/issues/5792)
RUN bun install
RUN bun install --frozen-lockfile --production

COPY . .

ENV NODE_ENV=production
RUN bun run build

# --

FROM oven/bun:1.0-alpine as runner
WORKDIR /app

COPY --from=builder /app/out/ ./out/
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

RUN apk add --no-cache tini

USER nobody
EXPOSE 8080/tcp

ENTRYPOINT ["/sbin/tini", "--", "bun", "run", "./out/index.js"]