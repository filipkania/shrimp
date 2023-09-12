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

	if (!username || !password)
		return c.json(
			{
				message: "Invalid username or password.",
			},
			401
		);

	const user = await db.query.users.findFirst({
		where: eq(schema.users.username, username.toString()),
	});
	if (!user)
		return c.json(
			{
				message: "Invalid username or password.",
			},
			401
		);

	const passwdDigest = await crypto.subtle.digest(
		{
			name: "SHA-256",
		},
		new TextEncoder().encode(password.toString() + user.salt)
	);
	if (arrayBufferToHex(passwdDigest) !== user.password)
		return c.json(
			{
				message: "Invalid username or password.",
			},
			401
		);

	const token = await new SignJWT({
		id: user.id,
		username: user.username,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setIssuer("urn:shrimp:issuer")
		.setExpirationTime("2d")
		.sign(new Uint8Array(new TextEncoder().encode(c.env.JWT_SECRET) as ArrayBuffer));

	return c.json({
		token,
	});
};
