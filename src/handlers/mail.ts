import { drizzle } from "drizzle-orm/d1";
import { Env } from "..";
import { streamToArrayBuffer } from "../utils/streamToArrayBuffer";

import PostalMime from "postal-mime";
import { postalMimeToEmail } from "../utils/postalMimeToEmail";

import mail from "../db/mail";

export const emailHandler = async (message: ForwardableEmailMessage, env: Env) => {
	const rawEmail = await streamToArrayBuffer(message.raw, message.rawSize);
	const parser = new PostalMime();
	const email = await parser.parse(rawEmail);

	const db = drizzle(env.DB);

	const mailId = await mail.insert(db, {
		...postalMimeToEmail(email),
		receivedAt: new Date(),
	});

	await mail.addRecipients(db, mailId, email.to);
	if (email.cc) {
		await mail.addCCs(db, mailId, email.cc);
	}

	if (email.replyTo) {
		await mail.addReplyTos(db, mailId, email.replyTo);
	}
};
