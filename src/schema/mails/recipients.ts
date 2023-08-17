import { int, sqliteTable } from "drizzle-orm/sqlite-core";
import { mails } from "./mails";
import { contacts } from "../contacts";
import { relations } from "drizzle-orm";

export const mailRecipients = sqliteTable("recipients", {
	mailId: int("mail_id")
		.notNull()
		.references(() => mails.id, { onDelete: "cascade" }),
	contactId: int("contact_id")
		.notNull()
		.references(() => contacts.id, { onDelete: "cascade" }),
});

export const mailRecipientsRelations = relations(mailRecipients, ({ one }) => ({
	mail: one(mails, {
		fields: [mailRecipients.mailId],
		references: [mails.id],
	}),
	contact: one(contacts, {
		fields: [mailRecipients.contactId],
		references: [contacts.id],
	}),
}));
