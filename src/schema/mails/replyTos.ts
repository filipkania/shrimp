import { int, sqliteTable } from "drizzle-orm/sqlite-core";
import { mails } from "./mails";
import { contacts } from "../contacts";
import { relations } from "drizzle-orm";

export const mailReplyTos = sqliteTable("mails_reply_tos", {
	mailId: int("mail_id")
		.notNull()
		.references(() => mails.id, { onDelete: "cascade" }),
	contactId: int("contact_id")
		.notNull()
		.references(() => contacts.id, { onDelete: "cascade" }),
});

export const mailReplyTosRelations = relations(mailReplyTos, ({ one }) => ({
	mail: one(mails, {
		fields: [mailReplyTos.mailId],
		references: [mails.id],
	}),
	contact: one(contacts, {
		fields: [mailReplyTos.contactId],
		references: [contacts.id],
	}),
}));
