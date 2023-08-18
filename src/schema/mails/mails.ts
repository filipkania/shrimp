import { sqliteTable, int, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { mailRecipients } from "./recipients";
import { JSONType } from "../types/JSONType";
import { DateType } from "../types/DateType";
import { mailCCs } from "./ccs";
import { mailReplyTos } from "./replyTos";
import { contacts } from "../contacts";

export const mails = sqliteTable("mails", {
	id: int("id").primaryKey(),

	fromId: integer("from_id").notNull(),
	fromName: text("from_name").notNull(),

	messageId: text("message_id"),
	references: text("references"),

	headers: JSONType<{ [key: string]: string }>("headers").notNull(),

	subject: text("subject"),

	text: text("text"),
	html: text("html"),

	receivedAt: DateType("received_at").notNull(),
});

export const mailsRelations = relations(mails, ({ one, many }) => ({
	from: one(contacts, {
		fields: [mails.fromId],
		references: [contacts.id],
	}),
	recipients: many(mailRecipients),
	ccs: many(mailCCs),
	replyTos: many(mailReplyTos),
}));
