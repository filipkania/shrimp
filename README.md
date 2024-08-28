<a href="https://github.com/filipkania/shrimp">
  <img alt="Shrimp Banner" src="https://github.com/user-attachments/assets/70047452-99d9-4ff2-99ae-8bdca7268fb6">
</a>
<br />
<br />
<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#setting-up-locally"><strong>Setting up locally</strong></a> ·
  <a href="#deploy-your-own-shrimp"><strong>Deploy your own Shrimp</strong></a>
</p>

> [!NOTE]
> Shrimp is in very early development stage. Many features still aren't implemented, contributions of any kind are very welcome.

## Introduction

Shrimp is [_will be_] an fully-featured email service, fully self-hostable. It [_will_] support(s) adding multiple domains, sending emails from them, receiving and forwarding emails.

## Setting up locally

1. Copy `.env.example` to `.env` and adjust environment variables.
2. Run `postgres`, `ingester` and `maddy` using: `docker compose -f ./docker-compose.dev.yml up`.
3. Install dependencies using: `bun install`
4. Run `client` and `server` development servers using: `bun dev`

## Deploy your own Shrimp

> There will be a detailed setup guide, only when we release container images.
>
> For now, you shouldn't deploy Shrimp as your production email service.

## License

Released under [MIT](/LICENSE) license.
