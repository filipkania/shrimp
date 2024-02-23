export const signHMAC = async (data: Buffer, secret: Buffer) => {
	const key = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);

	const signature = await crypto.subtle.sign("HMAC", key, data);

	return Buffer.from(signature).toString("base64");
};

export const verifyHMAC = async (signature: string, data: Buffer, secret: Buffer) => {
	const key = await crypto.subtle.importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);

	const sig = Buffer.from(signature, "base64");

	return crypto.subtle.verify("HMAC", key, sig, data);
};
