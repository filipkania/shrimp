import { int, sqliteTable } from "drizzle-orm/sqlite-core";
import { mails } from "./mails";
import { contacts } from "../contacts";
import { relations } from "drizzle-orm";

export const mailCCs = sqliteTable("mails_ccs", {
	mailId: int("mail_id")
		.notNull()
		.references(() => mails.id, { onDelete: "cascade" }),
	contactId: int("contact_id")
		.notNull()
		.references(() => contacts.id, { onDelete: "cascade" }),
});

export const mailCCsRelations = relations(mailCCs, ({ one }) => ({
	mail: one(mails, {
		fields: [mailCCs.mailId],
		references: [mails.id],
	}),
	contact: one(contacts, {
		fields: [mailCCs.contactId],
		references: [contacts.id],
	}),
}));
