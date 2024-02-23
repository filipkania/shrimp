import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Context } from "hono";

import { emailHandler } from "./handlers/mail";

import { authMiddleware } from "./middlewares/auth";

import routes from "./routes";
import * as LoginRoute from "./routes/login";
import * as ProxyRoute from "./routes/mails/proxy";

export type Env = {
	DB: D1Database;

	/* random bytes, base64-encoded */
	JWT_SECRET: string;
};

export type Variables = {
	user?: {
		id: number;
		username: string;
	};
};
export type AppContext = Context<{ Bindings: Env; Variables: Variables }, any, {}>;

const app = new Hono<{ Bindings: Env; Variables: Variables }>().basePath("/api");

app.use("*", cors());

// routes without authentication
app.on(LoginRoute.method, LoginRoute.route, LoginRoute.handler);
app.on(ProxyRoute.method, ProxyRoute.route, ProxyRoute.handler);

app.use("*", authMiddleware);

// register all routes from routes/ directory
routes.forEach((route) => {
	const { method, route: path, handler } = route;
	app.on(method, path, handler as any);
});

app.onError((err, _) => {
	console.error(`${err}`);
	throw err;
});

export default {
	...app,
	email: emailHandler,
};
