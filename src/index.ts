import { Hono } from "hono";
import { emailHandler } from "./handlers/mail";

export type Env = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();

app.onError((err, c) => {
	console.error(`${err}`);
	return c.text("Internal Server Error", 500);
});

export default {
	...app,
	email: emailHandler,
};
