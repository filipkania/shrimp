import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { mailRecipients } from "./recipients";
import { JSONType } from "../types/JSONType";
import { DateType } from "../types/DateType";

export const mails = sqliteTable("mails", {
	id: int("id").primaryKey(),

	from: text("from").notNull(),

	messageId: text("message_id"),
	references: text("references"),

	headers: JSONType<{ [key: string]: string }[]>("headers").notNull(),

	subject: text("subject"),

	text: text("text"),
	html: text("html"),

	receivedAt: DateType("received_at").notNull(),
});

export const mailsRelations = relations(mails, ({ many }) => ({
	recipients: many(mailRecipients),
}));
