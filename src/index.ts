import { Hono } from "hono";
import { emailHandler } from "./handlers/mail";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import contact from "./db/contact";

export type Env = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();

app.use("*", async (c, next) => {
	const st = new Date().getTime();
	await next();
	c.header("X-Response-Time", (new Date().getTime() - st).toString());
});

app.get("/helloworld", async (c) => {
	const db = drizzle(c.env.DB, { schema });

	return c.json(
		await db.query.mails.findMany({
			with: {
				from: true,
				ccs: {
					with: {
						contact: true,
					},
				},
				recipients: {
					with: {
						contact: true,
					},
				},
				replyTos: {
					with: {
						contact: true,
					},
				},
			},
		})
	);
})

app.onError((err, c) => {
	console.error(`${err}`);
	return c.text("Internal Server Error", 500);
});

export default {
	...app,
	email: emailHandler,
};
