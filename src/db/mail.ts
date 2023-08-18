import { InferModel } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { contacts, mailRecipients, mails, mailCCs, mailReplyTos } from "../schema";
import contact from "./contact";

type Mail = InferModel<typeof mails, "insert">;
type Contact = InferModel<typeof contacts, "insert">;

export default {
	/**
	 * Inserts a mail.
	 *
	 * @param data Mail to insert
	 * @return id ID of inserted mail
	 */
	insert: async (db: DrizzleD1Database<any>, mail: Mail) => {
		const result = await db.insert(mails).values(mail).returning({ id: mails.id }).get();

		return result.id;
	},

	/**
	 * Adds recipients to mail.
	 *
	 * @param recipients
	 */
	addRecipients: async (db: DrizzleD1Database<any>, mailId: number, recipients: Contact[]) => {
		const ids = await contact.insertMany(db, recipients);

		await db
			.insert(mailRecipients)
			.values(
				ids.map((rId) => ({
					contactId: rId,
					mailId,
				}))
			)
			.run();
	},

	/**
	 * Adds CCs to mail.
	 *
	 * @param ccs
	 */
	addCCs: async (db: DrizzleD1Database<any>, mailId: number, ccs: Contact[]) => {
		const ids = await contact.insertMany(db, ccs);

		await db
			.insert(mailCCs)
			.values(
				ids.map((rId) => ({
					contactId: rId,
					mailId,
				}))
			)
			.run();
	},

	/**
	 * Adds Reply-To contacts to mail.
	 *
	 * @param replyTos
	 */
	addReplyTos: async (db: DrizzleD1Database<any>, mailId: number, replyTos: Contact[]) => {
		const ids = await contact.insertMany(db, replyTos);

		await db
			.insert(mailReplyTos)
			.values(
				ids.map((rId) => ({
					contactId: rId,
					mailId,
				}))
			)
			.run();
	},
};
