import { Hono } from "hono";
import type { Context } from "hono";

import { emailHandler } from "./handlers/mail";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "./schema";
import routes from "./routes";
import { authMiddleware } from "./middlewares/auth";
import { handler as LoginHandler } from "./routes/login";

export type Env = {
	DB: D1Database;
	JWT_SECRET: string;
};

export type HonoVariables = {
	drizzle: DrizzleD1Database<typeof schema>;
	user?: {
		id: number;
		username: string;
	};
};
export type AppContext = Context<{ Bindings: Env, Variables: HonoVariables }, any, {}>;

const app = new Hono<{ Bindings: Env, Variables: HonoVariables }>();

app.post("/login", LoginHandler);
app.use("*", authMiddleware);

// register all routes from routes/ directory
routes.forEach((route) => {
	const { method, route: path, handler } = route;
	app.on(method, path, handler);
});

app.onError((err, c) => {
	console.error(`${err}`);
	throw err;
	return c.text("Internal Server Error", 500);
});

export default {
	...app,
	email: emailHandler,
};
