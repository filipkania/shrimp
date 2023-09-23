<a href="https://github.com/filipkania/shrimp">
  <img alt="Shrimp Banner" src="https://github.com/filipkania/shrimp/assets/36205125/82bd4277-7aa3-4386-ae22-f1b6a157ee2a">
</a>
<br />
<br />
<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#setting-up-locally"><strong>Setting Up Locally</strong></a> ·
  <a href="#deploy-to-cloudflare"><strong>Deploy to Cloudflare</strong></a> ·
  <a href="#license"><strong>License</strong></a>
</p>

> **Warning**
> Shrimp is in very early development stage. Many features still aren't implemented, contributions of any kind are very welcome.

## Introduction

Shrimp is an fully-featured email service, fully hosted on Cloudflare Workers. It supports adding multiple domains, sending emails from them, receiving and forwarding emails.

## Setting up locally

**Backend**
1. Copy `wrangler.toml.example` to `wrangler.toml`.
2. Install dependencies: `bun install` or `npm install`.
3. Create D1 database using `wrangler d1 create shrimp-db`, copy it's ID and replace it in `wrangler.toml`.
4. Run migrations using `wrangler d1 migrations apply shrimp-db`.
5. Start development server: `wrangler dev`.

**Frontend**
1. Go to the `client` folder.
2. Install dependencies: `bun install` or `npm install`.
3. Run development server: `bun dev` or `npm run dev`.

## Deploy to Cloudflare

1. Deploy backend using: `wrangler deploy`.
2. Create `JWT_SECRET` environment variable using: `openssl rand -base64 48 | wrangler secret put JWT_SECRET`.
3. Build frontend using `cd client && bun run build`.
4. Deploy frontend using `wrangler pages deploy out`.

## License

Released under [MIT](/LICENSE) license.
