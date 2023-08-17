import { Hono } from "hono";
import { emailHandler } from "./handlers/mail";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export type Env = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();

app.get("/helloworld", async (c) => {
	const db = drizzle(c.env.DB, { schema });
	return c.json(await db.query.mails.findMany());
})

app.onError((err, c) => {
	console.error(`${err}`);
	return c.text("Internal Server Error", 500);
});

export default {
	...app,
	email: emailHandler,
};
