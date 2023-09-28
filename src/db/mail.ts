import contact, { Contact } from "./contact";

export type Mail = {
	id: number;

	from_id: number;
	from_name: string;

	message_id?: string;
	references?: string;

	headers: string;
	subject?: string;

	text?: string;
	html?: string;

	received_at: string;
};

export default {
	/**
	 * Inserts a mail.
	 *
	 * @param data Mail to insert
	 * @return id ID of inserted mail
	 */
	insert: async (db: D1Database, mail: Omit<Mail, "id">) => {
		const { from_id, from_name, message_id, references, headers, subject, text, html, received_at } = mail;
		const stmt = await db
			.prepare(
				"INSERT INTO mails(`from_id`, `from_name`, `message_id`, `references`, `headers`, `subject`, `text`, `html`, `received_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *;"
			)
			.bind(from_id, from_name, message_id, references, headers, subject, text, html, received_at)
			.run();

		return (stmt.results as Mail[])[0].id;
	},

	/**
	 * Adds recipients to mail.
	 *
	 * @param recipients
	 */
	addRecipients: async (db: D1Database, mailId: number, recipients: Omit<Contact, "id">[]) => {
		const ids = await contact.insertMany(db, recipients);

		const stmt = db.prepare("INSERT INTO mails_recipients(mail_id, contact_id) VALUES (?, ?) RETURNING *;");
		await db.batch(ids.map((id) => stmt.bind(mailId, id)));
	},

	/**
	 * Adds CCs to mail.
	 *
	 * @param ccs
	 */
	addCCs: async (db: D1Database, mailId: number, ccs: Omit<Contact, "id">[]) => {
		const ids = await contact.insertMany(db, ccs);

		const stmt = db.prepare("INSERT INTO mails_ccs(mail_id, contact_id) VALUES (?, ?) RETURNING *;");
		await db.batch(ids.map((id) => stmt.bind(mailId, id)));
	},

	/**
	 * Adds Reply-To contacts to mail.
	 *
	 * @param replyTos
	 */
	addReplyTos: async (db: D1Database, mailId: number, replyTos: Omit<Contact, "id">[]) => {
		const ids = await contact.insertMany(db, replyTos);

		const stmt = db.prepare("INSERT INTO mails_reply_tos(mail_id, contact_id) VALUES (?, ?) RETURNING *;");
		await db.batch(ids.map((id) => stmt.bind(mailId, id)));
	},
};
