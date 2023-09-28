import { AppContext } from "..";
import { SignJWT } from "jose";

import { arrayBufferToHex } from "../utils/arrayBufferToHex";

export const method = "POST";
export const route = "/login";

type User = {
	id: number;
	username: string;
	password: string;
	salt: string;
};

export const handler = async (c: AppContext) => {
	const { username, password } = await c.req.json();
	if (!username || !password) return c.json({ message: "Invalid username or password." }, 401);

	const user: User | null = await c.env.DB.prepare("SELECT * FROM users WHERE username = ?;")
		.bind(username.toString().toLowerCase())
		.first();

	if (!user) return c.json({ message: "Invalid username or password." }, 401);

	const passwdDigest = await crypto.subtle.digest("SHA-256", Buffer.from(password.toString() + user.salt));
	if (arrayBufferToHex(passwdDigest) !== user.password) return c.json({ message: "Invalid username or password." }, 401);

	const token = await new SignJWT({
		id: user.id,
		username: user.username,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setIssuer("urn:shrimp:issuer")
		.setExpirationTime("2d")
		.sign(Buffer.from(c.env.JWT_SECRET));

	return c.json({
		token,
	});
};
