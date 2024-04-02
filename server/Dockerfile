FROM oven/bun:1.1-alpine as builder
WORKDIR /app

COPY package.json . 

# weird bug with bun install (https://github.com/oven-sh/bun/issues/5792)
RUN bun install
RUN bun install --frozen-lockfile --production

COPY . .

ENV NODE_ENV=production

# TODO: add support for aarch64 build.
RUN bunx prisma generate
RUN bun run build

# --

# TODO: try to use alpine-based image
FROM oven/bun:1.1-alpine as runner
WORKDIR /app

RUN apk add --no-cache tini

COPY --from=builder /app/out/ ./out/
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

USER nobody
EXPOSE 8080/tcp

ENTRYPOINT ["tini", "--", "bun", "run", "./out/index.js"]
