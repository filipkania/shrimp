import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { mailRecipients } from "./recipients";
import { JSONType } from "../types/JSONType";

export const mails = sqliteTable("mails", {
	id: int("id").primaryKey(),

	from: text("from").notNull(),

	headers: JSONType<{ [key: string]: string }[]>("headers"),
	content: text("content"),
});

export const mailsRelations = relations(mails, ({ many }) => ({
	recipients: many(mailRecipients),
}));
