import type { Next } from "hono";
import type { AppContext } from "..";
import { jwtVerify } from "jose";

export const authMiddleware = async (c: AppContext, next: Next) => {
	const rawToken = c.req.headers.get("Authorization")?.split("Bearer ")[1] || "";

	if (!rawToken) {
		return c.text("Invalid token.", 401);
	}

	try {
		const { payload } = await jwtVerify(rawToken, new TextEncoder().encode("it-is-very-secret"), {
			issuer: "urn:shrimp:issuer",
		});

		if (typeof payload.username !== "string" || typeof payload.id !== "number") {
			throw new Error();
		}

		c.set("user", {
			id: payload.id,
			username: payload.username,
		});
	} catch (err) {
		return c.text("Invalid token.", 401);
	}

	await next();
};
