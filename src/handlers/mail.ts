import { drizzle } from "drizzle-orm/d1";
import { Env } from "..";
import { streamToArrayBuffer } from "../utils/streamToArrayBuffer";
import PostalMime from "postal-mime";
import { mails } from "../schema";

export async function emailHandler(message: ForwardableEmailMessage, env: Env) {
	const rawEmail = await streamToArrayBuffer(message.raw, message.rawSize);
	const parser = new PostalMime();
	const email = await parser.parse(rawEmail);

	const db = drizzle(env.DB);

	await db
		.insert(mails)
		.values({
			headers: Array.from(email.headers.entries()).reduce((acc, curr) => ({ ...acc, [curr[1].key]: curr[1].value }), {}),
			from: email.from.address,
			content: email.text,
		})
		.run();
}
