FROM oven/bun:1.0 as builder
WORKDIR /app

COPY package.json bun.lockb . 

# weird bug with bun install (https://github.com/oven-sh/bun/issues/5792)
RUN bun install
RUN bun install --frozen-lockfile --production

COPY . .

ENV NODE_ENV=production
RUN bunx prisma generate
RUN bun run build

# --

# TODO: try to use alpine-based image
FROM oven/bun:1.0 as runner
WORKDIR /app

RUN apt update && \
    apt install -y --no-install-recommends tini && \
    apt clean && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/out/ ./out/
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

USER nobody
EXPOSE 8080/tcp

ENTRYPOINT ["/usr/bin/tini", "--", "bun", "run", "./out/index.js"]