import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

export const contacts = sqliteTable("contacts", {
	id: int("id").primaryKey(),
	name: text("name").notNull(),
	address: text("address").notNull().unique(),
});
