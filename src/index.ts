import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Context } from "hono";

import { emailHandler } from "./handlers/mail";

// import routes from "./routes";
import { authMiddleware } from "./middlewares/auth";
import { handler as LoginHandler } from "./routes/login";

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
app.post("/login", LoginHandler);
app.use("*", authMiddleware);

// register all routes from routes/ directory
// routes.forEach((route) => {
// 	const { method, route: path, handler } = route;
// 	app.on(method, path, handler as any);
// });

app.onError((err, _) => {
	console.error(`${err}`);
	throw err;
});

export default {
	...app,
	email: emailHandler,
};
