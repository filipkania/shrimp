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
			from: email.from.address,
		
			messageId: email.messageId,
			references: email.references,
		
			headers: email.headers,
		
			subject: email.subject,
		
			text: email.text,
			html: email.html,
		
			receivedAt: new Date(),
		})
		.run();
}
