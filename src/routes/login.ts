import { drizzle } from "drizzle-orm/d1";
import { AppContext } from "..";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose";

import * as schema from "../schema";
import { arrayBufferToHex } from "../utils/arrayBufferToHex";

export const method = "POST";
export const route = "/login";

export const handler = async (c: AppContext) => {
	const db = drizzle(c.env.DB, { schema });
	const { username, password } = await c.req.json();

	try {
		if (!username || !password) throw new Error();

		const user = await db.query.users.findFirst({
			where: eq(schema.users.username, username.toString()),
		});
		if (!user) throw new Error();

		const passwdDigest = await crypto.subtle.digest(
			{
				name: "SHA-256",
			},
			new TextEncoder().encode(password.toString() + user.salt)
		);
		if (arrayBufferToHex(passwdDigest) !== user.password) throw new Error();

		const token = await new SignJWT({
			id: user.id,
			username: user.username,
		})
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setIssuer("urn:shrimp:issuer")
			.setExpirationTime("2d")
			.sign(new TextEncoder().encode(c.env.JWT_SECRET));

		return c.json({
			token,
		});
	} catch (err) {
		return c.json({
      message: "Invalid username or password.",
		}, 401);
	}
};
